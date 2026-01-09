import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Quick keyword-based mood detection for instant response
function detectMoodFast(message: string): { mood: string; emoji: string; emotion_intensity: string } {
  const lowerMsg = message.toLowerCase();
  
  // Happy/Positive keywords
  if (/\b(happy|joy|excited|great|wonderful|amazing|love|awesome|fantastic|good|nice|yay|😊|😃|🎉)\b/.test(lowerMsg)) {
    return { mood: "happy", emoji: "😊", emotion_intensity: "high" };
  }
  
  // Sad keywords
  if (/\b(sad|depressed|down|unhappy|crying|tears|lonely|alone|miss|grief|😢|😭)\b/.test(lowerMsg)) {
    return { mood: "sad", emoji: "😢", emotion_intensity: "high" };
  }
  
  // Anxious/Stressed keywords
  if (/\b(anxious|anxiety|worried|stress|nervous|panic|scared|fear|overwhelm|tense|😰|😟)\b/.test(lowerMsg)) {
    return { mood: "anxious", emoji: "😰", emotion_intensity: "high" };
  }
  
  // Calm/Peaceful keywords
  if (/\b(calm|peaceful|relax|serene|tranquil|quiet|zen|meditat|breath|🧘|😌)\b/.test(lowerMsg)) {
    return { mood: "peaceful", emoji: "😌", emotion_intensity: "medium" };
  }
  
  // Energetic keywords
  if (/\b(energetic|energy|pumped|motivated|active|ready|lets go|fired up|💪|⚡)\b/.test(lowerMsg)) {
    return { mood: "energetic", emoji: "⚡", emotion_intensity: "high" };
  }
  
  // Tired keywords
  if (/\b(tired|exhausted|sleepy|fatigue|drained|worn out|😴|🥱)\b/.test(lowerMsg)) {
    return { mood: "calm", emoji: "😴", emotion_intensity: "low" };
  }
  
  // Angry/Frustrated keywords
  if (/\b(angry|mad|frustrated|annoyed|irritated|furious|rage|😠|😤)\b/.test(lowerMsg)) {
    return { mood: "stressed", emoji: "😤", emotion_intensity: "high" };
  }
  
  // Default neutral
  return { mood: "neutral", emoji: "🙂", emotion_intensity: "low" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    // Fast local detection - instant response
    const moodResult = detectMoodFast(message);
    
    console.log("Mood detected:", moodResult);

    return new Response(
      JSON.stringify(moodResult),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Mood analysis error:", error);
    return new Response(
      JSON.stringify({ 
        mood: "neutral", 
        emoji: "🙂", 
        emotion_intensity: "low" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
