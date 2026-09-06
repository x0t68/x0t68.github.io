/* ============================================
   PROJECTS LOADER
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupScrollAnimations();
    setupSmoothScroll();
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

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
        // Stagger animation
        setTimeout(() => {
            projectCard.classList.add('animate-on-scroll');
            projectCard.classList.add('in-view');
        }, index * 100);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card animate-on-scroll';
    
    const techTags = project.technologies
        .map(tech => `<span class="tech-badge">${tech}</span>`)
        .join('');

    card.innerHTML = `
        <div class="project-header">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${project.image}</div>
            <h3>${project.name}</h3>
        </div>
        <div class="project-body">
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                <a href="${project.github}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i>
                    <span>GitHub</span>
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

    // Observe project cards
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            if (!card.classList.contains('in-view')) {
                observer.observe(card);
            }
        });
    }, 500);
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
});
