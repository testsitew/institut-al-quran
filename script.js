// ============================================
// INSTITUT ARABE - MASTER JAVASCRIPT 2024
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 🎯 MENU MOBILE
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const headerButtons = document.querySelector('.header-buttons');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        headerButtons.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Fermer menu sur clic lien
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            headerButtons.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // 🎨 HEADER SCROLL EFFECT
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const scrollTop = window.scrollY;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255,255,255,0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
        } else {
            header.style.background = 'rgba(255,255,255,0.92)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 5px 25px rgba(0,0,0,0.1)';
        }
        
        // Hide/show header
        if (scrollTop > lastScroll && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = scrollTop;
    });
    
    // ⚡ SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 🌟 SCROLL ANIMATIONS (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);
    
    // Observe toutes les cards
    document.querySelectorAll('.niveau-card, .testimonial, .stat, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.95)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
    
    // 💫 COUNTER ANIMATION
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + (target > 100 ? '' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            const observerCounter = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observerCounter.unobserve(entry.target);
                    }
                });
            });
            observerCounter.observe(counter);
        });
    }
    
    animateCounters();
    
    // 🎭 DROPDOWN HOVER MOBILE
    if (window.innerWidth <= 768) {
        document.querySelector('.dropdown-toggle').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = this.parentElement.querySelector('.dropdown-menu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
    }
    
    // 📱 PARALLAX EFFECT
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // 🔥 BUTTON HOVER EFFECTS
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 🌍 LAZY LOADING IMAGES
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 💰 CONVERSION CURRENCY (optionnel)
    function updateCurrency() {
        const priceElements = document.querySelectorAll('.niveau-price-big');
        const currency = localStorage.getItem('currency') || 'EUR';
        priceElements.forEach(el => {
            if (currency === 'EUR') {
                el.textContent = el.dataset.eur || '29€';
            } else {
                el.textContent = el.dataset.dzd || '4500 DA';
            }
        });
    }
    
    // Toggle currency
    document.addEventListener('keydown', (e) => {
        if (e.key === 'c') {
            const current = localStorage.getItem('currency') || 'EUR';
            localStorage.setItem('currency', current === 'EUR' ? 'DZD' : 'EUR');
            updateCurrency();
        }
    });
    
    updateCurrency();
    
    // 📊 GOOGLE ANALYTICS (optionnel)
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX');
    
    // 🎵 SCROLL TO TOP
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 800) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    
    console.log('🚀 Institut Arabe - JavaScript chargé parfaitement!');
});

// ============================================
// PWA SERVICE WORKER (Offline)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed'));
    });
}

// ============================================
// PERFECT SCROLLBAR
// ============================================
(function() {
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
    
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth > 768) {
            const delta = e.deltaY > 0 ? 1 : -1;
            const nextSection = Math.max(0, Math.min(sections.length - 1, currentSection + delta));
            
            if (nextSection !== currentSection) {
                sections[nextSection].scrollIntoView({behavior: 'smooth'});
                currentSection = nextSection;
            }
        }
    }, {passive: false});
})();
