import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Gallery } from './pages/Gallery';
import { PublicGallery } from './pages/PublicGallery';
import { Contact } from './pages/Contact';
import { AuthGuard } from './components/AuthGuard';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Sidebar />
      <Routes>
        <Route path="/" element={<PublicGallery />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <Gallery />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;