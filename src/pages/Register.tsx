import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const interestsArray = interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        interests: interestsArray,
      });

      const authData = response.data.data || response.data;
      register(authData.token, authData.user);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Register</h2>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label>Full Name</label>
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
          <label>Password (min 6 chars)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Interests (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. chess, reading, coding"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  card: {
    width: '380px',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  field: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #94a3b8',
  },
  btn: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  error: {
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
};
