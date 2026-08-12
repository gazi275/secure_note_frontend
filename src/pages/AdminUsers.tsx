import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import type { User, Pagination as PaginationMeta, PaginatedResponse } from '../types';
import { Pagination } from '../components/Pagination';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // New User Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [interests, setInterests] = useState('');
  const [formError, setFormError] = useState('');

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get<PaginatedResponse<User>>(
        `/admin/users?page=${pageNumber}&limit=5`
      );
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers(page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const interestsArr = interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      await API.post('/admin/users', {
        name,
        email,
        password,
        role,
        interests: interestsArr,
      });

      setShowModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setInterests('');
      fetchUsers(page);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>User Management (Admin)</h2>
        <button onClick={() => setShowModal(true)} style={styles.createBtn}>
          + Add New User
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showModal && (
        <div style={styles.modalBackdrop}>
          <form onSubmit={handleCreateUser} style={styles.modalCard}>
            <h3>Add New User</h3>
            {formError && <div style={styles.error}>{formError}</div>}

            <div style={styles.field}>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                style={styles.input}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={styles.field}>
              <label>Interests (comma separated)</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.btnRow}>
              <button type="submit" style={styles.saveBtn}>
                Save User
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Interests</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const uId = u._id || u.id;
              return (
                <tr key={uId}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.roleTag,
                        backgroundColor:
                          u.role === 'admin' ? '#ef4444' : '#3b82f6',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {u.interests && u.interests.length > 0
                      ? u.interests.join(', ')
                      : 'None'}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(uId)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {pagination && (
        <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  createBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: '0.75rem',
    textAlign: 'left',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #e2e8f0',
  },
  roleTag: {
    color: '#fff',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  deleteBtn: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  error: {
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '400px',
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  field: {
    marginBottom: '0.8rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  input: {
    padding: '0.4rem',
    borderRadius: '4px',
    border: '1px solid #94a3b8',
  },
  btnRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  saveBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
