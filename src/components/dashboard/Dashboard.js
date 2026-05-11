'use client';
import { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useFoodLog } from '../../context/FoodLogContext';
import { calculateNutritionScore } from '../../lib/calculations';
import { getTrainingDayTargets } from '../../lib/calculations';
import { getStreak } from '../../lib/storage';
import { MEAL_TYPES, SUPPLEMENTS } from '../../lib/constants';
import CalorieRing from './CalorieRing';
import MacroCard from './MacroCard';
import dynamic from 'next/dynamic';

const MacroPie = dynamic(() => import('./MacroPie'), { ssr: false });

export default function Dashboard() {
  const { profile, isTrainingDay, dispatch: userDispatch } = useUser();
  const { totals, water, setWater, meals, supplements, toggleSupplement } = useFoodLog();

  const targets = useMemo(() => {
    if (!profile) return { calories: 2000, protein: 150, carbs: 250, fat: 70, fiber: 30, water: 8 };
    return isTrainingDay ? getTrainingDayTargets(profile.dailyTargets) : profile.dailyTargets;
  }, [profile, isTrainingDay]);

  const score = calculateNutritionScore(totals, targets);
  const streak = getStreak();

  const scoreClass = score >= 80 ? 'score-excellent' : score >= 60 ? 'score-good' : score >= 40 ? 'score-fair' : 'score-poor';

  const totalMeals = Object.values(meals).reduce((sum, arr) => sum + arr.length, 0);

  if (!profile) return null;

  return (
    <div className="animate-fade">
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {profile.name || 'Champ'} 💪</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex-center gap-sm">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rest</span>
          <button className={`toggle ${isTrainingDay ? 'active' : ''}`}
            onClick={() => userDispatch({ type: 'TOGGLE_TRAINING_DAY' })}>
            <div className="toggle-knob" />
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Training</span>
        </div>
      </div>

      {/* Top Row: Calorie Ring + Score + Streak */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card card-glow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CalorieRing consumed={totals.calories} target={targets.calories} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
            {Math.max(0, targets.calories - totals.calories)} kcal remaining
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className={`score-circle ${scoreClass}`}>{score}</div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 12 }}>Nutrition Score</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good job!' : score >= 40 ? 'Keep going!' : 'Log more meals'}
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="streak-display">
            <span className="streak-fire">🔥</span>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>{streak}</span>
          </div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 8 }}>Day Streak</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{totalMeals} items logged today</p>
        </div>
      </div>

      {/* Macro Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Macro Breakdown</span>
          </div>
          <MacroPie protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Daily Progress</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MacroCard label="Protein" consumed={totals.protein} target={targets.protein} unit="g" color="protein" />
            <MacroCard label="Carbs" consumed={totals.carbs} target={targets.carbs} unit="g" color="carbs" />
            <MacroCard label="Fat" consumed={totals.fat} target={targets.fat} unit="g" color="fat" />
            <MacroCard label="Fiber" consumed={totals.fiber} target={targets.fiber} unit="g" color="fiber" />
          </div>
        </div>
      </div>

      {/* Hydration + Supplements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">💧 Hydration</span>
            <span className="card-subtitle">{water} / {targets.water || 8} glasses ({(water * 0.25).toFixed(1)} / {((targets.water || 8) * 0.25).toFixed(1)} L)</span>
          </div>
          <div className="water-grid">
            {Array.from({ length: targets.water || 8 }).map((_, i) => (
              <button key={i} className={`water-glass ${i < water ? 'filled' : ''}`}
                onClick={() => setWater(i < water ? i : i + 1)}>
                💧
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">💊 Supplements</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SUPPLEMENTS.map(s => (
              <div key={s.id}
                className={`supplement-item ${supplements.includes(s.id) ? 'checked' : ''}`}
                onClick={() => toggleSupplement(s.id)}>
                <div className="supplement-check">{supplements.includes(s.id) ? '✓' : ''}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.dose}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
