import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Mail, 
  Settings, 
  Shield, 
  TrendingUp,
  FileText,
  Calendar,
  Bell
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import StoryManagement from './StoryManagement';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const { adminUser, loading, isAdmin, isSuperAdmin, logAdminAction, grantAdminAccess, revokeAdminAccess } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real data from Supabase
  const dashboardStats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 15420,
    storiesPublished: 23,
    chaptersDelivered: 8943,
    conversionRate: 67.2
  };

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'john@email.com', time: '2 minutes ago' },
    { id: 2, action: 'Story completed', story: 'The Digital Detective', time: '5 minutes ago' },
    { id: 3, action: 'Payment received', amount: '$1.00', time: '8 minutes ago' },
    { id: 4, action: 'Chapter delivered', chapter: 'Chapter 12', time: '12 minutes ago' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'stories', label: 'Story Management', icon: BookOpen },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'emails', label: 'Email Management', icon: Mail },
    { id: 'content', label: 'Content Workflow', icon: FileText },
    ...(isSuperAdmin ? [{ id: 'admin', label: 'Admin Settings', icon: Settings }] : [])
  ];

  interface StatCardProps {
    title: string;
    value: number | string;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Users"
                value={dashboardStats.totalUsers.toLocaleString()}
                change={12.5}
                icon={Users}
                color="text-blue-500"
              />
              <StatCard
                title="Active Subscriptions"
                value={dashboardStats.activeSubscriptions.toLocaleString()}
                change={8.2}
                icon={BookOpen}
                color="text-green-500"
              />
              <StatCard
                title="Total Revenue"
                value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
                change={15.3}
                icon={TrendingUp}
                color="text-purple-500"
              />
              <StatCard
                title="Stories Published"
                value={dashboardStats.storiesPublished}
                change={4.1}
                icon={FileText}
                color="text-orange-500"
              />
              <StatCard
                title="Chapters Delivered"
                value={dashboardStats.chaptersDelivered.toLocaleString()}
                change={22.7}
                icon={Mail}
                color="text-indigo-500"
              />
              <StatCard
                title="Conversion Rate"
                value={`${dashboardStats.conversionRate}%`}
                change={3.4}
                icon={BarChart3}
                color="text-teal-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          {activity.user || activity.story || activity.amount || activity.chapter}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'stories':
        return <StoryManagement onLogAction={logAdminAction} />;

      case 'users':
        return (
          <UserManagement 
            onLogAction={logAdminAction}
            isSuperAdmin={isSuperAdmin}
            onGrantAdmin={grantAdminAccess}
            onRevokeAdmin={revokeAdminAccess}
          />
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{menuItems.find(item => item.id === activeTab)?.label}</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-tr from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">NextChapter Admin</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Welcome back, <span className="font-semibold text-primary">{adminUser?.name}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-accent transition duration-150 focus:outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary capitalize">{adminUser?.role?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <nav className="w-20 md:w-64 bg-white/95 backdrop-blur border-r border-gray-200 flex flex-col items-center md:items-stretch py-8 px-2 md:px-6 shadow-sm">
          <ul className="space-y-2 w-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 group ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow font-semibold'
                        : 'text-gray-700 hover:bg-primary/10 font-medium'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-accent' : 'text-gray-400 group-hover:text-primary'}`} />
                    <span className="hidden md:inline-block">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
