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
    const { type, dishName, image, preferences, numberOfPeople, dietaryRestrictions, message, context, systemPrompt, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (type === 'analyze-image') {
      console.log('Analyzing image for ingredients');

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this image and list all the food ingredients you can identify. Return only the ingredient names as a comma-separated list, nothing else.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: image
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const ingredientsText = data.choices[0].message.content;
      const ingredients = ingredientsText.split(',').map((i: string) => i.trim());

      return new Response(
        JSON.stringify({ ingredients }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'suggest') {
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
      // Note: Skipping cache for now since we changed the recipe format
      // Old cached recipes won't match the new dual-version structure
      
      // Generate new recipe
      console.log('Generating new recipe with AI');
      const prompt = `Provide two versions of a recipe for ${dishName}. Format your response as JSON with this structure:
{
  "title": "dish name",
  "standard": {
    "ingredients": ["ingredient 1 (using convenient pre-made items like canned sauce)", "ingredient 2"],
    "steps": ["simple step 1", "simple step 2"],
    "tips": "helpful cooking tips for the standard version"
  },
  "fromScratch": {
    "ingredients": ["ingredient 1 (made from scratch)", "ingredient 2"],
    "steps": ["detailed step 1", "detailed step 2"],
    "tips": "helpful cooking tips for the from-scratch version"
  }
}

The standard version should use convenient shortcuts like pre-made sauces, canned items, etc.
The from-scratch version should show how to make everything from scratch with fresh ingredients.`;
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
      let content = data.choices[0].message.content;

      // Strip markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      try {
        const recipe = JSON.parse(content);
        
        // Note: Not caching dual-version recipes to keep cache simple
        // Can be added later if needed

        return new Response(
          JSON.stringify({ recipe }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse recipe JSON:', e);
        const recipe = {
          title: dishName,
          standard: {
            ingredients: [],
            steps: content.split('\n').filter((line: string) => line.trim()).slice(0, 5),
            tips: 'AI-generated recipe'
          },
          fromScratch: {
            ingredients: [],
            steps: content.split('\n').filter((line: string) => line.trim()),
            tips: 'AI-generated recipe'
          }
        };
        return new Response(
          JSON.stringify({ recipe }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (type === 'meal-plan') {
      console.log('Generating meal plan');
      
      const prompt = `Create a weekly meal plan (Monday-Sunday) for ${numberOfPeople} people.
${dietaryRestrictions ? `Dietary restrictions: ${dietaryRestrictions}` : ''}
Preferences and goals: ${preferences}

Format your response as JSON with this structure:
{
  "Monday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" },
  "Tuesday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" },
  "Wednesday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" },
  "Thursday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" },
  "Friday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" },
  "Saturday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" },
  "Sunday": { "breakfast": "dish name", "lunch": "dish name", "dinner": "dish name" }
}`;

      const systemPrompt = 'You are a professional meal planner creating balanced, varied meal plans. Always respond with valid JSON only.';

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
      let content = data.choices[0].message.content;

      // Strip markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      try {
        const mealPlan = JSON.parse(content);
        
        return new Response(
          JSON.stringify({ mealPlan }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse meal plan JSON:', e);
        throw new Error('Failed to generate valid meal plan');
      }
    } else if (type === 'chat') {
      console.log('Processing chat message');
      
      const contextInfo = context ? `\n\nCurrent context: ${JSON.stringify(context)}` : '';
      const messages = [
        { role: 'system', content: systemPrompt + contextInfo },
        ...(history || []),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0].message.content;

      return new Response(
        JSON.stringify({ response: responseContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'diet-guide') {
      console.log('Generating diet guide');
      
      const prompt = `Create a comprehensive diet guide based on the following goals and preferences: ${preferences}

Provide detailed information including:
1. An overview of how to achieve their goals
2. Key recommendations for their dietary approach
3. A sample daily meal plan with specific meal suggestions
4. Additional tips for success

Format your response as JSON with this structure:
{
  "title": "Personalized [Diet Type] Guide",
  "overview": "Brief overview of the diet approach and how it helps achieve their goals (2-3 sentences)",
  "recommendations": [
    "Key recommendation 1 (be specific and actionable)",
    "Key recommendation 2",
    "Key recommendation 3",
    "Key recommendation 4",
    "Key recommendation 5"
  ],
  "mealPlan": {
    "breakfast": "Specific breakfast example with portion guidance",
    "lunch": "Specific lunch example with portion guidance",
    "dinner": "Specific dinner example with portion guidance",
    "snacks": "Healthy snack suggestions"
  },
  "tips": [
    "Practical tip 1 for following this diet",
    "Practical tip 2",
    "Practical tip 3",
    "Practical tip 4"
  ]
}

Make the guide practical, specific, and tailored to their stated goals. Include portion guidance where relevant.`;

      const systemPrompt = 'You are a professional nutritionist and dietitian providing evidence-based dietary guidance. Always respond with valid JSON only. Be specific, practical, and supportive in your recommendations.';

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
      let content = data.choices[0].message.content;

      // Strip markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      try {
        const guide = JSON.parse(content);
        
        return new Response(
          JSON.stringify(guide),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse diet guide JSON:', e);
        throw new Error('Failed to generate valid diet guide');
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
