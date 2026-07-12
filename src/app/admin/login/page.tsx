"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLogin from '../../../components/AdminLogin';
import AdminDashboard from '../../../components/AdminDashboard';
import { isAdminAuthenticated } from '../../../utils/storage';

export default function AdminLoginPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setLoading(false);

    const handleAuthChange = () => {
      setAuthenticated(isAdminAuthenticated());
    };
    window.addEventListener('devshell_auth_updated', handleAuthChange);
    return () => {
      window.removeEventListener('devshell_auth_updated', handleAuthChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono text-xs">LOADING AUTH SYSTEM...</div>
      </div>
    );
  }

  if (authenticated) {
    return (
      <AdminDashboard 
        onLogout={() => {
          router.push('/');
        }} 
      />
    );
  }

  return (
    <AdminLogin 
      onLoginSuccess={() => {
        setAuthenticated(true);
      }} 
      onBackToHome={() => router.push('/')} 
    />
  );
}
