import { Routes, Route } from 'react-router-dom';
import EventsPage from '../pages/EventsPage.jsx';
import WelcomePage from '../pages/WelcomePage/WelcomePage.tsx';
export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<EventsPage />} />
      <Route path="/events" element={<EventsPage />} />
    <Route path="/welcome" element={<WelcomePage />} />
    </Routes>
  );
}

