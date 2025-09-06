import React from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)

  if (profileLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-richblack-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] bg-richblack-900">
    {/* Sidebar */}
    <div className="hidden md:block w-64 shrink-0">
      <Sidebar />
    </div>
  
    {/* Main Content scrollable */}
    <main className="flex-1 min-w-0 h-full overflow-y-auto dashboard-scroll">
  <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
    <Outlet />
  </div>
</main>

  </div>
  
  )
}

export default Dashboard
