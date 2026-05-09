'use client';
import { useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { getRecentDates, getDayLog, getWeightLogs, saveWeightLog, getTodayKey } from '../../lib/storage';
import { calculateNutritionScore } from '../../lib/calculations';
import dynamic from 'next/dynamic';

const TrendChart = dynamic(() => import('./TrendChart'), { ssr: false });

export default function Analytics() {
  const { profile } = useUser();
  const [weightInput, setWeightInput] = useState('');
  const [bodyFatInput, setBodyFatInput] = useState('');
  const [range, setRange] = useState(7);

  const dates = useMemo(() => getRecentDates(range), [range]);
  const logs = useMemo(() => dates.map(d => ({ date: d, ...getDayLog(d) })), [dates]);
  const weightLogs = getWeightLogs();
  const targets = profile?.dailyTargets || { calories: 2000, protein: 150, carbs: 250, fat: 70 };

  const chartData = logs.map(l => ({
    date: l.date.slice(5),
    calories: l.totals.calories,
    protein: l.totals.protein,
    carbs: l.totals.carbs,
    fat: l.totals.fat,
    score: calculateNutritionScore(l.totals, targets),
  }));

  // Most eaten foods
  const foodFreq = {};
  logs.forEach(l => {
    Object.values(l.meals).forEach(arr => {
      arr.forEach(f => { foodFreq[f.name] = (foodFreq[f.name] || 0) + 1; });
    });
  });
  const topFoods = Object.entries(foodFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const addWeight = () => {
    if (!weightInput) return;
    saveWeightLog({ date: getTodayKey(), weight: +weightInput, bodyFat: bodyFatInput ? +bodyFatInput : null });
    setWeightInput('');
    setBodyFatInput('');
  };

  // Deficiency check
  const avgProtein = logs.reduce((s, l) => s + l.totals.protein, 0) / logs.length;
  const alerts = [];
  if (avgProtein < targets.protein * 0.7) alerts.push('⚠️ Your average protein intake is low. Consider adding more lean protein sources.');
  const avgCal = logs.reduce((s, l) => s + l.totals.calories, 0) / logs.length;
  if (avgCal < targets.calories * 0.6 && avgCal > 0) alerts.push('⚠️ You\'re significantly under your calorie target. Make sure you\'re eating enough!');

  return (
    <div className="animate-fade">
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📈 Analytics</h1>
        <div className="tabs">
          <button className={`tab ${range === 7 ? 'active' : ''}`} onClick={() => setRange(7)}>7 Days</button>
          <button className={`tab ${range === 14 ? 'active' : ''}`} onClick={() => setRange(14)}>14 Days</button>
          <button className={`tab ${range === 30 ? 'active' : ''}`} onClick={() => setRange(30)}>30 Days</button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card" style={{ marginBottom: 16, borderColor: 'var(--warning)' }}>
          {alerts.map((a, i) => <p key={i} style={{ fontSize: '0.85rem', padding: 4 }}>{a}</p>)}
        </div>
      )}

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Calorie Trend</span></div>
          <TrendChart data={chartData} dataKey="calories" color="#22c55e" target={targets.calories} />
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Protein Trend</span></div>
          <TrendChart data={chartData} dataKey="protein" color="#3b82f6" target={targets.protein} />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Nutrition Score</span></div>
          <TrendChart data={chartData} dataKey="score" color="#a855f7" />
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Most Eaten Foods</span></div>
          {topFoods.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start logging to see your patterns</p>
          ) : (
            topFoods.map(([name, count], i) => (
              <div key={i} className="food-log-item">
                <span className="food-log-name">{name}</span>
                <span className="badge badge-blue">{count}×</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Weight Logging */}
      <div className="card">
        <div className="card-header"><span className="card-title">⚖️ Weight Log</span></div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input className="input" type="number" placeholder="Weight (kg)" value={weightInput} onChange={e => setWeightInput(e.target.value)} style={{ flex: 1 }} />
          <input className="input" type="number" placeholder="Body fat % (optional)" value={bodyFatInput} onChange={e => setBodyFatInput(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={addWeight}>Log</button>
        </div>
        {weightLogs.slice(-7).reverse().map((w, i) => (
          <div key={i} className="food-log-item">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.date}</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontWeight: 700 }}>{w.weight} kg</span>
              {w.bodyFat && <span style={{ color: 'var(--text-muted)' }}>{w.bodyFat}% BF</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
