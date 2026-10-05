import { el, clear } from './dom.js';
import { createGame } from './game.js';
import { createModal } from './modal.js';
import {
  getLeaderboard,
  addResult,
  formatDate,
  todayIsoDate,
} from './leaderboard.js';

const newGameButton = el('button', {
  className: 'btn btn--primary',
  type: 'button',
  textContent: 'New game',
  onClick: () => startNewGame(),
});

const leaderboardButton = el('button', {
  className: 'btn',
  type: 'button',
  textContent: 'Leaderboard',
  onClick: () => openLeaderboardModal(),
});

const header = el('header', { className: 'header' }, [
  el('h1', { className: 'header__title', textContent: 'Castles of Belarus' }),
  el('div', { className: 'header__buttons' }, [newGameButton, leaderboardButton]),
]);

const movesValue = el('span', { className: 'stats__value', textContent: '0' });
const pairsValue = el('span', { className: 'stats__value', textContent: '0 / 8' });

const movesItem = el('div', { className: 'stats__item' }, [
  'Moves: ',
  movesValue,
]);

const pairsItem = el('div', { className: 'stats__item' }, [
  'Pairs: ',
  pairsValue,
]);

const stats = el('div', { className: 'stats' }, [movesItem, pairsItem]);

const board = el('div', { className: 'board' });

const app = el('div', { className: 'app' }, [header, stats, board]);

document.body.append(app);

const modal = createModal();

const game = createGame({
  container: board,
  onUpdate: (state) => {
    movesValue.textContent = String(state.moves);
    pairsValue.textContent = `${state.pairsFound} / ${state.totalPairs}`;
  },
  onWin: (moves) => {    
    addResult({ moves, date: todayIsoDate() });
    openWinModal(moves);
  },
});

function startNewGame() {  
  if (modal.isOpen()) {
    modal.close();
  }  
  game.start();
}

function openWinModal(moves) {
  const newGameInModal = el('button', {
    className: 'btn btn--primary',
    type: 'button',
    textContent: 'New game',
    onClick: () => startNewGame(),
  });

  const message = el('p', {
    textContent: `You won in ${moves} ${moves === 1 ? 'move' : 'moves'}!`,
  });

  modal.open([message], {
    title: 'You win!',
    actions: [newGameInModal],
  });
}

function openLeaderboardModal() {
  const content = buildLeaderboardContent();
  modal.open([content], { title: 'Leaderboard' });
}

function buildLeaderboardContent() {
  const entries = getLeaderboard();

  if (entries.length === 0) {
    return el('p', {
      className: 'leaderboard__empty',
      textContent: 'No results yet',
    });
  }

  const headRow = el('tr', {}, [
    el('th', { textContent: '#' }),
    el('th', { textContent: 'Moves' }),
    el('th', { textContent: 'Date' }),
  ]);

  const thead = el('thead', {}, [headRow]);

  const tbody = el('tbody');

  entries.forEach((entry, index) => {
    const row = el('tr', {}, [
      el('td', { textContent: String(index + 1) }),
      el('td', { textContent: String(entry.moves) }),
      el('td', { textContent: formatDate(entry.date) }),
    ]);
    tbody.append(row);
  });

  const table = el('table', { className: 'leaderboard' }, [thead, tbody]);
  return table;
}

game.start();