/* NovaLearn Student Dashboard */

const metrics = [
  {
    label: "Overall Progress",
    count: 78,
    unit: "%",
    delta: "+6% this month",
    positive: true,
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19H20M8 15V11M12 15V8M16 15V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    label: "Active Courses",
    count: 5,
    unit: "",
    delta: "2 near completion",
    positive: false,
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6H20V18H4V6Z M8 6V18 M4 10H20" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  },
  {
    label: "Study Time",
    count: 24,
    unit: "h",
    delta: "+3.5h this week",
    positive: true,
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><path d="M12 8V12L15 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    label: "Achievements",
    count: 12,
    unit: "",
    delta: "3 unlocked recently",
    positive: true,
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L14.5 9H21L16 13L18 20L12 16L6 20L8 13L3 9H9.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  },
];

const borderGlowDefaults = {
  edgeSensitivity: 30,
  glowColor: "280 70 75",
  backgroundColor: "#1B1B2F",
  borderRadius: 20,
  glowRadius: 32,
  glowIntensity: 1.0,
  coneSpread: 25,
  colors: ["#E026C6", "#7B2FF7", "#c084fc"],
  fillOpacity: 0.45,
};

const courses = [
  { name: "Data Structures & Algorithms", instructor: "Dr. Chen", progress: 86 },
  { name: "Web Development Studio", instructor: "Prof. Rivera", progress: 72 },
  { name: "Linear Algebra", instructor: "Dr. Okonkwo", progress: 64 },
  { name: "Cognitive Psychology", instructor: "Prof. Hale", progress: 91 },
  { name: "Digital Marketing Labs", instructor: "Ms. Park", progress: 45 },
];

const assignments = [
  {
    title: "Binary Tree Traversal Lab",
    course: "Data Structures",
    due: "Due in 2 days",
    status: "due-soon",
    action: "Submit",
  },
  {
    title: "Responsive Landing Page",
    course: "Web Development",
    due: "Due in 5 days",
    status: "in-progress",
    action: "Continue",
  },
  {
    title: "Eigenvalue Problem Set",
    course: "Linear Algebra",
    due: "Submitted",
    status: "submitted",
    action: "Review",
  },
  {
    title: "Memory Experiment Report",
    course: "Cognitive Psychology",
    due: "Due in 8 days",
    status: "in-progress",
    action: "Open",
  },
];

const deadlines = [
  { day: "28", month: "Jul", title: "DSA Midterm Quiz", course: "Data Structures", urgency: "2 days", calm: false },
  { day: "31", month: "Jul", title: "Campaign Brief Draft", course: "Digital Marketing", urgency: "5 days", calm: false },
  { day: "03", month: "Aug", title: "Portfolio Checkpoint", course: "Web Development", urgency: "8 days", calm: true },
  { day: "07", month: "Aug", title: "Chapter 6 Problem Set", course: "Linear Algebra", urgency: "12 days", calm: true },
];

const achievements = [
  { icon: "⚡", name: "Speed Learner", desc: "Completed 5 lessons in one day", time: "Today" },
  { icon: "🎯", name: "Perfect Score", desc: "100% on Psychology quiz", time: "Yesterday" },
  { icon: "🔥", name: "7-Day Streak", desc: "Studied every day this week", time: "2 days ago" },
  { icon: "📚", name: "Course Crusher", desc: "Finished Cognitive Psychology module 4", time: "4 days ago" },
];

const chartData = {
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    scores: [72, 78, 75, 82, 88, 85, 91],
    avg: [70, 72, 74, 76, 78, 80, 82],
  },
  monthly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    scores: [74, 79, 83, 88],
    avg: [70, 73, 76, 80],
  },
};

const studyHours = [2.5, 3.8, 1.5, 4.2, 3.0, 5.1, 3.9];

let performanceChart = null;
let studyChart = null;
let currentPeriod = "weekly";

/* ---------- Renderers ---------- */

function renderMetrics() {
  const grid = document.getElementById("metricsGrid");
  grid.innerHTML = "";

  metrics.forEach((m, i) => {
    const unitHtml = m.unit ? `<span class="metric-unit">${m.unit}</span>` : "";
    const deltaClass = m.positive ? "metric-delta positive" : "metric-delta";

    const content = `
      <article class="metric-card">
        <div class="metric-icon" aria-hidden="true">${m.icon}</div>
        <p class="metric-label">${m.label}</p>
        <p class="metric-value" data-count="${m.count}">0${unitHtml}</p>
        <p class="${deltaClass}">${m.delta}</p>
      </article>`;

    const glow = new BorderGlow({
      ...borderGlowDefaults,
      content,
      animated: i === 0,
      className: "metric-glow",
    });

    glow.mount(grid);
  });
}

