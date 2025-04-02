"use client"

import { useState } from "react"
import { Download, FileDown, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/Component/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Component/ui/dropdown-menu"
import { useToast } from "@/Component/ui/use-toast"

export function ExportData() {
  const [isExporting, setIsExporting] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  // Determine what data to export based on the current page
  const getExportType = () => {
    if (pathname.includes("/books")) return "books"
    if (pathname.includes("/members")) return "members"
    if (pathname.includes("/reports")) {
      // For reports page, we need to check which tab is active
      // This is a simplified approach - you might need to pass the active tab as a prop
      return "reports"
    }
    if (pathname.includes("/transactions")) return "transactions"
    return "data"
  }

  const exportType = getExportType()

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    setIsExporting(true)

    try {
      // In a real implementation, you would call your API to get the data
      // For example:
      // const response = await fetch(`/api/export/${exportType}?format=${format}`)
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `library-${exportType}-${new Date().toISOString().split('T')[0]}.${format}`
      // document.body.appendChild(a)
      // a.click()
      // a.remove()

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Export successful",
        description: `${exportType.charAt(0).toUpperCase() + exportType.slice(1)} data has been exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error(`Failed to export ${exportType}:`, error)
      toast({
        title: "Export failed",
        description: `There was an error exporting your ${exportType} data.`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} disabled={isExporting} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} disabled={isExporting} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")} disabled={isExporting} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

