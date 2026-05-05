/* Admin Panel Logic */

/* ── Auth ───────────────────────────────────────────── */
function doLogin() {
  const pwd = document.getElementById('pwd-input').value;
  if (PortfolioData.verifyPassword(pwd)) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').classList.add('visible');
    loadAllSections();
  } else {
    document.getElementById('login-err').textContent = 'Incorrect password. Try again.';
  }
}

function doLogout() {
  document.getElementById('admin-app').classList.remove('visible');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('pwd-input').value = '';
  document.getElementById('login-err').textContent = '';
}

/* ── Tab Navigation ─────────────────────────────────── */
document.querySelectorAll('.nav-item[data-target]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.target));
});

function switchTab(name) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const btn = document.querySelector(`.nav-item[data-target="${name}"]`);
  if (btn) btn.classList.add('active');
  const sec = document.getElementById(`sec-${name}`);
  if (sec) sec.classList.add('active');
}

/* ── Toast ──────────────────────────────────────────── */
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
  t.className = `show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3000);
}

/* ── Load All ───────────────────────────────────────── */
function loadAllSections() {
  loadDashboard();
  loadProfileForm();
  loadSkillsList();
  loadProjectsList();
  loadEducationList();
  loadCertsList();
}

/* ── Dashboard ──────────────────────────────────────── */
function loadDashboard() {
  const data = PortfolioData.getData();
  const row = document.getElementById('stats-row');
  const items = [
    { label: 'Skills', count: data.skills.length, icon: '⭐' },
    { label: 'Projects', count: data.projects.length, icon: '💼' },
    { label: 'Education', count: data.education.length, icon: '🎓' },
    { label: 'Certifications', count: data.certifications.length, icon: '🏆' },
  ];
  row.innerHTML = items.map(i => `
    <div class="stat-card">
      <div style="font-size:28px;margin-bottom:6px">${i.icon}</div>
      <div class="stat-number">${i.count}</div>
      <div class="stat-label">${i.label}</div>
    </div>`).join('');
}

/* ── Profile ────────────────────────────────────────── */
function loadProfileForm() {
  const p = PortfolioData.getProfile();
  const s = PortfolioData.getSocials();
  document.getElementById('admin-avatar-preview').src = p.avatar || 'assets/images/self.jpg';
  setVal('p-name', p.name); setVal('p-title', p.title); setVal('p-bio', p.bio);
  setVal('p-email', p.email); setVal('p-phone', p.phone);
  setVal('p-birthday', p.birthday); setVal('p-location', p.location);
  setVal('p-resume', p.resumeUrl);
  setVal('s-facebook', s.facebook); setVal('s-twitter', s.twitter);
  setVal('s-instagram', s.instagram); setVal('s-linkedin', s.linkedin);
  setVal('s-github', s.github);
}

function handleAvatarUpload(input) {
  if (!input.files[0]) return;
  readFile(input.files[0], dataUrl => openCropModal(dataUrl));
}

function saveProfile() {
  PortfolioData.updateProfile({
    name: getVal('p-name'), title: getVal('p-title'), bio: getVal('p-bio'),
    email: getVal('p-email'), phone: getVal('p-phone'),
    birthday: getVal('p-birthday'), location: getVal('p-location'),
    resumeUrl: getVal('p-resume')
  });
  toast('Profile saved!');
}

function saveSocials() {
  PortfolioData.updateSocials({
    facebook: getVal('s-facebook'), twitter: getVal('s-twitter'),
    instagram: getVal('s-instagram'), linkedin: getVal('s-linkedin'),
    github: getVal('s-github')
  });
  toast('Social links saved!');
}

/* ── Skills ─────────────────────────────────────────── */
function loadSkillsList() {
  const skills = PortfolioData.getSkills();
  document.getElementById('skills-admin-list').innerHTML = skills.length
    ? skills.map(sk => skillCard(sk)).join('')
    : '<p style="color:var(--muted)">No skills yet. Add one above.</p>';
}

function skillCard(sk) {
  return `<div class="item-card" id="sk-card-${sk.id}">
    ${sk.icon
      ? `<img class="item-icon" src="${escHtml(sk.icon)}" alt="">`
      : `<div class="item-icon-letter">${escHtml(sk.name[0])}</div>`}
    <div class="item-body">
      <div class="item-name">${escHtml(sk.name)}</div>
      <div class="item-desc">${escHtml(sk.description)}</div>
      <div class="item-actions">
        <button class="btn btn-ghost btn-sm" onclick="editSkill('${sk.id}')">
          <ion-icon name="create-outline"></ion-icon> Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteSkill('${sk.id}')">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    </div>
  </div>`;
}

function previewSkillIcon(input) {
  if (!input.files[0]) return;
  readFile(input.files[0], d => {
    document.getElementById('sk-icon-data').value = d;
    const img = document.getElementById('sk-icon-preview');
    img.src = d; img.style.display = 'block';
  });
}

function addSkill() {
  const name = getVal('sk-name'), desc = getVal('sk-desc'), icon = getVal('sk-icon-data');
  if (!name) return toast('Skill name is required', 'error');
  PortfolioData.addSkill({ name, description: desc, icon });
  setVal('sk-name', ''); setVal('sk-desc', ''); setVal('sk-icon-data', '');
  document.getElementById('sk-icon-preview').style.display = 'none';
  togglePanel('skill-add-panel');
  loadSkillsList(); loadDashboard(); toast('Skill added!');
}

function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  PortfolioData.deleteSkill(id); loadSkillsList(); loadDashboard(); toast('Skill deleted');
}

function editSkill(id) {
  const sk = PortfolioData.getSkills().find(s => s.id === id);
  if (!sk) return;
  openModal('Edit Skill', `
    <div class="form-group" style="margin-bottom:12px"><label>Name</label>
      <input type="text" id="m-sk-name" value="${escHtml(sk.name)}"></div>
    <div class="form-group" style="margin-bottom:12px"><label>Description</label>
      <textarea id="m-sk-desc" rows="3">${escHtml(sk.description)}</textarea></div>
    <div class="form-group"><label>Icon (upload new to replace)</label>
      <label class="upload-btn" for="m-sk-icon"><ion-icon name="image-outline"></ion-icon> Choose</label>
      <input id="m-sk-icon" type="file" accept="image/*" style="display:none"
             onchange="readFile(this.files[0], d => { document.getElementById('m-sk-icon-data').value = d; })">
      <input type="hidden" id="m-sk-icon-data" value="${escHtml(sk.icon || '')}">
    </div>`,
    () => {
      PortfolioData.updateSkill(id, {
        name: getVal('m-sk-name'),
        description: getVal('m-sk-desc'),
        icon: getVal('m-sk-icon-data') || sk.icon
      });
      loadSkillsList(); toast('Skill updated!');
    }
  );
}

/* ── Projects ───────────────────────────────────────── */
function loadProjectsList() {
  const projects = PortfolioData.getProjects();
  document.getElementById('projects-admin-list').innerHTML = projects.length
    ? projects.map(pr => projectCard(pr)).join('')
    : '<p style="color:var(--muted)">No projects yet. Add one above.</p>';
}

function projectCard(pr) {
  return `<div class="item-card" id="pr-card-${pr.id}">
    ${pr.image
      ? `<img class="item-icon" src="${escHtml(pr.image)}" alt="" style="border-radius:8px;object-fit:cover;">`
      : `<div class="item-icon-letter">💼</div>`}
    <div class="item-body">
      <div class="item-name">${escHtml(pr.title)}</div>
      <div class="item-desc">${escHtml(pr.description)}</div>
      <div class="item-actions">
        <button class="btn btn-ghost btn-sm" onclick="editProject('${pr.id}')">
          <ion-icon name="create-outline"></ion-icon> Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteProject('${pr.id}')">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    </div>
  </div>`;
}

function previewProjectImg(input) {
  if (!input.files[0]) return;
  readFile(input.files[0], d => {
    document.getElementById('pr-img-data').value = d;
    const img = document.getElementById('pr-img-preview');
    img.src = d; img.style.display = 'block';
  });
}

function addProject() {
  const title = getVal('pr-title');
  if (!title) return toast('Project title required', 'error');
  const tagsRaw = getVal('pr-tags');
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  PortfolioData.addProject({
    title, description: getVal('pr-desc'), tags,
    link: getVal('pr-link'), github: getVal('pr-github'),
    image: getVal('pr-img-data')
  });
  ['pr-title','pr-desc','pr-tags','pr-link','pr-github','pr-img-data'].forEach(id => setVal(id,''));
  document.getElementById('pr-img-preview').style.display = 'none';
  togglePanel('project-add-panel');
  loadProjectsList(); loadDashboard(); toast('Project added!');
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  PortfolioData.deleteProject(id); loadProjectsList(); loadDashboard(); toast('Project deleted');
}

function editProject(id) {
  const pr = PortfolioData.getProjects().find(p => p.id === id);
  if (!pr) return;
  openModal('Edit Project', `
    <div class="form-grid">
      <div class="form-group"><label>Title</label><input type="text" id="m-pr-title" value="${escHtml(pr.title)}"></div>
      <div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="m-pr-tags" value="${escHtml((pr.tags||[]).join(', '))}"></div>
      <div class="form-group span2"><label>Description</label><textarea id="m-pr-desc" rows="2">${escHtml(pr.description)}</textarea></div>
      <div class="form-group"><label>Live Link</label><input type="url" id="m-pr-link" value="${escHtml(pr.link||'')}"></div>
      <div class="form-group"><label>GitHub Link</label><input type="url" id="m-pr-github" value="${escHtml(pr.github||'')}"></div>
    </div>`,
    () => {
      const tags = getVal('m-pr-tags').split(',').map(t=>t.trim()).filter(Boolean);
      PortfolioData.updateProject(id, {
        title: getVal('m-pr-title'), description: getVal('m-pr-desc'),
        tags, link: getVal('m-pr-link'), github: getVal('m-pr-github')
      });
      loadProjectsList(); toast('Project updated!');
    }
  );
}

/* ── Education ──────────────────────────────────────── */
function loadEducationList() {
  const edu = PortfolioData.getEducation();
  document.getElementById('education-admin-list').innerHTML = edu.length
    ? edu.map(e => `<div class="item-card" id="ed-card-${e.id}">
        <div class="item-icon-letter">🎓</div>
        <div class="item-body">
          <div class="item-name">${escHtml(e.degree)}</div>
          <div class="item-desc">${escHtml(e.institution)} · ${escHtml(e.year)}</div>
          <div class="item-actions">
            <button class="btn btn-ghost btn-sm" onclick="editEducation('${e.id}')">
              <ion-icon name="create-outline"></ion-icon> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteEducation('${e.id}')">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>`).join('')
    : '<p style="color:var(--muted)">No education entries yet.</p>';
}

