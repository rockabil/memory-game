# Memory Game

A classic memory (pair-matching) game built with vanilla JavaScript, HTML, and CSS.
The player flips cards two at a time and tries to find all 8 matching pairs in as
few moves as possible. Best results are stored locally and shown in a leaderboard.

Live demo: _добавьте ссылку на деплой_

---

## Features

- **16 cards, 8 pairs** — eight photos of Belarusian castles and landmarks,
  each appearing twice.
- **Random shuffle** on every page load and every new game (Fisher–Yates).
- **Move counter and pairs counter**, updated live.
- **Mismatched pair lock** — while a wrong pair is shown (~1 second), other
  cards cannot be clicked.
- **Win modal** with the final number of moves and buttons to start a new game
  or close the dialog.
- **Leaderboard modal** with the top-10 results, stored in `localStorage` and
  available after page reload.
- **New game** works at any time, including during a pending mismatch timer —
  the timer is cancelled and the board is reshuffled immediately.
- **Accessible**: cards and buttons have `aria-label`s, modal dialogs are
  keyboard-friendly (Escape to close), and page scroll is locked while a modal
  is open.
- **No frameworks, no libraries** — pure ES modules.

---

## Tech stack

- HTML5 (`<body>` contains only a `<script type="module">` tag)
- CSS3 (custom properties, grid, 3D transforms for card flip)
- JavaScript (ES modules, `document.createElement` for all markup)
- `localStorage` for the leaderboard

No build step, no bundler, no dependencies.

---

## How to play
1. The game starts automatically when the page loads. All 16 cards are face
down and shuffled.  

2. Click a card to flip it. Click a second card.  
 - If the two images match, both cards stay open. The pairs counter
 increases by 1.  

 - If they do not match, both cards flip back after about one second. During that time no other card can be clicked.  

3. One move is counted each time the second card of a pair is flipped,
regardless of whether the pair matched.  

4. Find all 8 pairs to win. A modal shows your final move count.  

5. Your result is saved automatically and appears in the leaderboard.  