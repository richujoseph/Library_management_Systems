"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getBookById, updateBook } from "./book-actions"
import { getMemberById, updateMember } from "./member-actions"

// Transaction schema for validation
const TransactionSchema = z.object({
  id: z.number().optional(),
  memberId: z.number(),
  memberName: z.string(),
  bookId: z.number(),
  bookTitle: z.string(),
  type: z.enum(["Borrow", "Return"]),
  date: z.string(),
  dueDate: z.string().optional(),
  returnDate: z.string().optional(),
  status: z.enum(["Active", "Completed", "Overdue"]),
})

export type Transaction = z.infer<typeof TransactionSchema>

// In-memory database for transactions
const transactions = [
  {
    id: 1,
    memberId: 1,
    memberName: "John Doe",
    bookId: 3,
    bookTitle: "The Great Gatsby",
    type: "Borrow",
    date: "2023-04-01",
    dueDate: "2023-04-15",
    returnDate: null,
    status: "Active",
  },
  {
    id: 2,
    memberId: 2,
    memberName: "Alice Smith",
    bookId: 1,
    bookTitle: "To Kill a Mockingbird",
    type: "Return",
    date: "2023-04-02",
    dueDate: "2023-04-02",
    returnDate: "2023-04-02",
    status: "Completed",
  },
  {
    id: 3,
    memberId: 3,
    memberName: "Robert Johnson",
    bookId: 2,
    bookTitle: "1984",
    type: "Borrow",
    date: "2023-04-03",
    dueDate: "2023-04-17",
    returnDate: null,
    status: "Active",
  },
  {
    id: 4,
    memberId: 4,
    memberName: "Emma Wilson",
    bookId: 4,
    bookTitle: "Pride and Prejudice",
    type: "Return",
    date: "2023-04-04",
    dueDate: "2023-04-04",
    returnDate: "2023-04-04",
    status: "Completed",
  },
  {
    id: 5,
    memberId: 5,
    memberName: "Michael Brown",
    bookId: 5,
    bookTitle: "The Hobbit",
    type: "Borrow",
    date: "2023-04-05",
    dueDate: "2023-04-19",
    returnDate: null,
    status: "Active",
  },
  {
    id: 6,
    memberId: 6,
    memberName: "Sarah Davis",
    bookId: 8,
    bookTitle: "Animal Farm",
    type: "Borrow",
    date: "2023-04-06",
    dueDate: "2023-04-20",
    returnDate: null,
    status: "Overdue",
  },
  {
    id: 7,
    memberId: 7,
    memberName: "James Miller",
    bookId: 6,
    bookTitle: "The Catcher in the Rye",
    type: "Return",
    date: "2023-04-07",
    dueDate: "2023-04-07",
    returnDate: "2023-04-07",
    status: "Completed",
  },
]

// Get all transactions
export async function getTransactions() {
  return transactions
}

// Get a transaction by ID
export async function getTransactionById(id: number) {
  return transactions.find((transaction) => transaction.id === id)
}

// Add a new transaction (borrow)
export async function borrowBook(formData: FormData) {
  try {
    const memberId = Number(formData.get("memberId"))
    const bookId = Number(formData.get("bookId"))

    // Get member and book
    const member = await getMemberById(memberId)
    const book = await getBookById(bookId)

    if (!member) {
      return { success: false, message: "Member not found" }
    }

    if (!book) {
      return { success: false, message: "Book not found" }
    }

    if (book.status === "Borrowed") {
      return { success: false, message: "Book is already borrowed" }
    }

    // Create transaction
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(today.getDate() + 14) // 2 weeks from now

    const newTransaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1,
      memberId,
      memberName: member.name,
      bookId,
      bookTitle: book.title,
      type: "Borrow",
      date: today.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      returnDate: null,
      status: "Active",
    }

    // Validate the new transaction
    TransactionSchema.parse(newTransaction)

    // Update book status
    await updateBook(
      new FormData(
        Object.entries({
          ...book,
          status: "Borrowed",
        }).map(([key, value]) => [key, String(value)]),
      ),
    )

    // Update member borrowed books count
    await updateMember(
      new FormData(
        Object.entries({
          ...member,
          borrowedBooks: member.borrowedBooks + 1,
        }).map(([key, value]) => [key, String(value)]),
      ),
    )

    // Add the transaction to our "database"
    transactions.push(newTransaction)

    revalidatePath("/transactions")
    return { success: true, message: "Book borrowed successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to borrow book" }
  }
}

// Return a book
export async function returnBook(transactionId: number) {
  try {
    // Find the transaction
    const transaction = transactions.find((t) => t.id === transactionId)

    if (!transaction) {
      return { success: false, message: "Transaction not found" }
    }

    if (transaction.type !== "Borrow" || transaction.status === "Completed") {
      return { success: false, message: "Invalid transaction for return" }
    }

    // Get book and member
    const book = await getBookById(transaction.bookId)
    const member = await getMemberById(transaction.memberId)

    if (!book || !member) {
      return { success: false, message: "Book or member not found" }
    }

    // Update transaction
    const today = new Date().toISOString().split("T")[0]
    const index = transactions.findIndex((t) => t.id === transactionId)

    if (index !== -1) {
      transactions[index] = {
        ...transaction,
        type: "Return",
        returnDate: today,
        status: "Completed",
      }
    }

    // Create a new return transaction
    const newTransaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1,
      memberId: transaction.memberId,
      memberName: transaction.memberName,
      bookId: transaction.bookId,
      bookTitle: transaction.bookTitle,
      type: "Return",
      date: today,
      dueDate: transaction.dueDate,
      returnDate: today,
      status: "Completed",
    }

    // Add the return transaction
    transactions.push(newTransaction)

    // Update book status
    await updateBook(
      new FormData(
        Object.entries({
          ...book,
          status: "Available",
        }).map(([key, value]) => [key, String(value)]),
      ),
    )

    // Update member borrowed books count
    await updateMember(
      new FormData(
        Object.entries({
          ...member,
          borrowedBooks: Math.max(0, member.borrowedBooks - 1),
        }).map(([key, value]) => [key, String(value)]),
      ),
    )

    revalidatePath("/transactions")
    return { success: true, message: "Book returned successfully" }
  } catch (error) {
    return { success: false, message: "Failed to return book" }
  }
}

// Export transactions data
export async function exportTransactionsData() {
  return JSON.stringify(transactions, null, 2)
}

// Get overdue books
export async function getOverdueBooks() {
  const today = new Date().toISOString().split("T")[0]

  return transactions.filter(
    (transaction) =>
      transaction.type === "Borrow" &&
      transaction.status !== "Completed" &&
      transaction.dueDate &&
      transaction.dueDate < today,
  )
}

// Send reminder for overdue book
export async function sendReminder(transactionId: number) {
  try {
    const transaction = transactions.find((t) => t.id === transactionId)

    if (!transaction) {
      return { success: false, message: "Transaction not found" }
    }

    // In a real application, this would send an email or notification
    // For now, we'll just simulate it

    return {
      success: true,
      message: `Reminder sent to ${transaction.memberName} for ${transaction.bookTitle}`,
    }
  } catch (error) {
    return { success: false, message: "Failed to send reminder" }
  }
}

