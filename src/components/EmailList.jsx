import { FiArchive, FiChevronDown, FiChevronLeft, FiChevronRight, FiMoreHorizontal, FiRefreshCw, FiStar, FiTrash2 } from 'react-icons/fi';
import { formatEmailDate } from '../utils/email';

const folderTitles = {
  inbox: ['All inboxes', 'A little room for good things.'],
  primary: ['Primary', 'The messages that matter most.'],
  promotions: ['Promotions', 'Updates and offers from brands you follow.'],
  social: ['Social', 'The latest from your people.'],
  updates: ['Updates', 'Receipts, confirmations, and reminders.'],
  starred: ['Starred', 'The notes you want to come back to.'],
  snoozed: ['Snoozed', 'Messages saved for a better time.'],
  important: ['Important', 'Messages marked as important.'],
  purchases: ['Purchases', 'Your shopping receipts and order updates.'],
  sent: ['Sent', 'A record of what you’ve shared.'],
  scheduled: ['Scheduled', 'Messages set to send later.'],
  outbox: ['Outbox', 'Messages waiting to be sent.'],
  drafts: ['Drafts', 'Your ideas, still in progress.'],
  'all-mail': ['All mail', 'Every message, all in one place.'],
  archive: ['Archive', 'Out of the way, never out of reach.'],
  spam: ['Spam', 'The things you didn’t ask for.'],
  trash: ['Trash', 'Recently deleted messages.'],
  subscriptions: ['Subscriptions', 'The newsletters and lists you follow.'],
};

export default function EmailList({
  emails,
  activeFolder,
  selectedEmail,
  onSelect,
  onToggleStar,
  onArchive,
  onDelete,
  onMarkUnread,
  onRefresh,
}) {
  const [title, subtitle] = folderTitles[activeFolder] || folderTitles.inbox;

  return (
    <section className={`email-list-panel${selectedEmail ? ' has-selection' : ''}`} aria-label={`${title} messages`}>
      <div className="list-heading">
        <div>
          <div className="heading-title-row">
            <h1>{title}</h1>
            <button className="heading-filter" aria-label="Filter messages"><FiChevronDown /></button>
          </div>
          <p>{subtitle}</p>
        </div>
        <button className="mobile-icon icon-button" onClick={onRefresh} aria-label="Refresh emails"><FiRefreshCw /></button>
      </div>
      <div className="list-toolbar">
        <label className="select-all"><input type="checkbox" aria-label="Select all messages" /><span /></label>
        <button className="toolbar-button" onClick={onRefresh} aria-label="Refresh emails"><FiRefreshCw /></button>
        <button className="toolbar-button toolbar-more" aria-label="More actions"><FiMoreHorizontal /></button>
        <span className="result-count">{emails.length ? `1–${emails.length} of ${emails.length}` : '0 messages'}</span>
        <button className="toolbar-button page-arrow" aria-label="Previous page" disabled><FiChevronLeft /></button>
        <button className="toolbar-button page-arrow" aria-label="Next page" disabled><FiChevronRight /></button>
      </div>
      {emails.length ? (
        <div className="email-rows">
          {emails.map((email) => (
            <article
              key={email.id}
              className={`email-row${email.read ? '' : ' unread'}${selectedEmail?.id === email.id ? ' selected' : ''}`}
              onClick={() => onSelect(email)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(email);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${email.read ? '' : 'Unread, '}${email.sender}: ${email.subject}`}
            >
              <div className="row-leading">
                <label className="row-checkbox" onClick={(event) => event.stopPropagation()}>
                  <input type="checkbox" aria-label={`Select ${email.subject}`} />
                  <span />
                </label>
                <button
                  className={`star-button${email.starred ? ' starred' : ''}`}
                  aria-label={email.starred ? 'Remove star' : 'Add star'}
                  onClick={(event) => { event.stopPropagation(); onToggleStar(email.id); }}
                >
                  <FiStar />
                </button>
              </div>
              <div className={`avatar sender-avatar avatar-${email.color}`}>{email.avatar}</div>
              <div className="email-row-content">
                <div className="email-row-top">
                  <span className="sender-name">{email.sender}</span>
                  <span className="email-date">{formatEmailDate(email.date)}</span>
                </div>
                <div className="email-subject">{email.subject}</div>
                <div className="email-preview">{email.preview}</div>
                {email.labels.length > 0 && (
                  <div className="email-labels">{email.labels.map((label) => <span key={label} className="email-label">{label}</span>)}</div>
                )}
              </div>
              <div className="row-hover-actions">
                <button aria-label="Archive email" onClick={(event) => { event.stopPropagation(); onArchive(email.id); }}><FiArchive /></button>
                <button aria-label={email.read ? 'Mark unread' : 'Mark read'} onClick={(event) => { event.stopPropagation(); onMarkUnread(email); }}><span className={email.read ? 'unread-dot-outline' : 'read-dot'} /></button>
                <button aria-label="Delete email" onClick={(event) => { event.stopPropagation(); onDelete(email.id); }}><FiTrash2 /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-illustration"><FiArchive /></div>
          <h2>{activeFolder === 'inbox' ? 'You’re all caught up' : 'Nothing here just yet'}</h2>
          <p>{activeFolder === 'inbox' ? 'Your inbox is clear. Enjoy a little breathing room.' : 'Try another folder or adjust your search.'}</p>
        </div>
      )}
    </section>
  );
}
