"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Jan",
    borrowed: 65,
    returned: 58,
  },
  {
    name: "Feb",
    borrowed: 59,
    returned: 48,
  },
  {
    name: "Mar",
    borrowed: 80,
    returned: 73,
  },
  {
    name: "Apr",
    borrowed: 81,
    returned: 72,
  },
  {
    name: "May",
    borrowed: 56,
    returned: 49,
  },
  {
    name: "Jun",
    borrowed: 55,
    returned: 51,
  },
  {
    name: "Jul",
    borrowed: 40,
    returned: 37,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="borrowed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="returned" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