function addEducation() {
  const degree = getVal('ed-degree');
  if (!degree) return toast('Degree is required', 'error');
  PortfolioData.addEducation({
    degree, institution: getVal('ed-institution'),
    year: getVal('ed-year'), description: getVal('ed-desc')
  });
  ['ed-degree','ed-institution','ed-year','ed-desc'].forEach(id => setVal(id,''));
  togglePanel('edu-add-panel');
  loadEducationList(); loadDashboard(); toast('Education added!');
}

function deleteEducation(id) {
  if (!confirm('Delete this entry?')) return;
  PortfolioData.deleteEducation(id); loadEducationList(); loadDashboard(); toast('Deleted');
}

function editEducation(id) {
  const e = PortfolioData.getEducation().find(x => x.id === id);
  if (!e) return;
  openModal('Edit Education', `
    <div class="form-group" style="margin-bottom:12px"><label>Degree</label><input type="text" id="m-ed-degree" value="${escHtml(e.degree)}"></div>
    <div class="form-group" style="margin-bottom:12px"><label>Institution</label><input type="text" id="m-ed-inst" value="${escHtml(e.institution)}"></div>
    <div class="form-group" style="margin-bottom:12px"><label>Year</label><input type="text" id="m-ed-year" value="${escHtml(e.year)}"></div>
    <div class="form-group"><label>Description</label><textarea id="m-ed-desc" rows="2">${escHtml(e.description)}</textarea></div>`,
    () => {
      PortfolioData.updateEducation(id, {
        degree: getVal('m-ed-degree'), institution: getVal('m-ed-inst'),
        year: getVal('m-ed-year'), description: getVal('m-ed-desc')
      });
      loadEducationList(); toast('Education updated!');
    }
  );
}

