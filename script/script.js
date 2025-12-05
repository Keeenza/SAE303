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
        const losange2 = document.getElementById('losange2');
        const rond = document.getElementById('rond');
        const rond2 = document.getElementById('rond2');
        const rond3 = document.getElementById('rond3');
        const etoile = document.getElementById('etoile');
        const etoile2 = document.getElementById('etoile2');
        console.log('elements:', { coeur, losange, losange2, rond, rond2, rond3, etoile, etoile2 });

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
        preserveAspectFor(losange2);
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

        // popup with links for losange
        function showPopupWithLinks() {
            const overlay = document.getElementById('popup-overlay');
            const msg = document.getElementById('popup-message');
            const close = document.getElementById('popup-close');
            if (!overlay || !msg) {
                alert('Liens disponibles');
                return;
            }
            
            // Create HTML content with links and colors
            msg.innerHTML = '<a href="https://ubs-beziers.fr/ecoles-publiques-superieures/" target="_blank" style="display: block; margin: 10px 0; color: #fecf72; text-decoration: none; font-weight: bold;">Liste des écoles publiques superieures</a>' +
                           '<a href="https://www.enseignement-prive.info/annuaire-enseignement-prive/beziers-34500" target="_blank" style="display: block; margin: 10px 0; color: #4bbab2; text-decoration: none; font-weight: bold;">Liste des écoles privees sous et hors contrat</a>';
            
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
        }

        // COEUR - message personnalisé
        if (coeur) {
            coeur.addEventListener('click', function () {
                console.log('Coeur clique');
                const overlay = document.getElementById('popup-overlay');
                const msg = document.getElementById('popup-message');
                const close = document.getElementById('popup-close');
                if (!overlay || !msg) {
                    alert('Fait par Carion Marthe et Digonal Kenza MMI2.');
                    return;
                }
                msg.innerHTML = 'Fait par <span style="color: #fecf72; font-weight: bold;">Carion Marthe</span> et <span style="color: #4bbab2; font-weight: bold;">Digonal Kenza</span> <span style="color: #ec6152; font-weight: bold;">MMI2.</span>';
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
            });
        }

        // LOSANGE - affiche les deux liens
        if (losange) {
            losange.addEventListener('click', function () {
                console.log('Losange clique - affichage des liens');
                showPopupWithLinks();
            });
        }

        // LOSANGE2 - super animation uniquement (pas de popup)
        if (losange2) {
            let isAnimating = false;
            
            losange2.addEventListener('click', function () {
                console.log('Losange2 clique - super animation');
                
                if (isAnimating) return;
                isAnimating = true;
                
                // Animation de rotation 3D + zoom
                losange2.setAttribute('animation__rotate', {
                    property: 'rotation',
                    to: '0 360 0',
                    dur: 1000,
                    easing: 'easeInOutBack'
                });
                
                losange2.setAttribute('animation__scale', {
                    property: 'scale',
                    from: '0.5 0.5 0.5',
                    to: '0.8 0.8 0.8',
                    dur: 500,
                    easing: 'easeOutElastic',
                    dir: 'alternate',
                    loop: 1
                });
                
                // Réinitialiser le flag après l'animation
                setTimeout(function() {
                    isAnimating = false;
                }, 1000);
            });
        }

        // ETOILE - redirection vers etoile.html
        if (etoile) {
            etoile.addEventListener('click', function () {
                console.log('Etoile cliquee - ouverture de etoile.html');
                window.location.href = 'etoile.html';
            });
        }

        // ETOILE2 - ouverture lien externe
        if (etoile2) {
            etoile2.addEventListener('click', function () {
                console.log('Etoile2 cliquee - ouverture du lien externe');
                window.open('https://pulse-beziers.fr/index.php/2025/09/03/rentree-universitaire-2025-plus-de-1-400-etudiants-a-liut-et-a-du-guesclin/', '_blank');
            });
        }

        // Click-based 3D text toggle for ronds - now using containers
        function setupRond3DTexts(rondEl, rondName) {
            if (!rondEl) return;
            
            const containerTop = document.getElementById(rondName + '-container-top');
            const containerRight = document.getElementById(rondName + '-container-right');
            const containerBottom = document.getElementById(rondName + '-container-bottom');
            const containerLeft = document.getElementById(rondName + '-container-left');
            
            console.log('Setting up', rondName, '- containers:', {
                top: containerTop,
                right: containerRight,
                bottom: containerBottom,
                left: containerLeft
            });
            
            let visible = false;
            
            rondEl.addEventListener('click', function () {
                console.log(rondName + ' clicked - toggling 3D texts, visible was:', visible);
                
                visible = !visible;
                
                if (containerTop) containerTop.setAttribute('visible', visible);
                if (containerRight) containerRight.setAttribute('visible', visible);
                if (containerBottom) containerBottom.setAttribute('visible', visible);
                if (containerLeft) containerLeft.setAttribute('visible', visible);
                
                console.log(rondName + ' - set visible to:', visible);
            });
        }

        // Setup 3D texts for each rond
        setupRond3DTexts(rond, 'rond');
        setupRond3DTexts(rond2, 'rond2');
        setupRond3DTexts(rond3, 'rond3');
    }
});