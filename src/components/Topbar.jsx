import { useState } from 'react';
import { FiHelpCircle, FiLogOut, FiMenu, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi';

export default function Topbar({ query, onQueryChange, onMenu, theme, onToggleTheme, searchInput, account, onSignOut }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><FiMenu /></button>
      <div className="search-box">
        <FiSearch className="search-icon" />
        <input
          ref={searchInput}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search mail"
          aria-label="Search emails"
        />
        {query && <button className="search-clear" onClick={() => onQueryChange('')} aria-label="Clear search"><FiX /></button>}
        <kbd>⌘ K</kbd>
      </div>
      <div className="topbar-actions">
        <button className="icon-button topbar-theme" onClick={onToggleTheme} aria-label="Toggle color theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <button className="icon-button help-button" aria-label="Help"><FiHelpCircle /></button>
        <button className="profile-menu-trigger" onClick={() => setProfileOpen(!profileOpen)} aria-label="Open account menu" aria-expanded={profileOpen}>
          <span className="avatar avatar-profile topbar-avatar">{(account?.name || 'Alex Morgan').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
        </button>
        {profileOpen && (
          <div className="profile-menu">
            <div className="profile-menu-account"><strong>{account?.name || 'Alex Morgan'}</strong><span>{account?.email || 'alex.morgan@northstar.design'}</span></div>
            <button onClick={onSignOut}><FiLogOut /> Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
