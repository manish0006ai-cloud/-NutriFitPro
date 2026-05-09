'use client';
import { useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useFoodLog } from '../../context/FoodLogContext';
import { getRecommendations, getPreWorkoutMeals, getPostWorkoutMeals, getBestFoodsForGoal, getFoodsToAvoid } from '../../lib/recommendations';

export default function Recommendations() {
  const { profile } = useUser();
  const { totals } = useFoodLog();
  const [tab, setTab] = useState('smart');

  const remaining = useMemo(() => {
    if (!profile) return { calories: 2000, protein: 150, carbs: 250, fat: 70 };
    const t = profile.dailyTargets;
    return {
      calories: Math.max(0, t.calories - totals.calories),
      protein: Math.max(0, t.protein - totals.protein),
      carbs: Math.max(0, t.carbs - totals.carbs),
      fat: Math.max(0, t.fat - totals.fat),
    };
  }, [profile, totals]);

  const diet = profile?.dietaryPreference || 'non_veg';
  const goal = profile?.goal || 'maintenance';

  const smartRecs = useMemo(() => getRecommendations(remaining, diet), [remaining, diet]);
  const preWorkout = useMemo(() => getPreWorkoutMeals(diet), [diet]);
  const postWorkout = useMemo(() => getPostWorkoutMeals(diet), [diet]);
  const bestFoods = useMemo(() => getBestFoodsForGoal(goal, diet), [goal, diet]);
  const avoidFoods = useMemo(() => getFoodsToAvoid(), []);

  const tabs = [
    { id: 'smart', label: '⚡ Smart Picks' },
    { id: 'pre', label: '🏃 Pre-Workout' },
    { id: 'post', label: '💪 Post-Workout' },
    { id: 'best', label: '⭐ Best Foods' },
    { id: 'avoid', label: '🚫 Avoid' },
  ];

  const renderFoodList = (foods) => (
    <div>
      {foods.map(f => (
        <div key={f.id} className="food-log-item" style={{ marginBottom: 8 }}>
          <div>
            <div className="food-log-name">{f.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Per 100g</div>
          </div>
          <div className="food-log-macros">
            <span style={{ color: 'var(--accent)' }}>{f.cal} kcal</span>
            <span style={{ color: 'var(--protein)' }}>{f.protein}g P</span>
            <span style={{ color: 'var(--carbs)' }}>{f.carbs}g C</span>
            <span style={{ color: 'var(--fat)' }}>{f.fat}g F</span>
            <span className={`badge badge-${f.traffic === 'green' ? 'green' : f.traffic === 'yellow' ? 'yellow' : 'red'}`}>
              {f.traffic === 'green' ? '✓ EAT' : f.traffic === 'yellow' ? '⚠ MODERATE' : '✕ AVOID'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>⭐ Food Recommendations</h1>

      <div className="tabs" style={{ marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'smart' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Based on your remaining macros</span>
            <span className="card-subtitle">P: {remaining.protein}g | C: {remaining.carbs}g | F: {remaining.fat}g left</span>
          </div>
          {renderFoodList(smartRecs)}
        </div>
      )}

      {tab === 'pre' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pre-Workout Meals</span>
            <span className="card-subtitle">1-2 hrs before training: 40-60g carbs, 20-30g protein, &lt;10g fat</span>
          </div>
          {renderFoodList(preWorkout)}
        </div>
      )}

      {tab === 'post' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Post-Workout Meals</span>
            <span className="card-subtitle">Within 30-60 min: 30-40g protein, 50-80g fast carbs</span>
          </div>
          {renderFoodList(postWorkout)}
        </div>
      )}

      {tab === 'best' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Best Foods for {goal.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
          </div>
          {renderFoodList(bestFoods)}
        </div>
      )}

      {tab === 'avoid' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Foods to Avoid / Limit</span>
            <span className="card-subtitle">Processed, high-sugar, trans fats</span>
          </div>
          {renderFoodList(avoidFoods)}
        </div>
      )}
    </div>
  );
}
