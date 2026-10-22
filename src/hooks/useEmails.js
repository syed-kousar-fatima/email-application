import { useEffect, useMemo, useState } from 'react';
import { initialEmails } from '../data/emails';
import { getEmailsForFolder } from '../utils/email';

const STORAGE_KEY = 'northstar-mail-emails';

function loadEmails() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialEmails;
  const emails = JSON.parse(saved);
  if (!Array.isArray(emails)) throw new Error('Saved email data is invalid.');
  return emails;
}

export default function useEmails(folder, query) {
  const [emails, setEmails] = useState(loadEmails);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  }, [emails]);

  const visibleEmails = useMemo(() => getEmailsForFolder(emails, folder, query), [emails, folder, query]);

  const updateEmail = (id, updates) => {
    setEmails((current) => current.map((email) => (email.id === id ? { ...email, ...updates } : email)));
  };

  const moveToTrash = (id) => updateEmail(id, { folder: 'trash', archived: false });
  const archiveEmail = (id) => updateEmail(id, { archived: true, folder: 'inbox' });
  const toggleStar = (id) => {
    setEmails((current) => current.map((email) => (
      email.id === id ? { ...email, starred: !email.starred } : email
    )));
  };
  const addEmail = (email) => setEmails((current) => [email, ...current]);
  const removeEmail = (id) => setEmails((current) => current.filter((email) => email.id !== id));

  return {
    emails,
    visibleEmails,
    updateEmail,
    moveToTrash,
    archiveEmail,
    toggleStar,
    addEmail,
    removeEmail,
  };
}
