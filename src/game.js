import { el } from './dom.js';
import { createShuffledDeck } from './cards.js';

const MISMATCH_DELAY_MS = 1000;
const TOTAL_PAIRS = 8;

export function createGame({ container, onWin, onUpdate }) {
    let deck = [];
    let cardViews = new Map();

    let flippedUids = [];

    let moves = 0;
    let pairsFound = 0;
    let finished = false;
    let locked = false;

    let mismatchTimerId = null;

    function renderBoard() {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        cardViews.clear();

        const fragment = document.createDocumentFragment();

        for (const card of deck) {
            const node = buildCardNode(card);
            const view = { card, node, flipped: false, matched: false };
            cardViews.set(card.uid, view);
            fragment.append(node);
        }

        container.append(fragment);
    }

}