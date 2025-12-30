const pdfjsLib = window.pdfjsLib;

console.log('Loading folder:', folder);

for (const file of pdfFiles) {
    const filePath = `${folder}/${file}`;
    console.log('Attempting to load PDF:', filePath);

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

        console.log('Rendered PDF:', file);
    } catch (err) {
        console.error('Failed to load PDF:', filePath, err);
    }
}

if (!pdfjsLib) {
  throw new Error('PDF.js failed to load');
}

// Set PDF worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';

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
      break; // stop when no more PDFs
    }
  }
}
