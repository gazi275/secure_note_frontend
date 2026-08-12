import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import type { Note, Pagination as PaginationMeta, PaginatedResponse } from '../types';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchNotes = async (pageNumber: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get<PaginatedResponse<Note>>(
        `/notes?page=${pageNumber}&limit=5`
      );
      setNotes(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes(page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete note');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Notes</h2>
        <Link to="/notes/new" style={styles.createBtn}>
          + Create New Note
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <LoadingSpinner message="Fetching your secure notes..." />
      ) : notes.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No notes found. Create your first note!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {notes.map((note) => (
            <div key={note._id} style={styles.card}>
              <h3 style={styles.title}>{note.title}</h3>
              <p style={styles.content}>{note.content}</p>
              <div style={styles.cardFooter}>
                <span style={styles.date}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div style={styles.actions}>
                  <Link to={`/notes/${note._id}/edit`} style={styles.editBtn}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    backgroundColor: '#0284c7',
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
  },
  date: {
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
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
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    color: '#64748b',
  },
};
