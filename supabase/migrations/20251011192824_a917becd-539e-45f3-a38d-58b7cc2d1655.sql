-- Create table for cached meal suggestions
CREATE TABLE public.meal_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for cached recipes
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  steps TEXT[] NOT NULL,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meal_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Public read access for meal suggestions
CREATE POLICY "Anyone can view meal suggestions"
ON public.meal_suggestions
FOR SELECT
USING (true);

-- Public read access for recipes
CREATE POLICY "Anyone can view recipes"
ON public.recipes
FOR SELECT
USING (true);

-- Create indexes for faster lookups
CREATE INDEX idx_meal_suggestions_suggestion ON public.meal_suggestions(suggestion);
CREATE INDEX idx_recipes_dish_name ON public.recipes(dish_name);