/* ── Certifications ─────────────────────────────────── */
function loadCertsList() {
  const certs = PortfolioData.getCertifications();
  document.getElementById('certs-admin-list').innerHTML = certs.length
    ? certs.map(c => `<div class="item-card" id="ce-card-${c.id}">
        ${c.image ? `<img class="item-icon" src="${escHtml(c.image)}" alt="">` : `<div class="item-icon-letter">🏆</div>`}
        <div class="item-body">
          <div class="item-name">${escHtml(c.name)}</div>
          <div class="item-desc">${escHtml(c.issuer)} · ${escHtml(c.date)}</div>
          <div class="item-actions">
            <button class="btn btn-danger btn-sm" onclick="deleteCert('${c.id}')">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>`).join('')
    : '<p style="color:var(--muted)">No certifications yet.</p>';
}

function previewCertImg(input) {
  if (!input.files[0]) return;
  readFile(input.files[0], d => {
    document.getElementById('ce-img-data').value = d;
    const img = document.getElementById('ce-img-preview');
    img.src = d; img.style.display = 'block';
  });
}

function addCertification() {
  const name = getVal('ce-name');
  if (!name) return toast('Name is required', 'error');
  PortfolioData.addCertification({
    name, issuer: getVal('ce-issuer'),
    date: getVal('ce-date'), image: getVal('ce-img-data')
  });
  ['ce-name','ce-issuer','ce-date','ce-img-data'].forEach(id => setVal(id,''));
  document.getElementById('ce-img-preview').style.display = 'none';
  togglePanel('cert-add-panel');
  loadCertsList(); loadDashboard(); toast('Certification added!');
}

