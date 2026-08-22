import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Layout Components
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './app/router/ProtectedRoute';
import { ScrollToHash } from './app/router/ScrollToHash';

// Auth pages own their full-height layout and skip the marketing
// footer, matching the focused, minimal-chrome pattern most premium
// products use for sign-in/sign-up (Stripe, Linear, etc.).
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

function AppShell() {
  const { pathname } = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <div className="App">
      <Navbar />

      <main className={isAuthRoute ? '' : 'min-h-[calc(100vh-14rem)] pb-12'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:tripId"
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAuthRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToHash />
      <AppShell />
    </Router>
  );
}

export default App;
