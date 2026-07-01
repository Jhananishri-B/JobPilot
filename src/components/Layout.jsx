import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-56 lg:ml-64 min-h-screen flex flex-col pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 animate-fade-in max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
