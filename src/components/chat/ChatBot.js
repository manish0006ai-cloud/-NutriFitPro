'use client';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useFoodLog } from '../../context/FoodLogContext';

const SYSTEM_PROMPT = `You are a certified sports nutritionist and fitness coach. Give science-backed, practical advice. Keep answers concise and actionable. Always reference the user's current macro targets and today's logged food when answering.`;

// Smart pre-built responses for common questions when no API key
const smartResponses = {
  'pre workout': '🏋️ **Pre-Workout Meal (1-2 hrs before):**\n\n• 40-60g carbs + 20-30g protein, <10g fat\n• **Ideas:** Oats + banana + whey shake, Rice cakes + PB + honey, Toast + eggs\n• Avoid high fiber/fat — slows digestion',
  'post workout': '💪 **Post-Workout Meal (within 30-60 min):**\n\n• 30-40g protein + 50-80g fast carbs\n• **Ideas:** Whey + banana + milk shake, Chicken + white rice, Greek yogurt + berries + honey\n• Fast carbs replenish glycogen stores',
  'protein': '🥩 **Top Protein Sources for Gym-Goers:**\n\n• Chicken breast: 31g/100g\n• Eggs: 13g/100g (6g per egg)\n• Greek yogurt: 10g/100g\n• Tuna: 26g/100g\n• Whey protein: 24g/scoop\n• Lentils: 9g/100g\n\n**Aim for 1.6-2.2g per kg bodyweight** for muscle gain.',
  'creatine': '⚡ **Creatine Monohydrate:**\n\n• Dose: 5g/day (no loading needed)\n• Take any time — consistency matters more than timing\n• Improves strength, power output, and muscle recovery\n• Stay well hydrated (extra 500ml water/day)\n• Most studied and safest supplement available',
  'magnesium': '🧲 **Why Magnesium Matters for Gym-Goers:**\n\n• Supports muscle contractions and relaxation\n• Aids energy production (ATP synthesis)\n• Reduces cramping and improves sleep quality\n• 400-420mg/day for men, 310-320mg for women\n• **Sources:** Pumpkin seeds, spinach, almonds, dark chocolate',
  'fat loss': '🔥 **Fat Loss Tips:**\n\n• Deficit of 300-500 kcal/day from TDEE\n• High protein (1.8-2.4g/kg) to preserve muscle\n• Prioritize whole foods, fiber, and water\n• Strength train 3-5x/week\n• Sleep 7-9 hours — crucial for fat loss hormones',
  'muscle gain': '💪 **Muscle Gain Tips:**\n\n• Surplus of 200-400 kcal/day above TDEE\n• Protein: 1.6-2.2g per kg bodyweight\n• Progressive overload in training\n• Spread protein across 4-5 meals\n• Complex carbs around workouts for energy',
  default: "🤖 I'm your AI nutrition coach! Ask me about:\n\n• Pre/post workout meals\n• Protein sources & intake\n• Supplements (creatine, whey, etc.)\n• Fat loss or muscle gain strategies\n• Nutrient explanations\n• Recipe ideas\n\nI'll give you science-backed, practical advice!"
};

function getSmartResponse(query, profile, totals) {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(smartResponses)) {
    if (key !== 'default' && q.includes(key)) {
      let r = response;
      if (profile) {
        r += `\n\n📊 *Your targets: ${profile.dailyTargets.calories} kcal | ${profile.dailyTargets.protein}g protein*`;
      }
      return r;
    }
  }

  // Context-aware responses
  if (profile && totals) {
    const remaining = {
      protein: profile.dailyTargets.protein - totals.protein,
      calories: profile.dailyTargets.calories - totals.calories,
    };
    if (q.includes('what should i eat') || q.includes('suggest') || q.includes('recommend')) {
      if (remaining.protein > 30) {
        return `Based on your log today, you still need **${remaining.protein}g protein** and **${remaining.calories} kcal**.\n\n💡 **Suggestions:**\n• Add 2 eggs (12g protein) ≈ 150 kcal\n• A scoop of whey (24g protein) ≈ 120 kcal\n• Greek yogurt cup (10g protein) ≈ 60 kcal\n• 150g chicken breast (46g protein) ≈ 250 kcal`;
      }
      return `You're doing great today! **${remaining.calories} kcal** and **${remaining.protein}g protein** remaining. Try a light snack like almonds or a banana.`;
    }
    if (q.includes('how am i doing') || q.includes('feedback') || q.includes('today')) {
      const protPct = Math.round((totals.protein / profile.dailyTargets.protein) * 100);
      const calPct = Math.round((totals.calories / profile.dailyTargets.calories) * 100);
      return `📊 **Today's Progress:**\n\n• Calories: ${totals.calories}/${profile.dailyTargets.calories} (${calPct}%)\n• Protein: ${totals.protein}/${profile.dailyTargets.protein}g (${protPct}%)\n• Carbs: ${totals.carbs}/${profile.dailyTargets.carbs}g\n• Fat: ${totals.fat}/${profile.dailyTargets.fat}g\n\n${protPct < 50 ? '⚠️ Your protein is low — prioritize protein-rich foods for remaining meals!' : '✅ Protein intake looks solid!'}`;
    }
  }

  if (q.includes('leg day')) return smartResponses['pre workout'] + '\n\n🦵 **Leg day specifics:** Extra carbs (60-80g) for glycogen in large muscle groups. Sweet potato + chicken is ideal!';
  if (q.includes('sleep') || q.includes('recovery')) return '😴 **Recovery & Sleep:**\n\n• 7-9 hours sleep for optimal muscle recovery\n• Casein protein before bed (slow-release)\n• Magnesium and zinc aid sleep quality\n• Avoid caffeine 6+ hours before bed';

  return smartResponses.default;
}

export default function ChatBot() {
  const { profile } = useUser();
  const { totals } = useFoodLog();
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm your AI nutrition coach 🤖💪\n\nAsk me anything about nutrition, supplements, pre/post workout meals, or your daily targets!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Use smart responses (no API key needed)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const response = getSmartResponse(userMsg, profile, totals);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <div className="animate-fade chat-container">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>🤖 AI Nutrition Coach</h1>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot" style={{ opacity: 0.6 }}>
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>
        <div className="chat-input-bar">
          <input className="input" placeholder="Ask about nutrition, supplements, meals..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }} />
          <button className="btn btn-primary" onClick={send} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}
