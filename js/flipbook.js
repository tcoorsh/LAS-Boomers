const pdfjsLib = window.pdfjsLib;

if (!pdfjsLib) {
  throw new Error('PDF.js failed to load');
}

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

export async function loadFlipbook(folder) {
  const container = document.getElementById('flipbookContainer');
  container.innerHTML = '';

  let pageNumber = 1;

  while (true) {
    const padded = String(pageNumber).padStart(2, '0');
    const filePath = `${folder}/${padded} Gulberg Flash.pdf`;

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

      pageNumber++;
    } catch {
      break;
    }
  }
}
