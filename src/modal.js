import { el, clear } from './dom.js';

export function createModal() {
    let isOpen = false;
    let onCloseCallback = null;

    const titleNode = el('h2', { className: 'modal__title' });

    const bodyNode = el('div', { class: 'modal_body' });

    const closeButton = el('button', {
        className: 'btn',
        type: 'button',
        textContent: 'Close',
        onclick: () => close(),
    });
    const actionsNode = el('div', { className: 'modal__actions' }, [closeButton]);

    const dialog = el(
    'div',
    {
      className: 'modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'modal-title',
      onClick: (event) => {       
        event.stopPropagation();
      },
    },
    [titleNode, bodyNode, actionsNode],
  );
  titleNode.id = 'modal-title';

  const overlay = el(
    'div',
    {
      className: 'modal-overlay',
      onClick: () => close(),
    },
    [dialog],
  );

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  function open(contentNodes = [], options = {}) {
    if (isOpen) return;

    const { title = '', actions = [], onClose = null } = options;
    
    clear(bodyNode);
    clear(actionsNode);

    titleNode.textContent = title;

    for (const node of contentNodes) {
      bodyNode.append(node);
    }

    for (const action of actions) {
      actionsNode.append(action);
    }
    actionsNode.append(closeButton);

    onCloseCallback = onClose;

    document.body.append(overlay);
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onKeyDown);

    isOpen = true;
 
    const firstFocusable = actionsNode.querySelector('button');
    if (firstFocusable) firstFocusable.focus();
  }

  function close() {
    if (!isOpen) return;

    document.removeEventListener('keydown', onKeyDown);
    document.body.classList.remove('modal-open');

    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    isOpen = false;

    const cb = onCloseCallback;
    onCloseCallback = null;
    if (cb) cb();
  }

  function isOpenFn() {
    return isOpen;
  }

  function setTitle(text) {
    titleNode.textContent = text;
  }

  return {
    open,
    close,
    isOpen: isOpenFn,
    setTitle,
  };

}