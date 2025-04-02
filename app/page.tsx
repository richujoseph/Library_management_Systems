"use client"
import Link from "next/link"
import { BookOpen, Users, Clock, BookMarked } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Component/ui/card"
import { Overview } from "@/Component/overview"
import { RecentBorrows } from "@/Component/recent-borrows"
import {Button} from "@/Component/ui/button"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Library Management System</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/books" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Books
          </Link>
          <Link href="/members" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Members
          </Link>
          <Link href="/transactions" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Transactions
          </Link>
          <Link href="/reports" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Reports
          </Link>
          <Button size="sm" onClick={()=>{Cookies.remove("token");Cookies.remove("userId");router.push("/auth/login")}}>
            Logout
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+12 added this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">+18 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">249</div>
              <p className="text-xs text-muted-foreground">+4% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">-3 from last week</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Book borrowing and returning trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest book borrowings and returns</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBorrows />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

