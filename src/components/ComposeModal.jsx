import { useRef, useState } from 'react';
import { FiChevronDown, FiPaperclip, FiPlus, FiSend, FiTrash2, FiX } from 'react-icons/fi';

function hasValidAddresses(value) {
  if (!value.trim()) return true;
  return value.split(/[;,]/).map((address) => address.trim()).filter(Boolean)
    .every((address) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address));
}

export default function ComposeModal({ onClose, onSend, onSaveDraft, draft }) {
  const [to, setTo] = useState(draft?.to || '');
  const [cc, setCc] = useState(draft?.cc || '');
  const [bcc, setBcc] = useState(draft?.bcc || '');
  const [subject, setSubject] = useState(draft?.subject || '');
  const [body, setBody] = useState(draft?.body || '');
  const [showCc, setShowCc] = useState(Boolean(draft?.cc));
  const [showBcc, setShowBcc] = useState(Boolean(draft?.bcc));
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState(draft?.attachments || []);
  const fileInput = useRef(null);

  const handleSend = (event) => {
    event.preventDefault();
    if (!to.trim() || !hasValidAddresses(to) || !hasValidAddresses(cc) || !hasValidAddresses(bcc)) {
      setError('Add a valid email address to each recipient field.');
      return;
    }
    if (!subject.trim() && !body.trim()) {
      setError('Add a subject or message before sending.');
      return;
    }
    onSend({ id: draft?.id, to, cc, bcc, subject, body, attachments });
  };

  const saveDraft = () => onSaveDraft({ to, cc, bcc, subject, body, attachments });

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="compose-modal" onSubmit={handleSend}>
        <div className="compose-header"><strong>{draft ? 'Edit draft' : 'New message'}</strong><div><button type="button" onClick={saveDraft} aria-label="Save draft"><FiChevronDown /></button><button type="button" onClick={onClose} aria-label="Close compose"><FiX /></button></div></div>
        <div className="compose-fields">
          <label className="compose-line"><span>To</span><input value={to} onChange={(event) => setTo(event.target.value)} placeholder="name@example.com" autoFocus /><span className="cc-bcc-links">{!showCc && <button type="button" onClick={() => setShowCc(true)}>Cc</button>}{!showBcc && <button type="button" onClick={() => setShowBcc(true)}>Bcc</button>}</span></label>
          {showCc && <label className="compose-line"><span>Cc</span><input value={cc} onChange={(event) => setCc(event.target.value)} placeholder="Add recipients" /></label>}
          {showBcc && <label className="compose-line"><span>Bcc</span><input value={bcc} onChange={(event) => setBcc(event.target.value)} placeholder="Add recipients" /></label>}
          <label className="compose-line"><span>Subject</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Add a subject" /></label>
        </div>
        <textarea className="compose-body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write something thoughtful..." />
        {error && <p className="compose-error" role="alert">{error}</p>}
        {attachments.length > 0 && <div className="compose-attachments">{attachments.map((attachment) => <span key={attachment.name}><FiPaperclip />{attachment.name}</span>)}</div>}
        <input ref={fileInput} type="file" className="visually-hidden" multiple onChange={(event) => setAttachments((current) => [...current, ...Array.from(event.target.files || [], (file) => ({ name: file.name, size: `${Math.max(1, Math.round(file.size / 1024))} KB` }))])} />
        <div className="compose-footer">
          <button className="send-button" type="submit"><FiSend /> Send</button>
          <div className="compose-footer-tools"><button type="button" onClick={() => fileInput.current?.click()} aria-label="Add attachment"><FiPaperclip /></button><button type="button" aria-label="Add content"><FiPlus /></button><button type="button" onClick={saveDraft} aria-label="Save draft"><FiChevronDown /></button><button type="button" onClick={() => { onClose(); }} aria-label="Discard message"><FiTrash2 /></button></div>
        </div>
      </form>
    </div>
  );
}
