"use client"

import type React from "react"
import { AuthService } from "@/lib/auth/auth-service"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { LayoutDashboard, Upload, Menu, X,  PanelLeftClose, PanelLeftOpen } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Upload Product",
    href: "/upload",
    icon: Upload,
  },
  // {
  //   name: "My Products",
  //   href: "/products",
  //   icon: Package,
  // },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "w-64 lg:w-64",
          sidebarCollapsed && "lg:w-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className={cn(
            "flex h-16 items-center justify-between px-6 bg-gradient-to-r from-primary to-secondary",
            sidebarCollapsed && "lg:justify-center lg:px-4",
          )}>
            <div className={cn("flex items-center space-x-2", sidebarCollapsed && "lg:space-x-0") }>
              {/* <Image src="/logo.webp" alt="Logo" width={28} height={28} priority /> */}
              <span
                className={cn(
                  "text-xl font-bold text-primary-foreground ml-2 transition-all duration-300",
                  sidebarCollapsed && "lg:opacity-0 lg:w-0 lg:ml-0 lg:overflow-hidden",
                )}
              >
                SSC VendorHub
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-primary-foreground hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    sidebarCollapsed && "lg:justify-center",
                    isActive
                      ? "bg-gradient-to-r from-sidebar-primary to-sidebar-accent text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span
                    className={cn(
                      "ml-3 whitespace-nowrap transition-all duration-300",
                      sidebarCollapsed && "lg:opacity-0 lg:ml-0 lg:w-0 lg:overflow-hidden",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Vendor info card */}
          {/* <div className="p-4">
            <Card className="p-4 bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">Premium Vendor</p>
                </div>
              </div>
            </Card>
          </div> */}
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out",
          "lg:pl-64",
          sidebarCollapsed && "lg:pl-20",
        )}
      > 
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
            <Image src="/logo.webp" alt="Logo" width={48} height={48} priority />
              <span className="text-sm text-muted-foreground">SSC Vendor Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" onClick={() => AuthService.logout()}>
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 transition-[padding] duration-300 ease-in-out">{children}</main>
      </div>
    </div>
  )
}
