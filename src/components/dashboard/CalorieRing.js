'use client';

export default function CalorieRing({ consumed, target }) {
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(consumed / (target || 1), 1);
  const offset = circumference * (1 - pct);
  const overLimit = consumed > target;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring">
        <circle className="progress-ring-bg" cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} />
        <circle className="progress-ring-fill" cx={size/2} cy={size/2} r={radius} strokeWidth={stroke}
          stroke={overLimit ? 'var(--danger)' : 'var(--accent)'}
          strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'1.6rem', fontWeight:800, color: overLimit ? 'var(--danger)' : 'var(--text-primary)' }}>{consumed}</span>
        <span style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>/ {target} kcal</span>
      </div>
    </div>
  );
}
