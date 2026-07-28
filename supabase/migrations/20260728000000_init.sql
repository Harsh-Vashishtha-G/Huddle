-- Enable btree_gist extension for exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create Roles Enum
CREATE TYPE public.user_role AS ENUM ('admin', 'member');

-- Create Booking Status Enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- 1. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role public.user_role NOT NULL DEFAULT 'member',
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Resources Table
CREATE TABLE public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  capacity INT NOT NULL,
  requires_approval BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bookings Table (with tstzrange)
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  time_range TSTZRANGE NOT NULL,
  status public.booking_status DEFAULT 'pending' NOT NULL,
  recurrence_group_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Overlap prevention constraint using btree_gist
-- Rejects overlapping bookings for the same resource where status is pending or approved
ALTER TABLE public.bookings ADD CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
  resource_id WITH =,
  time_range WITH &&
) WHERE (status IN ('pending', 'approved'));

-- 4. Notifications Table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  related_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Helper Function for RLS Role Retrieval
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
DECLARE
  r public.user_role;
BEGIN
  -- If not logged in, return null
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Query role from profiles
  SELECT role INTO r FROM public.profiles WHERE id = auth.uid();
  RETURN r;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger to automatically create profile when user is created in auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    new.id,
    CASE 
      WHEN new.email = 'vashishthaharsh97@gmail.com' THEN 'admin'::public.user_role
      ELSE 'member'::public.user_role
    END,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Trigger to enforce booking status on insert
CREATE OR REPLACE FUNCTION public.enforce_booking_status()
RETURNS trigger AS $$
DECLARE
  res_requires_approval BOOLEAN;
  caller_role public.user_role;
BEGIN
  caller_role := public.get_my_role();
  
  -- Resolve resource approval requirement
  SELECT requires_approval INTO res_requires_approval FROM public.resources WHERE id = new.resource_id;
  
  -- Set user_id if not admin
  IF caller_role IS DISTINCT FROM 'admin'::public.user_role THEN
    new.user_id := auth.uid();
    IF res_requires_approval THEN
      new.status := 'pending'::public.booking_status;
    ELSE
      new.status := 'approved'::public.booking_status;
    END IF;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_booking_insert_enforce
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_status();

-- 8. Trigger to handle booking notification creation
CREATE OR REPLACE FUNCTION public.handle_booking_notification()
RETURNS trigger AS $$
BEGIN
  -- On INSERT
  IF TG_OP = 'INSERT' THEN
    IF new.status = 'pending' THEN
      INSERT INTO public.notifications (user_id, type, message, related_booking_id)
      VALUES (new.user_id, 'booking_created', 'Your booking request is pending approval.', new.id);
    ELSIF new.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, type, message, related_booking_id)
      VALUES (new.user_id, 'booking_confirmed', 'Your booking has been confirmed.', new.id);
    END IF;
  -- On UPDATE
  ELSIF TG_OP = 'UPDATE' THEN
    IF old.status <> new.status THEN
      IF new.status = 'approved' THEN
        INSERT INTO public.notifications (user_id, type, message, related_booking_id)
        VALUES (new.user_id, 'booking_confirmed', 'Your booking has been approved.', new.id);
      ELSIF new.status = 'rejected' THEN
        INSERT INTO public.notifications (user_id, type, message, related_booking_id)
        VALUES (new.user_id, 'booking_rejected', 'Your booking request was rejected.', new.id);
      ELSIF new.status = 'cancelled' THEN
        INSERT INTO public.notifications (user_id, type, message, related_booking_id)
        VALUES (new.user_id, 'booking_cancelled', 'Your booking has been cancelled.', new.id);
      END IF;
    END IF;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_booking_change
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_booking_notification();

-- 9. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies
-- Profiles policies
CREATE POLICY "Profiles read access" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Profiles update access" ON public.profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id OR public.get_my_role() = 'admin'::public.user_role);

-- Resources policies
CREATE POLICY "Resources read access" ON public.resources
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Resources write access" ON public.resources
  FOR ALL TO authenticated 
  USING (public.get_my_role() = 'admin'::public.user_role);

-- Bookings policies
CREATE POLICY "Bookings read access" ON public.bookings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Bookings insert access" ON public.bookings
  FOR INSERT TO authenticated 
  WITH CHECK (public.get_my_role() = 'admin'::public.user_role OR auth.uid() = user_id);

CREATE POLICY "Bookings update access" ON public.bookings
  FOR UPDATE TO authenticated 
  USING (
    public.get_my_role() = 'admin'::public.user_role OR 
    (auth.uid() = user_id AND status IN ('pending'::public.booking_status, 'approved'::public.booking_status))
  )
  WITH CHECK (
    public.get_my_role() = 'admin'::public.user_role OR 
    (auth.uid() = user_id AND status = 'cancelled'::public.booking_status)
  );

-- Notifications policies
CREATE POLICY "Notifications access" ON public.notifications
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Enable Realtime publication for notifications
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.notifications;
COMMIT;
