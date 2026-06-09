import ProtectedRoute from './ProtectedRoute';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children, title }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-dark-950 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title={title} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
