'use client';
import { useState, useEffect, useRef } from 'react';
import { useFoodLog } from '../../context/FoodLogContext';
import { searchLocalFoods } from '../../lib/foodDatabase';
import { MEAL_TYPES, EGG_SIZES } from '../../lib/constants';

export default function VoiceLogger() {
  const { addFood } = useFoodLog();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        processVoiceCommand(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setStatus('Error: ' + event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    setTranscript('');
    setStatus('Listening...');
    setIsListening(true);
    recognitionRef.current.start();
  };

  const processVoiceCommand = async (text) => {
    setStatus('Processing: "' + text + '"');
    
    // 1. Identify Meal
    let selectedMeal = 'breakfast'; // default
    const mealKeywords = {
      breakfast: ['breakfast', 'breafast', 'brekfast', 'morning meal'],
      lunch: ['lunch', 'luch', 'afternoon meal'],
      pre_workout: ['pre workout', 'preworkout', 'pre-workout', 'before workout'],
      post_workout: ['post workout', 'postworkout', 'post-workout', 'after workout'],
      dinner: ['dinner', 'diner', 'night meal'],
      snacks: ['snack', 'snacks', 'munchies']
    };

    for (const [meal, keywords] of Object.entries(mealKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        selectedMeal = meal;
        break;
      }
    }

    // 2. Identify Foods
    // We'll search for matches in our local database
    // This is a simple approach: check if any food name is in the transcript
    const foundFoods = [];
    
    // Check local foods first (which are common gym foods)
    const localFoods = require('../../lib/foodDatabase').default;
    
    localFoods.forEach(food => {
      const foodName = food.name.toLowerCase().replace(/\(.*\)/g, '').trim();
      if (text.includes(foodName)) {
        foundFoods.push(food);
      }
    });

    if (foundFoods.length > 0) {
      foundFoods.forEach(food => {
        let quantity = 100;
        let sizeLabel = null;

        if (food.name.toLowerCase().includes('egg')) {
          const size = EGG_SIZES.find(s => text.includes(s.id) || text.includes(s.label.toLowerCase()));
          let count = 1;
          const match = text.match(/(\d+)\s*(egg|small|medium|large)/);
          if (match) count = parseInt(match[1]);

          if (size) {
            quantity = size.weight * count;
            sizeLabel = count > 1 ? `${count}x ${size.label}` : size.label;
          } else {
            // Default to medium weight (50g) if count is mentioned but no size
            quantity = 50 * count;
            if (count > 1) sizeLabel = `${count}x Eggs`;
          }
        } else if (food.name.toLowerCase().includes('chapati') || food.name.toLowerCase().includes('roti') || food.name.toLowerCase().includes('bhakri')) {
          const size = ROTI_SIZES.find(s => text.includes(s.id) || text.includes(s.label.toLowerCase()));
          let count = 1;
          // Match digits before keywords
          const match = text.match(/(\d+)\s*(chapati|roti|bhakri|small|medium|large)/);
          if (match) count = parseInt(match[1]);

          const label = food.name.toLowerCase().includes('chapati') ? 'Chapati' : food.name.toLowerCase().includes('bhakri') ? 'Bhakri' : 'Roti';
          
          if (size) {
            quantity = size.weight * count;
            sizeLabel = count > 1 ? `${count}x ${size.label} ${label}` : `${size.label} ${label}`;
          } else {
            // Default to medium weight (45g) if count is mentioned but no size
            quantity = 45 * count;
            if (count > 1) sizeLabel = `${count}x ${label}s`;
          }
        }

        addFood(selectedMeal, { ...food, quantity, sizeLabel, unit: 'g', loggedAt: new Date().toISOString() });
      });
      setStatus(`Added ${foundFoods.length} items to ${selectedMeal}`);
      
      // Auto-hide status after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    } else {
      // Try searching via API for the whole text (minus meal keywords)
      setStatus('Searching for foods...');
      let searchQuery = text
        .replace(/breakfast|lunch|pre workout|preworkout|post workout|postworkout|dinner|snacks|snack|ate|had|for/g, '')
        .trim();
      
      if (searchQuery) {
        try {
          const res = await fetch(`/api/food-search?q=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.foods && data.foods.length > 0) {
              const bestMatch = data.foods[0];
              addFood(selectedMeal, { ...bestMatch, quantity: 100, unit: 'g', loggedAt: new Date().toISOString() });
              setStatus(`Added ${bestMatch.name} to ${selectedMeal}`);
              setTimeout(() => setStatus(''), 3000);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStatus('Could not find food in: "' + text + '"');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="voice-logger" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button 
        className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`} 
        onClick={isListening ? () => recognitionRef.current.stop() : startListening}
        style={{ 
          borderRadius: '50%', 
          width: 48, 
          height: 48, 
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isListening ? '0 0 15px var(--danger)' : 'none',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
      >
        {isListening ? '🛑' : '🎤'}
      </button>
      
      {status && (
        <div className="animate-fade-in" style={{ 
          background: 'var(--bg-glass)', 
          padding: '8px 16px', 
          borderRadius: 8, 
          fontSize: '0.85rem',
          border: '1px solid var(--border)',
          maxWidth: 300
        }}>
          {status}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
