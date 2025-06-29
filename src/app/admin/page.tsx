'use client';

import Header from '@/components/Header';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div>
      <Header variant="admin" showNavLinks={false} />
      <div style={{ paddingTop: '5rem' }}>
        <AdminDashboard />
      </div>
    </div>
  );
}
