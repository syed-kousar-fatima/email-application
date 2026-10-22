export function formatEmailDate(value) {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date);
  }
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);
  }
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

export function getEmailsForFolder(emails, folder, query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const inboxEmails = emails.filter((email) => email.folder === 'inbox' && !email.archived);

  return emails.filter((email) => {
    let matchesFolder;
    if (folder === 'starred') {
      matchesFolder = email.starred && !['trash', 'spam'].includes(email.folder) && !email.archived;
    } else if (folder === 'important') {
      matchesFolder = email.important && !['trash', 'spam'].includes(email.folder) && !email.archived;
    } else if (folder === 'purchases') {
      matchesFolder = email.category === 'purchases' && !['trash', 'spam'].includes(email.folder);
    } else if (folder === 'snoozed') {
      matchesFolder = Boolean(email.snoozed);
    } else if (['primary', 'promotions', 'social', 'updates'].includes(folder)) {
      matchesFolder = inboxEmails.includes(email)
        && (folder === 'primary'
          ? ['primary', undefined].includes(email.category)
          : email.category === folder);
    } else if (folder === 'all-mail') {
      matchesFolder = !['trash', 'spam'].includes(email.folder) && !email.archived;
    } else if (folder === 'subscriptions') {
      matchesFolder = Boolean(email.subscription) && !['trash', 'spam'].includes(email.folder);
    } else if (folder === 'archive') {
      matchesFolder = Boolean(email.archived);
    } else if (folder === 'inbox') {
      matchesFolder = email.folder === 'inbox' && !email.archived;
    } else {
      matchesFolder = email.folder === folder;
    }
    const matchesQuery = !normalizedQuery || [
      email.sender,
      email.email,
      email.subject,
      email.preview,
      ...(email.labels || []),
    ].join(' ').toLowerCase().includes(normalizedQuery);
    return matchesFolder && matchesQuery;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getEmailCounts(emails) {
  const inbox = emails.filter((email) => email.folder === 'inbox' && !email.archived);
  return {
    inbox: inbox.length,
    primary: inbox.filter((email) => !email.category || email.category === 'primary').length,
    promotions: inbox.filter((email) => email.category === 'promotions').length,
    social: inbox.filter((email) => email.category === 'social').length,
    updates: inbox.filter((email) => email.category === 'updates').length,
    starred: emails.filter((email) => email.starred && !['trash', 'spam'].includes(email.folder) && !email.archived).length,
    snoozed: emails.filter((email) => email.snoozed).length,
    important: emails.filter((email) => email.important && !['trash', 'spam'].includes(email.folder)).length,
    purchases: emails.filter((email) => email.category === 'purchases' && !['trash', 'spam'].includes(email.folder)).length,
    sent: emails.filter((email) => email.folder === 'sent').length,
    scheduled: emails.filter((email) => email.folder === 'scheduled').length,
    outbox: emails.filter((email) => email.folder === 'outbox').length,
    drafts: emails.filter((email) => email.folder === 'drafts').length,
    'all-mail': emails.filter((email) => !['trash', 'spam'].includes(email.folder) && !email.archived).length,
    archive: emails.filter((email) => email.archived).length,
    spam: emails.filter((email) => email.folder === 'spam').length,
    trash: emails.filter((email) => email.folder === 'trash').length,
    subscriptions: emails.filter((email) => email.subscription && !['trash', 'spam'].includes(email.folder)).length,
  };
}

export function getUnreadCounts(emails) {
  const inbox = emails.filter((email) => email.folder === 'inbox' && !email.archived && !email.read);
  return {
    inbox: inbox.length,
    primary: inbox.filter((email) => !email.category || email.category === 'primary').length,
    promotions: inbox.filter((email) => email.category === 'promotions').length,
    social: inbox.filter((email) => email.category === 'social').length,
    updates: inbox.filter((email) => email.category === 'updates').length,
  };
}
