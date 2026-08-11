/**
 * Simple back image toggle (for pack cards with static back images).
 * Usage:
 *   BackImage.init({ storageKey: '...', imgId: 'back-img', radioName: 'back-image' });
 */
var BackImage = (function () {
    function init(opts) {
        var backImg = document.getElementById(opts.imgId);
        var radios = document.querySelectorAll('input[name="' + opts.radioName + '"]');

        function load() {
            var saved = localStorage.getItem(opts.storageKey);
            if (saved) {
                backImg.src = saved;
                radios.forEach(function (r) {
                    r.checked = r.value === saved;
                });
            }
        }

        radios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                backImg.src = this.value;
                localStorage.setItem(opts.storageKey, this.value);
            });
        });

        load();
    }

    return { init: init };
})();
