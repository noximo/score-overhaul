function initRoomNavigation() {
  const isRoom = /room|inbox|user/.test(window.location.href);
  document.querySelector("meta[name='theme-color']")?.setAttribute('content', '#94ada5');

  if (isRoom) {
    const roomName = document.querySelector('.room-name');
    if (roomName) window.scrollTo({ top: roomName.offsetTop, behavior: 'auto' });
    document.getElementById('content').insertAdjacentHTML('beforeend', '<div id="home"><a href="/">⌂</a></div>');
  }
}

function initNeverVisitedRooms() {
  const isRoom = /room|inbox|user/.test(window.location.href);
  if (isRoom) return;

  setTimeout(() => window.location.reload(), 60000);
  const timeNow = () => {
    const date = new Date();
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  };
  document.getElementById('content').insertAdjacentHTML('beforeend', `<span style="float: right;">last refresh: <b>${timeNow()}</b></span>`);

  const inboxNewMessages = document.querySelector('span.inbox-new-messages');
  if (inboxNewMessages?.textContent !== '0') {
    inboxNewMessages.classList.add('new');
  }

  const secondTable = document.querySelector('.room-list:last-of-type');
  if (secondTable) {
    secondTable.insertAdjacentHTML('afterend', "<hr><table id='thirdTable' class='room-list hidden-table'></table>");
    const thirdTable = document.getElementById('thirdTable');
    thirdTable.insertAdjacentHTML('afterend', "<hr><table id='fourthTable' class='room-list hidden-table'></table>");

    let totalUnread = 0;
    document.querySelectorAll('.unread .post-count').forEach(e => {
      const count = e.textContent.trim();
      const intCount = parseInt(count);
      const row = e.parentElement.parentElement;

      if (count != intCount && intCount > 0) {
        row.classList.add('really-unread');
        e.parentElement.previousElementSibling?.querySelector('a')?.prepend(`${intCount}|`);
        totalUnread++;
      }

      if (parseInt(count) == count) {
        row.classList.add('never-read');
        if (thirdTable) thirdTable.appendChild(row);
      }
    });

    document.title = `(${totalUnread}) Score Phorum v4.0`;
  }
}

function initRecentlyVisitedRooms() {
  const isRoom = /room|inbox|user/.test(window.location.href);
  if (isRoom) return;

  const timeNow = () => {
    const date = new Date();
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  };

  const updateVisited = () => {
    const visited = JSON.parse(localStorage.getItem('visited')) || [];
    const fourthTable = document.getElementById('fourthTable');
    if (fourthTable) fourthTable.innerHTML = visited.join('');
  };

  updateVisited();

  document.querySelectorAll('.room-list a').forEach(link => {
    link.addEventListener('mousedown', () => {
      const visited = JSON.parse(localStorage.getItem('visited')) || [];
      const row = link.closest('tr');
      if (row) {
        const clone = row.cloneNode(true);
        clone.className = 'last-visited';
        const timeEl = clone.querySelector('.last-message-time');
        if (timeEl) timeEl.textContent = `| ${timeNow()}`;
        visited.unshift(clone.outerHTML);
        visited.length = Math.min(5, visited.length);
        localStorage.setItem('visited', JSON.stringify(visited));
        updateVisited();
      }
    });
  });
}

function initHideUsers() {
 const hideUsers = ['ms.garrett'];
  const hideMessage = (message) => {
    if (message.classList.contains('messageHidden')) return;
    message.classList.add('messageHidden');
    message.querySelectorAll('[class^=level]').forEach(el => {
      el.style.cssText = 'top:0;position:relative;';
    });
    message.querySelectorAll('.send-reply, .text, [class^=level]').forEach(el => {
      el.style.display = 'none';
    });

    const toggle = document.createElement('div');
    toggle.className = 'toggleMessage';
    toggle.textContent = '👁';
    toggle.addEventListener('click', () => {
      message.querySelectorAll('.send-reply, .text, [class^=level]').forEach(el => {
        el.style.display = el.style.display === 'none' ? '' : 'none';
      });
      message.classList.toggle('messageOffset');
      message.classList.toggle('messageHidden');
      toggle.classList.toggle('toggleOffset');
    });

    const avatar = message.querySelector('.avatar');
    if (avatar) avatar.insertAdjacentElement('afterbegin', toggle);
  };

  hideUsers.forEach(user => {
    document.querySelectorAll(`.message .recipient`).forEach(recipient => {
      if (recipient.textContent.includes(user)) {
        hideMessage(recipient.closest('.message'));
      }
    });
    document.querySelectorAll(`.message[data-author="${user}"]`).forEach(msg => {
      hideMessage(msg);
    });
  });
}

function initMediaEmbeds() {
  const isMobile = Math.min(window.screen.width, window.screen.height) < 768 || /Mobi/.test(navigator.userAgent);
  if (isMobile) return;

  document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach((link) => {
    const url = new URL(link.href);
    let id;
    let isShort = false;

    if (link.href.includes('/shorts/')) {
      id = url.pathname.split('/shorts/')[1]?.split('?')[0];
      isShort = true;
    } else if (link.href.includes('youtube.com')) {
      id = url.searchParams.get('v');
    } else if (link.href.includes('youtu.be')) {
      id = url.pathname.split('/').pop()?.split('?')[0];
    }

    if (id) {
      const si = url.searchParams.get('si');
      const iframe = document.createElement('iframe');
      iframe.width = isShort ? '280' : '280';
      iframe.height = isShort ? '498' : '158';
      iframe.src = si ? `https://www.youtube.com/embed/${id}?si=${si}` : `https://www.youtube.com/embed/${id}`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      link.replaceWith(iframe);
    }
  });
}

function initFormRestructure() {
  const toInboxCheckbox = document.getElementById('id_to_inbox');
  const recipientInput = document.getElementById('id_recipient');

  if (toInboxCheckbox && recipientInput) {
    const inboxLabel = document.querySelector('label[for="id_to_inbox"]');
    const labelText = inboxLabel?.textContent.trim() || 'To inbox';

    toInboxCheckbox.title = labelText;
    inboxLabel?.remove();

    const recipientP = recipientInput.closest('p');
    if (recipientP) {
      recipientP.insertAdjacentElement('beforeend', toInboxCheckbox);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initRoomNavigation();
  initNeverVisitedRooms();
  initRecentlyVisitedRooms();
  initHideUsers();
  initMediaEmbeds();
  initFormRestructure();
});
