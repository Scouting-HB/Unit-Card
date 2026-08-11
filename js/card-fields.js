/**
 * Card field persistence: localStorage + URL param serialization.
 * Usage:
 *   var mgr = CardFields.init({ storageKey: '...', urlTriggerFields: ['pack','title'] });
 *   // mgr.defaults, mgr.save(), mgr.reset(), mgr.copyLink()
 */
var CardFields = (function () {
    function init(opts) {
        var storageKey = opts.storageKey;
        var triggerFields = opts.urlTriggerFields || [];
        var fields = document.querySelectorAll('[data-field]');

        function getData() {
            var data = {};
            fields.forEach(function (el) {
                data[el.dataset.field] = el.innerHTML.trim();
            });
            return data;
        }

        function setData(data) {
            fields.forEach(function (el) {
                var key = el.dataset.field;
                if (data[key] !== undefined) {
                    el.innerHTML = data[key];
                }
            });
        }

        var defaults = getData();

        function save() {
            try {
                localStorage.setItem(storageKey, JSON.stringify(getData()));
            } catch (e) { }
        }

        function load() {
            var params = new URLSearchParams(window.location.search);
            var hasUrlData = triggerFields.some(function (f) { return params.has(f); });
            if (hasUrlData) {
                var data = {};
                fields.forEach(function (el) {
                    var key = el.dataset.field;
                    if (params.has(key)) {
                        data[key] = params.get(key);
                    }
                });
                setData(data);
                save();
                if (window.history.replaceState) {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } else {
                try {
                    var stored = localStorage.getItem(storageKey);
                    if (stored) {
                        setData(JSON.parse(stored));
                    }
                } catch (e) { }
            }
        }

        // Auto-save on edit
        fields.forEach(function (el) {
            el.addEventListener('input', save);
        });

        function reset(afterReset) {
            setData(defaults);
            save();
            if (afterReset) afterReset();
        }

        function copyLink(btn, extraParams) {
            var data = getData();
            var params = new URLSearchParams();
            Object.keys(data).forEach(function (key) {
                var tmp = document.createElement('div');
                tmp.innerHTML = data[key];
                params.set(key, tmp.textContent);
            });
            if (extraParams) {
                Object.keys(extraParams).forEach(function (key) {
                    var val = extraParams[key];
                    if (val !== undefined && val !== null && val !== '') {
                        params.set(key, typeof val === 'string' ? val : JSON.stringify(val));
                    }
                });
            }
            var url = window.location.origin + window.location.pathname + '?' + params.toString();
            navigator.clipboard.writeText(url).then(function () {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(function () {
                    btn.textContent = 'Copy Link';
                    btn.classList.remove('copied');
                }, 2000);
            });
        }

        function getUrlParams() {
            return new URLSearchParams(window.location.search);
        }

        return {
            defaults: defaults,
            load: load,
            save: save,
            reset: reset,
            copyLink: copyLink,
            getData: getData,
            setData: setData,
            getUrlParams: getUrlParams
        };
    }

    return { init: init };
})();
