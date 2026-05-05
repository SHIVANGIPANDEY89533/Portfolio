/**
 * Portfolio Data Manager
 * All data is stored in localStorage and can be edited from admin.html
 */

const STORAGE_KEY = 'portfolio_v1';

const DEFAULT_DATA = {
  profile: {
    name: "Shivangi Pandey",
    title: "Data Engineering Enthusiast",
    bio: "Data Engineering enthusiast currently exploring the power of Microsoft Azure ☁️. Skilled in Python, GitHub, MS Office, Linux CLI, Canva, and front-end basics. Ready to transform data into impact — one project at a time.",
    avatar: "assets/images/self.jpg",
    email: "shivangipandey89533@gmail.com",
    phone: "+918953314748",
    birthday: "February 18, 2004",
    location: "Lucknow, Uttar Pradesh",
    resumeUrl: ""
  },
  socials: {
    facebook: "https://www.facebook.com/share/1GdK2erdS4/",
    twitter: "https://x.com/pandey_41872?t=V52cZhScWndG9gBKl1R2dw&s=09",
    instagram: "https://www.instagram.com/_brahmin_girl_8090/profilecard/?igsh=ejF2a3R3a2x1aXgy",
    linkedin: "",
    github: ""
  },
  skills: [
    { id: "s1", name: "Python", description: "Applied advanced Python concepts in data analysis, automation, and machine learning workflows using Pandas, MatPlotLib.", icon: "assets/images/python.png" },
    { id: "s2", name: "Microsoft Tools", description: "Skilled in leveraging Microsoft Office Suite for efficient documentation, data analysis, and presentations.", icon: "assets/images/ms.jpg" },
    { id: "s3", name: "Front End Developer", description: "Creating fast, responsive, and dynamic websites using pure HTML, CSS, and JavaScript.", icon: "assets/images/fed.jpeg" },
    { id: "s4", name: "Languages", description: "Professional proficiency in English and Hindi.", icon: "assets/images/language.webp" },
    { id: "s5", name: "Linux (Terminal)", description: "Familiar with Linux terminal commands for file management, navigation, and system operations.", icon: "assets/images/linu.jpg" },
    { id: "s6", name: "Canva", description: "Transforming ideas into impactful visuals with Canva.", icon: "assets/images/canva.jpg" },
    { id: "s7", name: "GitHub", description: "Keeping code clean, tracked, and collaborative — one commit at a time.", icon: "assets/images/GitHub-Symbol-700x394.png" }
  ],
  projects: [
    { id: "p1", title: "Portfolio Website", description: "A dynamic personal portfolio with an admin panel for easy content management.", tags: ["HTML", "CSS", "JavaScript"], image: "", link: "", github: "" }
  ],
  education: [
    { id: "ed1", degree: "B.Tech / B.Sc", institution: "Your University", year: "2022 – Present", description: "Currently pursuing degree. Update this from the admin panel." }
  ],
  certifications: [],
  adminPassword: btoa("admin123")
};

const PortfolioData = {
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { this.saveData(DEFAULT_DATA); return structuredClone(DEFAULT_DATA); }
      const data = JSON.parse(raw);
      // Ensure all keys exist (for upgrades)
      if (!data.certifications) data.certifications = [];
      if (!data.socials.linkedin) data.socials.linkedin = "";
      if (!data.socials.github) data.socials.github = "";
      return data;
    } catch { return structuredClone(DEFAULT_DATA); }
  },

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // --- Profile ---
  getProfile() { return this.getData().profile; },
  getSocials() { return this.getData().socials; },

  updateProfile(updates) {
    const data = this.getData();
    data.profile = { ...data.profile, ...updates };
    this.saveData(data);
  },

  updateSocials(updates) {
    const data = this.getData();
    data.socials = { ...data.socials, ...updates };
    this.saveData(data);
  },

  // --- Skills ---
  getSkills() { return this.getData().skills; },

  addSkill(skill) {
    const data = this.getData();
    skill.id = 's' + Date.now();
    data.skills.push(skill);
    this.saveData(data);
    return skill;
  },

  updateSkill(id, updates) {
    const data = this.getData();
    const i = data.skills.findIndex(s => s.id === id);
    if (i !== -1) data.skills[i] = { ...data.skills[i], ...updates };
    this.saveData(data);
  },

  deleteSkill(id) {
    const data = this.getData();
    data.skills = data.skills.filter(s => s.id !== id);
    this.saveData(data);
  },

  reorderSkills(ordered) {
    const data = this.getData();
    data.skills = ordered;
    this.saveData(data);
  },

  // --- Projects ---
  getProjects() { return this.getData().projects; },

  addProject(project) {
    const data = this.getData();
    project.id = 'p' + Date.now();
    data.projects.push(project);
    this.saveData(data);
    return project;
  },

  updateProject(id, updates) {
    const data = this.getData();
    const i = data.projects.findIndex(p => p.id === id);
    if (i !== -1) data.projects[i] = { ...data.projects[i], ...updates };
    this.saveData(data);
  },

  deleteProject(id) {
    const data = this.getData();
    data.projects = data.projects.filter(p => p.id !== id);
    this.saveData(data);
  },

  // --- Education ---
  getEducation() { return this.getData().education; },

  addEducation(edu) {
    const data = this.getData();
    edu.id = 'ed' + Date.now();
    data.education.push(edu);
    this.saveData(data);
    return edu;
  },

  updateEducation(id, updates) {
    const data = this.getData();
    const i = data.education.findIndex(e => e.id === id);
    if (i !== -1) data.education[i] = { ...data.education[i], ...updates };
    this.saveData(data);
  },

  deleteEducation(id) {
    const data = this.getData();
    data.education = data.education.filter(e => e.id !== id);
    this.saveData(data);
  },

  // --- Certifications ---
  getCertifications() { return this.getData().certifications; },

  addCertification(cert) {
    const data = this.getData();
    cert.id = 'c' + Date.now();
    data.certifications.push(cert);
    this.saveData(data);
    return cert;
  },

  updateCertification(id, updates) {
    const data = this.getData();
    const i = data.certifications.findIndex(c => c.id === id);
    if (i !== -1) data.certifications[i] = { ...data.certifications[i], ...updates };
    this.saveData(data);
  },

  deleteCertification(id) {
    const data = this.getData();
    data.certifications = data.certifications.filter(c => c.id !== id);
    this.saveData(data);
  },

  // --- Admin Auth ---
  verifyPassword(pwd) { return this.getData().adminPassword === btoa(pwd); },
  changePassword(newPwd) {
    const data = this.getData();
    data.adminPassword = btoa(newPwd);
    this.saveData(data);
  },

  // --- Backup ---
  exportData() { return JSON.stringify(this.getData(), null, 2); },
  importData(json) {
    try { this.saveData(JSON.parse(json)); return true; }
    catch { return false; }
  },
  resetToDefaults() { this.saveData(structuredClone(DEFAULT_DATA)); }
};

// Helper: escape HTML
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
