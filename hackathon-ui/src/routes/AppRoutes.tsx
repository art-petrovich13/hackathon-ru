import { Routes, Route } from 'react-router-dom';
import EventsPage from '../pages/EventsPage.jsx';
import WelcomePage from '../pages/WelcomePage/WelcomePage.tsx';
import Authorization from '../pages//Authorization/Authorization.tsx';
import Profile from '../pages/Profile/Profile';
export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<EventsPage />} />
      <Route path="/events" element={<EventsPage />} />
    <Route path="/welcome" element={<WelcomePage />} />
    <Route path="/authorization" element={<Authorization onAuthSuccess={() => {}} />} />
       <Route 
        path="/profile" 
        element={
            <Profile />
        
        } />
    </Routes>
  );
}

