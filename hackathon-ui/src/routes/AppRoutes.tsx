import { Routes, Route } from 'react-router-dom';
import EventsPage from '../pages/EventsPage.jsx';
import WelcomePage from '../pages/WelcomePage/WelcomePage.tsx';
import Profile from '../pages/Profile/Profile';

import Login from '../pages/Authorization/components/Login/Login';
import Register from '../pages/Authorization/components/Register/Register';
import VerifyEmail from '../pages/Authorization/components/VerifyEmail/VerifyEmail';
import ForgotPassword from '../pages/Authorization/components/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/Authorization/components/ResetPassword/ResetPassword';

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<EventsPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route
        path="/profile"
        element={
          <Profile />

        } />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
}



