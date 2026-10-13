"use strict";
const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const on = (q, ev, fn) => $(q).addEventListener(ev, fn);
const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const state = { cat: "all", query: "", user: null, sex: "any", px: 16 };

const CATS = { agri: "Agriculture", health: "Health", edu: "Education", biz: "Business", home: "Housing & Home", save: "Savings & Pension" };

// banner photos sit in /images. use "png" here if yours are png
const EXT = "jpg";
const SLIDES = [
  ["#1b3a8a,#2798c2", "Find schemes that may be right for you"],
  ["#216b43,#84a832", "Support for farmers"],
  ["#572080,#9563ad", "Scholarships for students"],
  ["#a3154e,#e97965", "Health for everyone"]
];

// only the static text gets translated, scheme data stays english for now
const TEXT = {
  ta: { contrast: "அதிக மாறுபாடு", home: "முகப்பு", services: "சேவைகள்", browse: "திட்டங்கள்", how: "எப்படி செயல்படுகிறது", track: "நிலை அறிய", help: "உதவி", elig: "தகுதி சரிபார்ப்பு", explore: "ஆராயுங்கள்", s1: "உங்களுக்கு ஏற்ற திட்டங்களைக் கண்டறியுங்கள்", s2: "விவசாயிகளுக்கான ஆதரவு", s3: "மாணவர்களுக்கான உதவித்தொகை", s4: "அனைவருக்கும் ஆரோக்கியம்", svc: "எங்கள் சேவைகள்", go: "மாதிரி பொருத்தங்களைக் காட்டு", brw: "திட்டங்களைப் பாருங்கள்", stp: "தொடங்க நான்கு படிகள்", trk: "விண்ணப்ப நிலை கண்காணிப்பு", hlp: "பொதுவான கேள்விகள்" },
  hi: { contrast: "उच्च कंट्रास्ट", home: "होम", services: "सेवाएँ", browse: "योजनाएँ", how: "यह कैसे काम करता है", track: "स्थिति देखें", help: "सहायता", elig: "पात्रता जाँच", explore: "देखें", s1: "अपने लिए सही योजनाएँ खोजें", s2: "किसानों के लिए सहायता", s3: "छात्रों के लिए छात्रवृत्ति", s4: "सबके लिए स्वास्थ्य", svc: "हमारी सेवाएँ", go: "नमूना परिणाम दिखाएँ", brw: "योजनाएँ देखें", stp: "योजना जानने के चार चरण", trk: "आवेदन स्थिति ट्रैकर", hlp: "आम सवाल" }
};

// dummy data, not a real government database
const SCHEMES = [
  { name: "PM-KISAN", cat: "agri", icon: "₹", info: "Income support for eligible farmer families.", perk: "Around ₹6,000 per year (sample figure).", jobs: ["farmer"], from: 18, to: 90, cap: 800000, sex: "any", docs: ["Aadhaar", "Land records", "Bank passbook"] },
  { name: "Ayushman Bharat PM-JAY", cat: "health", icon: "+", info: "Health coverage for eligible families.", perk: "Coverage and limits depend on current rules.", jobs: [], from: 1, to: 90, cap: 300000, sex: "any", docs: ["Identity proof", "Eligibility records", "Family details"] },
  { name: "PM Awas Yojana", cat: "home", icon: "⌂", info: "Housing assistance for eligible applicants.", perk: "Support depends on the scheme component.", jobs: [], from: 18, to: 90, cap: 1800000, sex: "any", docs: ["Identity proof", "Income details", "Address proof"] },
  { name: "Sukanya Samriddhi Yojana", cat: "save", icon: "S", info: "A savings scheme for a girl child's future.", perk: "Interest and tax rules are subject to current regulations.", jobs: [], from: 1, to: 10, cap: Infinity, sex: "female", docs: ["Birth certificate", "Parent or guardian ID"] },
  { name: "PM Mudra Yojana", cat: "biz", icon: "M", info: "Loans for eligible small business activities.", perk: "Loan terms depend on the lender and category.", jobs: ["entrepreneur", "worker"], from: 18, to: 65, cap: Infinity, sex: "any", docs: ["Identity proof", "Business details", "Bank records"] },
  { name: "Atal Pension Yojana", cat: "save", icon: "A", info: "Pension savings for eligible subscribers.", perk: "Pension options depend on applicable scheme rules.", jobs: ["worker", "homemaker", "entrepreneur"], from: 18, to: 40, cap: Infinity, sex: "any", docs: ["Identity proof", "Savings account", "Mobile number"] },
  { name: "PM Ujjwala Yojana", cat: "home", icon: "U", info: "LPG connection assistance for eligible women.", perk: "Benefits depend on current eligibility and scheme rules.", jobs: [], from: 18, to: 90, cap: 100000, sex: "female", docs: ["Identity proof", "Household details", "Bank records"] },
  { name: "National Scholarship", cat: "edu", icon: "E", info: "Explore scholarship opportunities for students.", perk: "Award amounts vary by scholarship.", jobs: ["student"], from: 14, to: 30, cap: 300000, sex: "any", docs: ["Marksheet", "Income certificate", "Bank details"] },
  { name: "Skill India / PMKVY", cat: "edu", icon: "K", info: "Explore vocational training opportunities.", perk: "Training and certification depend on the programme.", jobs: ["student", "worker"], from: 15, to: 45, cap: Infinity, sex: "any", docs: ["Identity proof", "Education details", "Photograph"] },
  { name: "Stand-Up India", cat: "biz", icon: "$", info: "Explore business finance options for eligible entrepreneurs.", perk: "Current loan eligibility and programme availability must be verified.", jobs: ["entrepreneur"], from: 18, to: 65, cap: Infinity, sex: "female", docs: ["Identity proof", "Project report", "Relevant eligibility records"] },
  { name: "Kisan Credit Card", cat: "agri", icon: "K", info: "Credit facilities for eligible agricultural activities.", perk: "Credit terms depend on the lender and applicable rules.", jobs: ["farmer"], from: 18, to: 75, cap: Infinity, sex: "any", docs: ["Identity proof", "Relevant land or activity records"] },
  { name: "Senior Citizen Savings Scheme", cat: "save", icon: "%", info: "A savings option for eligible senior citizens.", perk: "Deposit limits and interest rates may change.", jobs: ["senior"], from: 60, to: 90, cap: Infinity, sex: "any", docs: ["Age proof", "Identity proof", "Photograph"] }
];

