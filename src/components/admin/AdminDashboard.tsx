'use client';

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

const AdminDashboard = () => {
  const { adminUser, loading, isAdmin, isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
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
          <div className="loading-spinner"></div>
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

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="admin-stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
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
            <div className="responsive-grid">
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
                        <p className="font-medium text-gray-900 mb-1">{activity.action}</p>
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

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="admin-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">NextChapter Admin</h1>
            <p className="text-sm text-gray-600">Welcome back, {adminUser?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {adminUser?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          <div className="p-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="admin-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
