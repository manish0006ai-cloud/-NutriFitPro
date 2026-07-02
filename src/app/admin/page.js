'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && !session.user.isAdmin) {
      router.push('/');
    } else if (session?.user.isAdmin) {
      fetchUsers();
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!session?.user.isAdmin) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--accent-primary)', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Joined</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Last Login</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{user.id.slice(-6)}</td>
                <td style={{ padding: '1rem' }}>{user.name || '-'}</td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: user.isAdmin ? 'rgba(255, 69, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: user.isAdmin ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
