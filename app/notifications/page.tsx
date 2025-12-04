import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Stay updated on your trip requests and messages
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">No Notifications</h2>
          <p className="mt-2 text-gray-600">
            You're all caught up! Notifications will appear here when you have updates.
          </p>
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">You'll receive notifications for:</p>
            <ul className="mt-2 space-y-1 text-left text-sm text-gray-700">
              <li>✉️ Join requests for your trips (Week 3)</li>
              <li>✅ Approved trip join requests (Week 3)</li>
              <li>💬 New messages in trip chats (Week 4)</li>
              <li>📢 Trip updates and announcements (Week 4)</li>
            </ul>
          </div>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

