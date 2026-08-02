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
import TripDetail from './pages/TripDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Auth pages own their full-height layout and skip the marketing
// footer, matching the focused, minimal-chrome pattern most premium
// products use for sign-in/sign-up (Stripe, Linear, etc.).
const AUTH_ROUTES = ['/login', '/register'];

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

          {/* Protected Routes (would wrap with requireAuth in real app) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />
          <Route path="/profile" element={<Profile />} />

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
      <AppShell />
    </Router>
  );
}

export default App;
