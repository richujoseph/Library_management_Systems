"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { borrowBook } from "@/app/actions/transaction-actions"
import { getBooks } from "@/app/actions/book-actions"
import { getMembers } from "@/app/actions/member-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

export function AddTransactionForm() {
  const [open, setOpen] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [bookId, setBookId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const membersData = await getMembers()
        const booksData = await getBooks()

        setMembers(membersData)
        setBooks(booksData.filter((book) => book.status === "Available"))
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load members and books",
          variant: "destructive",
        })
      }
    }

    if (open) {
      loadData()
    }
  }, [open, toast])

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await borrowBook(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setOpen(false)
        router.refresh()
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
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow a Book</DialogTitle>
          <DialogDescription>Select a member and a book to create a new borrowing transaction.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center">Loading...</div>
        ) : (
          <form action={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="memberId">Member</Label>
              <Select name="memberId" value={memberId} onValueChange={setMemberId} required>
                <SelectTrigger id="memberId">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name} ({member.membershipId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bookId">Book</Label>
              <Select name="bookId" value={bookId} onValueChange={setBookId} required>
                <SelectTrigger id="bookId">
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.title} by {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !memberId || !bookId}>
                {isSubmitting ? "Processing..." : "Borrow Book"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

