document.addEventListener('DOMContentLoaded', function () {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        attachListener();
    } else {
        scene.addEventListener('loaded', attachListener);
    }
    
    function attachListener() {
        const coeur = document.getElementById('coeur');
        const losange = document.getElementById('losange');
        const rond = document.getElementById('rond');
        const rond2 = document.getElementById('rond2');
        const rond3 = document.getElementById('rond3');
        const etoile = document.getElementById('etoile');
        const etoile2 = document.getElementById('etoile2');
        console.log('elements:', { coeur, losange, rond, rond2, rond3, etoile, etoile2 });

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
        preserveAspectFor(losange);
        preserveAspectFor(rond);
        preserveAspectFor(rond2);
        preserveAspectFor(rond3);
        preserveAspectFor(etoile);
        preserveAspectFor(etoile2);

        // popup helper
        function showPopup(message, timeout = 0) {
            const overlay = document.getElementById('popup-overlay');
            const msg = document.getElementById('popup-message');
            const close = document.getElementById('popup-close');
            if (!overlay || !msg) {
                alert(message);
                return;
            }
            msg.textContent = message;
            overlay.style.display = 'flex';

            function hide() {
                overlay.style.display = 'none';
            }

            if (close) {
                close.onclick = hide;
            }

            overlay.onclick = function (e) {
                if (e.target === overlay) hide();
            };

            if (timeout > 0) {
                setTimeout(hide, timeout);
            }
        }

        if (coeur) {
            coeur.addEventListener('click', function () {
                console.log('Cœur cliqué');
                showPopup('Carion Marthe Digonal Kenza', 0);
            });
        }

        if (losange) {
            losange.addEventListener('click', function () {
                console.log('Losange cliqué');
                showPopup('Vous avez cliqué sur le losange !', 0);
            });
        }

        if (etoile) {
            etoile.addEventListener('click', function () {
                console.log('Étoile cliquée – ouverture de etoile.html');
                window.location.href = 'etoile.html';
            });
        }

        if (etoile2) {
            etoile2.addEventListener('click', function () {
                console.log('Étoile2 cliquée – ouverture du lien externe');
                window.open('https://pulse-beziers.fr/index.php/2025/09/03/rentree-universitaire-2025-plus-de-1-400-etudiants-a-liut-et-a-du-guesclin/', '_blank');
            });
        }

        // Click-based popup function for ronds (no hover)
        function setupRondPopupsClick(el, name) {
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

            // Toggle on click only (no hover)
            el.addEventListener('click', function () {
                console.log(name + ' clicked - toggling popups');
                if (visible) {
                    hide();
                    visible = false;
                } else {
                    show();
                    visible = true;
                }
            });

            // Update positions on window resize if visible
            window.addEventListener('resize', function () {
                if (visible) show();
            });
        }

        // setup popups for each rond with click only
        setupRondPopupsClick(rond, 'rond');
        setupRondPopupsClick(rond2, 'rond2');
        setupRondPopupsClick(rond3, 'rond3');
    }
});