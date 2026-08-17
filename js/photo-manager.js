/**
 * Photo gallery, slot assignment, and pan/zoom/rotate for troop back card.
 * Usage:
 *   var pm = PhotoManager.init({ ... });
 *   // call pm.reset() from the reset button handler
 */
var PhotoManager = (function () {
    function init(opts) {
        var stockPhotos = opts.stockPhotos || [];
        var slotCounts = opts.slotCounts; // { banner: 1, frame: 4, collage: 3 }
        var selectedPhotosKey = opts.selectedPhotosKey;
        var customPhotosKey = opts.customPhotosKey;
        var transformsKey = opts.transformsKey;
        var galleryEl = document.getElementById(opts.galleryId);
        var hintEl = document.getElementById(opts.hintId);
        var uploadInput = document.getElementById(opts.uploadInputId);
        var layoutRadios = document.querySelectorAll(opts.layoutRadioSelector);

        // Per-layout photo selections: { banner: [...], frame: [...], collage: [...] }
        var selectedByLayout = {};
        Object.keys(slotCounts).forEach(function (k) { selectedByLayout[k] = []; });
        var photoTransforms = {};

        function getSelectedPhotos() {
            return selectedByLayout[getCurrentLayout()];
        }
        function setSelectedPhotos(arr) {
            selectedByLayout[getCurrentLayout()] = arr;
        }

        function getCurrentLayout() {
            var checked = document.querySelector(opts.layoutRadioSelector + ':checked');
            return checked ? checked.value : Object.keys(slotCounts)[0];
        }

        function getMaxPhotos() {
            return slotCounts[getCurrentLayout()];
        }

        function updateHint() {
            hintEl.textContent = '(' + getSelectedPhotos().length + '/' + getMaxPhotos() + ')';
        }

        // --- Transforms ---

        function loadTransforms() {
            try {
                var saved = JSON.parse(localStorage.getItem(transformsKey) || '{}');
                if (saved) photoTransforms = saved;
            } catch (e) { }
        }

        function saveTransforms() {
            try { localStorage.setItem(transformsKey, JSON.stringify(photoTransforms)); } catch (e) { }
        }

        function getTransform(slotName) {
            return photoTransforms[slotName] || { scale: 1, x: 0, y: 0, rotate: 0 };
        }

        // --- Image cover sizing ---

        function sizeImageToCover(img, slot) {
            var sw = slot.clientWidth;
            var sh = slot.clientHeight;
            var nw = img.naturalWidth;
            var nh = img.naturalHeight;
            if (!nw || !nh || !sw || !sh) return;
            var ratio = Math.max(sw / nw, sh / nh);
            var w = nw * ratio;
            var h = nh * ratio;
            img.style.width = w + 'px';
            img.style.height = h + 'px';
            img.style.left = (sw - w) / 2 + 'px';
            img.style.top = (sh - h) / 2 + 'px';
        }

        function applyTransform(img, t) {
            var r = t.rotate || 0;
            img.style.transform = 'translate(' + t.x + 'px, ' + t.y + 'px) scale(' + t.scale + ') rotate(' + r + 'deg)';
        }

        // --- Pan/Zoom/Rotate ---

        function setupPanZoom(slot) {
            var img = slot.querySelector('img');
            if (!img) return;
            var slotName = slot.dataset.slot;

            function initSize() {
                sizeImageToCover(img, slot);
                applyTransform(img, getTransform(slotName));
            }

            if (img.naturalWidth) {
                initSize();
            }
            img.addEventListener('load', initSize);

            slot.addEventListener('wheel', function (e) {
                e.preventDefault();
                var img = slot.querySelector('img');
                if (!img) return;
                var t = getTransform(slotName);
                if (e.shiftKey) {
                    var scrollDelta = e.deltaX || e.deltaY;
                    var rDelta = scrollDelta > 0 ? 5 : -5;
                    t.rotate = (t.rotate || 0) + rDelta;
                } else {
                    var delta = e.deltaY > 0 ? -0.1 : 0.1;
                    t.scale = Math.max(0.5, Math.min(5, t.scale + delta));
                }
                photoTransforms[slotName] = t;
                applyTransform(img, t);
                saveTransforms();
            }, { passive: false });

            var dragging = false;
            var startX, startY, startTx, startTy;

            slot.addEventListener('mousedown', function (e) {
                var img = slot.querySelector('img');
                if (!img) return;
                e.preventDefault();
                dragging = true;
                var t = getTransform(slotName);
                startX = e.clientX;
                startY = e.clientY;
                startTx = t.x;
                startTy = t.y;
                slot.style.cursor = 'grabbing';
            });

            window.addEventListener('mousemove', function (e) {
                if (!dragging) return;
                var img = slot.querySelector('img');
                if (!img) return;
                var t = getTransform(slotName);
                t.x = startTx + (e.clientX - startX);
                t.y = startTy + (e.clientY - startY);
                photoTransforms[slotName] = t;
                applyTransform(img, t);
            });

            window.addEventListener('mouseup', function () {
                if (!dragging) return;
                dragging = false;
                slot.style.cursor = '';
                saveTransforms();
            });

            slot.addEventListener('dblclick', function (e) {
                e.preventDefault();
                photoTransforms[slotName] = { scale: 1, x: 0, y: 0, rotate: 0 };
                var img = slot.querySelector('img');
                if (img) applyTransform(img, photoTransforms[slotName]);
                saveTransforms();
            });
        }

        // --- Slot assignment ---

        function applyPhotosToSlots() {
            var layout = getCurrentLayout();
            var prefix = layout + '-';
            document.querySelectorAll('.back-photo-slot').forEach(function (slot) {
                if (slot.dataset.slot.indexOf(prefix) !== 0) return;
                var idx = parseInt(slot.dataset.slot.replace(prefix, ''), 10);
                var img = slot.querySelector('img');
                var placeholder = slot.querySelector('.photo-placeholder');
                var sel = getSelectedPhotos();
                if (idx < sel.length) {
                    if (!img) {
                        if (placeholder) placeholder.style.display = 'none';
                        img = document.createElement('img');
                        slot.appendChild(img);
                        setupPanZoom(slot);
                    }
                    img.src = sel[idx];
                } else {
                    if (img) { img.remove(); }
                    if (placeholder) placeholder.style.display = '';
                }
            });
            try { localStorage.setItem(selectedPhotosKey, JSON.stringify(selectedByLayout)); } catch (ex) { }
        }

        // --- Gallery ---

        function renderGallery() {
            galleryEl.innerHTML = '';
            var allPhotos = stockPhotos.slice();
            var custom = [];
            try { custom = JSON.parse(localStorage.getItem(customPhotosKey) || '[]'); } catch (e) { }
            allPhotos = allPhotos.concat(custom);

            allPhotos.forEach(function (src) {
                var thumb = document.createElement('img');
                thumb.className = 'photo-gallery-thumb';
                thumb.src = src;
                thumb.alt = 'Photo';
                var sel = getSelectedPhotos();
                var idx = sel.indexOf(src);
                if (idx !== -1) {
                    thumb.classList.add('selected');
                    thumb.title = 'Selected #' + (idx + 1);
                }
                thumb.addEventListener('click', function () {
                    var sel = getSelectedPhotos();
                    var i = sel.indexOf(src);
                    if (i !== -1) {
                        sel.splice(i, 1);
                    } else {
                        if (sel.length >= getMaxPhotos()) {
                            sel.shift();
                        }
                        sel.push(src);
                    }
                    renderGallery();
                    applyPhotosToSlots();
                    updateHint();
                });
                galleryEl.appendChild(thumb);
            });
        }

        // --- Upload ---

        uploadInput.addEventListener('change', function () {
            var files = this.files;
            if (!files.length) return;
            var custom = [];
            try { custom = JSON.parse(localStorage.getItem(customPhotosKey) || '[]'); } catch (e) { }
            var loaded = 0;
            Array.from(files).forEach(function (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    custom.push(e.target.result);
                    loaded++;
                    if (loaded === files.length) {
                        try { localStorage.setItem(customPhotosKey, JSON.stringify(custom)); } catch (ex) { }
                        renderGallery();
                    }
                };
                reader.readAsDataURL(file);
            });
            this.value = '';
        });

        // --- URL add ---

        var urlInput = opts.urlInputId ? document.getElementById(opts.urlInputId) : null;
        var urlBtn = opts.urlBtnId ? document.getElementById(opts.urlBtnId) : null;

        function addPhotoUrl() {
            var url = urlInput.value.trim();
            if (!url) return;
            var custom = [];
            try { custom = JSON.parse(localStorage.getItem(customPhotosKey) || '[]'); } catch (e) { }
            if (custom.indexOf(url) === -1 && stockPhotos.indexOf(url) === -1) {
                custom.push(url);
                try { localStorage.setItem(customPhotosKey, JSON.stringify(custom)); } catch (ex) { }
            }
            urlInput.value = '';
            renderGallery();
        }

        if (urlBtn) {
            urlBtn.addEventListener('click', addPhotoUrl);
        }
        if (urlInput) {
            urlInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addPhotoUrl();
                }
            });
        }

        // --- Layout change ---

        layoutRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                applyPhotosToSlots();
                renderGallery();
                updateHint();
            });
        });

        // --- Load ---

        function loadPhotos() {
            try {
                var saved = JSON.parse(localStorage.getItem(selectedPhotosKey) || '{}');
                if (Array.isArray(saved)) {
                    // Migrate old flat array format: assign to current layout
                    selectedByLayout[getCurrentLayout()] = saved;
                } else if (saved && typeof saved === 'object') {
                    Object.keys(saved).forEach(function (k) {
                        if (selectedByLayout.hasOwnProperty(k)) {
                            selectedByLayout[k] = saved[k];
                        }
                    });
                }
            } catch (e) { }
            renderGallery();
            applyPhotosToSlots();
            updateHint();
        }

        // --- Reset ---

        function reset() {
            Object.keys(selectedByLayout).forEach(function (k) { selectedByLayout[k] = []; });
            photoTransforms = {};
            applyPhotosToSlots();
            renderGallery();
            updateHint();
            saveTransforms();
        }

        // --- URL serialization ---

        function getExtraParams() {
            var custom = [];
            try { custom = JSON.parse(localStorage.getItem(customPhotosKey) || '[]'); } catch (e) { }
            // Only include URL-based photos (not data: URIs which are too long)
            var urls = custom.filter(function (s) { return s.indexOf('data:') !== 0; });
            var params = {};
            if (urls.length) params._photos = JSON.stringify(urls);
            return params;
        }

        function loadFromParams(urlParams) {
            if (urlParams.has('_photos')) {
                try {
                    var urls = JSON.parse(urlParams.get('_photos'));
                    if (Array.isArray(urls) && urls.length) {
                        var custom = [];
                        try { custom = JSON.parse(localStorage.getItem(customPhotosKey) || '[]'); } catch (e) { }
                        urls.forEach(function (u) {
                            if (custom.indexOf(u) === -1) custom.push(u);
                        });
                        try { localStorage.setItem(customPhotosKey, JSON.stringify(custom)); } catch (ex) { }
                    }
                } catch (e) { }
            }
        }

        // --- Init ---

        loadTransforms();
        loadPhotos();

        return { reset: reset, getExtraParams: getExtraParams, loadFromParams: loadFromParams };
    }

    return { init: init };
})();
