import { useState } from 'react';
import { Search, Filter, Edit, Trash2, Shield, UserCheck, UserX, MoreVertical, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminUserService from '../../services/adminUserService';
import { useToast } from '../../contexts/ToastContext';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Fetch users
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminUserService.getAllUsers(),
  });

  const users = response?.data || [];

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: adminUserService.deleteUser,
    onSuccess: () => {
      success('User deleted successfully');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => {
      toastError(err.response?.data?.message || 'Failed to delete user');
    },
  });

  // Toggle block mutation
  const toggleBlockMutation = useMutation({
    mutationFn: ({ userId, isBlocked }) => adminUserService.toggleUserBlock(userId, isBlocked),
    onSuccess: () => {
      success('User status updated successfully');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => {
      toastError(err.response?.data?.message || 'Failed to update user status');
    },
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Customer':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (isBlocked) => {
    return isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || 
                         user.role?.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleToggleBlock = (userId, currentStatus) => {
    toggleBlockMutation.mutate({ userId, isBlocked: !currentStatus });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          <UserCheck className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load users</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{user.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getRoleColor(user.role)}`}>
                        {user.role || 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.isBlocked)}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Edit">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          disabled={toggleBlockMutation.isLoading}
                          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50" 
                          title="Toggle Status"
                        >
                          {user.isBlocked ? (
                            <UserCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          disabled={deleteMutation.isLoading}
                          className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
