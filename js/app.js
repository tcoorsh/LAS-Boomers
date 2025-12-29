import { loadFlipbook } from './flipbook.js';

const editionSelect = document.getElementById('editionSelect');

editionSelect.addEventListener('change', () => {
  const edition = editionSelect.value;
  if (edition) {
    loadFlipbook(`editions/${edition}`);
  }
});
