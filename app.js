/**
 * Qingdao Summer Language Camp Website Application Logic
 * Implements smooth interactive UI elements, sticky navigation, offset day scrollspy,
 * FAQ accordions, form handling, and optimized scroll reveal animations.
 */

// Low-spec auto-detect отключён — hero-видео и cinematic-эффекты должны работать.
// prefers-reduced-motion обрабатывается отдельным CSS @media-блоком ниже.

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            if (navBackdrop) navBackdrop.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
                if (navBackdrop) navBackdrop.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });

        // Click outside on backdrop to close mobile drawer
        if (navBackdrop) {
            navBackdrop.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
                navBackdrop.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        }
    }

    /* ==========================================================================
       STICKY HEADER ON SCROLL
       ========================================================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       SCROLLSPY (ACTIVE LINK HIGHLIGHTING IN HEADER)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            const activeNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (activeNavLink) {
                if (isBottom) {
                    if (sectionId === 'faq') {
                        activeNavLink.classList.add('active');
                    } else {
                        activeNavLink.classList.remove('active');
                    }
                } else {
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        activeNavLink.classList.add('active');
                    } else {
                        activeNavLink.classList.remove('active');
                    }
                }
            }
        });
    });

    const dayCards = document.querySelectorAll('.tennis-day-card');

    // Mobile click/tap toggle for detailed schedule timeline slide-up overlays
    dayCards.forEach(card => {
        const triggerBtn = card.querySelector('.program-trigger-btn');
        const closeBtn = card.querySelector('.overlay-close-btn');
        
        if (triggerBtn && closeBtn) {
            // Open on trigger button click
            triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close any other open card overlays first to prevent overlaps
                dayCards.forEach(c => {
                    if (c !== card) c.classList.remove('active-overlay');
                });
                card.classList.toggle('active-overlay');
            });
            
            // Close on close button click
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('active-overlay');
            });
            
            // Close when clicking anywhere outside of the active card
            document.addEventListener('click', (e) => {
                if (!card.contains(e.target)) {
                    card.classList.remove('active-overlay');
                }
            });
        }
    });

    /* ==========================================================================
       FAQ ACCORDION TRIGGERS
       ========================================================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = trigger.nextElementSibling;
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Close all other accordion items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('expanded');
                    const content = item.querySelector('.faq-content');
                    if (content) content.style.maxHeight = null;
                    const trig = item.querySelector('.faq-trigger');
                    if (trig) trig.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current accordion
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                faqItem.classList.remove('expanded');
                faqContent.style.maxHeight = null;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                faqItem.classList.add('expanded');
                faqContent.style.maxHeight = faqContent.scrollHeight + "px";
                
                // Smoothly scroll expanded accordion item into view
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });

    /* ==========================================================================
       FORM VALIDATION & MODAL HANDLING
       ========================================================================== */
    const applyForm = document.getElementById('apply-form');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBtnOk = document.getElementById('modal-btn-ok');

    if (applyForm && successModal && modalClose && modalBtnOk) {
        
        applyForm.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                const group = input.parentElement;
                if (input.value.trim() !== '') {
                    group.classList.remove('invalid');
                }
            });
        });

        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            
            // Validate Name
            const nameInput = document.getElementById('form-name');
            if (!nameInput || nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Validate Age
            const ageInput = document.getElementById('form-age');
            const ageValue = parseInt(ageInput.value);
            if (!ageInput || isNaN(ageValue) || ageValue < 12 || ageValue > 99) {
                ageInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            // Validate Contact/Telegram
            const contactInput = document.getElementById('form-contact');
            if (!contactInput || contactInput.value.trim() === '') {
                contactInput.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            if (isFormValid) {
                successModal.classList.add('open');
                applyForm.reset();
            }
        });

        function closeModal() {
            successModal.classList.remove('open');
        }

        modalClose.addEventListener('click', closeModal);
        modalBtnOk.addEventListener('click', closeModal);
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = [
        '.section-header', 
        '.about-section .section-left', 
        '.about-section .section-right',
        '.program-card', 
        '.advantage-item', 
        '.timeline-step',
        '.price-box', 
        '.safety-image', 
        '.safety-content',
        '.adults-content', 
        '.adults-image',
        '.target-box', 
        '.organizer-left', 
        '.organizer-right',
        '.gallery-live-item', 
        '.faq-item',
        '.apply-left', 
        '.apply-right',
        '.schedule-day-card'
    ];

    revealElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('fade-in-up');
            
            // Apply progressive delay to list/grid sibling groups
            if (elements.length > 1) {
                // progressive delay, capped at 0.4s to remain snappy and fast
                const delay = Math.min(index * 0.06, 0.4);
                el.style.transitionDelay = `${delay}s`;
            }
        });
    });

    // Observer setup
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.08
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('active');
                    
                    // Clear transition-delay after the entrance animation finishes
                    // so that micro-interactions on hover (like card translateY) react instantly!
                    setTimeout(() => {
                        el.style.transitionDelay = '0s';
                    }, 1000);
                    
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.classList.add('active');
            el.style.transitionDelay = '0s';
        });
    }

    /* ==========================================================================
       BACKGROUND VIDEO AUTO-PAUSE FOR ECO-PERFORMANCE
       ========================================================================== */
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(() => {});
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.1 });
        videoObserver.observe(heroVideo);
    }

    /* ==========================================================================
       PHOTO LIGHTBOX — открытие по клику на фото карусели
       ========================================================================== */
    const lightbox        = document.getElementById('photo-lightbox');
    const lightboxImg     = document.getElementById('lightbox-img');
    const lightboxClose   = document.getElementById('lightbox-close');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        // Небольшая задержка перед очисткой src — чтобы анимация закрытия успела проиграть
        setTimeout(() => {
            lightboxImg.src = '';
        }, 380);
    }

    if (lightbox && lightboxImg && lightboxClose) {
        // Клик на любой .carousel-item (делегирование на трек)
        document.querySelectorAll('.carousel-track').forEach(track => {
            track.addEventListener('click', (e) => {
                const item = e.target.closest('.carousel-item');
                if (!item) return;
                const img = item.querySelector('img');
                if (img) openLightbox(img.src, img.alt);
            });
        });

        // Закрытие — кнопка крестика
        lightboxClose.addEventListener('click', closeLightbox);

        // Закрытие — клик на фон (оверлей, но не на само фото)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Закрытие — клавиша Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }
});
