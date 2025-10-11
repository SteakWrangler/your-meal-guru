import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let prompt = '';
    let systemPrompt = 'You are a helpful cooking assistant. Provide clear, practical cooking advice.';

    if (type === 'suggest') {
      prompt = 'Suggest 5 popular, delicious meals that people love to cook at home. Just list the meal names, one per line, no extra text or numbering.';
    } else if (type === 'recipe') {
      prompt = `Provide a detailed recipe for ${dishName}. Format your response as JSON with this structure:
{
  "title": "dish name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "tips": "helpful cooking tips"
}`;
      systemPrompt = 'You are a professional chef providing detailed recipes. Always respond with valid JSON only.';
    }

    console.log('Making request to Lovable AI with type:', type);

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

    console.log('AI response received:', content?.substring(0, 100));

    if (type === 'suggest') {
      const suggestions = content
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter((line: string) => line.length > 0)
        .slice(0, 5);

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'recipe') {
      try {
        const recipe = JSON.parse(content);
        return new Response(
          JSON.stringify({ recipe }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse recipe JSON:', e);
        // Fallback: create a simple recipe object from the text
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
