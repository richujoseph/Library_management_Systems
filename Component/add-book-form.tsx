"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addBook } from "@/app/actions/book-actions"
import { Button } from "@/Component/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Component/ui/dialog"
import { Input } from "@/Component/ui/input"
import { Label } from "@/Component/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Component/ui/select"
import { Textarea } from "@/Component/ui/textarea"
import { useToast } from "@/Component/ui/use-toast"
import { Plus } from "lucide-react"

export function AddBookForm() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState("Available")
  const [category, setCategory] = useState("Fiction")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await addBook(formData)

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
          <Plus className="mr-2 h-4 w-4" /> Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>Enter the details of the book you want to add to the library.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input id="publishedYear" name="publishedYear" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                  <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                  <SelectItem value="Fantasy">Fantasy</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Biography">Biography</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Self-Help">Self-Help</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Borrowed">Borrowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

