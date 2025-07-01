
-- Enable Row Level Security on files table and create comprehensive policies
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own files" ON public.files;
DROP POLICY IF EXISTS "Users can insert their own files" ON public.files;
DROP POLICY IF EXISTS "Users can update their own files" ON public.files;
DROP POLICY IF EXISTS "Users can delete their own files" ON public.files;

-- Create comprehensive RLS policies for files table
CREATE POLICY "Users can view their own files" 
  ON public.files 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" 
  ON public.files 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" 
  ON public.files 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" 
  ON public.files 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Ensure user_id column is not nullable for security
ALTER TABLE public.files ALTER COLUMN user_id SET NOT NULL;
