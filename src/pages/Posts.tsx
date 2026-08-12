import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import type { Post, Pagination as PaginationMeta, PaginatedResponse } from '../types';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchPosts = async (pageNumber: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get<PaginatedResponse<Post>>(
        `/posts?page=${pageNumber}&limit=5`
      );
      setPosts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Public Posts</h2>
        <Link to="/posts/new" style={styles.createBtn}>
          + Create Post
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <LoadingSpinner message="Loading public posts..." />
      ) : posts.length === 0 ? (
        <div style={styles.emptyState}>No public posts available yet.</div>
      ) : (
        <div style={styles.grid}>
          {posts.map((post) => {
            const authorName =
              typeof post.author === 'object'
                ? post.author.name
                : 'Unknown Author';

            const authorId =
              typeof post.author === 'object' ? post.author._id : post.author;

            return (
              <div key={post._id} style={styles.card}>
                <h3 style={styles.title}>{post.title}</h3>
                <p style={styles.content}>{post.content}</p>
                <div style={styles.cardFooter}>
                  <span>
                    Author:{' '}
                    <Link
                      to={`/aggregations/users/${authorId}/posts`}
                      style={styles.authorLink}
                    >
                      {authorName} (View Posts $lookup)
                    </Link>
                  </span>
                  <span style={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
    maxWidth: '900px',
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
    backgroundColor: '#16a34a',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    padding: '1.2rem',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#0f172a',
  },
  content: {
    color: '#334155',
    whiteSpace: 'pre-wrap',
    marginBottom: '1rem',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#64748b',
  },
  authorLink: {
    color: '#0284c7',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  date: {
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  error: {
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    color: '#64748b',
  },
};
