"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../Component/ui/avatar"
import { Badge } from "../Component/ui/badge"
import { ScrollArea } from "../Component/ui/scroll-area"

type Status = "borrowed" | "returned" | "overdue"

interface Transaction {
  id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  book: string
  date: string
  status: Status
}

const transactions: Transaction[] = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    book: "The Great Gatsby",
    date: "2023-04-01",
    status: "borrowed"
  },
  {
    id: "2",
    user: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    book: "To Kill a Mockingbird",
    date: "2023-04-02",
    status: "returned"
  },
  {
    id: "3",
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    book: "1984",
    date: "2023-03-28",
    status: "overdue"
  },
  {
    id: "4",
    user: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    book: "Pride and Prejudice",
    date: "2023-04-03",
    status: "borrowed"
  },
  {
    id: "5",
    user: {
      name: "David Wilson",
      email: "david@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    book: "The Hobbit",
    date: "2023-04-01",
    status: "returned"
  }
]

export function RecentBorrows() {
  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4 rounded-lg border p-3">
            <Avatar>
              <AvatarImage src={transaction.user.avatar} alt={transaction.user.name} />
              <AvatarFallback>{transaction.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{transaction.user.name}</p>
                <StatusBadge status={transaction.status} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{transaction.book}</p>
              <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "borrowed") {
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Borrowed</Badge>
  }
  if (status === "returned") {
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Returned</Badge>
  }
  return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date)
}
