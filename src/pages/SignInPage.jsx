import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import AuthLayout from './AuthLayout';
import { getAccount, startSession, verifyPassword } from '../utils/auth';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const account = getAccount();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    if (!account) {
      setError('Create an account before signing in.');
      return;
    }
    const email = values.get('email').trim().toLowerCase();
    if (!window.crypto?.subtle) {
      setError('Secure password verification is not available in this browser.');
      return;
    }
    const passwordIsValid = await verifyPassword(values.get('password'), account.passwordHash);
    if (account.email !== email || !passwordIsValid) {
      setError('That email and password do not match. Try again.');
      return;
    }
    setError('');
    startSession(email, values.get('keepSignedIn') === 'on');
    navigate('/');
  };

  if (!account) return <Navigate to="/signup" replace />;

  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title="Good to see you."
      description="Your inbox is right where you left it."
      mode={<>New around here? <Link to="/signup">Create an account <FiArrowRight /></Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {location.state?.registered && <p className="auth-success" role="status">Account created. Sign in to open your inbox.</p>}
        <label className="auth-label" htmlFor="signin-email">Email address</label>
        <div className="auth-input-wrap"><FiMail /><input id="signin-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></div>
        <div className="auth-password-label"><label className="auth-label" htmlFor="signin-password">Password</label><Link to="/forgot-password">Forgot password?</Link></div>
        <div className="auth-input-wrap"><FiLock /><input id="signin-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" minLength="8" required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <label className="remember-check"><input type="checkbox" name="keepSignedIn" defaultChecked /><span />Keep me signed in</label>
        <button type="submit" className="auth-submit">Sign in <FiArrowRight /></button>
        <div className="auth-divider"><span>or continue with</span></div>
        <button type="button" className="google-button"><span className="google-g">G</span>Continue with Google</button>
      </form>
    </AuthLayout>
  );
}
