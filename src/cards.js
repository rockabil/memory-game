export const CARD_DEFINITIONS = [
  { id: 'mir',        src: 'assets/mir.webp',        alt: 'Mir Castle' },
  { id: 'niasviz',    src: 'assets/niasviz.webp',    alt: 'Niasviz Palace' },
  { id: 'kosava',     src: 'assets/kosava.webp',     alt: 'Kosava Palace' },
  { id: 'navahradak', src: 'assets/navahradak.webp', alt: 'Navahradak Castle' },
  { id: 'lida',       src: 'assets/lida.webp',       alt: 'Lida Castle' },
  { id: 'harodnia',   src: 'assets/harodnia.webp',   alt: 'Harodnia Old Castle' },
  { id: 'halsany',    src: 'assets/halsany.webp',    alt: 'Halshany Castle' },
  { id: 'kamianiec',  src: 'assets/kamianiec.webp',  alt: 'Kamianiec Tower' },
];

export function createDeck() {
  const deck = [];
  let uid = 0;

  for (const def of CARD_DEFINITIONS) {
    deck.push({ uid: uid++, ...def });
    deck.push({ uid: uid++, ...def });
  }

  return deck;
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function createShuffledDeck() {
  return shuffle(createDeck());
}