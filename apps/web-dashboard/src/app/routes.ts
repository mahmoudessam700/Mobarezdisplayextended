import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/dashboard/Devices';
import { Sessions } from './pages/dashboard/Sessions';
import { Analytics } from './pages/dashboard/Analytics';
import { Settings } from './pages/dashboard/Settings';
import { Account } from './pages/dashboard/Account';
import { Help } from './pages/dashboard/Help';
import { Download } from './pages/Download';
import { Documentation } from './pages/Documentation';
import { Community } from './pages/Community';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Careers } from './pages/Careers';
import { PressKit } from './pages/PressKit';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DisplayPage } from './pages/display/DisplayPage';
import { NotFound } from './pages/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      // ... (lines 32-84)
    ],
  },
  {
    path: '/dashboard',
    Component: Dashboard,
    ErrorBoundary: ErrorBoundary,
    children: [
      // ... (lines 91-115)
    ],
  },
  {
    path: '/display',
    Component: DisplayPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);