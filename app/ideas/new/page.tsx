'use client';

import { CreateIdeaForm } from '@/app/components/CreateIdeaForm';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewIdeaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <DashboardLayout><div></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <CreateIdeaForm />
    </DashboardLayout>
  );
}
