// ✅ IMPORT FIRST — NO window.pdfjsLib
import * as pdfjsLib from './pdf.min.mjs';

// ✅ Correct worker setup for GitHub Pages
pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('./pdf.worker.min.mjs', import.meta.url).toString();

export async function loadFlipbook(folder) {
  console.log('Loading edition folder:', folder);

  const container = document.getElementById('flipbookContainer');
  container.innerHTML = '';

  let pageNumber = 1;

  while (true) {
    const padded = String(pageNumber).padStart(2, '0');
    const filePath = `${folder}/${padded} Gulberg Flash.pdf`;

    console.log('Trying:', filePath);

    try {
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
      pageNumber++;
    } catch (err) {
      console.log('No more pages at:', filePath);
      break;
    }
  }
}
