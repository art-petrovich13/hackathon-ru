import { Routes, Route } from 'react-router-dom';
import EventsPage from '../pages/EventsPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<EventsPage />} />
      <Route path="/events" element={<EventsPage />} />

    </Routes>
  );
}

