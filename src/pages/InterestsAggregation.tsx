import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import type { GroupedInterest } from '../types';

export const InterestsAggregation: React.FC = () => {
  const [groups, setGroups] = useState<GroupedInterest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAggregation = async () => {
      try {
        const response = await API.get('/aggregations/users-by-interest');
        setGroups(response.data.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Failed to fetch interest aggregation'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAggregation();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Aggregation Scenario 1: Users Grouped by Interests</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Executed using a single <code>User.aggregate()</code> pipeline with{' '}
        <code>$unwind</code> and <code>$group</code>.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p>Running MongoDB Aggregation Pipeline...</p>
      ) : groups.length === 0 ? (
        <p>No user interests found.</p>
      ) : (
        <div style={styles.grid}>
          {groups.map((item) => (
            <div key={item.interest} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.interestTitle}>🏷️ {item.interest}</h3>
                <span style={styles.badge}>{item.userCount} users</span>
              </div>
              <ul style={styles.userList}>
                {item.users.map((u) => (
                  <li key={u._id} style={styles.userItem}>
                    <strong>{u.name}</strong> ({u.email})
                    <Link
                      to={`/aggregations/users/${u._id}/posts`}
                      style={styles.lookupLink}
                    >
                      View Posts ($lookup)
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '1rem',
  },
  card: {
    padding: '1.2rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.8rem',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '0.5rem',
  },
  interestTitle: {
    margin: 0,
    textTransform: 'capitalize',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#0284c7',
    color: '#fff',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  userList: {
    listStyleType: 'none',
    paddingLeft: 0,
    margin: 0,
  },
  userItem: {
    padding: '0.4rem 0',
    fontSize: '0.9rem',
    color: '#334155',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  lookupLink: {
    fontSize: '0.8rem',
    color: '#16a34a',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  error: {
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};
