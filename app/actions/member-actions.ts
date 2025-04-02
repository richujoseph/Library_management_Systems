"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Member schema for validation
const MemberSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  membershipId: z.string().min(1, "Membership ID is required"),
  joinDate: z.string().min(1, "Join date is required"),
  status: z.enum(["Active", "Inactive"]),
  borrowedBooks: z.number().default(0),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export type Member = z.infer<typeof MemberSchema>

// In-memory database for members
let members = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    membershipId: "LIB-1001",
    joinDate: "2022-01-15",
    status: "Active",
    borrowedBooks: 2,
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    membershipId: "LIB-1002",
    joinDate: "2022-02-20",
    status: "Active",
    borrowedBooks: 1,
    phone: "555-234-5678",
    address: "456 Oak Ave, Somewhere, USA",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    membershipId: "LIB-1003",
    joinDate: "2022-03-10",
    status: "Active",
    borrowedBooks: 3,
    phone: "555-345-6789",
    address: "789 Pine Rd, Nowhere, USA",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    membershipId: "LIB-1004",
    joinDate: "2022-04-05",
    status: "Inactive",
    borrowedBooks: 0,
    phone: "555-456-7890",
    address: "101 Elm St, Elsewhere, USA",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    membershipId: "LIB-1005",
    joinDate: "2022-05-12",
    status: "Active",
    borrowedBooks: 1,
    phone: "555-567-8901",
    address: "202 Maple Dr, Anyplace, USA",
  },
  {
    id: 6,
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    membershipId: "LIB-1006",
    joinDate: "2022-06-18",
    status: "Active",
    borrowedBooks: 0,
    phone: "555-678-9012",
    address: "303 Cedar Ln, Somewhere, USA",
  },
  {
    id: 7,
    name: "James Miller",
    email: "james.miller@example.com",
    membershipId: "LIB-1007",
    joinDate: "2022-07-22",
    status: "Inactive",
    borrowedBooks: 0,
    phone: "555-789-0123",
    address: "404 Birch Blvd, Nowhere, USA",
  },
]

// Get all members
export async function getMembers() {
  return members
}

// Get a member by ID
export async function getMemberById(id: number) {
  return members.find((member) => member.id === id)
}

// Add a new member
export async function addMember(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const status = formData.get("status") as string

    // Generate a membership ID
    const membershipId = `LIB-${1000 + members.length + 1}`
    const joinDate = new Date().toISOString().split("T")[0]

    const newMember = {
      id: members.length > 0 ? Math.max(...members.map((member) => member.id)) + 1 : 1,
      name,
      email,
      membershipId,
      joinDate,
      status,
      borrowedBooks: 0,
      phone,
      address,
    }

    // Validate the new member
    MemberSchema.parse(newMember)

    // Add the member to our "database"
    members.push(newMember)

    revalidatePath("/members")
    return { success: true, message: "Member added successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to add member" }
  }
}

// Update a member
export async function updateMember(formData: FormData) {
  try {
    const id = Number(formData.get("id"))
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const status = formData.get("status") as string

    // Get existing member data
    const existingMember = members.find((member) => member.id === id)
    if (!existingMember) {
      return { success: false, message: "Member not found" }
    }

    const updatedMember = {
      ...existingMember,
      name,
      email,
      status,
      phone,
      address,
    }

    // Validate the updated member
    MemberSchema.parse(updatedMember)

    // Update the member in our "database"
    const index = members.findIndex((member) => member.id === id)
    if (index !== -1) {
      members[index] = updatedMember
      revalidatePath("/members")
      return { success: true, message: "Member updated successfully" }
    }

    return { success: false, message: "Member not found" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to update member" }
  }
}

// Delete a member
export async function deleteMember(id: number) {
  try {
    const initialLength = members.length
    members = members.filter((member) => member.id !== id)

    if (members.length < initialLength) {
      revalidatePath("/members")
      return { success: true, message: "Member deleted successfully" }
    }

    return { success: false, message: "Member not found" }
  } catch (error) {
    return { success: false, message: "Failed to delete member" }
  }
}

// Export members data
export async function exportMembersData() {
  return JSON.stringify(members, null, 2)
}