function deleteCert(id) {
  if (!confirm('Delete this certification?')) return;
  PortfolioData.deleteCertification(id); loadCertsList(); loadDashboard(); toast('Deleted');
}

/* ── Settings ───────────────────────────────────────── */
function changePassword() {
  const old = getVal('set-old-pwd'), nw = getVal('set-new-pwd'), conf = getVal('set-confirm-pwd');
  if (!PortfolioData.verifyPassword(old)) return toast('Current password is wrong', 'error');
  if (!nw) return toast('New password cannot be empty', 'error');
  if (nw !== conf) return toast('Passwords do not match', 'error');
  PortfolioData.changePassword(nw);
  ['set-old-pwd','set-new-pwd','set-confirm-pwd'].forEach(id => setVal(id,''));
  toast('Password changed!');
}

function exportData() {
  const blob = new Blob([PortfolioData.exportData()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-backup.json';
  a.click();
  toast('Data exported!');
}

function importData(input) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    if (PortfolioData.importData(e.target.result)) {
      loadAllSections(); toast('Data imported successfully!');
    } else {
      toast('Invalid JSON file', 'error');
    }
  };
  reader.readAsText(input.files[0]);
}

function resetData() {
  if (!confirm('Reset all data to defaults? This cannot be undone!')) return;
  PortfolioData.resetToDefaults(); loadAllSections(); toast('Data reset to defaults');
}

/* ── Modal ──────────────────────────────────────────── */
function openModal(title, bodyHtml, onSave) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('edit-modal').style.display = 'flex';
  document.getElementById('modal-save-btn').onclick = () => { onSave(); closeModal(); };
}

function closeModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('edit-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('edit-modal')) closeModal();
});

/* ── Helpers ────────────────────────────────────────── */
function togglePanel(id) {
  document.getElementById(id).classList.toggle('open');
}

function getVal(id) { return (document.getElementById(id)?.value || '').trim(); }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

function readFile(file, cb) {
  const reader = new FileReader();
  reader.onload = e => cb(e.target.result);
  reader.readAsDataURL(file);
}

