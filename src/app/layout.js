import './globals.css';
import { UserProvider } from '../context/UserContext';
import { FoodLogProvider } from '../context/FoodLogContext';
import { Providers } from '../components/Providers';

export const metadata = {
  title: 'Quantum Nutrifit Pro — Gym Nutrition Tracker',
  description: 'Track your macros, plan meals, and optimize your nutrition for muscle gain, fat loss, or maintenance. Built for serious gym-goers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Providers>
          <UserProvider>
            <FoodLogProvider>
              {children}
            </FoodLogProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
