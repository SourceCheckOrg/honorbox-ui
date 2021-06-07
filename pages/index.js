import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '../context/auth';
import NavBar from '../components/NavBar';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated]);

  return (
    <NavBar />
  );
}
