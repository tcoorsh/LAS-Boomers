import pdfjsLib from './pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

export async function loadFlipbook(folder) {
  const container = document.getElementById('flipbookContainer');
  container.innerHTML = '';

  let pageNumber = 1;

  while (true) {
    const padded = String(pageNumber).padStart(2, '0');
    const filePath = `${folder}/${padded} Gulberg Flash.pdf`;

    try {
      const pdf = await pdfjsLib.getDocument(filePath).promise;
      const pdfPage = await pdf.getPage(1);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const viewport = pdfPage.getViewport({ scale: 1.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await pdfPage.render({ canvasContext: ctx, viewport }).promise;
      container.appendChild(canvas);

      pageNumber++;
    } catch (err) {
      console.warn('Stopping at page', pageNumber);
      break;
    }
  }
}
