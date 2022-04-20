import React from 'react';
import { Login } from '../modules/login/main';
import { useRouter } from 'next/router';

function HomePage() {
  const router = useRouter();
  const onSuccess = () => router.push('/dashboard');
  return <Login onSuccess={onSuccess} />;
}

export default HomePage;
