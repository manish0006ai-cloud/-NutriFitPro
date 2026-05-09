'use client';
import { useState } from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import FoodLog from '../../components/food/FoodLog';
import MealPlans from '../../components/meals/MealPlans';
import Recommendations from '../../components/recommendations/Recommendations';
import Analytics from '../../components/analytics/Analytics';
import ChatBot from '../../components/chat/ChatBot';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'log', label: 'Food Log', icon: '🍽️' },
  { id: 'meals', label: 'Meal Plans', icon: '📋' },
  { id: 'recommend', label: 'Recommendations', icon: '⭐' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'chat', label: 'AI Coach', icon: '🤖' },
];

export default function AppShell({ initialPage = 'dashboard' }) {
  const [activePage, setActivePage] = useState(initialPage);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'log': return <FoodLog />;
      case 'meals': return <MealPlans />;
      case 'recommend': return <Recommendations />;
      case 'analytics': return <Analytics />;
      case 'chat': return <ChatBot />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>💪</span>
          <h1>NutriFit Pro</h1>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`sidebar-link ${activePage === p.id ? 'active' : ''}`}
              onClick={() => setActivePage(p.id)}
            >
              <span className="icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', marginTop: '16px' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NutriFit Pro v1.0</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Built for Gym-Goers 🏋️</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content animate-fade">
        {renderPage()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {PAGES.slice(0, 5).map(p => (
            <button
              key={p.id}
              className={`bottom-nav-item ${activePage === p.id ? 'active' : ''}`}
              onClick={() => setActivePage(p.id)}
            >
              <span className="icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
