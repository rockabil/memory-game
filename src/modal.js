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

}