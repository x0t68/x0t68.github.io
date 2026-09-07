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
