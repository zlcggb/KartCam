import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VideoList } from './pages/VideoList';
import { VideoDetail } from './pages/VideoDetail';
import { Highlights } from './pages/Highlights';
import { GridGallery } from './pages/GridGallery';
import { Shares } from './pages/Shares';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { VideoExtractor } from './pages/VideoExtractor';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<VideoList />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/grid" element={<GridGallery />} />
          <Route path="/shares" element={<Shares />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/extractor" element={<VideoExtractor />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
