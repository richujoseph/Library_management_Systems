"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Book schema for validation
const BookSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Available", "Borrowed"]),
  publishedYear: z.string().optional(),
  description: z.string().optional(),
})

export type Book = z.infer<typeof BookSchema>

// In-memory database for books
let books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Fiction",
    status: "Available",
    publishedYear: "1960",
    description: "The story of racial injustice and the loss of innocence in the American South.",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Science Fiction",
    status: "Borrowed",
    publishedYear: "1949",
    description: "A dystopian novel about totalitarianism, surveillance, and censorship.",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    category: "Fiction",
    status: "Available",
    publishedYear: "1925",
    description: "A novel about the American Dream, wealth, and tragedy in the Jazz Age.",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    category: "Romance",
    status: "Available",
    publishedYear: "1813",
    description: "A romantic novel about the Bennet family and the proud Mr. Darcy.",
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    category: "Fantasy",
    status: "Borrowed",
    publishedYear: "1937",
    description: "A fantasy novel about the journey of Bilbo Baggins to win a share of a treasure.",
  },
  {
    id: 6,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    category: "Fiction",
    status: "Available",
    publishedYear: "1951",
    description: "A novel about teenage angst and alienation.",
  },
  {
    id: 7,
    title: "Lord of the Flies",
    author: "William Golding",
    isbn: "9780399501487",
    category: "Fiction",
    status: "Available",
    publishedYear: "1954",
    description: "A novel about a group of British boys stuck on an uninhabited island.",
  },
  {
    id: 8,
    title: "Animal Farm",
    author: "George Orwell",
    isbn: "9780451526342",
    category: "Fiction",
    status: "Borrowed",
    publishedYear: "1945",
    description: "An allegorical novella about the Russian Revolution.",
  },
]

// Get all books
export async function getBooks() {
  return books
}

// Get a book by ID
export async function getBookById(id: number) {
  return books.find((book) => book.id === id)
}

// Add a new book
export async function addBook(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const isbn = formData.get("isbn") as string
    const category = formData.get("category") as string
    const status = formData.get("status") as string
    const publishedYear = formData.get("publishedYear") as string
    const description = formData.get("description") as string

    const newBook = {
      id: books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1,
      title,
      author,
      isbn,
      category,
      status,
      publishedYear,
      description,
    }

    // Validate the new book
    BookSchema.parse(newBook)

    // Add the book to our "database"
    books.push(newBook)

    revalidatePath("/books")
    return { success: true, message: "Book added successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to add book" }
  }
}

// Update a book
export async function updateBook(formData: FormData) {
  try {
    const id = Number(formData.get("id"))
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const isbn = formData.get("isbn") as string
    const category = formData.get("category") as string
    const status = formData.get("status") as string
    const publishedYear = formData.get("publishedYear") as string
    const description = formData.get("description") as string

    const updatedBook = {
      id,
      title,
      author,
      isbn,
      category,
      status,
      publishedYear,
      description,
    }

    // Validate the updated book
    BookSchema.parse(updatedBook)

    // Update the book in our "database"
    const index = books.findIndex((book) => book.id === id)
    if (index !== -1) {
      books[index] = updatedBook
      revalidatePath("/books")
      return { success: true, message: "Book updated successfully" }
    }

    return { success: false, message: "Book not found" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to update book" }
  }
}

// Delete a book
export async function deleteBook(id: number) {
  try {
    const initialLength = books.length
    books = books.filter((book) => book.id !== id)

    if (books.length < initialLength) {
      revalidatePath("/books")
      return { success: true, message: "Book deleted successfully" }
    }

    return { success: false, message: "Book not found" }
  } catch (error) {
    return { success: false, message: "Failed to delete book" }
  }
}

// Export books data
export async function exportBooksData() {
  return JSON.stringify(books, null, 2)
}

