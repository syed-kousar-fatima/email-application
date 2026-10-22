import {
  FiArchive,
  FiBell,
  FiCalendar,
  FiChevronDown,
  FiEdit3,
  FiFileText,
  FiHelpCircle,
  FiInbox,
  FiMail,
  FiMoon,
  FiPlus,
  FiSend,
  FiSettings,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiSun,
  FiTag,
  FiTrash2,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import BrandMark from './BrandMark';

const sections = [
  {
    title: 'INBOXES',
    folders: [
      { id: 'inbox', label: 'All inboxes', icon: FiInbox },
      { id: 'primary', label: 'Primary', icon: FiMail },
      { id: 'promotions', label: 'Promotions', icon: FiTag },
      { id: 'social', label: 'Social', icon: FiUsers },
      { id: 'updates', label: 'Updates', icon: FiBell },
    ],
  },
  {
    title: 'ALL LABELS',
    folders: [
      { id: 'starred', label: 'Starred', icon: FiStar },
      { id: 'snoozed', label: 'Snoozed', icon: FiBell },
      { id: 'important', label: 'Important', icon: FiTag },
      { id: 'purchases', label: 'Purchases', icon: FiShoppingBag },
    ],
  },
  {
    title: 'ALL MAIL',
    folders: [
      { id: 'sent', label: 'Sent', icon: FiSend },
      { id: 'scheduled', label: 'Scheduled', icon: FiCalendar },
      { id: 'outbox', label: 'Outbox', icon: FiSend },
      { id: 'drafts', label: 'Drafts', icon: FiFileText },
      { id: 'all-mail', label: 'All mail', icon: FiArchive },
      { id: 'archive', label: 'Archive', icon: FiArchive },
      { id: 'spam', label: 'Spam', icon: FiShield },
      { id: 'trash', label: 'Trash', icon: FiTrash2 },
    ],
  },
  {
    title: 'MANAGE',
    folders: [{ id: 'subscriptions', label: 'Manage subscriptions', icon: FiMail }],
  },
];

function FolderLink({ folder, activeFolder, onSelect, count, unread }) {
  const Icon = folder.icon;
  return (
    <button
      className={`folder-link${activeFolder === folder.id ? ' active' : ''}`}
      onClick={() => onSelect(folder.id)}
      aria-current={activeFolder === folder.id ? 'page' : undefined}
    >
      <Icon className="folder-icon" />
      <span>{folder.label}</span>
      {count > 0 && <span className={`folder-count${unread ? ' has-unread' : ''}`}>{count}</span>}
    </button>
  );
}

export default function Sidebar({
  activeFolder,
  onSelect,
  counts,
  unreadCounts,
  onCompose,
  onCreateLabel,
  onUtility,
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  account,
}) {
  return (
    <>
      <button className={`sidebar-scrim${isOpen ? ' visible' : ''}`} aria-label="Close navigation" onClick={onClose} />
      <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <BrandMark />
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu"><FiX /></button>
        </div>
        <button className="compose-button" onClick={onCompose}>
          <FiEdit3 />
          <span>Compose</span>
          <span className="compose-shortcut">C</span>
        </button>
        <div className="sidebar-navigation">
          {sections.map((section) => (
            <div className="nav-section" key={section.title}>
              <p className="nav-label">{section.title}</p>
              <nav aria-label={section.title.toLowerCase()}>
                {section.folders.map((folder) => (
                  <FolderLink
                    key={folder.id}
                    folder={folder}
                    activeFolder={activeFolder}
                    onSelect={onSelect}
                    count={counts[folder.id] || 0}
                    unread={unreadCounts[folder.id] > 0}
                  />
                ))}
              </nav>
              {section.title === 'MANAGE' && (
                <button className="folder-link create-label-link" onClick={onCreateLabel}>
                  <FiPlus className="folder-icon" />
                  <span>Create label</span>
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button className="folder-link utility-link" onClick={() => onUtility('Settings')}><FiSettings className="folder-icon" /><span>Settings</span></button>
          <button className="folder-link utility-link" onClick={() => onUtility('Help & feedback')}><FiHelpCircle className="folder-icon" /><span>Help & feedback</span></button>
          <button className="theme-switch" onClick={onToggleTheme}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
            <span>{theme === 'dark' ? 'Light appearance' : 'Dark appearance'}</span>
            <FiChevronDown className="account-chevron" />
          </button>
          <div className="account-card">
            <div className="avatar avatar-profile">{(account?.name || 'Alex Morgan').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div className="account-info">
              <strong>{account?.name || 'Alex Morgan'}</strong>
              <span>{account?.email || 'alex.morgan@northstar.design'}</span>
            </div>
            <FiChevronDown className="account-chevron" />
          </div>
        </div>
      </aside>
    </>
  );
}