/* ── Canvas Circular Crop Tool ─────────────────────── */
const Crop = {
  overlay: null, canvas: null, ctx: null,
  img: new Image(),
  scale: 1, minScale: 1,
  offsetX: 0, offsetY: 0,
  dragStartX: 0, dragStartY: 0,
  isDragging: false,
  SIZE: 280,   // canvas pixel size
  onConfirm: null,

  init() {
    if (document.getElementById('crop-modal-overlay')) return;
    const el = document.createElement('div');
    el.id = 'crop-modal-overlay';
    el.style.display = 'none';
    el.innerHTML = `
      <div class="crop-modal-box">
        <h3>✂️ Crop Profile Photo</h3>
        <p>Drag to reposition · Scroll or use slider to zoom</p>
        <div class="crop-canvas-wrap" id="crop-wrap">
          <canvas id="crop-canvas" width="280" height="280"></canvas>
        </div>
        <div class="crop-controls">
          <span>🔍</span>
          <input type="range" id="crop-zoom" min="100" max="300" value="100"
                 oninput="Crop.setZoom(this.value/100)">
          <span>🔎</span>
        </div>
        <div class="crop-actions">
          <button class="crop-btn-confirm" onclick="Crop.confirm()">✅ Use This Photo</button>
          <button class="crop-btn-cancel" onclick="Crop.close()">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    this.overlay = el;
    this.canvas = document.getElementById('crop-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Mouse drag
    this.canvas.addEventListener('mousedown', e => { this.isDragging = true; this.dragStartX = e.clientX - this.offsetX; this.dragStartY = e.clientY - this.offsetY; });
    window.addEventListener('mousemove', e => { if (!this.isDragging) return; this.offsetX = e.clientX - this.dragStartX; this.offsetY = e.clientY - this.dragStartY; this.draw(); });
    window.addEventListener('mouseup', () => this.isDragging = false);

    // Touch drag
    this.canvas.addEventListener('touchstart', e => { const t = e.touches[0]; this.isDragging = true; this.dragStartX = t.clientX - this.offsetX; this.dragStartY = t.clientY - this.offsetY; }, { passive: true });
    window.addEventListener('touchmove', e => { if (!this.isDragging) return; const t = e.touches[0]; this.offsetX = t.clientX - this.dragStartX; this.offsetY = t.clientY - this.dragStartY; this.draw(); }, { passive: true });
    window.addEventListener('touchend', () => this.isDragging = false);

    // Wheel zoom
    this.canvas.addEventListener('wheel', e => { e.preventDefault(); const delta = e.deltaY < 0 ? 0.05 : -0.05; this.setZoom(this.scale + delta); }, { passive: false });
  },

  open(dataUrl, onConfirm) {
    this.init();
    this.onConfirm = onConfirm;
    this.img = new Image();
    this.img.onload = () => {
      // Compute min scale so image always fills the circle
      const { naturalWidth: w, naturalHeight: h } = this.img;
      const smaller = Math.min(w, h);
      this.minScale = this.SIZE / smaller;
      this.scale = this.minScale;
      // Center the image
      this.offsetX = (this.SIZE - w * this.scale) / 2;
      this.offsetY = (this.SIZE - h * this.scale) / 2;
      document.getElementById('crop-zoom').value = 100;
      this.draw();
    };
    this.img.src = dataUrl;
    this.overlay.style.display = 'flex';
  },

  close() { this.overlay.style.display = 'none'; },

  setZoom(val) {
    const newScale = Math.max(this.minScale, Math.min(val, this.minScale * 3));
    // Zoom around center
    const cx = this.SIZE / 2, cy = this.SIZE / 2;
    this.offsetX = cx - (cx - this.offsetX) * (newScale / this.scale);
    this.offsetY = cy - (cy - this.offsetY) * (newScale / this.scale);
    this.scale = newScale;
    const sliderVal = Math.round(((newScale - this.minScale) / (this.minScale * 2)) * 200 + 100);
    const slider = document.getElementById('crop-zoom');
    if (slider) slider.value = Math.min(300, Math.max(100, sliderVal));
    this.draw();
  },

  draw() {
    const c = this.canvas, ctx = this.ctx;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(this.img, this.offsetX, this.offsetY,
      this.img.naturalWidth * this.scale,
      this.img.naturalHeight * this.scale);
  },

  confirm() {
    // Export the canvas as a circular 400x400 JPEG
    const out = document.createElement('canvas');
    out.width = out.height = 400;
    const octx = out.getContext('2d');
    // Scale coords from 280 display to 400 output
    const ratio = 400 / this.SIZE;
    octx.beginPath();
    octx.arc(200, 200, 200, 0, Math.PI * 2);
    octx.clip();
    octx.drawImage(this.img,
      this.offsetX * ratio, this.offsetY * ratio,
      this.img.naturalWidth * this.scale * ratio,
      this.img.naturalHeight * this.scale * ratio);
    const dataUrl = out.toDataURL('image/jpeg', 0.92);
    this.close();
    if (this.onConfirm) this.onConfirm(dataUrl);
  }
};

function openCropModal(dataUrl) {
  Crop.open(dataUrl, croppedUrl => {
    document.getElementById('admin-avatar-preview').src = croppedUrl;
    PortfolioData.updateProfile({ avatar: croppedUrl });
    toast('Profile photo updated! ✨');
  });
}
