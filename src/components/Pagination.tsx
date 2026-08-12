import React from 'react';
import type { Pagination as PaginationMeta } from '../types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (meta.totalPages <= 1) return null;

  return (
    <div style={styles.container}>
      <button
        disabled={meta.currentPage === 1}
        onClick={() => onPageChange(meta.currentPage - 1)}
        style={styles.btn}
      >
        Previous
      </button>

      <span style={styles.info}>
        Page {meta.currentPage} of {meta.totalPages} ({meta.totalItems} items)
      </span>

      <button
        disabled={meta.currentPage === meta.totalPages}
        onClick={() => onPageChange(meta.currentPage + 1)}
        style={styles.btn}
      >
        Next
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
  btn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  info: {
    fontSize: '0.9rem',
    color: '#475569',
  },
};
