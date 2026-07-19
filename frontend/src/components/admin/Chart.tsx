import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultData = [
  { name: 'Jan', visits: 400 },
  { name: 'Fév', visits: 600 },
  { name: 'Mar', visits: 800 },
  { name: 'Avr', visits: 700 },
  { name: 'Mai', visits: 900 },
  { name: 'Jun', visits: 1200 },
];

export default function Chart({ data = defaultData, title = 'Visites', dataKey = 'visits' }) {
  return (
    <div className="admin-stat-card">
      <h3 className="font-display font-semibold text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5865f5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5865f5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#1a1f2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#e2e8f0',
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#5865f5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
