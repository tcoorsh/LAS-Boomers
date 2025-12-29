import * as pdfjsLib from './pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

export async function loadFlipbook(folder) {
  const container = document.getElementById('flipbookContainer');
  container.innerHTML = '';

  let page = 1;
  while (true) {
    try {
      const pdf = await pdfjsLib.getDocument(`${folder}/page${page}.pdf`).promise;
      const pdfPage = await pdf.getPage(1);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const viewport = pdfPage.getViewport({ scale: 1.4 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await pdfPage.render({ canvasContext: context, viewport }).promise;
      container.appendChild(canvas);

      page++;
    } catch {
      break;
    }
  }
}
