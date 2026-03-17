'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ScoreBucket {
  range: string
  count: number
}

interface ScoreDistributionProps {
  data: ScoreBucket[]
  title?: string
}

export function ScoreDistribution({ data, title }: ScoreDistributionProps) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-ink mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
