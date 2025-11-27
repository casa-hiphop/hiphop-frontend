"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { LoanChart } from "@/components/loan-chart"
import { RecentActivities } from "@/components/recent-activities"

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState("Dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LoanChart />
              </div>

              <div className="lg:col-span-1">
                <RecentActivities />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
