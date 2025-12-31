const pdfjsLib = window.pdfjsLib;

if (!pdfjsLib) throw new Error('PDF.js failed to load');

// Use the CDN worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

const editionSelect = document.getElementById('editionSelect');
const container = document.getElementById('flipbookContainer');

editionSelect.addEventListener('change', () => {
  const edition = editionSelect.value;
  if (!edition) return;

  loadFlipbook(`editions/${edition}`);
});

async function loadFlipbook(folder) {
  container.innerHTML = '';
  console.log('Loading edition folder:', folder);

  // Optional: use manifest.json if present
  let manifest;
  try {
    const resp = await fetch(`${folder}/manifest.json`);
    manifest = await resp.json();
  } catch {
    manifest = null;
  }

  const pages = manifest?.pages || [];

  // If no manifest, fallback: find pages sequentially
  if (!pages.length) {
    let pageNumber = 1;
    while (true) {
      const padded = String(pageNumber).padStart(2, '0');
      const filePath = `${folder}/${padded} Gulberg Flash.pdf`;
      try {
        await renderPDF(filePath);
        pageNumber++;
      } catch {
        break;
      }
    }
    return;
  }

  // Render pages from manifest
  for (const pageFile of pages) {
    const filePath = `${folder}/${pageFile}`;
    try {
      await renderPDF(filePath);
    } catch {
      console.warn('Failed to render', filePath);
    }
  }
}

async function renderPDF(filePath) {
  console.log('Trying:', filePath);
  const pdf = await pdfjsLib.getDocument(filePath).promise;
  const page = await pdf.getPage(1);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const viewport = page.getViewport({ scale: 1.5 });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport }).promise;
  container.appendChild(canvas);

  console.log('Rendered:', filePath);
}
