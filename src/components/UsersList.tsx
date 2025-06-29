import { useState, useEffect } from 'react';

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
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

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
      const originalError = error;
      setError('User deleted successfully');
      setTimeout(() => setError(originalError), 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setDeletingUserId(null);
    }
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
                {users.map((user) => (
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
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_new_user 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.is_new_user ? 'New User' : 'Returning'}
                      </span>
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
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={deletingUserId === user.id}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                          deletingUserId === user.id
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
                          <>
                            🗑️ Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
};

export default UsersList;
