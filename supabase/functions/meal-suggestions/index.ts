import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, dishName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (type === 'suggest') {
      // Check cache first
      const { data: cachedSuggestions } = await supabase
        .from('meal_suggestions')
        .select('suggestion')
        .limit(5);

      if (cachedSuggestions && cachedSuggestions.length >= 5) {
        console.log('Returning cached suggestions');
        return new Response(
          JSON.stringify({ suggestions: cachedSuggestions.map(s => s.suggestion) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate new suggestions
      console.log('Generating new suggestions with AI');
      const prompt = 'Suggest 5 popular, delicious meals that people love to cook at home. Just list the meal names, one per line, no extra text or numbering.';
      const systemPrompt = 'You are a helpful cooking assistant. Provide clear, practical cooking advice.';

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const suggestions = content
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter((line: string) => line.length > 0)
        .slice(0, 5);

      // Save to cache
      for (const suggestion of suggestions) {
        await supabase
          .from('meal_suggestions')
          .upsert({ suggestion }, { onConflict: 'suggestion' });
      }

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'recipe') {
      // Check cache first
      const { data: cachedRecipe } = await supabase
        .from('recipes')
        .select('*')
        .ilike('dish_name', dishName)
        .single();

      if (cachedRecipe) {
        console.log('Returning cached recipe');
        return new Response(
          JSON.stringify({ 
            recipe: {
              title: cachedRecipe.title,
              ingredients: cachedRecipe.ingredients,
              steps: cachedRecipe.steps,
              tips: cachedRecipe.tips
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate new recipe
      console.log('Generating new recipe with AI');
      const prompt = `Provide a detailed recipe for ${dishName}. Format your response as JSON with this structure:
{
  "title": "dish name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "tips": "helpful cooking tips"
}`;
      const systemPrompt = 'You are a professional chef providing detailed recipes. Always respond with valid JSON only.';

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        const recipe = JSON.parse(content);
        
        // Save to cache
        await supabase
          .from('recipes')
          .insert({
            dish_name: dishName,
            title: recipe.title,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            tips: recipe.tips
          });

        return new Response(
          JSON.stringify({ recipe }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse recipe JSON:', e);
        const recipe = {
          title: dishName,
          ingredients: [],
          steps: content.split('\n').filter((line: string) => line.trim()),
          tips: 'AI-generated recipe'
        };
        return new Response(
          JSON.stringify({ recipe }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    throw new Error('Invalid request type');

  } catch (error) {
    console.error('Error in meal-suggestions function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
