// ===== Global Variables =====
let portfolioData = null;
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const mainContent = document.getElementById('main-content');
const currentYearSpan = document.getElementById('currentYear');
const themeToggle = document.getElementById('themeToggle');

// ===== Load JSON Data =====
async function loadPortfolioData() {
    try {
        mainContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-circle-notch fa-spin"></i> Loading portfolio...
            </div>
        `;
        
        // Add timestamp to prevent caching
        const response = await fetch(`data.json?t=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error('Failed to load portfolio data');
        }
        portfolioData = await response.json();
        
        console.log('Portfolio data loaded:', portfolioData); // Check this
        
        renderPortfolio();
        initializeAfterRender();
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        mainContent.innerHTML = `
            <div class="loading" style="color: var(--danger);">
                <i class="fas fa-exclamation-triangle"></i> Failed to load portfolio data. Please check console.
            </div>
        `;
    }
}

// ===== Render Portfolio Sections =====
function renderPortfolio() {
    if (!portfolioData) return;
    
    const sections = [
        renderHeroSection(),
        renderAboutSection(),
        renderSkillsSection(),
        renderCertificationsSection(),
        renderBadgesSection(),
        renderProjectsSection(),
        renderExperienceSection(),
        renderEducationSection(),
        renderClientsSection(),
        renderContactSection()
    ];
    
    mainContent.innerHTML = sections.join('');
}

