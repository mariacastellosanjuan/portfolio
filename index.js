const pdf = 'document.pdf';

const pageNum = document.querySelector('#page_num');
const pageCount = document.querySelector('#page_count');
const currentPage = document.querySelector('#current_page');
const previousPage = document.querySelector('#prev_page');
const nextPage = document.querySelector('#next_page');
const zoomIn = document.querySelector('#zoom_in');
const zoomOut = document.querySelector('#zoom_out');

const initialState = {
    pdfDoc: null,
    currentPage: 1,
    pageCount: 0,
    zoom: 1,
};

// Load the document.
pdfjsLib.getDocument(pdf)
    .promise.then((data) => {
        initialState.pdfDoc = data;
        console.log('pdfDocument', initialState.pdfDoc);

        pageCount.textContent = initialState.pdfDoc.numPages;

        renderPage();
    })
    .catch((err) => {
        alert(err.message);
    });

// Render the page.
const renderPage = () => {
    // Load the first page.
    console.log(initialState.pdfDoc, 'pdfDoc');
    initialState.pdfDoc
        .getPage(initialState.currentPage)
        .then((page) => {
            console.log('page', page);

            const canvas = document.querySelector('#canvas');
            const ctx = canvas.getContext('2d');
            const viewport = page.getViewport({
                scale: initialState.zoom,
            });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render the PDF page into the canvas context.
            const renderCtx = {
                canvasContext: ctx,
                viewport: viewport,
            };

            page.render(renderCtx);

            pageNum.textContent = initialState.currentPage;
        });
};