function renderCourses() {
  const list = document.getElementById("courseList");
  list.innerHTML = courses
    .map(
      (c) => `
    <li class="course-item">
      <div>
        <p class="course-name">${c.name}</p>
        <p class="course-meta">${c.instructor}</p>
      </div>
      <span class="course-pct">${c.progress}%</span>
      <div class="progress-track" role="progressbar" aria-valuenow="${c.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${c.name} completion">
        <div class="progress-fill" style="width: 0%" data-width="${c.progress}"></div>
      </div>
    </li>`
    )
    .join("");

  requestAnimationFrame(() => {
    list.querySelectorAll(".progress-fill").forEach((el) => {
      el.style.width = `${el.dataset.width}%`;
    });
  });
}

function renderAssignments() {
  const list = document.getElementById("assignmentList");
  list.innerHTML = assignments
    .map(
      (a) => `
    <li class="assignment-item">
      <span class="assignment-status ${a.status}" aria-hidden="true"></span>
      <div>
        <p class="assignment-title">${a.title}</p>
        <p class="assignment-meta">${a.course} · ${a.due}</p>
      </div>
      <button type="button" class="assignment-action" data-action="${a.status === "submitted" ? "grades" : "submit"}" data-item="${a.title}">
        ${a.action}
      </button>
    </li>`
    )
    .join("");
}

function renderDeadlines() {
  const list = document.getElementById("deadlineList");
  list.innerHTML = deadlines
    .map(
      (d) => `
    <li class="deadline-item">
      <div class="deadline-date">
        <span class="deadline-day">${d.day}</span>
        <span class="deadline-month">${d.month}</span>
      </div>
      <div class="deadline-info">
        <p class="deadline-title">${d.title}</p>
        <p class="deadline-course">${d.course}</p>
      </div>
      <span class="deadline-urgency ${d.calm ? "calm" : ""}">${d.urgency}</span>
    </li>`
    )
    .join("");
}

function renderAchievements() {
  const list = document.getElementById("achievementList");
  list.innerHTML = achievements
    .map(
      (a, i) => `
    <li class="achievement-item" style="animation-delay: ${i * 0.08}s">
      <div class="achievement-icon" aria-hidden="true">${a.icon}</div>
      <div>
        <p class="achievement-name">${a.name}</p>
        <p class="achievement-desc">${a.desc}</p>
      </div>
      <span class="achievement-time">${a.time}</span>
    </li>`
    )
    .join("");
}

function renderStudySummary() {
  const total = studyHours.reduce((s, h) => s + h, 0);
  const avg = total / studyHours.length;
  const peak = Math.max(...studyHours);
  const peakDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][studyHours.indexOf(peak)];

  document.getElementById("studySummary").innerHTML = `
    <div class="study-stat">
      <span class="study-stat-value">${total.toFixed(1)}h</span>
      <span class="study-stat-label">Total</span>
    </div>
    <div class="study-stat">
      <span class="study-stat-value">${avg.toFixed(1)}h</span>
      <span class="study-stat-label">Daily avg</span>
    </div>
    <div class="study-stat">
      <span class="study-stat-value">${peakDay}</span>
      <span class="study-stat-label">Peak day</span>
    </div>`;
}

/* ---------- Charts ---------- */

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        color: "#B9B9C9",
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: "circle",
        font: { family: "Outfit", size: 11, weight: "600" },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#1B1B2F",
      titleColor: "#FFFFFF",
      bodyColor: "#B9B9C9",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      padding: 10,
      titleFont: { family: "Outfit", weight: "700" },
      bodyFont: { family: "Outfit" },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
      ticks: { color: "#B9B9C9", font: { family: "Outfit", size: 11 } },
    },
    y: {
      beginAtZero: false,
      min: 50,
      max: 100,
      grid: { color: "rgba(255,255,255,0.06)", drawBorder: false },
      ticks: { color: "#B9B9C9", font: { family: "Outfit", size: 11 } },
    },
  },
};

function createPerformanceChart(period) {
  const ctx = document.getElementById("performanceChart");
  const data = chartData[period];

  if (performanceChart) performanceChart.destroy();

  performanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Your score",
          data: data.scores,
          borderColor: "#E026C6",
          backgroundColor: "rgba(224, 38, 198, 0.12)",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointBackgroundColor: "#E026C6",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Class average",
          data: data.avg,
          borderColor: "#7B2FF7",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    },
    options: chartDefaults,
  });
}

