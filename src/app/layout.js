import './globals.css';
import { UserProvider } from '../context/UserContext';
import { FoodLogProvider } from '../context/FoodLogContext';

export const metadata = {
  title: 'NutriFit Pro — Gym Nutrition Tracker',
  description: 'Track your macros, plan meals, and optimize your nutrition for muscle gain, fat loss, or maintenance. Built for serious gym-goers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <UserProvider>
          <FoodLogProvider>
            {children}
          </FoodLogProvider>
        </UserProvider>
      </body>
    </html>
  );
}
