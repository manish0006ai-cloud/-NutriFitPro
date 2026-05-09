'use client';

export default function MacroCard({ label, consumed, target, unit, color }) {
  const pct = Math.min((consumed / (target || 1)) * 100, 100);
  const remaining = Math.max(0, target - consumed);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{consumed} / {target}{unit}</span>
      </div>
      <div className="macro-bar">
        <div className={`macro-bar-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{remaining}{unit} remaining</p>
    </div>
  );
}
