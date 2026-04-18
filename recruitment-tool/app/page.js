import { Suspense } from 'react'
import UserAnalytics from '@/components/UserAnalytics'

function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg font-medium">Loading user data...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Suspense fallback={<LoadingFallback />}>
        <UserAnalytics />
      </Suspense>
    </div>
  )
}
