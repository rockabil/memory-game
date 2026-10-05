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

    function buildCardNode(card) {
        const img = el('img', {
            className: 'card__image',
            src: card.src,
            alt: card.alt,
            draggable: 'false',
        });

        const inner = el('div', { className: 'card__inner' }, [
            el('div', {
                className: 'card__face card__face--back',
                textContent: '?',
                'aria-hidden': 'true',
            }),
            el('div', { className: 'card__face card__face--front' }, [img]),
        ]);

        const node = el(
            'button', {
                className: 'card',
                type: 'button',
                dataset: { uid: String(card.uid) },
                'aria-label': 'Hidden card',
                onClick: () => handleCardClick(card.uid),
            },
            [inner],
        );

        return node;    
    }

     function updateCardView(view) {
        const { node, flipped, matched } = view;
        node.classList.toggle('is-flipped', flipped || matched);
        node.classList.toggle('is-matched', matched);

        if (matched) {
            node.disabled = true;
            node.setAttribute('aria-label', `Matched card: ${view.card.alt}`);
        } else if (flipped) {
            node.disabled = true;
            node.setAttribute('aria-label', `Open card: ${view.card.alt}`);
        } else {      
            node.disabled = locked || finished;
            node.setAttribute('aria-label', 'Hidden card');
        }
    }

    function refreshAllCards() {
        for (const view of cardViews.values()) {
            updateCardView(view);
        }
    }

    function emitUpdate() {
        onUpdate(getState());
    }
    function getState() {
        return {
            moves,
            pairsFound,
            totalPairs: TOTAL_PAIRS,
            finished,locked,
        };
    }

    function handleCardClick(uid) {
        if (finished || locked) return;

        const view = cardViews.get(uid);
        if (!view) return;
        if (view.matched || view.flipped) return;
        if (flippedUids.length >= 2) return;

        view.flipped = true;
        flippedUids.push(uid);
        updateCardView(view);

        if (flippedUids.length === 1) {
            emitUpdate();
            return;
        }

        moves += 1;
        const [firstUid, secondUid] = flippedUids;
        const first = cardViews.get(firstUid);
        const second = cardViews.get(secondUid);

        if (first.card.id === second.card.id) {
            first.matched = true;
            second.matched = true;
            flippedUids = [];
            pairsFound += 1;
            updateCardView(first);
            updateCardView(second);

            emitUpdate();

            if (pairsFound === TOTAL_PAIRS) {
                finished = true;
                for (const v of cardViews.values()) {
                    v.node.disabled = true;
                }
                onWin(moves);
            }
            return;
        }

        locked = true;
        refreshAllCards();
        emitUpdate();

         mismatchTimerId = window.setTimeout(() => {
            mismatchTimerId = null;
            first.flipped = false;
            second.flipped = false;
            flippedUids = [];
            locked = false;
            refreshAllCards();
            emitUpdate();
         }, MISMATCH_DELAY_MS);
    }

    function cancelMismatchTimer() {
        if (mismatchTimerId !== null) {
            clearTimeout(mismatchTimerId);
            mismatchTimerId = null;
        }
    }

    function start() {
        cancelMismatchTimer();

        deck = createShuffledDeck();
        flippedUids = [];
        moves = 0;
        pairsFound = 0;
        finished = false;
        locked = false;

        renderBoard();
        refreshAllCards();
        emitUpdate();
    }

    return {
        start,
        reset: start,
        getState
    };
}