'use client';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { GOALS, ACTIVITY_LEVELS } from '../../lib/constants';
import { calculateTargets } from '../../lib/calculations';

export default function OnboardingPage() {
  const { dispatch } = useUser();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', age: 25, weight: 70, height: 170, gender: 'male',
    goal: '', activityLevel: 'moderately_active', dietaryPreference: 'non_veg',
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const preview = form.goal ? calculateTargets(form) : null;

  const finish = () => {
    dispatch({ type: 'SET_PROFILE', payload: { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() } });
  };

  return (
    <div className="onboarding">
      <div className="onboarding-card card animate-scale">
        {/* Progress */}
        <div className="onboarding-progress">
          {[1, 2, 3].map(s => (
            <div key={s} className={`onboarding-step ${s === step ? 'active' : s < step ? 'done' : ''}`} />
          ))}
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="animate-fade">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>What&apos;s your fitness goal?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>This helps us calculate your ideal calories and macros.</p>
            <div className="goal-grid">
              {GOALS.map(g => (
                <div key={g.id} className={`goal-card ${form.goal === g.id ? 'selected' : ''}`} onClick={() => update('goal', g.id)}>
                  <div className="icon">{g.icon}</div>
                  <div className="label">{g.label}</div>
                  <div className="desc">{g.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" disabled={!form.goal} onClick={() => setStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Body Stats */}
        {step === 2 && (
          <div className="animate-fade">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Tell us about yourself</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>We&apos;ll calculate your BMR and TDEE from this.</p>

            <div className="input-group" style={{ marginBottom: 16 }}>
              <label>Your Name</label>
              <input className="input" placeholder="Enter your name" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>

            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="input-group">
                <label>Age</label>
                <input className="input" type="number" value={form.age} onChange={e => update('age', +e.target.value)} />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input className="input" type="number" value={form.weight} onChange={e => update('weight', +e.target.value)} />
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input className="input" type="number" value={form.height} onChange={e => update('height', +e.target.value)} />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 24 }}>
              <label>Activity Level</label>
              <select className="input" value={form.activityLevel} onChange={e => update('activityLevel', e.target.value)}>
                {ACTIVITY_LEVELS.map(a => (
                  <option key={a.id} value={a.id}>{a.label} — {a.desc}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Diet Preference + Review */}
        {step === 3 && (
          <div className="animate-fade">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Almost done!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>Choose your dietary preference and review your personalized targets.</p>

            <div className="input-group" style={{ marginBottom: 24 }}>
              <label>Dietary Preference</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'non_veg', label: '🍗 Non-Veg' }, { id: 'veg', label: '🥬 Vegetarian' }, { id: 'vegan', label: '🌱 Vegan' }].map(d => (
                  <button key={d.id} className={`btn ${form.dietaryPreference === d.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => update('dietaryPreference', d.id)} style={{ flex: 1 }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {preview && (
              <div className="card" style={{ background: 'var(--bg-glass)', marginBottom: 24 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>🎯 Your Personalized Targets</h3>
                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="stat-card card" style={{ padding: 12 }}>
                    <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{preview.bmr}</div>
                    <div className="stat-label">BMR (kcal)</div>
                  </div>
                  <div className="stat-card card" style={{ padding: 12 }}>
                    <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--accent-2)' }}>{preview.tdee}</div>
                    <div className="stat-label">TDEE (kcal)</div>
                  </div>
                  <div className="stat-card card" style={{ padding: 12 }}>
                    <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--warning)' }}>{preview.dailyTargets.calories}</div>
                    <div className="stat-label">Daily Calories</div>
                  </div>
                  <div className="stat-card card" style={{ padding: 12 }}>
                    <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--protein)' }}>{preview.dailyTargets.protein}g</div>
                    <div className="stat-label">Protein</div>
                  </div>
                  <div className="stat-card card" style={{ padding: 12 }}>
                    <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--carbs)' }}>{preview.dailyTargets.carbs}g</div>
                    <div className="stat-label">Carbs</div>
                  </div>
                  <div className="stat-card card" style={{ padding: 12 }}>
                    <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--fat)' }}>{preview.dailyTargets.fat}g</div>
                    <div className="stat-label">Fat</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={finish}>🚀 Start Tracking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
