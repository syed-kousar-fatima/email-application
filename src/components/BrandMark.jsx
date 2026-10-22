import { FiMail } from 'react-icons/fi';

export default function BrandMark({ compact = false }) {
  return (
    <div className={`brand-mark${compact ? ' brand-mark-compact' : ''}`}>
      <span className="brand-icon"><FiMail /></span>
      {!compact && <span>northstar<span className="brand-dot">.</span></span>}
    </div>
  );
}
