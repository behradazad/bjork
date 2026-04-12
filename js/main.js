/* ============================================================
   BJÖRKLINGE MASKIN AB — Premium Website JavaScript
   ============================================================ */

(function() {
    'use strict';

    // ============ DOM READY ============
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        document.body.classList.add('loading');
        
        initLoader();
        initHeader();
        initMobileMenu();
        initScrollProgress();
        initScrollSpy();
        initScrollReveal();
        initCounters();
        initTestimonialsSlider();
        initFAQ();
        initGalleryLightbox();
        initContactForm();
        initBackToTop();
        initThemeToggle();
        initCustomCursor();
        initStepsLine();
        initTiltEffect();
        initSmoothScroll();
    }

    // ============ LOADER ============
    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        const hideLoader = () => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        };

        // Wait for loader animation + images
        window.addEventListener('load', () => {
            setTimeout(hideLoader, 2000);
        });

        // Fallback: hide after 3.5s regardless
        setTimeout(hideLoader, 3500);
    }

    // ============ HEADER ============
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        const onScroll = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        onScroll();
    }

    // ============ MOBILE MENU ============
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if (!hamburger || !mobileMenu) return;

        const toggle = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggle);

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggle();
            }
        });
    }

    // ============ SCROLL PROGRESS ============
    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateProgress);
        }, { passive: true });
    }

    // ============ SCROLL SPY ============
    function initScrollSpy() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        if (!navLinks.length) return;

        const sections = [];
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) sections.push({ link, section });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const match = sections.find(s => s.section === entry.target);
                    if (match) match.link.classList.add('active');
                }
            });
        }, {
            rootMargin: '-30% 0px -60% 0px'
        });

        sections.forEach(({ section }) => observer.observe(section));
    }

    // ============ SCROLL REVEAL ============
    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    // ============ COUNTERS ============
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const start = performance.now();
            const startVal = 0;

            const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

            const update = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const current = Math.floor(startVal + (target - startVal) * easedProgress);
                
                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ============ TESTIMONIALS SLIDER ============
    function initTestimonialsSlider() {
        const track = document.getElementById('testimonialsTrack');
        const dotsContainer = document.getElementById('testimonialsDots');
        const prevBtn = document.getElementById('testimonialPrev');
        const nextBtn = document.getElementById('testimonialNext');
        if (!track || !dotsContainer) return;

        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let autoPlayInterval;
        const totalSlides = cards.length;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

        // Auto-play
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        startAutoPlay();

        // Pause on hover
        const slider = document.getElementById('testimonialsSlider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            slider.addEventListener('mouseleave', startAutoPlay);
        }

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoPlay();
            }
        }, { passive: true });
    }

    // ============ FAQ ACCORDION ============
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            if (!btn) return;

            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const q = i.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ============ GALLERY LIGHTBOX ============
    function initGalleryLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (!lightbox || !lightboxImg || !galleryItems.length) return;

        const images = [];
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) images.push(img.src);
        });

        let currentLightboxIndex = 0;

        function openLightbox(index) {
            currentLightboxIndex = index;
            lightboxImg.src = images[index];
            lightboxImg.alt = galleryItems[index].querySelector('img')?.alt || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function nextImage() {
            currentLightboxIndex = (currentLightboxIndex + 1) % images.length;
            lightboxImg.src = images[currentLightboxIndex];
        }

        function prevImage() {
            currentLightboxIndex = (currentLightboxIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentLightboxIndex];
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next')?.addEventListener('click', nextImage);
        lightbox.querySelector('.lightbox-prev')?.addEventListener('click', prevImage);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    // ============ CONTACT FORM ============
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        if (!form || !submitBtn) return;

        // Live validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                validateField(field);
            });

            field.addEventListener('blur', () => {
                validateField(field);
            });
        });

        function validateField(field) {
            const group = field.closest('.form-group');
            if (!group) return false;

            let isValid = false;

            if (field.type === 'email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
            } else if (field.type === 'tel') {
                isValid = field.value.trim().length >= 6;
            } else {
                isValid = field.value.trim().length > 0;
            }

            group.classList.toggle('valid', isValid);
            return isValid;
        }

        // Form submission — opens user's email client with draft
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let allValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) allValid = false;
            });

            if (!allValid) {
                // Find first invalid field and focus
                const firstInvalid = form.querySelector('[required]:not(:valid)');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.closest('.form-group')?.classList.add('error');
                }
                return;
            }

            // Gather form data
            const namn = form.querySelector('#namn')?.value?.trim() || '';
            const foretag = form.querySelector('#foretag')?.value?.trim() || '';
            const telefon = form.querySelector('#telefon')?.value?.trim() || '';
            const epost = form.querySelector('#epost')?.value?.trim() || '';
            const meddelande = form.querySelector('#meddelande')?.value?.trim() || '';

            // Build email subject and body
            const subject = encodeURIComponent('Offertförfrågan från ' + namn + (foretag ? ' (' + foretag + ')' : ''));
            const body = encodeURIComponent(
                'Hej Björklinge Maskin AB,\n\n' +
                meddelande + '\n\n' +
                '---\n' +
                'Kontaktuppgifter:\n' +
                'Namn: ' + namn + '\n' +
                (foretag ? 'Företag: ' + foretag + '\n' : '') +
                'Telefon: ' + telefon + '\n' +
                'E-post: ' + epost + '\n'
            );

            // Open user's email client using a temporary link (most reliable method)
            const mailtoUrl = 'mailto:info@csgab.se?subject=' + subject + '&body=' + body;
            const tempLink = document.createElement('a');
            tempLink.href = mailtoUrl;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            // Show success state
            submitBtn.classList.add('success');

            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                form.reset();
                form.querySelectorAll('.form-group').forEach(g => g.classList.remove('valid'));
            }, 2500);
        });

        // Modal form
        const modalForm = document.getElementById('modalForm');
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = modalForm.querySelector('button[type="submit"]');
                if (btn) {
                    btn.textContent = 'Skickar...';
                    btn.disabled = true;
                    setTimeout(() => {
                        btn.textContent = '✓ Skickat!';
                        btn.style.background = '#22c55e';
                        btn.style.borderColor = '#22c55e';
                        setTimeout(() => {
                            closeModal();
                            btn.textContent = 'Skicka förfrågan';
                            btn.style.background = '';
                            btn.style.borderColor = '';
                            btn.disabled = false;
                            modalForm.reset();
                        }, 2000);
                    }, 1500);
                }
            });
        }
    }

    // ============ BACK TO TOP ============
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        const circle = btn.querySelector('.back-to-top-circle');
        const circumference = 2 * Math.PI * 20; // r=20

        const updateButton = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY / scrollHeight;

            // Toggle visibility
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }

            // Update progress ring
            if (circle) {
                const offset = circumference - (scrolled * circumference);
                circle.style.strokeDashoffset = offset;
            }
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateButton);
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ THEME TOGGLE ============
    function initThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        // Check saved preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ============ CUSTOM CURSOR ============
    function initCustomCursor() {
        // Only on devices with a mouse
        if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const cursor = document.getElementById('customCursor');
        const cursorDot = document.getElementById('customCursorDot');
        if (!cursor || !cursorDot) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows immediately
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth follow for outer ring
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .machine-card, .faq-question, input, textarea, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        // Click effect
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    }

    // ============ STEPS LINE ANIMATION ============
    function initStepsLine() {
        const lineFill = document.getElementById('stepsLineFill');
        if (!lineFill) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lineFill.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(lineFill.parentElement);
    }

    // ============ 3D TILT EFFECT ============
    function initTiltEffect() {
        if (!matchMedia('(hover: hover)').matches) return;

        const cards = document.querySelectorAll('.machine-card, .benefit-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -4;
                const rotateY = (x - centerX) / centerX * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============ SMOOTH SCROLL ============
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============ QUOTE MODAL ============
    // (available globally for use if needed)
    window.openQuoteModal = function() {
        const modal = document.getElementById('quoteModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeModal() {
        const modal = document.getElementById('quoteModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    window.closeModal = closeModal;

    // Modal event listeners
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('quoteModal');
        if (!modal) return;

        // Close button
        if (e.target.closest('.modal-close')) {
            closeModal();
        }

        // Click outside modal
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            
            // Also close lightbox
            const lightbox = document.getElementById('lightbox');
            if (lightbox?.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ============ PARALLAX SUBTLE EFFECT ============
    // Subtle parallax on hero image
    window.addEventListener('scroll', () => {
        const heroImg = document.querySelector('.hero-img');
        if (heroImg && window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.3;
            heroImg.style.transform = `scale(1.05) translateY(${offset}px)`;
        }
    }, { passive: true });

    // ============ INTERSECTION OBSERVER FOR STAR RATINGS ============
    // Animate star ratings when visible
    const starSections = document.querySelectorAll('.testimonial-stars');
    if (starSections.length) {
        const starObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stars = entry.target.querySelectorAll('svg');
                    stars.forEach((star, i) => {
                        star.style.opacity = '0';
                        star.style.transform = 'scale(0)';
                        star.style.transition = `all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`;
                        
                        requestAnimationFrame(() => {
                            star.style.opacity = '1';
                            star.style.transform = 'scale(1)';
                        });
                    });
                    starObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        starSections.forEach(section => starObserver.observe(section));
    }

})();
