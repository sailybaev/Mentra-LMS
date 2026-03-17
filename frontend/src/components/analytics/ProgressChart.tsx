'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint {
  label: string
  value: number
}

interface ProgressChartProps {
  data: DataPoint[]
  title?: string
}

export function ProgressChart({ data, title }: ProgressChartProps) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-ink mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}
          />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
