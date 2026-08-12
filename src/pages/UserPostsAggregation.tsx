import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import type { UserPostsAggregation } from '../types';

export const UserPostsAggregationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<UserPostsAggregation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const response = await API.get(`/aggregations/users/${id}/posts`);
        setData(response.data.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Failed to fetch user posts aggregation'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [id]);

  return (
    <div style={styles.container}>
      <Link to="/posts" style={styles.backLink}>
        ← Back to Posts
      </Link>

      <h2>Aggregation Scenario 2: User Posts ($lookup)</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Executed using a single aggregation pipeline with <code>$match</code> and{' '}
        <code>$lookup</code> from the <code>posts</code> collection.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p>Running $lookup Aggregation Pipeline...</p>
      ) : !data ? (
        <p>User not found.</p>
      ) : (
        <div>
          <div style={styles.profileCard}>
            <h3>👤 {data.name}</h3>
            <p>
              <strong>Email:</strong> {data.email} | <strong>Role:</strong>{' '}
              {data.role}
            </p>
            <p>
              <strong>Interests:</strong>{' '}
              {data.interests && data.interests.length > 0
                ? data.interests.join(', ')
                : 'None'}
            </p>
            <p>
              <strong>Total Posts Found ($lookup):</strong> {data.totalPosts}
            </p>
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Joined Posts via $lookup:</h3>

          {data.posts.length === 0 ? (
            <p style={{ color: '#64748b' }}>
              This user has not authored any public posts yet.
            </p>
          ) : (
            <div style={styles.postsGrid}>
              {data.posts.map((post) => (
                <div key={post._id} style={styles.postCard}>
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                  <small style={{ color: '#94a3b8' }}>
                    Posted: {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  backLink: {
    color: '#0284c7',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginBottom: '1rem',
    display: 'inline-block',
  },
  profileCard: {
    padding: '1.2rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
  },
  postsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  postCard: {
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  error: {
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};
