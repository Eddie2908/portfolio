import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

type StatsCardProps = {
  title: ReactNode;
  value: ReactNode;
  icon?: any;
  trend?: 'up' | 'down';
  trendValue?: ReactNode;
  color?: string;
};

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = '#5865f5' }: StatsCardProps) {
  const isPositive = trend === 'up';

  return (
    <div className="admin-stat-card">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}33` }}
        >
          {Icon && <Icon size={20} style={{ color }} />}
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="font-display font-bold text-2xl text-white mb-1">{value}</div>
      <div className="text-white/40 text-sm">{title}</div>
    </div>
  );
}
