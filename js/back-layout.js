/**
 * Back layout toggle + graphic upload (for troop cards with multiple layout options).
 * Usage:
 *   BackLayout.init({ layoutKey: '...', graphicKey: '...', graphicInputId: '...',
 *     layouts: { banner: el, frame: el, collage: el } });
 */
var BackLayout = (function () {
    function init(opts) {
        var layoutRadios = document.querySelectorAll('input[name="back-layout"]');
        var layouts = opts.layouts;
        var graphicImgs = document.querySelectorAll('.back-graphic');

        function showLayout(name) {
            Object.keys(layouts).forEach(function (k) {
                layouts[k].style.display = k === name ? 'flex' : 'none';
            });
        }

        function loadLayout() {
            var saved = localStorage.getItem(opts.layoutKey) || Object.keys(layouts)[0];
            showLayout(saved);
            layoutRadios.forEach(function (r) { r.checked = r.value === saved; });
        }

        layoutRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                showLayout(this.value);
                localStorage.setItem(opts.layoutKey, this.value);
            });
        });

        // Graphic upload
        function setGraphic(dataUrl) {
            graphicImgs.forEach(function (img) { img.src = dataUrl; });
        }

        function loadGraphic() {
            var saved = localStorage.getItem(opts.graphicKey);
            if (saved) setGraphic(saved);
        }

        document.getElementById(opts.graphicInputId).addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataUrl = e.target.result;
                setGraphic(dataUrl);
                try { localStorage.setItem(opts.graphicKey, dataUrl); } catch (ex) { }
            };
            reader.readAsDataURL(file);
        });

        loadLayout();
        loadGraphic();
    }

    return { init: init };
})();
