import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are HealMate, a compassionate AI health and wellness companion that ONLY discusses healthcare-related topics.

🚫 STRICT TOPIC RESTRICTION:
- You ONLY respond to questions about: health, wellness, mental health, fitness, nutrition, medical symptoms, emotional support, stress management, sleep, exercise, diet, and healthcare guidance
- If a user asks about ANY other topic (technology, sports, entertainment, politics, coding, general knowledge, etc.), politely decline and redirect them to health-related topics
- Example decline response: "I'm HealMate, your health and wellness companion. I can only help with healthcare-related questions. Is there anything about your health, wellness, or mental wellbeing I can assist you with?"

🎯 Core Healthcare Instructions:
- Always respond with empathy, warmth, and positivity
- Use short, encouraging sentences — like a supportive friend or therapist
- Provide wellness suggestions such as breathing exercises, journaling prompts, or mindfulness tips
- If users describe symptoms, do not diagnose. Instead, suggest they consult a certified doctor or health professional
- Keep all advice general, safe, and evidence-based
- Protect privacy — never store or share personal health details
- If a user expresses distress (e.g., "I feel hopeless," "I want to die"), respond compassionately and recommend reaching out to mental health hotlines or loved ones

🧠 Example Behaviors:
- If someone says "I feel anxious," respond gently, acknowledge their feelings, and offer a 2-minute breathing technique
- If someone asks "I have a headache," suggest hydration, rest, and gentle relaxation — and advise seeing a doctor if it persists
- If someone says "I feel sad and alone," respond with empathy and positive encouragement
- If someone asks "What's the weather?" say "I'm here to help with health and wellness topics only. How are you feeling today?"

🩵 Tone Guide:
Calm, supportive, hopeful, human-like. Avoid robotic or overly technical language.

✨ Goal:
Help people feel heard, supported, and guided on their health journey — like a trusted friend in their pocket.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
