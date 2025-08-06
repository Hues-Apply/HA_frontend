import { useState, useEffect } from 'react';
import UserDetailsModal from './UserDetailsModal';

interface GoogleUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_new_user: boolean;
  created_at: string;
  google_data?: {
    name: string;
    picture: string;
  };
}

interface UsersListResponse {
  count: number;
  results: GoogleUser[];
}

const UsersList = () => {
  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<GoogleUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<GoogleUser | null>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch users from backend API
      const response = await fetch(`${import.meta.env.PROD ? 'https://ha-backend-pq2f.vercel.app' : 'http://localhost:8000'}/api/users/google-signups/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data: UsersListResponse = await response.json();
      setUsers(data.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingUserId(userId);

      const response = await fetch(`${import.meta.env.PROD ? 'https://ha-backend-pq2f.vercel.app' : 'http://localhost:8000'}/api/users/${userId}/delete/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }

      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      // Show success message briefly
      setSuccessMessage('User deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setDeletingUserId(null);
    }
  };

  const startEditUser = (user: GoogleUser) => {
    setEditingUser({ ...user });
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const updateUser = async (userId: number, userData: Partial<GoogleUser>) => {
    try {
      setUpdatingUserId(userId);

      // Get the current user data to ensure we send complete payload
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      // Always use the role endpoint with complete payload for all updates
      const completeUserData = {
        id: userId,
        email: currentUser.email,
        first_name: userData.first_name ?? currentUser.first_name,
        last_name: userData.last_name ?? currentUser.last_name,
        role: userData.role ?? currentUser.role,
        is_new_user: userData.is_new_user ?? currentUser.is_new_user,
        google_data: currentUser.google_data
      };

      // Mock update for now - replace with actual API call
      console.log('Updating user:', completeUserData);

      // Update user in local state
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, ...userData } : user
      ));

      setSuccessMessage('User updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingUser(null);

    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    await updateUser(editingUser.id, {
      first_name: editingUser.first_name,
      last_name: editingUser.last_name,
      role: editingUser.role,
      is_new_user: editingUser.is_new_user
    });
  };



  const handleQuickRoleChange = async (userId: number, newRole: string) => {
    try {
      setUpdatingUserId(userId);

      // Get the current user data to ensure we send complete payload
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      // Use updateUserComplete with complete payload
      const completeUserData = {
        id: userId,
        email: currentUser.email,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        role: newRole,
        is_new_user: currentUser.is_new_user,
        google_data: currentUser.google_data
      };

      // Mock update for now - replace with actual API call
      console.log('Updating user role:', completeUserData);

      // Update user in local state
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      setSuccessMessage(`User role updated to ${newRole}`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
      console.error('Error updating user role:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleQuickStatusChange = async (userId: number, isNewUser: boolean) => {
    try {
      setUpdatingUserId(userId);

      await updateUser(userId, { is_new_user: isNewUser });

      setSuccessMessage(`User status updated to ${isNewUser ? 'New User' : 'Returning'}`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
      console.error('Error updating user status:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const openUserDetails = (user: GoogleUser) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const closeUserDetails = () => {
    setShowUserDetailsModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Google Sign-up Users</h1>
            <p className="text-gray-600 mt-2">
              Total users: {users.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isEditing = editingUser?.id === user.id;
                  const isUpdating = updatingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.google_data?.picture ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.google_data.picture}
                              alt={`${user.first_name} ${user.last_name}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingUser.first_name}
                                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1 w-24"
                                  placeholder="First"
                                />
                                <input
                                  type="text"
                                  value={editingUser.last_name}
                                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1 w-24"
                                  placeholder="Last"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value } : null)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            disabled={isUpdating}
                          >
                            <option value="applicant">Applicant</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                            <select
                              value={user.role}
                              onChange={(e) => handleQuickRoleChange(user.id, e.target.value)}
                              disabled={isUpdating}
                              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
                            >
                              <option value="applicant">Applicant</option>
                              <option value="employer">Employer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editingUser.is_new_user ? 'new' : 'returning'}
                            onChange={(e) => setEditingUser(prev => prev ? { ...prev, is_new_user: e.target.value === 'new' } : null)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            disabled={isUpdating}
                          >
                            <option value="new">New User</option>
                            <option value="returning">Returning</option>
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_new_user
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {user.is_new_user ? 'New User' : 'Returning'}
                            </span>
                            <select
                              value={user.is_new_user ? 'new' : 'returning'}
                              onChange={(e) => handleQuickStatusChange(user.id, e.target.value === 'new')}
                              disabled={isUpdating}
                              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
                            >
                              <option value="new">New User</option>
                              <option value="returning">Returning</option>
                            </select>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={isUpdating}
                                className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${isUpdating
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  } transition-colors`}
                              >
                                {isUpdating ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                  </>
                                ) : (
                                  '💾 Save'
                                )}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={isUpdating}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                ❌ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => openUserDetails(user)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                              >
                                👁️ View Details
                              </button>
                              <button
                                onClick={() => startEditUser(user)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                disabled={deletingUserId === user.id}
                                className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${deletingUserId === user.id
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
                                  } transition-colors`}
                              >
                                {deletingUserId === user.id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                  </>
                                ) : (
                                  '🗑️ Delete'
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">👥</div>
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          isOpen={showUserDetailsModal}
          onClose={closeUserDetails}
          userId={selectedUser.id}
          userBasicInfo={selectedUser}
        />
      )}
    </div>
  );
};

export default UsersList;
