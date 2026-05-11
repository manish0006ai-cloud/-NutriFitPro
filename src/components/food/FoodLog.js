'use client';
import { useState, useCallback } from 'react';
import { useFoodLog } from '../../context/FoodLogContext';
import { useUser } from '../../context/UserContext';
import { searchLocalFoods } from '../../lib/foodDatabase';
import { MEAL_TYPES, EGG_SIZES } from '../../lib/constants';
import VoiceLogger from './VoiceLogger';

export default function FoodLog() {
  const { meals, totals, addFood, removeFood } = useFoodLog();
  const { profile } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [apiResults, setApiResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const doSearch = useCallback(async (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); setApiResults([]); return; }
    const local = searchLocalFoods(q);
    setSearchResults(local);
    // USDA API search
    setSearching(true);
    try {
      const res = await fetch(`/api/food-search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setApiResults(data.foods || []);
      }
    } catch { /* ignore */ }
    setSearching(false);
  }, []);

  const handleAddFood = () => {
    if (!selectedFood) return;
    const itemToAdd = { ...selectedFood, quantity, unit: 'g', loggedAt: new Date().toISOString() };
    if (selectedFood.name.toLowerCase().includes('egg')) {
      const size = EGG_SIZES.find(s => s.weight === quantity);
      if (size) itemToAdd.sizeLabel = size.label;
    }
    addFood(selectedMeal, itemToAdd);
    setSelectedFood(null);
    setQuantity(100);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setApiResults([]);
  };

  return (
    <div className="animate-fade">
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🍽️ Food Log</h1>
          <VoiceLogger />
        </div>
        <button className="btn btn-primary" onClick={() => setShowSearch(true)}>+ Add Food</button>
      </div>

      {/* Quick Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Calories', val: totals.calories, target: profile?.dailyTargets?.calories, color: 'var(--accent)' },
          { label: 'Protein', val: `${totals.protein}g`, target: profile?.dailyTargets?.protein, color: 'var(--protein)' },
          { label: 'Carbs', val: `${totals.carbs}g`, target: profile?.dailyTargets?.carbs, color: 'var(--carbs)' },
          { label: 'Fat', val: `${totals.fat}g`, target: profile?.dailyTargets?.fat, color: 'var(--fat)' },
        ].map(s => (
          <div key={s.label} className="card stat-card" style={{ padding: 16 }}>
            <div className="stat-value" style={{ fontSize: '1.3rem', color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Meals */}
      {MEAL_TYPES.map(mt => {
        const items = meals[mt.id] || [];
        return (
          <div key={mt.id} className="card" style={{ marginBottom: 12 }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{mt.icon}</span>
                <span className="card-title">{mt.label}</span>
                <span className="badge badge-blue" style={{ marginLeft: 8 }}>{items.length} items</span>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => { setSelectedMeal(mt.id); setShowSearch(true); }}>+ Add</button>
            </div>
            {items.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0' }}>No food logged</p>
            ) : (
              items.map((item, idx) => {
                const mult = (item.quantity || 100) / 100;
                return (
                  <div key={idx} className="food-log-item">
                    <div>
                      <div className="food-log-name">{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.sizeLabel ? `${item.sizeLabel} Egg (${item.quantity}g)` : `${item.quantity}g`}
                      </div>
                    </div>
                    <div className="food-log-macros">
                      <span className="food-log-macro"><span className="dot" style={{ background: 'var(--accent)' }} />{Math.round(item.cal * mult)} kcal</span>
                      <span className="food-log-macro"><span className="dot" style={{ background: 'var(--protein)' }} />{Math.round(item.protein * mult)}g P</span>
                      <span className="food-log-macro"><span className="dot" style={{ background: 'var(--carbs)' }} />{Math.round(item.carbs * mult)}g C</span>
                      <span className="food-log-macro"><span className="dot" style={{ background: 'var(--fat)' }} />{Math.round(item.fat * mult)}g F</span>
                      <button className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeFood(mt.id, idx)}>✕</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );
      })}

      {/* Search Modal */}
      {showSearch && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSearch(false); }}>
          <div className="modal" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 700 }}>Search Food — {MEAL_TYPES.find(m => m.id === selectedMeal)?.label}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowSearch(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="search-container" style={{ marginBottom: 16 }}>
                <span className="search-icon">🔍</span>
                <input className="input search-input" placeholder="Search foods... (e.g. chicken breast)"
                  value={searchQuery} onChange={e => doSearch(e.target.value)} autoFocus />
              </div>

              {selectedFood ? (
                <div className="animate-fade">
                  <div className="card" style={{ marginBottom: 16 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{selectedFood.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>Per 100g: {selectedFood.cal} kcal | P: {selectedFood.protein}g | C: {selectedFood.carbs}g | F: {selectedFood.fat}g</p>
                    <div className="input-group" style={{ marginBottom: 16 }}>
                      <label>Serving Size (grams)</label>
                      <input className="input" type="number" value={quantity} onChange={e => setQuantity(+e.target.value)} min={1} />
                    </div>

                    {selectedFood.name.toLowerCase().includes('egg') && (
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Select Size:</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {EGG_SIZES.map(size => (
                            <button
                              key={size.id}
                              className={`btn btn-sm ${quantity === size.weight ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ flex: 1, fontSize: '0.75rem' }}
                              onClick={() => setQuantity(size.weight)}
                            >
                              {size.label} ({size.weight}g)
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="card" style={{ background: 'var(--bg-glass)', padding: 12 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Nutrition for {quantity}g:</p>
                      <div className="grid-4">
                        <div><span style={{ fontWeight: 700, color: 'var(--accent)' }}>{Math.round(selectedFood.cal * quantity / 100)}</span><br/><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>kcal</span></div>
                        <div><span style={{ fontWeight: 700, color: 'var(--protein)' }}>{Math.round(selectedFood.protein * quantity / 100)}g</span><br/><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Protein</span></div>
                        <div><span style={{ fontWeight: 700, color: 'var(--carbs)' }}>{Math.round(selectedFood.carbs * quantity / 100)}g</span><br/><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carbs</span></div>
                        <div><span style={{ fontWeight: 700, color: 'var(--fat)' }}>{Math.round(selectedFood.fat * quantity / 100)}g</span><br/><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fat</span></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => setSelectedFood(null)}>← Back</button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddFood}>Add to {MEAL_TYPES.find(m => m.id === selectedMeal)?.label}</button>
                  </div>
                </div>
              ) : (
                <div className="search-results" style={{ position: 'relative', maxHeight: 350, overflowY: 'auto' }}>
                  {searchResults.length > 0 && (
                    <div style={{ padding: '8px 16px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>LOCAL DATABASE</div>
                  )}
                  {searchResults.map(f => (
                    <div key={f.id} className="search-result-item" onClick={() => setSelectedFood(f)}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Per 100g</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--accent)' }}>{f.cal} kcal</span>
                        <span style={{ color: 'var(--protein)' }}>{f.protein}g P</span>
                        <span className={`badge badge-${f.traffic === 'green' ? 'green' : f.traffic === 'yellow' ? 'yellow' : 'red'}`}>{f.traffic}</span>
                      </div>
                    </div>
                  ))}
                  {apiResults.length > 0 && (
                    <>
                      <div style={{ padding: '8px 16px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>USDA DATABASE</div>
                      {apiResults.map(f => (
                        <div key={f.id} className="search-result-item" onClick={() => setSelectedFood(f)}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Per 100g</div>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{f.cal} kcal</div>
                        </div>
                      ))}
                    </>
                  )}
                  {searching && <p style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Searching USDA database...</p>}
                  {!searching && searchQuery.length >= 2 && searchResults.length === 0 && apiResults.length === 0 && (
                    <p style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No results found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
