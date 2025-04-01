"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    borrowed: 65,
    returned: 58,
  },
  {
    name: "Feb",
    borrowed: 78,
    returned: 69,
  },
  {
    name: "Mar",
    borrowed: 82,
    returned: 79,
  },
  {
    name: "Apr",
    borrowed: 75,
    returned: 73,
  },
  {
    name: "May",
    borrowed: 92,
    returned: 85,
  },
  {
    name: "Jun",
    borrowed: 84,
    returned: 80,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="borrowed" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="returned" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

