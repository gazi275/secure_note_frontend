import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const backgroundColor =
    toast.type === 'error'
      ? '#ef4444'
      : toast.type === 'success'
      ? '#10b981'
      : '#3b82f6';

  return (
    <div style={{ ...styles.toast, backgroundColor }}>
      <span>{toast.text}</span>
      <button onClick={onClose} style={styles.closeBtn}>
        ✕
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    color: '#fff',
    padding: '0.8rem 1.2rem',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    zIndex: 9999,
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0,
  },
};