// null = no profile yet, true/false = fits or not
const fits = (s) => {
  const u = state.user;
  if (!u) return null;
  const ageOk = u.age >= s.from && u.age <= s.to;
  const sexOk = [s.sex, u.gender].includes("any") || u.gender === s.sex;
  const jobOk = !s.jobs.length || s.jobs.includes(u.job);
  const incomeOk = u.income === null || u.income <= s.cap; // skipped income != zero
  return ageOk && sexOk && jobOk && incomeOk;
};

const renderChips = () => {
  const all = [["all", "All categories"], ...Object.entries(CATS)];
  $("#chipRow").innerHTML = all.map(([key, label]) =>
    `<button type="button" class="chip${state.cat === key ? " on" : ""}" data-category="${key}" aria-pressed="${state.cat === key}">${label}</button>`).join("");
};

const renderCards = () => {
  const q = state.query.trim().toLowerCase();
  const list = SCHEMES.filter((s) =>
    (state.cat === "all" || s.cat === state.cat) &&
    [s.name, s.info, s.perk, CATS[s.cat]].join(" ").toLowerCase().includes(q));
  state.user && list.sort((a, b) => Number(fits(b)) - Number(fits(a)));
  $("#noneMsg").hidden = list.length > 0;
  $("#cardGrid").innerHTML = list.map((s) => {
    const ok = fits(s);
    return `<button type="button" class="card${ok === false ? " faded" : ""}" data-scheme="${s.name}">
      <div class="cover ${s.cat}" data-icon="${s.icon}"><span>${CATS[s.cat]}</span>${ok ? '<span class="match">Possible match</span>' : ""}</div>
      <div class="card-body"><h3>${s.name}</h3><p>${s.info}</p><p class="perk">${s.perk}</p></div></button>`;
  }).join("");
};

const openInfo = (s) => {
  if (!s) return;
  $("#dlgBody").innerHTML = `<div class="dlg-body">
    <h3 id="modalTitle">${s.name}</h3><p>${s.info}</p>
    <p><strong>Category:</strong> ${CATS[s.cat]}</p>
    <p><strong>Illustrative benefit:</strong> ${s.perk}</p>
    <p><strong>Age range:</strong> ${s.from}–${s.to} years</p>
    <h4>Documents to check</h4><ul>${s.docs.map((d) => `<li>${d}</li>`).join("")}</ul>
    <p class="form-note">This is sample information, not an eligibility decision. Check the current official scheme rules before applying.</p>
    <form method="dialog"><button class="btn">Close</button></form></div>`;
  $("#infoDlg").open || $("#infoDlg").showModal();
};

const runFinder = () => {
  const job = $("#jobSel").value;
  const note = $("#matchInfo");
  if (job === "any") {
    note.textContent = "Please select an occupation to see sample matches.";
    return $("#jobSel").focus();
  }
  const income = $("#incomeSel").value;
  state.user = { age: +$("#ageIn").value, job, gender: state.sex, income: income === "unknown" ? null : +income };
  state.cat = "all";
  const n = SCHEMES.filter((s) => fits(s)).length;
  note.textContent = n ? `${n} possible sample match(es). Check official rules.` : "No sample matches found. Try adjusting your answers.";
  renderChips();
  renderCards();
  $("#catalog").scrollIntoView({ behavior: noMotion ? "auto" : "smooth" });
};

