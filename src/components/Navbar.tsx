import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.logo}>
          🔒 Secure Notes
        </Link>
      </div>

      {user ? (
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            My Notes
          </Link>
          <Link to="/posts" style={styles.link}>
            Public Posts
          </Link>
          <Link to="/aggregations/interests" style={styles.link}>
            Interests Aggregation
          </Link>

          {user.role === 'admin' && (
            <>
              <span style={styles.badge}>ADMIN</span>
              <Link to="/admin/users" style={styles.adminLink}>
                Manage Users
              </Link>
              <Link to="/admin/notes" style={styles.adminLink}>
                All Notes
              </Link>
            </>
          )}

          <span style={styles.userInfo}>
            {user.name} ({user.role})
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      ) : (
        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e293b',
    color: '#fff',
  },
  brand: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  logo: {
    color: '#38bdf8',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  adminLink: {
    color: '#f43f5e',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
  badge: {
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '0.7rem',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  userInfo: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    marginLeft: '0.5rem',
  },
  logoutBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#334155',
    color: '#fff',
    border: '1px solid #475569',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
