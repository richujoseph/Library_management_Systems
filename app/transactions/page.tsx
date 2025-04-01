"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Search } from "lucide-react"
import { getTransactions, returnBook } from "@/app/actions/transaction-actions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { useToast } from "@/components/ui/use-toast"
import { ExportData } from "@/components/export-data"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getTransactions()
        setTransactions(data)
      } catch (error) {
        console.error("Failed to load transactions:", error)
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [toast])

  const filteredTransactions = transactions.filter((transaction: any) => {
    const matchesSearch =
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  async function handleReturnBook(id: number) {
    try {
      const result = await returnBook(id)

      if (result.success) {
        // Refresh transactions
        const data = await getTransactions()
        setTransactions(data)

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
        description: "Failed to return book",
        variant: "destructive",
      })
    }
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
          <Link href="/transactions" className="text-sm font-medium hover:text-foreground">
            Transactions
          </Link>
          <Link href="/reports" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Reports
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="flex gap-2">
            <ExportData />
            <AddTransactionForm />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Book Transactions</CardTitle>
            <CardDescription>Manage borrowing and returning of books</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by member or book..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Borrow">Borrow</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.memberName}</TableCell>
                          <TableCell>{transaction.bookTitle}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "Borrow" ? "outline" : "secondary"}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.dueDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.status === "Active"
                                  ? "default"
                                  : transaction.status === "Completed"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {transaction.type === "Borrow" && transaction.status !== "Completed" ? (
                              <Button variant="outline" size="sm" onClick={() => handleReturnBook(transaction.id)}>
                                Return Book
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

