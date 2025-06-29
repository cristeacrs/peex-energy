
-- Create a table for energy listings
CREATE TABLE public.energy_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  amount_kwh DECIMAL(10,2) NOT NULL CHECK (amount_kwh > 0),
  price_per_kwh DECIMAL(8,4) NOT NULL CHECK (price_per_kwh > 0),
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (amount_kwh * price_per_kwh) STORED,
  description TEXT,
  available_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  available_until TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.energy_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for energy listings
CREATE POLICY "Users can view all active listings" 
  ON public.energy_listings 
  FOR SELECT 
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own listings" 
  ON public.energy_listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
  ON public.energy_listings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
  ON public.energy_listings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a table for energy transactions
CREATE TABLE public.energy_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.energy_listings NOT NULL,
  buyer_id UUID REFERENCES auth.users NOT NULL,
  seller_id UUID REFERENCES auth.users NOT NULL,
  amount_kwh DECIMAL(10,2) NOT NULL,
  price_per_kwh DECIMAL(8,4) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Add RLS to transactions
ALTER TABLE public.energy_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.energy_transactions 
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions" 
  ON public.energy_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);
