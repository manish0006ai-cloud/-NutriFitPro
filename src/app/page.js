'use client';
import { useUser } from '../context/UserContext';
import AppShell from '../components/layout/AppShell';
import OnboardingPage from './onboarding/OnboardingPage';

export default function Home() {
  const { isOnboarded } = useUser();

  if (!isOnboarded) {
    return <OnboardingPage />;
  }

  return <AppShell initialPage="dashboard" />;
}
