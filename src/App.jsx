import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import InboxPage from './pages/InboxPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { getAccount, hasActiveSession } from './utils/auth';

function AuthenticatedInbox() {
  if (hasActiveSession()) return <InboxPage />;
  return <Navigate to={getAccount() ? '/signin' : '/signup'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticatedInbox />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
