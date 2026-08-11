/**
 * QR code generation from the website field.
 * Usage:
 *   CardQR.init({ fieldSelector: '[data-field="website"]', elementId: 'qrcode' });
 */
var CardQR = (function () {
    function init(opts) {
        var fieldEl = document.querySelector(opts.fieldSelector);
        var qrEl = document.getElementById(opts.elementId);

        function getUrl() {
            var text = fieldEl.textContent.trim();
            if (text && !/^https?:\/\//i.test(text)) {
                text = 'https://' + text;
            }
            return text;
        }

        var qrCode = new QRCode(qrEl, {
            text: getUrl(),
            width: 256,
            height: 256,
            correctLevel: QRCode.CorrectLevel.M
        });

        function update() {
            var url = getUrl();
            if (url) {
                qrCode.clear();
                qrCode.makeCode(url);
            }
        }

        fieldEl.addEventListener('input', update);

        return { update: update };
    }

    return { init: init };
})();
