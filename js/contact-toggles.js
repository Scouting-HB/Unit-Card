/**
 * Contact field visibility toggles.
 * Adds checkboxes to show/hide website, socials, and email fields.
 * Persists state to localStorage and syncs to URL params.
 *
 * Usage:
 *   ContactToggles.init({
 *     storageKey: 'pack-card-contact-toggles',
 *     containerId: 'contact-toggles',
 *     fields: ['website', 'socials', 'email'],
 *     mirrors: true  // if alt layout mirrors exist
 *   });
 */
var ContactToggles = (function () {
    function init(opts) {
        var storageKey = opts.storageKey;
        var container = document.getElementById(opts.containerId);
        var fieldNames = opts.fields || ['website', 'socials', 'email'];
        var hasMirrors = opts.mirrors || false;

        var labels = { website: 'Web', socials: 'Facebook', email: 'Email' };

        // Load saved state
        var state = {};
        try {
            var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
            if (saved) state = saved;
        } catch (e) { }

        // Default all to visible
        fieldNames.forEach(function (name) {
            if (state[name] === undefined) state[name] = true;
        });

        function save() {
            try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (e) { }
        }

        function applyVisibility() {
            fieldNames.forEach(function (name) {
                var field = document.querySelector('[data-field="' + name + '"]');
                if (field) {
                    var wrapper = field.closest('.contact');
                    if (wrapper) {
                        wrapper.style.display = state[name] ? '' : 'none';
                    }
                }
                if (hasMirrors) {
                    var mirror = document.querySelector('[data-mirror="' + name + '"]');
                    if (mirror) {
                        var mWrapper = mirror.closest('.contact');
                        if (mWrapper) {
                            mWrapper.style.display = state[name] ? '' : 'none';
                        }
                    }
                }
            });
        }

        // Build toggle UI
        var checkboxes = {};
        fieldNames.forEach(function (name) {
            var label = document.createElement('label');
            label.className = 'contact-toggle';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = state[name];
            cb.addEventListener('change', function () {
                state[name] = cb.checked;
                save();
                applyVisibility();
            });
            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + labels[name]));
            container.appendChild(label);
            checkboxes[name] = cb;
        });

        function reset() {
            fieldNames.forEach(function (name) {
                state[name] = true;
                checkboxes[name].checked = true;
            });
            save();
            applyVisibility();
        }

        function getExtraParams() {
            var hidden = fieldNames.filter(function (n) { return !state[n]; });
            var params = {};
            if (hidden.length) params._hidden = hidden.join(',');
            return params;
        }

        function loadFromParams(urlParams) {
            if (urlParams.has('_hidden')) {
                var hidden = urlParams.get('_hidden').split(',');
                fieldNames.forEach(function (name) {
                    state[name] = hidden.indexOf(name) === -1;
                    checkboxes[name].checked = state[name];
                });
                save();
                applyVisibility();
            }
        }

        applyVisibility();

        return { apply: applyVisibility, reset: reset, getExtraParams: getExtraParams, loadFromParams: loadFromParams };
    }

    return { init: init };
})();
