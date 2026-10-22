import { useState } from 'react';
import { FiArchive, FiArrowLeft, FiArrowUpRight, FiClock, FiCornerUpLeft, FiDownload, FiMoreHorizontal, FiPaperclip, FiStar, FiTrash2 } from 'react-icons/fi';
import { formatEmailDate } from '../utils/email';

export default function EmailDetail({ email, onBack, onToggleStar, onArchive, onDelete, onReply, onForward }) {
  const [showMore, setShowMore] = useState(false);

  if (!email) {
    return (
      <section className="detail-panel detail-empty" aria-label="Email preview">
        <div className="detail-empty-art"><span><FiPaperclip /></span><span><FiStar /></span><span><FiCornerUpLeft /></span></div>
        <h2>Your inbox, at a glance</h2>
        <p>Select a message to read it here. No need to open a new window.</p>
        <div className="detail-empty-tip"><span className="tip-sparkle">✳</span><span><strong>A little tip</strong>Use <kbd>↑</kbd> and <kbd>↓</kbd> to move between messages</span></div>
      </section>
    );
  }

  return (
    <section className="detail-panel" aria-label="Email details">
      <div className="detail-toolbar">
        <button className="icon-button detail-back" onClick={onBack} aria-label="Back to messages"><FiArrowLeft /></button>
        <div className="detail-toolbar-actions">
          <button className="icon-button" onClick={() => onArchive(email.id)} aria-label="Archive"><FiArchive /></button>
          <button className="icon-button" onClick={() => onDelete(email.id)} aria-label="Delete"><FiTrash2 /></button>
          <span className="toolbar-divider" />
          <button className={`icon-button${email.starred ? ' starred-icon' : ''}`} onClick={() => onToggleStar(email.id)} aria-label={email.starred ? 'Remove star' : 'Add star'}><FiStar /></button>
          <button className="icon-button" onClick={() => setShowMore(!showMore)} aria-label="More email actions"><FiMoreHorizontal /></button>
        </div>
        {showMore && <div className="detail-menu"><button onClick={() => { onForward(email); setShowMore(false); }}>Forward message</button><button onClick={() => { onReply(email); setShowMore(false); }}>Reply to sender</button></div>}
      </div>
      <div className="detail-scroll">
        <div className="detail-subject-row">
          <h2>{email.subject}</h2>
          {email.labels.map((label) => <span className="email-label" key={label}>{label}</span>)}
        </div>
        <div className="message-meta">
          <div className={`avatar sender-avatar avatar-${email.color}`}>{email.avatar}</div>
          <div className="message-sender">
            <strong>{email.sender}</strong>
            <span>to Alex Morgan <span className="recipient-chevron">⌄</span></span>
          </div>
          <div className="message-meta-right"><span>{formatEmailDate(email.date)}</span><FiClock /></div>
        </div>
        <div className="message-body">{email.body}</div>
        {email.attachments?.length > 0 && (
          <div className="attachments">
            <div className="attachment-heading"><span>{email.attachments.length} attachment</span><button><FiDownload /> Download all</button></div>
            <button className="attachment-card">
              <span className="attachment-file-icon">PDF</span>
              <span className="attachment-file-info"><strong>{email.attachments[0].name}</strong><small>{email.attachments[0].size}</small></span>
              <FiArrowUpRight className="attachment-open" />
            </button>
          </div>
        )}
        <div className="message-divider" />
        <div className="message-actions">
          <button className="reply-button" onClick={() => onReply(email)}><FiCornerUpLeft /> Reply</button>
          <button className="forward-button" onClick={() => onForward(email)}><FiArrowUpRight /> Forward</button>
          <span className="message-action-hint">Reply to {email.sender.split(' ')[0]}</span>
        </div>
      </div>
    </section>
  );
}
