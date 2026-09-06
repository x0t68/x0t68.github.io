/* ============================================
   PROJECTS LOADER
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupScrollAnimations();
    setupSmoothScroll();
    updateNavbarActiveState();
});

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsGrid').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Failed to load projects. Please refresh the page.</p>';
    }
}

// استبدل الدالة القديمة بهذه
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card animate-on-scroll';
    
    const techTags = project.technologies
        .map(tech => `<span class="tech-badge">${tech}</span>`)
        .join('');

    card.innerHTML = `
        <div class="project-header">
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.name}" class="project-img">
            </div>
            <div class="project-title-area">
                <h3>${project.name}</h3>
            </div>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links" style="margin-top: 1rem;">
                <button class="btn btn-secondary view-details-btn" style="flex:1; width:100%; border:none; background:var(--surface-light);">View Details</button>
            </div>
        </div>
    `;

    // ربط الزر لفتح النافذة المنبثقة
    const viewBtn = card.querySelector('.view-details-btn');
    viewBtn.addEventListener('click', () => openModal(project));

    return card;
}

/* ============================================
   MODAL LOGIC
   ============================================ */
const modal = document.getElementById('projectModal');
const closeModal = document.querySelector('.close-modal');

function openModal(project) {
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalTitle').textContent = project.name;
    document.getElementById('modalDesc').textContent = project.description;
    document.getElementById('modalGithub').href = project.github;
    
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('');
    
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // يمنع النزول في الصفحة الخلفية
}

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card animate-on-scroll';
    
    const techTags = project.technologies
        .map(tech => `<span class="tech-badge">${tech}</span>`)
        .join('');

    const highlightsList = project.highlights
        ? `<ul style="margin: 1rem 0; padding-left: 1.5rem; color: var(--text-secondary); font-size: 0.9rem;">
            ${project.highlights.map(h => `<li style="margin-bottom: 0.5rem;">${h}</li>`).join('')}
           </ul>`
        : '';

    card.innerHTML = `
        <div class="project-header">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${project.image}</div>
            <h3>${project.name}</h3>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description}</p>
            ${highlightsList}
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                <a href="${project.github}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i>
                    <span>View Code</span>
                </a>
            </div>
        </div>
    `;

    return card;
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Observe section headings
    document.querySelectorAll('section h2').forEach(heading => {
        heading.classList.add('animate-on-scroll');
        observer.observe(heading);
    });

    // Observe certification items
    setTimeout(() => {
        document.querySelectorAll('.cert-item').forEach(item => {
            item.classList.add('animate-on-scroll');
            observer.observe(item);
        });
    }, 100);

    // Observe project cards
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            if (!card.classList.contains('in-view')) {
                observer.observe(card);
            }
        });
    }, 500);

    // Observe education items
    setTimeout(() => {
        document.querySelectorAll('.education-item').forEach(item => {
            item.classList.add('animate-on-scroll');
            observer.observe(item);
        });
    }, 200);
}

/* ============================================
   SMOOTH SCROLL BEHAVIOR
   ============================================ */

function setupSmoothScroll() {
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
}

/* ============================================
   NAVBAR ACTIVE STATE
   ============================================ */

window.addEventListener('scroll', function() {
    updateNavbarActiveState();
    setupScrollAnimations();
});

function updateNavbarActiveState() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   PARALLAX EFFECT
   ============================================ */

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        heroSection.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
});

/* ============================================
   PERFORMANCE & UTILITY FUNCTIONS
   ============================================ */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   DARK MODE TOGGLE (OPTIONAL)
   ============================================ */

function initDarkModeToggle() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('light-mode') ? 'false' : 'true');
    });

    // Check for saved preference
    const isDarkMode = localStorage.getItem('darkMode') !== 'false';
    if (!isDarkMode) {
        document.body.classList.add('light-mode');
    }
}

/* ============================================
   CONTACT FORM HANDLING (IF NEEDED)
   ============================================ */

function initContactForm() {
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission here
            console.log('Form submitted');
        });
    }
}

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main') || document.body;
    mainContent.style.animation = 'fadeIn 0.6s ease';

    // Trigger animations for elements already in view
    setupScrollAnimations();
});

/* ============================================
   MOBILE MENU HANDLER (IF NEEDED)
   ============================================ */

function initMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navBrand = document.querySelector('.nav-brand');

    // Close menu when a link is clicked
    navLinks?.addEventListener('click', function() {
        if (window.innerWidth < 768) {
            navLinks.classList.remove('active');
        }
    });
}

/* ============================================
   ERROR HANDLING
   ============================================ */

window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

/* ============================================
   UTILITY: Copy to Clipboard
   ============================================ */

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/* ============================================
   LAZY LOAD IMAGES (IF NEEDED)
   ============================================ */

function initLazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/* ============================================
   ANALYTICS & TRACKING (OPTIONAL)
   ============================================ */

function trackPageView() {
    if (window.gtag) {
        gtag('config', 'GA_MEASUREMENT_ID', {
            'page_path': window.location.pathname,
            'page_title': document.title
        });
    }
}

/* ============================================
   INITIALIZATION ON DOM READY
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLazyLoadImages();
    initContactForm();
});

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Home key - scroll to top
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End key - scroll to bottom
    if (e.key === 'End') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

/* ============================================
   INTERSECTION OBSERVER FOR ELEMENTS
   ============================================ */

// Create a more efficient intersection observer
const observerConfig = {
    threshold: [0.1, 0.5],
    rootMargin: '0px 0px -100px 0px'
};

const elementObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerConfig);

// Observe elements on initial load
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        elementObserver.observe(el);
    });
});
