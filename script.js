let pdf; // to store pdf data 
let canvas; // to render pdf
let isPageRendering; // to check if the pdf is currently rendering
let pageRenderingQueue = null; // to store next page number to render
let canvasContext; // context of canvas
let totalPages; // total  pages of pdf
let currentPageNum = 1;

window.addEventListener('load', function () {
    isPageRendering = false;
    pageRenderingQueue = null;
    canvas = document.getElementById('pdf_canvas');
    canvasContext = canvas.getContext('2d');

    initEvents();
    initPDFRenderer(); // render first page
});

function initPDFRenderer() {
    let url = 'portfolio.pdf';
    // const url = 'filepath.pdf'; // to load pdf from our machine
    let option = { url };

    pdfjsLib.getDocument(option)
        .promise
        .then(pdfData => {
            totalPages = pdfData.numPages; // total number of pages 
            let pagesCounter = document.getElementById('total_page_num'); // update total pages text
            pagesCounter.textContent = totalPages;
            // assigning read pdfContent to global variable
            pdf = pdfData;
            console.log(pdfData);
            renderPage(currentPageNum);
        });
}

function initEvents() {
    let prevPageBtn = document.getElementById('prev_page');
    let nextPageBtn = document.getElementById('next_page');
    let goToPage = document.getElementById('go_to_page');
    prevPageBtn.addEventListener('click', renderPreviousPage);
    nextPageBtn.addEventListener('click', renderNextPage);
    goToPage.addEventListener('click', goToPageNum);
}

function renderPage(pageNumToRender = 1) {
    isPageRendering = true;
    document.getElementById('current_page_num').textContent = pageNumToRender;
    // use getPage method

    pdf
        .getPage(pageNumToRender)
        .then(page => {
            const viewport = page.getViewport({ scale: 1 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            let renderCtx = { canvasContext, viewport };

            page
                .render(renderCtx)
                .promise
                .then(() => {
                    isPageRendering = false;
                    // this is to check if there is next page to be rendered in the queue
                    if (pageRenderingQueue !== null) {
                        renderPage(pageRenderingQueue);
                        pageRenderingQueue = null;
                    }
                });
        });
}

function renderPageQueue(pageNum) {
    if (pageRenderingQueue != null) {
        pageRenderingQueue = pageNum;
    } else {
        renderPage(pageNum);
    }
}

function renderPageQueue(pageNum) {
    if (pageRenderingQueue != null) {
        pageRenderingQueue = pageNum;
    } else {
        renderPage(pageNum);
    }
}

function renderNextPage(ev) {
    if (currentPageNum >= totalPages) {
        alert("This is the last page");
        return;
    }
    currentPageNum++;
    renderPageQueue(currentPageNum);
}
function renderPreviousPage(ev) {
    if (currentPageNum <= 1) {
        alert("This is the first page");
        return;
    }
    currentPageNum--;
    renderPageQueue(currentPageNum);
}

function goToPageNum(ev) {
    let numberInput = document.getElementById('page_num');
    let pageNumber = parseInt(numberInput.value);
    if (pageNumber) {
        if (pageNumber <= totalPages && pageNumber >= 1) {
            currentPageNum = pageNumber;
            numberInput.value = "";
            renderPageQueue(pageNumber);
            return;
        }
    }
    alert("Enter a valide page numer");
}