// ===== Hero Section with Typewriter =====
function renderHeroSection() {
    const { main } = portfolioData;
    const titles = main.titles || ['Cyber Security', 'Information Technology', 'Networking'];
    
    return `
        <section id="home" class="hero-section">
            <div class="hero-overlay"></div>
            <div class="container">
                <div class="hero-content">
                    <div class="hero-text fade-up">
                        <p class="hero-subtitle">${titles[0] || 'Cyber Security'} Professional</p>
                        <h1 class="hero-title">
                            Hi, I'm <span class="hero-title-name">${main.name || 'Aashutosh Chaudhary'}</span>
                        </h1>
                        <div class="typewriter-container">
                            <span class="typewriter-text" id="typewriter"></span>
                        </div>
                        <p class="hero-tagline">${main.shortDesc || ''}</p>
                        <div class="hero-buttons">
                            <a href="#contact" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Connect with me
                            </a>
                            <a href="${portfolioData.about?.resumeUrl || '#'}" target="_blank" class="btn btn-outline">
                                <i class="fas fa-file-pdf"></i> Download Resume
                            </a>
                        </div>
                        
                        ${renderTechStackBadges()}
                    </div>
                    
                    <div class="hero-image fade-up">
                        <div class="image-frame">
                            <div class="image-wrapper">
                                <img src="${main.heroImage || 'https://via.placeholder.com/400'}" 
                                     alt="${main.name || 'Profile'}" 
                                     loading="lazy"
                                     onerror="this.src='https://via.placeholder.com/400'">
                            </div>
                            ${main.titles ? `
                                <div class="image-caption">
                                    <i class="fas fa-shield-alt"></i> ${main.titles[0] || 'Defender'}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <a href="#about" class="scroll-indicator">
                <i class="fas fa-chevron-down"></i>
            </a>
        </section>
    `;
}

function renderTechStackBadges() {
    const { techStackImages } = portfolioData.main;
    if (!techStackImages || !techStackImages.length) return '';
    
    return `
        <div class="tech-stack-badge">
            ${techStackImages.slice(0, 4).map(img => `
                <div class="tech-icon" data-tooltip="Tech Stack">
                    <img src="${img}" alt="Tech Stack" loading="lazy" onerror="this.src='https://via.placeholder.com/30'">
                </div>
            `).join('')}
        </div>
    `;
}

// ===== About Section =====
function renderAboutSection() {
    const { about } = portfolioData;
    if (!about) return '';
    
    return `
        <section id="about" class="about-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">About <span class="gradient-text">Me</span></h2>
                    <p class="section-subtitle">Get to know me better</p>
                </div>
                
                <div class="about-grid">
                    <div class="about-image fade-up">
                        <div class="about-image-wrapper">
                            <img src="${about.aboutImage || 'https://via.placeholder.com/400'}" 
                                 alt="${portfolioData.main.name || 'About'}" 
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/400'">
                            ${about.aboutImageCaption ? `
                                <div class="about-caption">
                                    <i class="fas fa-quote-right"></i> ${about.aboutImageCaption}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="about-content fade-up">
                        <h3>${about.title || 'Network & Security Engineer'}</h3>
                        <div class="about-description">
                            ${(about.about || '').split('\n\n').map(para => 
                                `<p>${para.replace(/\n/g, '<br>')}</p>`
                            ).join('')}
                        </div>
                        
                        <div class="about-actions">
                            <a href="${about.resumeUrl || '#'}" target="_blank" class="btn btn-primary">
                                <i class="fas fa-file-pdf"></i> Download Resume
                            </a>
                            ${about.callUrl ? `
                                <a href="${about.callUrl}" class="btn btn-outline">
                                    <i class="fas fa-phone-alt"></i> Schedule a Call
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// ===== Skills Section =====
function renderSkillsSection() {
    const skills = portfolioData.skills || [];
    const toolSkills = skills.filter(s => s.category === 'Tools');
    
    if (toolSkills.length === 0) return '';
    
    return `
        <section id="skills" class="skills-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Technical <span class="gradient-text">Skills</span></h2>
                    <p class="section-subtitle">Tools and technologies I work with</p>
                </div>
                
                <div class="skills-grid">
                    ${toolSkills.map(skill => `
                        <a href="${skill.url || '#'}" target="_blank" class="skill-card fade-up" rel="noopener">
                            <div class="skill-image">
                                <img src="${skill.image}" alt="${skill.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/60'">
                            </div>
                            <h3>${skill.name}</h3>
                            <span class="skill-category">${skill.category}</span>
                            ${skill.url ? `
                                <div class="skill-url-icon">
                                    <i class="fas fa-external-link-alt"></i>
                                </div>
                            ` : ''}
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Helper function to extract OEM (now uses manual oem field) =====
function getItemOEM(item) {
    // Use manual OEM field if available, otherwise return 'Other'
    return item.oem || 'Other';
}

// ===== Helper function to check if a date is expired =====
function checkIfExpired(expiryDate) {
    if (!expiryDate || expiryDate === 'No Expiry') return false;
    
    // Parse date string (assuming format like "2025" or "Dec 2025")
    let year = 9999;
    if (expiryDate.match(/^\d{4}$/)) {
        year = parseInt(expiryDate);
    } else {
        const match = expiryDate.match(/\d{4}/);
        if (match) year = parseInt(match[0]);
    }
    
    const currentYear = new Date().getFullYear();
    return year < currentYear;
}

// ===== Certifications Section with Manual OEM Filters =====
function renderCertificationsSection() {
    const skills = portfolioData.skills || [];
    const certifications = skills.filter(s => s.category === 'Certifications');
    
    if (certifications.length === 0) return '';
    
    // Get unique OEMs from manual oem field
    const oems = ['All', ...new Set(certifications.map(cert => cert.oem || 'Other'))];
    
    return `
        <section id="certifications" class="certifications-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Professional <span class="gradient-text">Certifications</span></h2>
                    <p class="section-subtitle">Verified credentials and achievements</p>
                </div>
                
                <div class="oem-filters">
                    ${oems.map(oem => `
                        <button class="oem-filter-btn ${oem === 'All' ? 'active' : ''}" data-oem="${oem}">
                            ${oem}
                        </button>
                    `).join('')}
                </div>
                
                <div class="cert-grid">
                    ${certifications.map(cert => {
                        const oem = cert.oem || 'Other';
                        const obtainedDate = cert.obtained || 'N/A';
                        const expiryDate = cert.expiry || 'No Expiry';
                        const isExpired = checkIfExpired(expiryDate);
                        const expiryClass = expiryDate === 'No Expiry' ? '' : (isExpired ? 'expiry-expired' : 'expiry-warning');
                        
                        return `
                            <div class="cert-card fade-up" data-oem="${oem}" data-cert='${JSON.stringify(cert).replace(/'/g, "&apos;")}'>
                                <div class="cert-image">
                                    <img src="${cert.image}" alt="${cert.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/100'">
                                </div>
                                <h3>${cert.name}</h3>
                                <span class="cert-oem">${oem}</span>
                                <div class="cert-dates">
                                    <span><i class="fas fa-calendar-alt"></i> Obtained: ${obtainedDate}</span>
                                    <span class="${expiryClass}"><i class="fas fa-hourglass-half"></i> Expires: ${expiryDate}</span>
                                </div>
                                ${cert.url ? `
                                    <a href="${cert.url}" target="_blank" class="cert-verify" onclick="event.stopPropagation()">
                                        <i class="fas fa-check-circle"></i> Verify
                                    </a>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Badges Section with Manual OEM Filters =====
function renderBadgesSection() {
    const skills = portfolioData.skills || [];
    const badges = skills.filter(s => s.category === 'Badge');
    
    if (badges.length === 0) return '';
    
    // Get unique OEMs from manual oem field
    const oems = ['All', ...new Set(badges.map(badge => badge.oem || 'Other'))];
    
    return `
        <section id="badges" class="badges-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Digital <span class="gradient-text">Badges</span></h2>
                    <p class="section-subtitle">Verified credentials from leading platforms</p>
                </div>
                
                <div class="oem-filters">
                    ${oems.map(oem => `
                        <button class="oem-filter-btn ${oem === 'All' ? 'active' : ''}" data-oem="${oem}">
                            ${oem}
                        </button>
                    `).join('')}
                </div>
                
                <div class="badges-grid">
                    ${badges.map(badge => {
                        const oem = badge.oem || 'Other';
                        const obtainedDate = badge.obtained || 'N/A';
                        const expiryDate = badge.expiry || 'No Expiry';
                        const isExpired = checkIfExpired(expiryDate);
                        const expiryClass = expiryDate === 'No Expiry' ? '' : (isExpired ? 'expiry-expired' : 'expiry-warning');
                        
                        return `
                            <div class="badge-card fade-up" data-oem="${oem}">
                                <div class="badge-image">
                                    <img src="${badge.image}" alt="${badge.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/80'">
                                </div>
                                <h3>${badge.name}</h3>
                                <span class="badge-oem">${oem}</span>
                                <div class="badge-dates">
                                    <span><i class="fas fa-calendar-alt"></i> Obtained: ${obtainedDate}</span>
                                    <span class="${expiryClass}"><i class="fas fa-hourglass-half"></i> Expires: ${expiryDate}</span>
                                </div>
                                <a href="${badge.url || '#'}" target="_blank" class="badge-verify">
                                    <i class="fas fa-check-circle"></i> Verify
                                </a>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Projects Section with Category Filters =====
function renderProjectsSection() {
    const projects = portfolioData.projects || [];
    
    if (projects.length === 0) return '';
    
    // Get unique categories
    const categories = ['All', ...new Set(projects.map(p => p.category || 'Other'))];
    
    return `
        <section id="projects" class="projects-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Featured <span class="gradient-text">Projects</span></h2>
                    <p class="section-subtitle">Work I'm proud of</p>
                </div>
                
                <div class="project-filters">
                    ${categories.map(cat => `
                        <button class="project-filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
                
                <div class="projects-grid">
                    ${projects.map(project => `
                        <div class="project-card fade-up" data-category="${project.category || 'other'}">
                            <div class="project-image">
                                <img src="${project.image}" alt="${project.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x225'">
                                <span class="project-category">${project.category || 'Project'}</span>
                            </div>
                            
                            <div class="project-content">
                                <h3>${project.name}</h3>
                                
                                ${project.techstack ? `
                                    <div class="project-techstack">
                                        ${project.techstack.split(',').map(tech => 
                                            `<span class="tech-tag">${tech.trim()}</span>`
                                        ).join('')}
                                    </div>
                                ` : ''}
                                
                                <p class="project-description">${project.description || ''}</p>
                                
                                <div class="project-links">
                                    ${project.links?.visit ? `
                                        <a href="${project.links.visit}" target="_blank" class="project-link">
                                            <i class="fas fa-external-link-alt"></i> Live Demo
                                        </a>
                                    ` : ''}
                                    ${project.links?.code ? `
                                        <a href="${project.links.code}" target="_blank" class="project-link">
                                            <i class="fab fa-github"></i> Source Code
                                        </a>
                                    ` : ''}
                                    ${project.links?.video ? `
                                        <a href="${project.links.video}" target="_blank" class="project-link">
                                            <i class="fas fa-video"></i> Video Demo
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Experience Section =====
function renderExperienceSection() {
    const experiences = portfolioData.experiences || [];
    
    if (experiences.length === 0) return '';
    
    return `
        <section id="experience" class="experience-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Professional <span class="gradient-text">Experience</span></h2>
                    <p class="section-subtitle">My journey in the industry</p>
                </div>
                
                <div class="timeline">
                    ${experiences.map((exp, index) => `
                        <div class="timeline-item fade-up">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <h3>${exp.position || 'Position'}</h3>
                                    <!-- MODIFIED: Company name now clickable if URL exists -->
                                    <div class="timeline-company">
                                        ${exp.url 
                                            ? `<a href="${exp.url}" target="_blank" rel="noopener noreferrer" class="company-link">
                                                ${exp.company || 'Company'} <i class="fas fa-external-link-alt"></i>
                                               </a>`
                                            : exp.company || 'Company'
                                        }
                                    </div>
                                    <span class="timeline-duration">${exp.duration || ''}</span>
                                </div>
                                
                                ${exp.desc ? `
                                    <ul class="timeline-desc">
                                        ${exp.desc.map(item => `
                                            <li>
                                                <i class="fas fa-chevron-right"></i>
                                                ${item}
                                            </li>
                                        `).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Education Section =====
function renderEducationSection() {
    const educations = portfolioData.educations || [];
    
    if (educations.length === 0) return '';
    
    return `
        <section id="education" class="education-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Educational <span class="gradient-text">Background</span></h2>
                    <p class="section-subtitle">Academic qualifications</p>
                </div>
                
                <div class="education-grid">
                    ${educations.map(edu => `
                        <div class="education-card fade-up">
                            <div class="education-header">
                                <h3>${edu.institute || 'Institute'}</h3>
                                <div class="education-degree">${edu.degree || 'Degree'}</div>
                                <span class="education-duration">${edu.duration || ''}</span>
                            </div>
                            
                            ${edu.desc ? `
                                <ul class="education-desc">
                                    ${edu.desc.map(item => `
                                        <li>
                                            <i class="fas fa-check-circle"></i>
                                            ${item}
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Clients Section =====
function renderClientsSection() {
    // Get clients from portfolioData
    const clients = portfolioData?.clients || [];
    
    console.log('Clients data:', clients); // Check what's in clients
    
    // If no clients, don't show the section
    if (!clients || clients.length === 0) {
        console.log('No clients to display');
        return '';
    }
    
    return `
        <section id="clients" class="clients-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Clients</h2>
                    <p class="section-subtitle">Organizations I've had the pleasure to work with</p>
                </div>
                
                <div class="clients-grid">
                    ${clients.map(client => `
                        <div class="client-card fade-up">
                            <div class="client-logo">
                                <img src="${client.logo || 'https://via.placeholder.com/120'}" 
                                     alt="${client.name}" 
                                     loading="lazy"
                                     onerror="this.src='https://via.placeholder.com/120'">
                            </div>
                            <h3>${client.name}</h3>
                            <p>${client.industry || ''}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Contact Section (Social Only) =====
function renderContactSection() {
    const socials = portfolioData.socials || [];
    
    if (socials.length === 0) return '';
    
    const iconMap = {
        'FaLinkedin': 'fab fa-linkedin-in',
        'FaGithub': 'fab fa-github',
        'FaInstagram': 'fab fa-instagram',
        'FaTwitter': 'fab fa-twitter',
        'FaEnvelope': 'fas fa-envelope'
    };
    
    return `
        <section id="contact" class="contact-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Let's <span class="gradient-text">Connect</span></h2>
                    <p class="section-subtitle">Reach out for collaborations or just a chat</p>
                </div>
                
                <div class="social-grid">
                    ${socials.map(social => {
                        const iconClass = iconMap[social.icon] || 'fas fa-link';
                        const username = extractUsername(social.link);
                        return `
                            <a href="${social.link}" target="_blank" class="social-card" rel="noopener noreferrer">
                                <div class="icon-wrapper">
                                    <i class="${iconClass}"></i>
                                </div>
                                <h3>${social.icon.replace('Fa', '')}</h3>
                                <span>${username}</span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

// ===== Helper Functions =====
function extractUsername(url) {
    if (!url) return 'aashutos';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'aashutos';
}

// ===== Typewriter Effect =====
class TypeWriter {
    constructor(titles, elementId) {
        this.titles = titles;
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        
        this.txt = '';
        this.index = 0;
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        if (!this.element) return;
        
        const current = this.index % this.titles.length;
        const fullTxt = this.titles[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.innerHTML = this.txt;
        
        let speed = 100;
        if (this.isDeleting) speed /= 2;
        
        if (!this.isDeleting && this.txt === fullTxt) {
            speed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.index++;
            speed = 500;
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// ===== Initialize OEM Filters (Manual) =====
function initOEMFilters() {
    const filterBtns = document.querySelectorAll('.oem-filter-btn');
    const certCards = document.querySelectorAll('.cert-card');
    const badgeCards = document.querySelectorAll('.badge-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const oem = btn.dataset.oem;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter certification cards
            certCards.forEach(card => {
                if (oem === 'All' || card.dataset.oem === oem) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Filter badge cards
            badgeCards.forEach(card => {
                if (oem === 'All' || card.dataset.oem === oem) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== Initialize Project Filters =====
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projects.forEach(project => {
                if (filter === 'All' || project.dataset.category === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== Initialize Certificate Modal =====
function initCertificateModal() {
    const modal = document.getElementById('certModal');
    const closeBtn = document.getElementById('closeModal');
    const certCards = document.querySelectorAll('.cert-card');
    
    if (!modal || !closeBtn) return;
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle verify button click separately
    const certVerify = document.getElementById('certVerify');
    if (certVerify) {
        certVerify.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event from bubbling
            // The link will work normally
        });
    }
    
    // Handle card clicks
    certCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on verify link
            if (e.target.closest('.cert-verify')) {
                return;
            }
            
            try {
                const certData = JSON.parse(this.dataset.cert.replace(/&apos;/g, "'"));
                
                // Set modal content
                document.getElementById('certFullImage').src = certData.image || '';
                document.getElementById('certTitle').textContent = certData.name || '';
                document.getElementById('certIssuer').textContent = `Issuer: ${certData.oem || 'Unknown'}`;
                document.getElementById('certObtained').textContent = `Obtained: ${certData.obtained || 'N/A'}`;
                document.getElementById('certExpiry').textContent = `Expires: ${certData.expiry || 'No Expiry'}`;
                
                // Set verify button
                const verifyBtn = document.getElementById('certVerify');
                if (verifyBtn) {
                    if (certData.url) {
                        verifyBtn.href = certData.url;
                        verifyBtn.target = '_blank';
                        verifyBtn.rel = 'noopener noreferrer';
                        verifyBtn.style.display = 'inline-flex';
                        verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Certificate';
                        
                        // Remove any existing click handlers and add fresh one
                        verifyBtn.onclick = function(e) {
                            e.stopPropagation();
                            window.open(certData.url, '_blank');
                            return false;
                        };
                    } else {
                        verifyBtn.style.display = 'none';
                    }
                }
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
            } catch (e) {
                console.error('Error parsing certificate data:', e);
            }
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== Initialize Theme =====
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }
}

// ===== Initialize Active Nav Links =====
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// ===== Sticky Navigation =====
function initStickyNav() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when link clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Intersection Observer for Animations =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.skill-card, .cert-card, .badge-card, .project-card, .timeline-item, .education-card, .client-card, .social-card').forEach(el => {
        el.classList.remove('fade-up');
        observer.observe(el);
    });
}

// ===== Initialize After Render =====
function initializeAfterRender() {
    // Set current year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Initialize theme
    initTheme();
    
    // Initialize typewriter
    if (portfolioData?.main?.titles) {
        new TypeWriter(portfolioData.main.titles, 'typewriter');
    }
    
    // Initialize sticky navigation
    initStickyNav();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize intersection observer
    initIntersectionObserver();
    
    // Initialize OEM filters (manual)
    initOEMFilters();
    
    // Initialize project filters
    initProjectFilters();
    
    // Initialize certificate modal
    initCertificateModal();
    
    // Initialize active nav links
    initActiveNavLinks();
}

// ===== Update logo with name =====
function updateLogo() {
    if (portfolioData?.main?.name) {
        const logo = document.getElementById('logo');
        if (logo) {
            const names = portfolioData.main.name.split(' ');
            if (names.length >= 2) {
                logo.innerHTML = `${names[0]} <span>${names.slice(1).join(' ')}</span>`;
            }
        }
    }
}

// ===== Initialize on Load =====
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData().then(() => {
        updateLogo();
    });
});

// ===== Handle Escape Key for Modal =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('certModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});