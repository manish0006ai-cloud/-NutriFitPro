'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['var(--protein)', 'var(--carbs)', 'var(--fat)'];
const RESOLVED = ['#3b82f6', '#f59e0b', '#ef4444'];

export default function MacroPie({ protein, carbs, fat }) {
  const total = protein + carbs + fat;
  if (total === 0) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No food logged yet
      </div>
    );
  }

  const data = [
    { name: 'Protein', value: protein, pct: Math.round((protein / total) * 100) },
    { name: 'Carbs', value: carbs, pct: Math.round((carbs / total) * 100) },
    { name: 'Fat', value: fat, pct: Math.round((fat / total) * 100) },
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={RESOLVED[i]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
            formatter={(val, name) => [`${val}g`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {data.map((d, i) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: RESOLVED[i] }} />
            {d.name} {d.pct}%
          </div>
        ))}
      </div>
    </div>
  );
}
