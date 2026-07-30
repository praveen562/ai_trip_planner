import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <main className="min-h-[calc(100vh-14rem)] pb-12">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Routes (would wrap with requireAuth in real app) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
