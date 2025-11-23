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
    const { type, dishName, image, preferences, numberOfPeople, dietaryRestrictions, message, context, systemPrompt, history, ingredients, forceRegenerate, dish, currentIngredients, dietInfo, foodInput } = await req.json();
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
      const limit = 5;

      // If no specific ingredients were provided, return a random sample from saved suggestions
      if (!ingredients) {
        const { data: allMeals, error: fetchErr } = await supabase
          .from('meal_suggestions')
          .select('suggestion');

        if (fetchErr) {
          console.error('Failed to fetch saved suggestions:', fetchErr);
        }

        if (allMeals && allMeals.length > 0) {
          // Shuffle and pick a random sample
          const shuffled = [...allMeals].sort(() => Math.random() - 0.5);
          const sample = shuffled.slice(0, limit).map(s => s.suggestion);
          console.log(`Returning random sample from DB (${sample.length}/${allMeals.length})`);
          return new Response(
            JSON.stringify({ suggestions: sample }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        // If DB empty, fall through to AI generation as a fallback
      }

      // Generate new suggestions
      console.log('Generating new suggestions with AI');
      const prompt = ingredients 
        ? `Based on these ingredients: ${ingredients.join(', ')}, suggest 5 delicious meals that can be made. Just list the meal names, one per line, no extra text or numbering.`
        : 'Suggest 5 popular, delicious meals that people love to cook at home. Just list the meal names, one per line, no extra text or numbering.';
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

      // Save to cache only if no specific ingredients (general suggestions)
      if (!ingredients) {
        for (const suggestion of suggestions) {
          await supabase
            .from('meal_suggestions')
            .upsert({ suggestion }, { onConflict: 'suggestion' });
        }
      }

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'recipe') {
      // Check database first for cached recipe
      console.log(`Checking database for recipe: ${dishName}`);
      const { data: cachedRecipe, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .ilike('dish_name', dishName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching recipe:', fetchError);
      }

      if (cachedRecipe) {
        console.log('Returning cached recipe from database');
        const recipe = {
          title: cachedRecipe.title,
          standard: {
            ingredients: cachedRecipe.standard_ingredients,
            steps: cachedRecipe.standard_steps,
            tips: cachedRecipe.standard_tips || ''
          },
          fromScratch: {
            ingredients: cachedRecipe.scratch_ingredients,
            steps: cachedRecipe.scratch_steps,
            tips: cachedRecipe.scratch_tips || ''
          }
        };
        return new Response(
          JSON.stringify({ recipe }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Generate new recipe with AI
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

IMPORTANT: Both versions MUST yield the same portion size and number of servings. Adjust ingredient quantities so the finished dish amount is identical.

The standard version should use convenient shortcuts like pre-made sauces, canned items, etc.
The from-scratch version should show how to make everything from scratch with fresh ingredients.`;
      const systemPrompt = 'You are a professional chef providing detailed recipes. Always respond with valid JSON only. Ensure both recipe versions produce equal portions.';

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
        
        // Save the generated recipe to database for reuse
        console.log('Saving recipe to database');
        const { error: insertError } = await supabase
          .from('recipes')
          .insert({
            dish_name: dishName,
            title: recipe.title,
            standard_ingredients: recipe.standard.ingredients,
            standard_steps: recipe.standard.steps,
            standard_tips: recipe.standard.tips || null,
            scratch_ingredients: recipe.fromScratch.ingredients,
            scratch_steps: recipe.fromScratch.steps,
            scratch_tips: recipe.fromScratch.tips || null
          });

        if (insertError) {
          console.error('Error saving recipe:', insertError);
          // Don't fail the request if save fails, just log it
        } else {
          console.log('Recipe saved successfully');
        }

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

Provide detailed information including an overview, key recommendations, a sample daily meal plan, and practical tips for success.`;

      const systemPrompt = 'You are a professional nutritionist and dietitian providing evidence-based dietary guidance. Be specific, practical, and supportive in your recommendations.';

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
          tools: [
            {
              type: "function",
              function: {
                name: "create_diet_guide",
                description: "Create a comprehensive diet guide with structured information",
                parameters: {
                  type: "object",
                  properties: {
                    title: { 
                      type: "string",
                      description: "A personalized title for the diet guide"
                    },
                    overview: { 
                      type: "string",
                      description: "Brief overview of the diet approach and how it helps achieve their goals"
                    },
                    recommendations: {
                      type: "array",
                      items: { type: "string" },
                      description: "5 specific and actionable recommendations"
                    },
                    mealPlan: {
                      type: "object",
                      properties: {
                        breakfast: { type: "string" },
                        lunch: { type: "string" },
                        dinner: { type: "string" },
                        snacks: { type: "string" }
                      },
                      required: ["breakfast", "lunch", "dinner", "snacks"]
                    },
                    tips: {
                      type: "array",
                      items: { type: "string" },
                      description: "4 practical tips for following this diet"
                    }
                  },
                  required: ["title", "overview", "recommendations", "mealPlan", "tips"],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "create_diet_guide" } }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Response:', JSON.stringify(data, null, 2));
      
      const toolCall = data.choices[0].message.tool_calls?.[0];
      if (!toolCall) {
        console.error('No tool call in response');
        throw new Error('Failed to generate diet guide');
      }

      const guide = JSON.parse(toolCall.function.arguments);
      
      return new Response(
        JSON.stringify(guide),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'enhance') {
      console.log('Generating dish enhancement suggestions');
      
      const prompt = `I'm making ${dish} using these ingredients: ${currentIngredients}

Suggest 3-5 ingredients I could add to enhance this dish. For each suggestion:
- If the ingredient requires special preparation or cooking instructions (like seasonings that need to be mixed in while cooking, or items that need specific timing), provide those instructions
- If it's just a topping or garnish that gets added at the end with no special preparation, don't include instructions

Also provide one general tip for making this dish better.`;

      const systemPrompt = 'You are a professional chef helping home cooks improve their dishes. Be specific and practical with your suggestions.';

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
          tools: [
            {
              type: "function",
              function: {
                name: "suggest_enhancements",
                description: "Suggest ingredients and preparation methods to enhance a dish",
                parameters: {
                  type: "object",
                  properties: {
                    additions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          ingredient: { 
                            type: "string",
                            description: "The ingredient to add"
                          },
                          instructions: { 
                            type: "string",
                            description: "How to prepare or incorporate this ingredient. Only include if special preparation is needed, omit for simple toppings."
                          }
                        },
                        required: ["ingredient"]
                      },
                      description: "3-5 suggested ingredient additions"
                    },
                    generalTips: {
                      type: "string",
                      description: "One helpful general tip for making this dish better"
                    }
                  },
                  required: ["additions"],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "suggest_enhancements" } }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const toolCall = data.choices[0].message.tool_calls?.[0];
      if (!toolCall) {
        console.error('No tool call in response');
        throw new Error('Failed to generate enhancement suggestions');
      }

      const suggestions = JSON.parse(toolCall.function.arguments);
      
      return new Response(
        JSON.stringify(suggestions),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'nutrition-analysis') {
      console.log('Analyzing diet for nutritional gaps');
      
      const prompt = `Analyze this diet: ${dietInfo}

First, interpret what they're eating (whether they gave a general description like "carnivore" or a detailed meal plan).
Then identify potential nutritional gaps and suggest specific foods or supplements to address those gaps.

Start your response by acknowledging what they're eating, then list the potential nutritional gaps, and finally provide actionable suggestions.`;

      const systemPrompt = 'You are a knowledgeable nutrition advisor. Be practical, supportive, and evidence-based in your recommendations. When given general diet descriptions, make reasonable assumptions about typical foods in that diet.';

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
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      return new Response(
        JSON.stringify({ analysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'calorie-estimate') {
      console.log('Estimating nutritional information');
      
      const prompt = `Provide a nutritional estimate for: ${foodInput}

If specific brands are mentioned (like Publix, Bubba Burger, etc.), try to use their actual nutritional data.
If the description is general, provide reasonable ranges based on typical portions.

Include:
- Calories (exact number or range)
- Protein (grams)
- Fat (grams)
- Carbohydrates (grams)
- Fiber (grams)
- Sugar (grams)
- Sodium (mg)

If the input is specific enough, provide exact numbers. If it's general, provide ranges (e.g., "250-350 calories").
Be practical and realistic with your estimates.`;

      const systemPrompt = 'You are a nutrition expert helping people understand the nutritional content of their meals. Be accurate, practical, and explain your reasoning when making estimates. If brands are mentioned, try to use actual data from those brands when possible.';

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
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices[0].message.content;
      
      return new Response(
        JSON.stringify({ result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
