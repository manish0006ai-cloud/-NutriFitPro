'use client';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { generateMealPlan, generateShoppingList } from '../../lib/mealPlanner';

export default function MealPlans() {
  const { profile } = useUser();
  const [plan, setPlan] = useState(null);
  const [showList, setShowList] = useState(false);
  const [diet, setDiet] = useState(profile?.dietaryPreference || 'non_veg');

  const generate = () => {
    if (!profile) return;
    const p = generateMealPlan(profile.dailyTargets, diet);
    setPlan(p);
  };

  const shoppingList = plan ? generateShoppingList(plan) : [];

  return (
    <div className="animate-fade">
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>📋 Meal Plans</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" style={{ width: 'auto' }} value={diet} onChange={e => setDiet(e.target.value)}>
            <option value="non_veg">🍗 Non-Veg</option>
            <option value="veg">🥬 Vegetarian</option>
            <option value="vegan">🌱 Vegan</option>
          </select>
          <button className="btn btn-primary" onClick={generate}>Generate 7-Day Plan</button>
        </div>
      </div>

      {!plan ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍽️</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>No Meal Plan Yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Generate a personalized 7-day meal plan based on your macro targets.</p>
          <button className="btn btn-primary" onClick={generate}>🚀 Generate Plan</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className={`btn ${!showList ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowList(false)}>Meal Plan</button>
            <button className={`btn ${showList ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowList(true)}>🛒 Shopping List ({shoppingList.length})</button>
          </div>

          {showList ? (
            <div className="card">
              <div className="card-header"><span className="card-title">Shopping List</span></div>
              {shoppingList.map((item, i) => (
                <div key={i} className="food-log-item">
                  <span className="food-log-name">{item.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.quantity}{item.unit}</span>
                </div>
              ))}
            </div>
          ) : (
            plan.days.map((day, di) => (
              <div key={di} className="card" style={{ marginBottom: 12 }}>
                <div className="card-header">
                  <span className="card-title">{day.day}</span>
                </div>
                {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
                  <div key={meal} style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                      {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'dinner' ? '🌙' : '🍎'} {meal}
                    </p>
                    {(day[meal] || []).map((item, ii) => (
                      <div key={ii} className="food-log-item">
                        <span className="food-log-name">{item.name}</span>
                        <div className="food-log-macros">
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.quantity}{item.unit}</span>
                          <span style={{ color: 'var(--protein)', fontSize: '0.75rem' }}>{Math.round(item.protein * item.quantity / 100)}g P</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
