"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, FileText, PieChart, BarChartIcon } from "lucide-react"
import { getOverdueBooks, sendReminder } from "@/app/actions/transaction-actions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ExportData } from "@/components/export-data"

export default function ReportsPage() {
  const [overdueBooks, setOverdueBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadOverdueBooks() {
      try {
        const data = await getOverdueBooks()
        setOverdueBooks(data)
      } catch (error) {
        console.error("Failed to load overdue books:", error)
        toast({
          title: "Error",
          description: "Failed to load overdue books",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOverdueBooks()
  }, [toast])

  async function handleSendReminder(id: number) {
    try {
      const result = await sendReminder(id)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      })
    }
  }

  // Calculate days overdue
  function getDaysOverdue(dueDate: string) {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = Math.abs(today.getTime() - due.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Library Management System</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/books" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Books
          </Link>
          <Link href="/members" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Members
          </Link>
          <Link href="/transactions" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Transactions
          </Link>
          <Link href="/reports" className="text-sm font-medium hover:text-foreground">
            Reports
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <ExportData />
        </div>

        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Popular Books
            </TabsTrigger>
            <TabsTrigger value="overdue" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overdue Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Book borrowing and returning trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Borrowing Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 days</div>
                  <p className="text-xs text-muted-foreground">-2 days from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Books</CardTitle>
                <CardDescription>Books with the highest borrowing frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full max-w-md">
                      <div className="text-sm font-medium">To Kill a Mockingbird</div>
                      <div className="mt-1 text-xs text-muted-foreground">Harper Lee</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">48 borrows</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "92%" }} />
                  </div>

                  <div className="flex items-center">
                    <div className="w-full max-w-md">
                      <div className="text-sm font-medium">1984</div>
                      <div className="mt-1 text-xs text-muted-foreground">George Orwell</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">42 borrows</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                  </div>

                  <div className="flex items-center">
                    <div className="w-full max-w-md">
                      <div className="text-sm font-medium">The Great Gatsby</div>
                      <div className="mt-1 text-xs text-muted-foreground">F. Scott Fitzgerald</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">39 borrows</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "78%" }} />
                  </div>

                  <div className="flex items-center">
                    <div className="w-full max-w-md">
                      <div className="text-sm font-medium">Pride and Prejudice</div>
                      <div className="mt-1 text-xs text-muted-foreground">Jane Austen</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">35 borrows</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "72%" }} />
                  </div>

                  <div className="flex items-center">
                    <div className="w-full max-w-md">
                      <div className="text-sm font-medium">The Hobbit</div>
                      <div className="mt-1 text-xs text-muted-foreground">J.R.R. Tolkien</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">32 borrows</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "65%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Books</CardTitle>
                <CardDescription>Books that are currently past their due date</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading overdue books...</div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Book Title</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Member</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Due Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Days Overdue</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overdueBooks.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-4 text-center">
                              No overdue books found
                            </td>
                          </tr>
                        ) : (
                          overdueBooks.map((transaction: any) => (
                            <tr
                              key={transaction.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">{transaction.bookTitle}</td>
                              <td className="p-4 align-middle">{transaction.memberName}</td>
                              <td className="p-4 align-middle">{transaction.dueDate}</td>
                              <td className="p-4 align-middle">
                                <Badge variant="destructive">{getDaysOverdue(transaction.dueDate)} days</Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <Button variant="outline" size="sm" onClick={() => handleSendReminder(transaction.id)}>
                                  Send Reminder
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