function createStudyChart() {
  const ctx = document.getElementById("studyChart");

  if (studyChart) studyChart.destroy();

  studyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Hours",
          data: studyHours,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return "rgba(123, 47, 247, 0.6)";
            const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "#7B2FF7");
            gradient.addColorStop(1, "#E026C6");
            return gradient;
          },
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 36,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: chartDefaults.plugins.tooltip,
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#B9B9C9", font: { family: "Outfit", size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.06)", drawBorder: false },
          ticks: {
            color: "#B9B9C9",
            font: { family: "Outfit", size: 11 },
            callback: (v) => `${v}h`,
          },
        },
      },
    },
  });
}

/* ---------- Metric count-up ---------- */

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const unit = el.querySelector(".metric-unit");
    const unitHtml = unit ? unit.outerHTML : "";
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.innerHTML = `${value}${unitHtml}`;
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

/* ---------- Toast & Modal ---------- */

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => {
      toast.hidden = true;
    }, 250);
  }, 2800);
}

const actionContent = {
  lessons: {
    eyebrow: "Quick Action",
    title: "Access Lessons",
    body: "Jump into your next recommended lesson. Continue Web Development Studio — Module 6: Flexbox & Grid, or pick another course.",
    actions: [
      { label: "Continue last lesson", primary: true, toast: "Opening last lesson…" },
      { label: "Browse all", primary: false, toast: "Browsing lesson library…" },
    ],
  },
  submit: {
    eyebrow: "Quick Action",
    title: "Submit Work",
    body: "Ready to turn in an assignment? Select a pending item or upload a new file without leaving your dashboard.",
    actions: [
      { label: "Upload file", primary: true, toast: "Upload panel ready — pick a file to submit." },
      { label: "Mark complete", primary: false, toast: "Assignment marked complete." },
    ],
  },
  grades: {
    eyebrow: "Quick Action",
    title: "View Grades",
    body: "Your current GPA is 3.72. Latest grades: Psychology quiz 100%, DSA lab 94%, Web Studio project 88%.",
    actions: [
      { label: "Full grade report", primary: true, toast: "Loading grade report…" },
      { label: "Close", primary: false, close: true },
    ],
  },
  profile: {
    eyebrow: "Account",
    title: "My Profile",
    body: "Alex Morgan · Computer Science major · Year 2. Update your study goals, notification prefs, or avatar anytime.",
    actions: [
      { label: "Edit profile", primary: true, toast: "Profile editor opened." },
      { label: "Close", primary: false, close: true },
    ],
  },
};

function openModal(key, itemTitle) {
  const content = actionContent[key];
  if (!content) return;

  const overlay = document.getElementById("modalOverlay");
  document.getElementById("modalEyebrow").textContent = content.eyebrow;
  document.getElementById("modalTitle").textContent = content.title;
  document.getElementById("modalBody").textContent = itemTitle
    ? `${content.body} Selected: “${itemTitle}”.`
    : content.body;

  const actionsEl = document.getElementById("modalActions");
  actionsEl.innerHTML = "";

  content.actions.forEach((a) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = a.primary ? "btn-primary" : "btn-ghost";
    btn.textContent = a.label;
    btn.addEventListener("click", () => {
      if (a.close) {
        closeModal();
        return;
      }
      if (a.toast) showToast(a.toast);
      closeModal();
    });
    actionsEl.appendChild(btn);
  });

  overlay.hidden = false;
  document.getElementById("modalClose").focus();
}

function closeModal() {
  document.getElementById("modalOverlay").hidden = true;
}

/* ---------- Events ---------- */

function bindEvents() {
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentPeriod = btn.dataset.period;
      createPerformanceChart(currentPeriod);
    });
  });

  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-action]");
    if (!trigger) return;
    const action = trigger.dataset.action;
    if (action === "lessons" || action === "submit" || action === "grades") {
      openModal(action, trigger.dataset.item);
    }
  });

  document.getElementById("btnProfile").addEventListener("click", () => openModal("profile"));
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  });
}

/* ---------- Init ---------- */

function init() {
  renderMetrics();
  renderCourses();
  renderAssignments();
  renderDeadlines();
  renderAchievements();
  renderStudySummary();
  createPerformanceChart("weekly");
  createStudyChart();
  animateCounters();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);
