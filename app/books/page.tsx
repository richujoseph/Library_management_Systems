"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Search } from "lucide-react"
import { getBooks, deleteBook } from "@/app/actions/book-actions"

import { Button } from "@/Component/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Component/ui/card"
import { Input } from "@/Component/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Component/ui/table"
import { Badge } from "@/Component/ui/badge"
import { AddBookForm } from "@/Component/add-book-form"
import { useToast } from "@/Component/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Component/ui/alert-dialog"
import { ExportData } from "@/Component/export-data"

export default function BooksPage() {
  const [books, setBooks] = useState<{ id: number; title: string; author: string; isbn: string; category: string; status: string; publishedYear: string; description: string; }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getBooks()
        setBooks(data)
      } catch (error) {
        console.error("Failed to load books:", error)
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [toast])

  const filteredBooks = books.filter(
    (book: any) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  async function handleDeleteBook(id: number) {
    try {
      const result = await deleteBook(id)

      if (result.success) {
        setBooks(books.filter((book: any) => book.id !== id))
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
        description: "Failed to delete book",
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
          <Link href="/books" className="text-sm font-medium hover:text-foreground">
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
        </nav>
      </header>
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Books Management</h1>
          <div className="flex gap-2">
            <ExportData />
            <AddBookForm />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Book Inventory</CardTitle>
            <CardDescription>Manage your library's book collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title, author or ISBN..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Loading books...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBooks.map((book: any) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{book.isbn}</TableCell>
                          <TableCell>{book.category}</TableCell>
                          <TableCell>
                            <Badge variant={book.status === "Available" ? "default" : "secondary"}>{book.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteBook(book.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
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

