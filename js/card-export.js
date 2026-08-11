/**
 * Card image export via html2canvas.
 * Usage:
 *   CardExport.init({ frontId: 'card-front', backId: 'card-back', btnId: 'download-btn' });
 */
var CardExport = (function () {
    var DPI_SCALE = 6;

    function downloadCanvas(canvas, filename) {
        var link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function captureElement(el) {
        return html2canvas(el, {
            scale: DPI_SCALE,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });
    }

    function init(opts) {
        var btn = document.getElementById(opts.btnId);
        var front = document.getElementById(opts.frontId);
        var back = document.getElementById(opts.backId);

        btn.addEventListener('click', function () {
            btn.disabled = true;
            btn.textContent = 'Generating\u2026';

            captureElement(front).then(function (frontCanvas) {
                downloadCanvas(frontCanvas, 'card-front.png');
                return captureElement(back);
            }).then(function (backCanvas) {
                downloadCanvas(backCanvas, 'card-back.png');
                btn.disabled = false;
                btn.textContent = 'Download Print Images';
            }).catch(function (err) {
                console.error('Image capture failed:', err);
                alert('Failed to generate images. Check the console for details.');
                btn.disabled = false;
                btn.textContent = 'Download Print Images';
            });
        });

        // Intercept Ctrl+P / Cmd+P
        window.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                btn.click();
            }
        });
    }

    return { init: init };
})();
