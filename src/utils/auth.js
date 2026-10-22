const ACCOUNT_KEY = 'northstar-mail-account';
const SESSION_KEY = 'northstar-mail-session';

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password) {
  if (!window.crypto?.subtle) throw new Error('Secure password hashing is not available in this browser.');
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const bytes = new TextEncoder().encode(password);
  const key = await window.crypto.subtle.importKey('raw', bytes, 'PBKDF2', false, ['deriveBits']);
  const digest = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations: 120000,
    hash: 'SHA-256',
  }, key, 256);
  return { salt: toHex(salt), hash: toHex(new Uint8Array(digest)) };
}

export async function verifyPassword(password, savedHash) {
  if (!savedHash?.salt || !savedHash?.hash) return false;
  if (!window.crypto?.subtle) throw new Error('Secure password verification is not available in this browser.');
  const salt = Uint8Array.from(savedHash.salt.match(/.{2}/g) || [], (byte) => Number.parseInt(byte, 16));
  const key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const digest = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations: 120000,
    hash: 'SHA-256',
  }, key, 256);
  return toHex(new Uint8Array(digest)) === savedHash.hash;
}

export function getAccount() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || 'null');
}

export function registerAccount({ name, email, passwordHash }) {
  const account = { name, email: email.toLowerCase(), passwordHash };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  return account;
}

export function startSession(email, keepSignedIn) {
  const normalizedEmail = email.toLowerCase();
  if (keepSignedIn) {
    localStorage.setItem(SESSION_KEY, normalizedEmail);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, normalizedEmail);
    localStorage.removeItem(SESSION_KEY);
  }
}

export function hasActiveSession() {
  const account = getAccount();
  const activeEmail = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  return Boolean(account && activeEmail === account.email);
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getActiveAccount() {
  if (!hasActiveSession()) return null;
  return getAccount();
}
