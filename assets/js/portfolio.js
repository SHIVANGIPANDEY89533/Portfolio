/**
 * Portfolio Renderer
 * Reads data from PortfolioData and renders it into index.html
 */

document.addEventListener('DOMContentLoaded', renderAll);

function renderAll() {
  const data = PortfolioData.getData();
  renderSidebar(data.profile, data.socials);
  renderAbout(data.profile, data.skills);
  renderProjects(data.projects);
  renderEducation(data.education, data.certifications);
  renderContact(data.profile, data.socials);
}

/* ── Sidebar ─────────────────────────────────────────── */
function renderSidebar(p, s) {
  set('profile-avatar', el => { el.src = p.avatar || 'assets/images/self.jpg'; el.alt = p.name; });
  setText('profile-name', p.name);
  setText('profile-title', p.title);

  setLink('contact-email', p.email, `mailto:${p.email}`);
  setLink('contact-phone', p.phone, `tel:${p.phone}`);
  setText('contact-birthday', p.birthday);
  setText('contact-location', p.location);

  setSocial('social-facebook', s.facebook);
  setSocial('social-twitter', s.twitter);
  setSocial('social-instagram', s.instagram);
  setSocial('social-linkedin', s.linkedin);
  setSocial('social-github', s.github);

  const resumeBtn = document.getElementById('resume-download');
  if (resumeBtn) {
    resumeBtn.style.display = p.resumeUrl ? '' : 'none';
    resumeBtn.href = p.resumeUrl || '#';
  }
}

/* ── About Tab ────────────────────────────────────────── */
function renderAbout(p, skills) {
  setText('about-bio', p.bio);

  const list = document.getElementById('skills-list');
  if (!list) return;
  list.innerHTML = skills.map(sk => `
    <li class="service-item">
      <div class="service-icon-box">
        ${sk.icon
          ? `<img src="${escHtml(sk.icon)}" alt="${escHtml(sk.name)}" width="40">`
          : `<span class="skill-letter">${escHtml(sk.name[0])}</span>`}
      </div>
      <div class="service-content-box">
        <h4 class="h4 service-item-title">${escHtml(sk.name)}</h4>
        <p class="service-item-text">${escHtml(sk.description)}</p>
      </div>
    </li>`).join('');
}

/* ── Projects Tab ─────────────────────────────────────── */
function renderProjects(projects) {
  const list = document.getElementById('projects-list');
  if (!list) return;

  if (!projects.length) {
    list.innerHTML = '<p class="empty-msg">No projects yet — add some from the <a href="admin.html">Admin Panel</a>.</p>';
    return;
  }

  list.innerHTML = projects.map(proj => `
    <li class="project-item active">
      <a href="${proj.link || '#'}" ${proj.link ? 'target="_blank" rel="noopener"' : ''}>
        <figure class="project-img">
          ${proj.image
            ? `<img src="${escHtml(proj.image)}" alt="${escHtml(proj.title)}" loading="lazy">`
            : `<div class="proj-placeholder"><ion-icon name="folder-open-outline"></ion-icon></div>`}
          <div class="proj-overlay"><ion-icon name="eye-outline"></ion-icon></div>
        </figure>
        <h3 class="project-title">${escHtml(proj.title)}</h3>
        <p class="project-category">${escHtml(proj.description)}</p>
        <div class="proj-tags">
          ${(proj.tags || []).map(t => `<span class="proj-tag">${escHtml(t)}</span>`).join('')}
        </div>
      </a>
    </li>`).join('');
}

/* ── Education Tab ────────────────────────────────────── */
function renderEducation(education, certifications) {
  // Education list
  const eduList = document.getElementById('education-list');
  if (eduList) {
    if (!education.length) {
      eduList.innerHTML = '<p class="empty-msg">No education entries yet.</p>';
    } else {
      eduList.innerHTML = education.map(e => `
        <li class="edu-item">
          <div class="edu-icon"><ion-icon name="school-outline"></ion-icon></div>
          <div class="edu-content">
            <h4 class="h4">${escHtml(e.degree)}</h4>
            <p class="edu-institution">${escHtml(e.institution)}</p>
            <time>${escHtml(e.year)}</time>
            <p class="edu-desc">${escHtml(e.description)}</p>
          </div>
        </li>`).join('');
    }
  }

  // Certifications list
  const certList = document.getElementById('certifications-list');
  if (certList) {
    if (!certifications.length) {
      certList.innerHTML = '<p class="empty-msg">No certifications yet — add some from the <a href="admin.html">Admin Panel</a>.</p>';
    } else {
      certList.innerHTML = certifications.map(c => `
        <li class="cert-item">
          ${c.image ? `<img src="${escHtml(c.image)}" alt="${escHtml(c.name)}" class="cert-img">` : ''}
          <div class="cert-info">
            <h4 class="h4">${escHtml(c.name)}</h4>
            <p class="cert-issuer">${escHtml(c.issuer)}</p>
            <time>${escHtml(c.date)}</time>
          </div>
        </li>`).join('');
    }
  }
}

/* ── Helpers ──────────────────────────────────────────── */
function set(id, fn) { const el = document.getElementById(id); if (el) fn(el); }
function setText(id, text) { set(id, el => el.textContent = text || ''); }
function setLink(id, text, href) { set(id, el => { el.textContent = text || ''; el.href = href || '#'; }); }
function setSocial(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  if (url) { el.href = url; el.parentElement.style.display = ''; }
  else { el.parentElement.style.display = 'none'; }
}

/* ── Contact Tab ──────────────────────────────────────── */
function renderContact(p, s) {
  // Update phone card
  const phoneCard = document.getElementById('contact-card-phone');
  if (phoneCard && p.phone) {
    phoneCard.href = `tel:${p.phone}`;
    const val = document.getElementById('cc-phone');
    if (val) val.textContent = p.phone;
  }

  // Update WhatsApp card (strip non-digits)
  const waCard = document.getElementById('contact-card-whatsapp');
  if (waCard && p.phone) {
    const digits = p.phone.replace(/\D/g, '');
    waCard.href = `https://wa.me/${digits}?text=Hi%20${encodeURIComponent(p.name)}%2C%20I%20found%20your%20portfolio!`;
  }

  // Update email card
  const emailCard = document.getElementById('contact-card-email');
  if (emailCard && p.email) {
    emailCard.href = `mailto:${p.email}`;
    const val = document.getElementById('cc-email');
    if (val) val.textContent = p.email;
  }

  // Location
  const locEl = document.getElementById('cc-location');
  if (locEl && p.location) locEl.textContent = p.location;

  // Social pills
  const socialsRow = document.getElementById('cc-socials');
  if (!socialsRow) return;

  const socialDefs = [
    { key: 'facebook',  icon: 'logo-facebook',  label: 'Facebook',  color: '#1877f2' },
    { key: 'twitter',   icon: 'logo-twitter',   label: 'Twitter/X', color: '#1da1f2' },
    { key: 'instagram', icon: 'logo-instagram', label: 'Instagram', color: '#e1306c' },
    { key: 'linkedin',  icon: 'logo-linkedin',  label: 'LinkedIn',  color: '#0a66c2' },
    { key: 'github',    icon: 'logo-github',    label: 'GitHub',    color: '#f0f6fc'  },
  ];

  socialsRow.innerHTML = socialDefs
    .filter(d => s[d.key])
    .map(d => `
      <a href="${escHtml(s[d.key])}" target="_blank" rel="noopener"
         class="cc-social-pill" style="--pill-color:${d.color}">
        <ion-icon name="${d.icon}"></ion-icon>
        <span>${d.label}</span>
      </a>`)
    .join('');
}
