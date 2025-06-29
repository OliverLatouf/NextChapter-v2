import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Calendar,
  DollarSign,
  BookOpen,
  CheckCircle,
  Clock,
  X,
  Eye,
  MoreVertical
} from 'lucide-react';

const UserManagement = ({ onLogAction, isSuperAdmin, onGrantAdmin, onRevokeAdmin }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock data - replace with real Supabase queries
  const mockUsers = [
    {
      id: '1',
      email: 'john.doe@email.com',
      name: 'John Doe',
      role: 'user',
      created_at: '2024-12-01T10:00:00Z',
      last_login: '2024-12-26T09:30:00Z',
      total_subscriptions: 3,
      active_subscriptions: 2,
      completed_stories: 1,
      total_spent: 3.00,
      status: 'active',
      subscriptions: [
        { story_title: 'The Digital Detective', status: 'active', progress: 8, total_chapters: 15 },
        { story_title: 'Moonbase Chronicles', status: 'active', progress: 5, total_chapters: 20 },
        { story_title: 'The Last Library', status: 'completed', progress: 12, total_chapters: 12 }
      ]
    },
    {
      id: '2',
      email: 'sarah.admin@nextchapter.email',
      name: 'Sarah Johnson',
      role: 'admin',
      created_at: '2024-11-15T14:20:00Z',
      last_login: '2024-12-26T11:45:00Z',
      total_subscriptions: 5,
      active_subscriptions: 3,
      completed_stories: 2,
      total_spent: 5.00,
      status: 'active',
      subscriptions: [
        { story_title: 'The Digital Detective', status: 'completed', progress: 15, total_chapters: 15 },
        { story_title: 'Moonbase Chronicles', status: 'active', progress: 12, total_chapters: 20 },
        { story_title: 'The Last Library', status: 'active', progress: 8, total_chapters: 12 }
      ]
    },
    {
      id: '3',
      email: 'inactive.user@email.com',
      name: 'Michael Smith',
      role: 'user',
      created_at: '2024-10-20T16:30:00Z',
      last_login: '2024-11-15T08:20:00Z',
      total_subscriptions: 1,
      active_subscriptions: 0,
      completed_stories: 0,
      total_spent: 1.00,
      status: 'inactive',
      subscriptions: [
        { story_title: 'The Digital Detective', status: 'paused', progress: 3, total_chapters: 15 }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      if (newRole === 'admin' && isSuperAdmin) {
        await onGrantAdmin(userId, 'admin');
      } else if (newRole === 'user' && isSuperAdmin) {
        await onRevokeAdmin(userId);
      }
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      onLogAction?.('change_user_role', 'user', userId, { new_role: newRole });
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <ShieldX className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const UserDetailsModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              {getRoleIcon(user.role)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">User Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Email:</span> {user.email}</div>
                <div><span className="font-medium">Role:</span> {user.role.replace('_', ' ')}</div>
                <div><span className="font-medium">Joined:</span> {formatDate(user.created_at)}</div>
                <div><span className="font-medium">Last Login:</span> {formatDate(user.last_login)}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Activity Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium text-blue-900">{user.total_subscriptions}</div>
                  <div className="text-blue-700">Total Subscriptions</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-medium text-green-900">{user.active_subscriptions}</div>
                  <div className="text-green-700">Active Stories</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-medium text-purple-900">{user.completed_stories}</div>
                  <div className="text-purple-700">Completed</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="font-medium text-orange-900">${user.total_spent}</div>
                  <div className="text-orange-700">Total Spent</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscriptions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Story Subscriptions</h4>
            <div className="space-y-3">
              {user.subscriptions.map((sub, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">{sub.story_title}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'active' ? 'bg-green-100 text-green-800' :
                      sub.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Progress: {sub.progress}/{sub.total_chapters} chapters</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(sub.progress / sub.total_chapters) * 100}%` }}
                      ></div>
                    </div>
                    <span>{Math.round((sub.progress / sub.total_chapters) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Admin Actions */}
          {isSuperAdmin && user.role !== 'super_admin' && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Admin Actions</h4>
              <div className="flex gap-3">
                {user.role === 'user' ? (
                  <button
                    onClick={() => handleRoleChange(user.id, 'admin')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Grant Admin Access
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(user.id, 'user')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <ShieldX className="w-4 h-4" />
                    Revoke Admin Access
                  </button># Continue the UserManagement component
cat >> components/admin/UserManagement.tsx << 'EOF'
               )}
               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                 <Mail className="w-4 h-4" />
                 Send Email
               </button>
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );

 if (loading) {
   return (
     <div className="flex items-center justify-center py-12">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
     </div>
   );
 }

 return (
   <div className="space-y-6">
     {/* Header */}
     <div className="flex justify-between items-center">
       <div>
         <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
         <p className="text-gray-600">Manage users, subscriptions, and permissions</p>
       </div>
       <div className="flex gap-3">
         <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
           <Download className="w-4 h-4" />
           Export Users
         </button>
         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
           <Mail className="w-4 h-4" />
           Send Broadcast
         </button>
       </div>
     </div>

     {/* Filters */}
     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
       <div className="flex gap-4">
         <div className="flex-1">
           <div className="relative">
             <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
             <input
               type="text"
               placeholder="Search users by name or email..."
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
         </div>
         <select
           value={filterRole}
           onChange={(e) => setFilterRole(e.target.value)}
           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         >
           <option value="all">All Roles</option>
           <option value="user">Users</option>
           <option value="admin">Admins</option>
           <option value="super_admin">Super Admins</option>
         </select>
       </div>
     </div>

     {/* Users Table */}
     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-50 border-b border-gray-200">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 User
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Role
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Subscriptions
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Revenue
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Last Login
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Status
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Actions
               </th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {filteredUsers.map((user) => (
               <tr key={user.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-900">{user.name}</div>
                     <div className="text-sm text-gray-500">{user.email}</div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                     {getRoleIcon(user.role)}
                     <span className="text-sm text-gray-900 capitalize">
                       {user.role.replace('_', ' ')}
                     </span>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">
                     {user.active_subscriptions}/{user.total_subscriptions}
                   </div>
                   <div className="text-sm text-gray-500">
                     {user.completed_stories} completed
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">${user.total_spent}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{formatDate(user.last_login)}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                     {user.status}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => {
                         setSelectedUser(user);
                         setShowUserModal(true);
                       }}
                       className="text-gray-600 hover:text-blue-600"
                       title="View details"
                     >
                       <Eye className="w-4 h-4" />
                     </button>
                     <button
                       className="text-gray-600 hover:text-gray-900"
                       title="More actions"
                     >
                       <MoreVertical className="w-4 h-4" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       {filteredUsers.length === 0 && (
         <div className="text-center py-12">
           <div className="text-gray-500 mb-4">No users found</div>
           {searchTerm && (
             <button
               onClick={() => setSearchTerm('')}
               className="text-blue-600 hover:text-blue-700"
             >
               Clear search
             </button>
           )}
         </div>
       )}
     </div>

     {/* User Details Modal */}
     {showUserModal && selectedUser && (
       <UserDetailsModal
         user={selectedUser}
         onClose={() => {
           setShowUserModal(false);
           setSelectedUser(null);
         }}
       />
     )}
   </div>
 );
};

export default UserManagement;
