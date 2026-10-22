import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import AuthLayout from './AuthLayout';
import { getAccount, hashPassword, registerAccount } from '../utils/auth';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (password.length < 8) {
      setError('Choose a password with at least 8 characters.');
      return;
    }
    const values = new FormData(form);
    const email = values.get('email').trim().toLowerCase();
    if (getAccount()?.email === email) {
      setError('An account already exists for this email. Sign in instead.');
      return;
    }
    if (!window.crypto?.subtle) {
      setError('Secure password hashing is not available in this browser.');
      return;
    }
    setError('');
    const passwordHash = await hashPassword(password);
    registerAccount({ name: values.get('name').trim(), email, passwordHash });
    navigate('/signin', { state: { registered: true } });
  };

  return (
    <AuthLayout
      eyebrow="A FRESH START"
      title="Your inbox, reimagined."
      description="Create an account and make a little room for what matters."
      mode={<>Already have an account? <Link to="/signin">Sign in <FiArrowRight /></Link></>}
    >
      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor="signup-name">Your name</label>
        <div className="auth-input-wrap"><FiUser /><input id="signup-name" name="name" type="text" placeholder="Alex Morgan" autoComplete="name" minLength="2" required /></div>
        <label className="auth-label" htmlFor="signup-email">Email address</label>
        <div className="auth-input-wrap"><FiMail /><input id="signup-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></div>
        <label className="auth-label" htmlFor="signup-password">Create a password</label>
        <div className="auth-input-wrap"><FiLock /><input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" autoComplete="new-password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
        <div className={`password-strength${password.length >= 8 ? ' strength-good' : ''}`}><span /><span /><span /><small>{password.length >= 8 ? 'Looking good' : 'Use at least 8 characters'}</small></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" className="auth-submit">Create your account <FiArrowRight /></button>
        <div className="auth-divider"><span>or sign up with</span></div>
        <button type="button" className="google-button"><span className="google-g">G</span>Continue with Google</button>
      </form>
    </AuthLayout>
  );
}
