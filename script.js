document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
    loadProjects();
    setupScrollAnimations();
    setupSmoothScroll();
    setupMobileNav();
    updateNavbarActiveState();
});

/* ============================================
   LIGHT / DARK THEME TOGGLE
   ------------------------------------------------
   Defaults to the visitor's OS preference (prefers-color-scheme)
   on first visit, then remembers whatever they pick in
   localStorage so it persists across reloads.
   ============================================ */
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = stored || (prefersLight ? 'light' : 'dark');

    applyTheme(initial);

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        if (toggle) {
            toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        }
    }
}

/* ============================================
   MOBILE NAV (hamburger menu)
   ============================================ */
function setupMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after tapping a link
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ============================================
   FALLBACK PROJECT DATA
   ------------------------------------------------
   fetch('projects.json') only works when the site is
   served over http(s) — GitHub Pages, a local dev server,
   etc. Opening index.html directly from disk (file://)
   blocks that fetch due to the browser's CORS rules, which
   used to show "Failed to load projects". This embedded
   copy is used automatically whenever the fetch fails, so
   the page always works. Keep this in sync with
   projects.json when you add/edit projects.
   ============================================ */
const FALLBACK_PROJECTS = [
  {
    "id": 1,
    "name": "Flight Ticket Booking App",
    "description": "Architected a full flight-booking flow end-to-end with dynamic search, seat selection, and digital ticket generation.",
    "technologies": ["Kotlin", "Jetpack Compose", "MVVM", "Firebase", "Kotlinx Serialization"],
    "image": "https://res.cloudinary.com/deirc2clp/image/upload/v1788737987/image_2026-09-07_02-36-50_rweiak.png",
    "github": "https://github.com/x0t68/TicketBookingApp",
    "features": [
      "End-to-end flight-booking flow: passenger selection, flight class, and date pickers.",
      "Engineered a real-time interactive seat-selection map with observable states.",
      "Resolved complex data-loading and layout-constraint bugs for a flawless UI.",
      "QR/barcode digital ticket generation."
    ],
    "status": "Active"
  },
  {
    "id": 2,
    "name": "Music Player App",
    "description": "A high-performance local music player providing a seamless audio experience with a focus on speed, design, and usability.",
    "technologies": ["Kotlin", "Jetpack Compose", "ExoPlayer", "Room", "Coroutines"],
    "image": "https://res.cloudinary.com/deirc2clp/image/upload/v1788737989/image_2026-09-07_02-37-08_gqorlm.png",
    "github": "https://github.com/x0t68/MusicApp",
    "features": [
      "Media3 ExoPlayer Integration: High-quality audio playback and media session support.",
      "Background Playback: Full notification controls even when locked.",
      "Smart Categorization & Offline Library: Scans Songs, Albums, and Folders dynamically.",
      "Interactive Waveform Visualizer & Material 3 UI with dynamic colors."
    ],
    "status": "Active"
  },
  {
    "id": 3,
    "name": "Restaurant App (Little Lemon)",
    "description": "A sleek Mediterranean restaurant application featuring remote data fetching, offline-first persistence, and dynamic UI.",
    "technologies": ["Kotlin", "Jetpack Compose", "Ktor", "Room Database", "Serialization"],
    "image": "https://res.cloudinary.com/deirc2clp/image/upload/v1788737988/image_2026-09-07_02-36-42_iseygi.png",
    "github": "https://github.com/x0t68/Little-lemon",
    "features": [
      "Dynamic Menu Integration: Real-time fetching of structured menus via Ktor.",
      "Offline-First Architecture: Room Database caching for uninterrupted functionality.",
      "Smart Search & Categorization: Real-time filtering and horizontal category tabs.",
      "Meta Android Developer Capstone project demonstrating production-grade architecture."
    ],
    "status": "Active"
  },
  {
    "id": 4,
    "name": "Appointment Booking App",
    "description": "A professional appointment scheduling application with searchable doctor-discovery flow and detailed provider profiles.",
    "technologies": ["Kotlin", "Jetpack Compose", "MVVM", "Android SDK"],
    "image": "https://res.cloudinary.com/deirc2clp/image/upload/v1788737988/image_2026-09-07_02-36-58_ps5c7l.png",
    "github": "https://github.com/x0t68/AppointmentApp",
    "features": [
      "Searchable doctor-discovery flow.",
      "Detailed provider profiles with experience/pricing display.",
      "MVVM architecture separating UI state from business logic.",
      "Responsive UI across multiple screens (splash, search, profile)."
    ],
    "status": "Active"
  },
  {
    "id": 5,
    "name": "Car Store App",
    "description": "An Android e-commerce application for browsing and viewing cars, demonstrating clean architecture and modern practices.",
    "technologies": ["Kotlin", "Jetpack Compose", "MVVM", "Firebase", "Cloudinary"],
    "image": "https://res.cloudinary.com/deirc2clp/image/upload/v1788970776/image_2026-09-09_19-18-29_iatdg4.png",
    "github": "https://github.com/x0t68/CarsShop",
    "features": [
      "Authentication: Firebase-based login & registration.",
      "Cloudinary Integration: Dynamically store & fetch car images.",
      "Car Details Screen: Shows specifications and capabilities of each car.",
      "Modern Material 3 UI built entirely with Compose."
    ],
    "status": "Active"
  }
];

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.warn('Could not fetch projects.json (expected when opening the file directly instead of via a server). Using built-in project data instead.', error);
        displayProjects(FALLBACK_PROJECTS);
    }
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
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
                <button class="btn btn-secondary view-details-btn" style="flex:1; width:100%; border:none; background:var(--surface-light); color:var(--text-primary); cursor:pointer;">View Details</button>
            </div>
        </div>
    `;

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
    document.body.style.overflow = 'hidden';
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

/* ============================================
   SCROLL ANIMATIONS & UTILS
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

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

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

window.addEventListener('scroll', function() {
    updateNavbarActiveState();
});

function updateNavbarActiveState() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
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
