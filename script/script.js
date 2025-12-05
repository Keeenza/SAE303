document.addEventListener('DOMContentLoaded', function () {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        attachListener();
    } else {
        scene.addEventListener('loaded', attachListener);
    }
    
    function attachListener() {
        const coeur = document.getElementById('coeur');
        const rond = document.getElementById('rond');
        const rond2 = document.getElementById('rond2');
        const rond3 = document.getElementById('rond3');
        const etoile = document.getElementById('etoile');
        console.log('coeur element:', coeur, 'rond elements:', rond, rond2, rond3, 'etoile element:', etoile);

        function preserveAspectFor(el) {
            if (!el) return;
            const src = el.getAttribute('src');
            if (!src) return;

            function applyRatioToElement(imgWidth, imgHeight) {
                if (!imgWidth || !imgHeight) return;
                const currW = parseFloat(el.getAttribute('width')) || 1;
                const newH = currW * (imgHeight / imgWidth);
                el.setAttribute('height', newH);
                console.log(el.id + ': set height to preserve aspect ratio ->', newH);
            }

            if (src.startsWith && src.startsWith('#')) {
                const imgEl = document.querySelector(src);
                if (!imgEl) return;
                if (imgEl.complete && (imgEl.naturalWidth || imgEl.width)) {
                    applyRatioToElement(imgEl.naturalWidth || imgEl.width, imgEl.naturalHeight || imgEl.height);
                } else {
                    imgEl.addEventListener('load', function () {
                        applyRatioToElement(imgEl.naturalWidth || imgEl.width, imgEl.naturalHeight || imgEl.height);
                    });
                }
            } else {
                const img = new Image();
                img.onload = function () {
                    applyRatioToElement(img.naturalWidth, img.naturalHeight);
                };
                img.src = src;
            }
        }

        // apply to elements if present
        preserveAspectFor(coeur);
        preserveAspectFor(rond);
        preserveAspectFor(rond2);
        preserveAspectFor(rond3);
        preserveAspectFor(etoile);

        // popup helper
        function showPopup(message, timeout = 0) {
            const overlay = document.getElementById('popup-overlay');
            const msg = document.getElementById('popup-message');
            const close = document.getElementById('popup-close');
            if (!overlay || !msg) {
                // fallback to alert
                alert(message);
                return;
            }
            msg.textContent = message;
            overlay.style.display = 'flex';

            function hide() {
                overlay.style.display = 'none';
            }

            // close button
            if (close) {
                close.onclick = hide;
            }

            // click outside box closes
            overlay.onclick = function (e) {
                if (e.target === overlay) hide();
            };

            // auto-hide if timeout > 0
            if (timeout > 0) {
                setTimeout(hide, timeout);
            }
        }

        if (coeur) {
            coeur.addEventListener('click', function () {
                console.log('Cœur cliqué');
                showPopup('Vous avez cliqué sur le cœur !', 0);
            });
        }

        if (etoile) {
            etoile.addEventListener('click', function () {
                console.log('Étoile cliquée — ouverture de etoile.html');
                // navigation vers la page etoile.html
                window.location.href = 'etoile.html';
            });
        }

        // (old centered hover overlay removed — using 4 popups instead)
        
        // generic function: create and manage 4 popups around a given element
        function setupRondPopups(el, name) {
            if (!el) return;
            const containerId = name + '-popups';
            let container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                document.body.appendChild(container);
                const positions = ['top','right','bottom','left'];
                positions.forEach(pos => {
                    const d = document.createElement('div');
                    d.className = 'rond-popup';
                    d.id = name + '-popup-' + pos;
                    d.textContent = 'bonjour';
                    container.appendChild(d);
                });
            }

            function getScreenPos() {
                const worldPos = new THREE.Vector3();
                el.object3D.getWorldPosition(worldPos);
                const projected = worldPos.clone().project(scene.camera);
                const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
                return { x, y };
            }

            function show() {
                const pos = getScreenPos();
                const x = pos.x, y = pos.y;
                const offset = 80;
                const topEl = document.getElementById(name + '-popup-top');
                const rightEl = document.getElementById(name + '-popup-right');
                const bottomEl = document.getElementById(name + '-popup-bottom');
                const leftEl = document.getElementById(name + '-popup-left');

                if (topEl) {
                    topEl.style.display = 'block';
                    topEl.style.left = (x - topEl.offsetWidth / 2) + 'px';
                    topEl.style.top = (y - offset - topEl.offsetHeight) + 'px';
                }
                if (rightEl) {
                    rightEl.style.display = 'block';
                    rightEl.style.left = (x + offset) + 'px';
                    rightEl.style.top = (y - rightEl.offsetHeight / 2) + 'px';
                }
                if (bottomEl) {
                    bottomEl.style.display = 'block';
                    bottomEl.style.left = (x - bottomEl.offsetWidth / 2) + 'px';
                    bottomEl.style.top = (y + offset) + 'px';
                }
                if (leftEl) {
                    leftEl.style.display = 'block';
                    leftEl.style.left = (x - offset - leftEl.offsetWidth) + 'px';
                    leftEl.style.top = (y - leftEl.offsetHeight / 2) + 'px';
                }
            }

            function hide() {
                const nodes = container.querySelectorAll('.rond-popup');
                nodes.forEach(n => n.style.display = 'none');
            }

            let visible = false;
            let hideTimer = null;
            let mouseMoveHandler = null;

            function startMouseWatch() {
                if (mouseMoveHandler) return;
                mouseMoveHandler = function (e) {
                    const pos = getScreenPos();
                    const dx = e.clientX - pos.x;
                    const dy = e.clientY - pos.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const threshold = 140; // pixels
                    if (dist > threshold) {
                        // hide immediately when pointer goes beyond threshold
                        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
                        hide();
                        visible = false;
                        stopMouseWatch();
                    } else {
                        // pointer close enough — cancel any pending hide and update positions
                        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
                        if (visible) show();
                    }
                };
                window.addEventListener('mousemove', mouseMoveHandler);
            }

            function stopMouseWatch() {
                if (!mouseMoveHandler) return;
                window.removeEventListener('mousemove', mouseMoveHandler);
                mouseMoveHandler = null;
            }

            el.addEventListener('mouseenter', function () {
                if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
                if (visible) return;
                visible = true;
                show();
                startMouseWatch();
            });
            window.addEventListener('resize', function () {
                const anyVisible = Array.from(container.querySelectorAll('.rond-popup')).some(el => el.style.display === 'block');
                if (anyVisible) show();
            });
        }

        // setup popups for each rond
        setupRondPopups(rond, 'rond');
        setupRondPopups(rond2, 'rond2');
        setupRondPopups(rond3, 'rond3');

        // scale handled by A-Frame animation attributes on the elements
    }
});