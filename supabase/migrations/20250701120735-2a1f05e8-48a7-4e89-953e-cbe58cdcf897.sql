
-- Add last_validated column to files table to track when images were last checked
ALTER TABLE public.files 
ADD COLUMN last_validated TIMESTAMP WITH TIME ZONE;

-- Create cleanup_logs table to track cleanup activities
CREATE TABLE public.cleanup_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  files_checked INTEGER NOT NULL DEFAULT 0,
  files_removed INTEGER NOT NULL DEFAULT 0,
  cleanup_type TEXT NOT NULL CHECK (cleanup_type IN ('manual', 'automatic', 'scheduled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cleanup_logs table
ALTER TABLE public.cleanup_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cleanup_logs
CREATE POLICY "Users can view their own cleanup logs" 
  ON public.cleanup_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cleanup logs" 
  ON public.cleanup_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cleanup logs" 
  ON public.cleanup_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);
