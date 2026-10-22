import { useEffect, useMemo, useRef, useState } from 'react';
import { FiBell, FiCheck, FiEdit3 } from 'react-icons/fi';
import ComposeModal from '../components/ComposeModal';
import EmailDetail from '../components/EmailDetail';
import EmailList from '../components/EmailList';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import useEmails from '../hooks/useEmails';
import useTheme from '../hooks/useTheme';
import { getActiveAccount, clearSession } from '../utils/auth';
import { getEmailCounts, getUnreadCounts } from '../utils/email';
import { useNavigate } from 'react-router-dom';

const folderNames = {
  inbox: 'All inboxes',
  primary: 'Primary',
  promotions: 'Promotions',
  social: 'Social',
  updates: 'Updates',
  starred: 'Starred',
  snoozed: 'Snoozed',
  important: 'Important',
  purchases: 'Purchases',
  sent: 'Sent',
  scheduled: 'Scheduled',
  outbox: 'Outbox',
  drafts: 'Drafts',
  'all-mail': 'All mail',
  archive: 'Archive',
  spam: 'Spam',
  trash: 'Trash',
  subscriptions: 'Subscriptions',
};

export default function InboxPage() {
  const navigate = useNavigate();
  const account = getActiveAccount();
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeDraft, setComposeDraft] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const searchInput = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const {
    emails,
    visibleEmails,
    updateEmail,
    moveToTrash,
    archiveEmail,
    toggleStar,
    addEmail,
    removeEmail,
  } = useEmails(activeFolder, query);
  const selectedEmail = useMemo(() => emails.find((email) => email.id === selectedId) || null, [emails, selectedId]);
  const counts = getEmailCounts(emails);
  const unreadCounts = getUnreadCounts(emails);

  useEffect(() => {
    if (selectedEmail && !visibleEmails.some((email) => email.id === selectedId)) setSelectedId(null);
  }, [selectedEmail, selectedId, visibleEmails]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key.toLowerCase() === 'c' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        setComposeDraft(null);
        setComposeOpen(true);
      }
      if (event.key === 'Escape') {
        setComposeOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectFolder = (folder) => {
    setActiveFolder(folder);
    setQuery('');
    setSelectedId(null);
    setSidebarOpen(false);
  };

  const selectEmail = (email) => {
    if (activeFolder === 'drafts') {
      setComposeDraft(email);
      setComposeOpen(true);
      return;
    }
    setSelectedId(email.id);
    if (!email.read) updateEmail(email.id, { read: true });
  };

  const openReply = (email, forwarded = false) => {
    setComposeDraft({
      to: forwarded ? '' : email.email,
      subject: `${forwarded ? 'Fwd' : 'Re'}: ${email.subject.replace(/^(Re|Fwd):\s*/i, '')}`,
      body: forwarded ? `\n\n---------- Forwarded message ----------\nFrom: ${email.sender} <${email.email}>\nSubject: ${email.subject}\n\n${email.body}` : `\n\nOn ${new Date(email.date).toLocaleString()}, ${email.sender} wrote:\n> ${email.body.split('\n').join('\n> ')}`,
    });
    setComposeOpen(true);
  };

  const handleSend = ({ id, to, cc, bcc, subject, body, attachments }) => {
    const senderName = to.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    addEmail({
      id: `sent-${Date.now()}`,
      sender: 'Alex Morgan',
      email: 'alex.morgan@northstar.design',
      recipient: to,
      cc,
      bcc,
      subject: subject || '(no subject)',
      preview: body.slice(0, 120) || 'No message content',
      body,
      date: new Date().toISOString(),
      avatar: 'AM',
      color: 'indigo',
      read: true,
      starred: false,
      folder: 'sent',
      labels: [],
      attachments,
      recipientName: senderName,
    });
    if (id) removeEmail(id);
    setComposeOpen(false);
    setComposeDraft(null);
    setToast(`Message sent to ${to}`);
  };

  const handleSaveDraft = ({ to, cc, bcc, subject, body, attachments }) => {
    const existingId = composeDraft?.id;
    const draftEmail = {
      id: existingId || `draft-${Date.now()}`,
      sender: 'Alex Morgan',
      email: 'alex.morgan@northstar.design',
      subject: subject || '(no subject)',
      preview: body.slice(0, 120) || 'Draft',
      body,
      to,
      cc,
      bcc,
      date: new Date().toISOString(),
      avatar: 'AM',
      color: 'indigo',
      read: true,
      starred: false,
      folder: 'drafts',
      labels: [],
      attachments,
    };
    if (existingId) updateEmail(existingId, draftEmail);
    else addEmail(draftEmail);
    setComposeOpen(false);
    setComposeDraft(null);
    setToast('Draft saved');
  };

  const deleteEmail = (id) => {
    if (activeFolder === 'trash') {
      removeEmail(id);
      setToast('Message permanently deleted');
    } else {
      moveToTrash(id);
      setToast('Message moved to trash');
    }
    if (selectedId === id) setSelectedId(null);
  };

  const archiveMessage = (id) => {
    archiveEmail(id);
    if (selectedId === id) setSelectedId(null);
    setToast('Message archived');
  };

  const createLabel = () => {
    const label = window.prompt('Name your label');
    if (label?.trim()) setToast(`Label “${label.trim()}” created`);
  };

  const handleUtility = (name) => setToast(`${name} is coming soon`);

  const handleSignOut = () => {
    clearSession();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeFolder={activeFolder}
        onSelect={selectFolder}
        counts={counts}
        unreadCounts={unreadCounts}
        onCompose={() => { setComposeDraft(null); setComposeOpen(true); }}
        onCreateLabel={createLabel}
        onUtility={handleUtility}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        account={account}
      />
      <main className="main-area">
        <Topbar
          query={query}
          onQueryChange={setQuery}
          onMenu={() => setSidebarOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          searchInput={searchInput}
          account={account}
          onSignOut={handleSignOut}
        />
        <div className="workspace">
          <div className="welcome-line"><div><span className="welcome-eyebrow">YOUR PERSONAL MAIL <span>·</span> A LITTLE MORE ROOM TO THINK</span><h2>A little space for <em>good things.</em></h2></div><div className="welcome-note"><FiBell /><span>You’re doing great, {account?.name?.split(' ')[0] || 'Alex'}.</span><FiCheck className="welcome-check" /></div></div>
          <div className={`mail-workspace${selectedEmail ? ' detail-active' : ''}`}>
            <EmailList
              emails={visibleEmails}
              activeFolder={activeFolder}
              selectedEmail={selectedEmail}
              onSelect={selectEmail}
              onToggleStar={toggleStar}
              onArchive={archiveMessage}
              onDelete={deleteEmail}
              onMarkUnread={(email) => updateEmail(email.id, { read: !email.read })}
              onRefresh={() => setToast('Your mail is up to date')}
            />
            <EmailDetail
              email={selectedEmail}
              onBack={() => setSelectedId(null)}
              onToggleStar={toggleStar}
              onArchive={archiveMessage}
              onDelete={deleteEmail}
              onReply={(email) => openReply(email)}
              onForward={(email) => openReply(email, true)}
            />
          </div>
          <footer className="workspace-footer"><span>Showing {visibleEmails.length} messages in {folderNames[activeFolder]}</span><span>Made for a little more <span className="footer-heart">♥</span> in your day</span></footer>
        </div>
      </main>
      <button className="floating-compose" onClick={() => { setComposeDraft(null); setComposeOpen(true); }} aria-label="Compose a new message"><FiEdit3 /><span>Compose</span></button>
      {composeOpen && <ComposeModal onClose={() => { setComposeOpen(false); setComposeDraft(null); }} onSend={handleSend} onSaveDraft={handleSaveDraft} draft={composeDraft} />}
      {toast && <div className="toast-message" role="status"><FiCheck />{toast}</div>}
    </div>
  );
}