const applyLang = (code) => {
  document.documentElement.lang = code;
  $$("[data-t]").forEach((el) => {
    el.dataset.en ??= el.textContent; // remember english first
    el.textContent = TEXT[code]?.[el.dataset.t] ?? el.dataset.en;
  });
  localStorage.setItem("lang", code);
};

let pos = 0, clock;

const showSlide = (n) => {
  pos = (n + SLIDES.length) % SLIDES.length;
  $$(".slide").forEach((el, i) => el.classList.toggle("on", i === pos));
  $$("#dotBox button").forEach((el, i) => el.classList.toggle("on", i === pos));
};

const startAuto = () => {
  clearInterval(clock);
  noMotion || (clock = setInterval(() => showSlide(pos + 1), 4500));
};

const moveTo = (step, to) => {
  showSlide(to ?? pos + step);
  startAuto();
};

const buildSlider = () => {
  $("#slideBox").innerHTML = SLIDES.map(([grad, text], i) => `
    <div class="slide" style="background:url(images/slide${i + 1}.${EXT}) center/cover,linear-gradient(135deg,${grad})">
      <div class="cap"><h2 data-t="s${i + 1}">${text}</h2>
      <a class="btn" href="#services" data-t="explore">Explore</a></div>
    </div>`).join("");
  $("#dotBox").innerHTML = SLIDES.map((_, i) =>
    `<button type="button" aria-label="Slide ${i + 1}" data-i="${i}"></button>`).join("");
  showSlide(0);
  on(".prev", "click", () => moveTo(-1));
  on(".next", "click", () => moveTo(1));
  on("#dotBox", "click", (e) => e.target.dataset.i && moveTo(0, +e.target.dataset.i));
  on(".hero", "mouseenter", () => clearInterval(clock));
  on(".hero", "mouseleave", startAuto);
  startAuto();
};

// fake refs, number = steps finished
const DEMO = { "YS-2026-1001": 1, "YS-2026-1042": 4 };

const statusText = (ref, n) => {
  if (!ref) return "Enter the demonstration reference number.";
  if (n === 4) return "Demo status: all steps completed. This is not a real confirmation.";
  if (n) return `Demo status: step ${n} of 4 done. Still in progress (demo only).`;
  return "Demo reference not found. Check the number and try again.";
};

const trackStatus = (e) => {
  e.preventDefault();
  const ref = $("#refNo").value.trim().toUpperCase();
  const n = DEMO[ref] ?? 0;
  $("#stages").hidden = !n;
  [...$("#stages").children].forEach((li, i) => li.classList.toggle("done", i < n));
  $("#trackNote").textContent = statusText(ref, n);
};

const resize = (d) => {
  state.px = Math.min(22, Math.max(13, state.px + d));
  document.documentElement.style.setProperty("--size", state.px + "px");
};

const countUp = () => $$("[data-n]").forEach((el) => {
  const goal = +el.dataset.n, t0 = performance.now();
  if (noMotion) return void (el.textContent = goal);
  const tick = (t) => {
    const p = Math.min((t - t0) / 900, 1);
    el.textContent = Math.floor(goal * p);
    p < 1 && requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

const wire = () => {
  on("#eligForm", "submit", (e) => { e.preventDefault(); runFinder(); });
  on("#ageIn", "input", (e) => ($("#ageShow").textContent = e.target.value));
  on("#genderBox", "click", (e) => {
    const b = e.target.closest("button[data-v]");
    if (!b) return;
    state.sex = b.dataset.v;
    [...e.currentTarget.children].forEach((o) => {
      o.classList.toggle("on", o === b);
      o.setAttribute("aria-pressed", o === b);
    });
  });
  on("#chipRow", "click", (e) => {
    const b = e.target.closest("button[data-category]");
    if (!b) return;
    state.cat = b.dataset.category;
    renderChips();
    renderCards();
  });
  on("#searchBox", "input", (e) => { state.query = e.target.value; renderCards(); });
  on("#cardGrid", "click", (e) => {
    const c = e.target.closest("button[data-scheme]");
    c && openInfo(SCHEMES.find((s) => s.name === c.dataset.scheme));
  });
  on("#dlgClose", "click", () => $("#infoDlg").close());
  on("#infoDlg", "click", (e) => e.target === $("#infoDlg") && $("#infoDlg").close());
  on("#trackForm", "submit", trackStatus);
  on("#fontPlus", "click", () => resize(1));
  on("#fontMinus", "click", () => resize(-1));
  on("#contrastBtn", "click", () => $("#contrastBtn").setAttribute("aria-pressed", document.body.classList.toggle("hc")));
  on("#langPick", "change", (e) => applyLang(e.target.value));
};

// start everything
buildSlider();
wire();
renderChips();
renderCards();
countUp();
const savedLang = localStorage.getItem("lang") || "en";
$("#langPick").value = savedLang;
applyLang(savedLang);