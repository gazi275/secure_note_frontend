import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import type { Note, Pagination as PaginationMeta, PaginatedResponse } from '../types';
import { Pagination } from '../components/Pagination';

export const AdminNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchAllNotes = async (pageNumber: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get<PaginatedResponse<Note>>(
        `/admin/notes?page=${pageNumber}&limit=5`
      );
      setNotes(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch all notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes(page);
  }, [page]);

  return (
    <div style={styles.container}>
      <h2>All Notes (Admin Overview)</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Admins can view everyone's notes across the system.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p>Loading all system notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes found in system.</p>
      ) : (
        <div style={styles.grid}>
          {notes.map((note) => {
            const author =
              typeof note.user === 'object'
                ? `${note.user.name} (${note.user.email})`
                : note.user;

            return (
              <div key={note._id} style={styles.card}>
                <div style={styles.authorBadge}>Owner: {author}</div>
                <h3 style={styles.title}>{note.title}</h3>
                <p style={styles.content}>{note.content}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.date}>
                    Created: {new Date(note.createdAt).toLocaleDateString()}
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
  authorBadge: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: '0.5rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#0f172a',
  },
  content: {
    color: '#334155',
    whiteSpace: 'pre-wrap',
    marginBottom: '0.8rem',
  },
  cardFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '0.4rem',
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
};
