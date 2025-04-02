"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Search } from "lucide-react"
import { getMembers, deleteMember } from "@/app/actions/member-actions"

import { Button } from "@/Component/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Component/ui/card"
import { Input } from "@/Component/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Component/ui/table"
import { Badge } from "@/Component/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/Component/ui/avatar"
import { AddMemberForm } from "@/Component/add-member-form"
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

export default function MembersPage() {
  const [members, setMembers] = useState<
    {
      id: number
      name: string
      email: string
      membershipId: string
      joinDate: string
      status: string
      borrowedBooks: number
      phone: string
      address: string
    }[]
  >([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await getMembers()
        setMembers(data)
      } catch (error) {
        console.error("Failed to load members:", error)
        toast({
          title: "Error",
          description: "Failed to load members",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMembers()
  }, [toast])

  const filteredMembers = members.filter(
    (member: any) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  async function handleDeleteMember(id: number) {
    try {
      const result = await deleteMember(id)

      if (result.success) {
        setMembers(members.filter((member: any) => member.id !== id))
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
        description: "Failed to delete member",
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
          <Link href="/members" className="text-sm font-medium hover:text-foreground">
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
          <h1 className="text-3xl font-bold">Members Management</h1>
          <div className="flex gap-2">
            <ExportData />
            <AddMemberForm />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Library Members</CardTitle>
            <CardDescription>Manage your library's membership</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email or ID..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Loading members...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Membership ID</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Books Borrowed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((member: any) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src="/placeholder.svg?height=36&width=36" alt={member.name} />
                                <AvatarFallback>
                                  {member.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.membershipId}</TableCell>
                          <TableCell>{member.joinDate}</TableCell>
                          <TableCell>
                            <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.borrowedBooks}</TableCell>
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
                                    <AlertDialogTitle>Delete Member</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{member.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteMember(member.id)}
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

