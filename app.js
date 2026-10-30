/* ============ Morse frontend v1.2 — bilingual · svg icons · profile photos ============ */
const $ = (s) => document.querySelector(s);
const API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.endsWith(".pythonanywhere.com")) ? "/api" : "https://morseapp.pythonanywhere.com/api";
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};
const API = (p, o) => fetch(API_BASE + p, {
  method: (o && o.method) || "GET",
  headers: { "Content-Type": "application/json", Authorization: "Bearer " + (state.token || "") },
  ...((o && o.body) ? { body: JSON.stringify(o.body) } : {}),
}).then((r) => r.json()).catch((e) => ({ ok: false, error: "خطای شبکه — اتصال اینترنت را بررسی کنید" }));

/* ================= i18n ================= */
const I18N = {
  fa: {
    dir: "rtl", num: (n) => (typeof n === "number" ? n : String(n)).toLocaleString("fa-IR"),
    tabLogin: "ورود", tabReg: "ساخت حساب", lblName: "نام و نام خانوادگی",
    lblIdent: "شماره موبایل یا ایمیل", lblPass: "رمز عبور", lblPass2: "تکرار رمز عبور",
    lblMid: "شناسه شما (mo خودکار اضافه می‌شود)", rowMid: "شناسه",
    login: "ورود", register: "ساخت حساب",
    authTitleLogin: "ورود به مورس", authTitleReg: "ساخت حساب جدید",
    authSubLogin: "شماره موبایل یا ایمیل و رمز عبور خود را وارد کنید.",
    authSubReg: "نام، شماره یا ایمیل، رمز و شناسه‌ی دلخواه‌ات را انتخاب کن؛ بی‌درنگ وارد می‌شوی.",
    authTagH: "گفتگو، ساده و امن",
    authTagP: "پیام‌رسان مورس؛ تم تاریک، سریع و مینیمال. یک‌بار حساب بساز، همیشه بمان؛ گروه و کانال راه بینداز.",
    demoHint: '<b>حساب نمونه:</b> <b dir="ltr">09120000001</b> یا <b dir="ltr">matin@morse.ir</b> با رمز <b dir="ltr">1234</b> — این «متین» است.',
    navChats: "چت‌ها", navSettings: "تنظیمات",
    fAll: "همه", fGroups: "گروه‌ها و کانال‌ها", fUnread: "خوانده‌نشده", fBlocked: "مسدود",
    searchPh: "جستجو یا مخاطب...", msgPh: "پیام خود را بنویسید...",
    welcomeH: "به مورس خوش آمدید",
    welcomeP: 'یک گفتگو را از لیست انتخاب کنید<br>یا با دکمه ✚ گروه و کانال بسازید.',
    online: "آنلاین", lastSeenMin: "آخرین بازدید __N__ دقیقه پیش",
    lastSeenH: "آخرین بازدید __N__ ساعت پیش", lastSeenD: "آخرین بازدید __N__ روز پیش",
    today: "امروز", yesterday: "دیروز",
    startChat: "شروع گفتگو...", noMsgCh: "کانال بی‌پیام", noMsgGr: "گروه تازه‌تاسیس",
    emptyGroups: "هنوز گروه یا کانالی ندارید.<br>با دکمه ✚ بسازید.",
    emptyBlocked: "هیچ مخاطبی را مسدود نکرده‌اید.",
    emptyUnread: "همه‌ی پیام‌ها خوانده شده‌اند. ✅",
    emptyAll: "مخاطبی یافت نشد.<br>با دکمه ✚ گفتگوی تازه شروع کنید.",
    secInfo: "اطلاعات", secOther: "سایر", rowName: "نام", rowPhone: "شماره تلفن / ایمیل",
    rowAbout: "درباره", rowKind: "نوع", rowMembers: "اعضا", rowStarred: "پیام‌های ستاره‌دار",
    rowMute: "بی‌صدا کردن اعلان‌ها", call: "تماس", searchIn: "جستجو",
    contactInfo: "اطلاعات مخاطب", groupInfo: "اطلاعات گروه", channelInfo: "اطلاعات کانال",
    blockUser: "مسدود کردن کاربر", unblock: "رفع مسدودی", blocked: "مسدود شده",
    delChat: "حذف چت", delGroup: "حذف گروه", leaveGroup: "ترک گروه",
    member: "عضو", members: "عضو", owner: "مالک", admin: "مدیر",
    groupKind: "گروه (همه ارسال می‌کنند)", channelKind: "کانال (فقط مدیران ارسال می‌کنند)",
    grpPrefix: "گروه · ", chPrefix: "کانال · ",
    phDM: "پیام خود را بنویسید...", phGroup: "پیام به __N__...",
    phChannelRO: "فقط مدیران می‌توانند در کانال پیام بگذارند",
    newChat: "گفتگوی جدید", newGroup: "گروه جدید", newChannel: "کانال جدید",
    makeGroup: "ساخت گروه", makeChannel: "ساخت کانال",
    grpName: "نام گروه", chName: "نام کانال", pickMembers: "انتخاب اعضا",
    grpNamePh: "مثلاً دوستان", chNamePh: "مثلاً اخبار",
    createdGrp: "__K__ «__N__» ساخته شد 🎉", grp: "گروه", channel: "کانال",
    addMember: "افزودن عضو", add: "افزودن", addedN: "__N__ عضو اضافه شد ✅",
    close: "بستن", cancel: "انصراف", save: "ذخیره", delete: "حذف", leave: "ترک", remove: "خروج",
    starOn: "پیام ستاره‌دار شد ⭐", starOff: "ستاره برداشته شد",
    starredTitle: "پیام‌های ستاره‌دار", noStarred: "پیام ستاره‌داری در این چت ندارید.",
    muted: "اعلان‌های این چت بی‌صدا شد 🔕", unmuted: "اعلان‌ها فعال شد 🔔",
    blockConfirm: "پس از مسدودسازی، __N__ نمی‌تواند به شما پیام دهد.",
    unblockConfirm: "آیا __N__ از لیست مسدودها حذف شود؟",
    blockedToast: "کاربر مسدود شد 🚫", unblockedToast: "مسدودی برداشته شد",
    delChatConfirm: "تمام پیام‌های این گفتگو (به‌جز ستاره‌دارها) حذف شود؟",
    delChatToast: "چت حذف شد 🗑️",
    delGrpConfirm: "گروه «__N__» برای همه حذف شود؟",
    leaveGrpConfirm: "از گروه «__N__» خارج می‌شوید؟",
    delGrpToast: "گروه حذف شد 🗑️", leftGrpToast: "گروه را ترک کردید",
    logoutTitle: "خروج از حساب", logoutText: "آیا مطمئنید که می‌خواهید خارج شوید؟",
    logoutBtn: "خروج",
    callTitle: "تماس صوتی با __N__",
    callText: "در حال برقراری تماس... (این نسخه‌ی نمایشی، تماس واقعی برقرار نمی‌کند)",
    callEnd: "پایان تماس",
    grpNotFound: "گروه یافت نشد", sendFail: "ارسال نشد", err: "خطا",
    nameShort: "نام باید حداقل ۲ حرف باشد", passShort: "رمز عبور باید حداقل ۴ کاراکتر باشد",
    identEmpty: "شماره موبایل یا ایمیل را وارد کنید",
    passMismatch: "تکرار رمز عبور مطابقت ندارد", codeIncomplete: "کد ۶ رقمی را کامل وارد کنید",
    editProfile: "ویرایش پروفایل", name: "نام", about: "درباره",
    photo: "عکس پروفایل", pickPhoto: "انتخاب از گالری", removePhoto: "حذف عکس",
    photoSaved: "عکس پروفایل ذخیره شد ✅", photoRemoved: "عکس حذف شد",
    photoTooBig: "تصویر بیش از حد بزرگ است", photoBad: "فایل تصویر معتبر نیست",
    profileSaved: "پروفایل ذخیره شد ✅",
    secGeneral: "عمومی", language: "زبان", security: "امنیت", twoStep: "ورود دومرحله‌ای (نمایشی)",
    notifications: "اعلان‌ها", notifSub: "صدا و پیش‌نمایش", blockedUsers: "مخاطبان مسدودشده",
    aboutMorse: "درباره مورس", aboutSub: "گروه‌ها، کانال‌ها و عکس پروفایل",
    logout: "خروج از حساب", langFa: "فارسی", fa: "فا", en: "EN",
    twoOn: "ورود دومرحله‌ای فعال شد", twoOff: "ورود دومرحله‌ای خاموش شد",
    emptyBlkList: "لیست مسدودها خالی است.", blockedTitle: "مخاطبان مسدودشده",
    nContacts: "__N__ مخاطب", empty: "خالی",
    youTxt: "شما", statusTitle: "وضعیت", statusSub: "به‌روزرسانی‌های ۲۴ ساعت گذشته",
    membersOf: "اعضای __N__", addMemberHint: "برای افزودن عضو جدید از دکمه‌ی پایین استفاده کنید.",
    errGeneric: "خطا",
  },
  en: {
    dir: "ltr", num: (n) => (typeof n === "number" ? n : String(n)).toLocaleString("en-US"),
    tabLogin: "Log in", tabReg: "Sign up", lblName: "Full name",
    lblIdent: "Phone or email", lblPass: "Password", lblPass2: "Repeat password",
    lblMid: "Your ID (mo is added automatically)", rowMid: "ID",
    login: "Log in", register: "Create account",
    authTitleLogin: "Log in to Morse", authTitleReg: "Create account",
    authSubLogin: "Enter your phone number or email and password.",
    authSubReg: "Pick a name, phone/email, password and your ID; you are in instantly.",
    authTagH: "Chatting, simple & secure",
    authTagP: "Morse messenger; dark, fast and minimal. Sign up once, stay signed in; build groups and channels.",
    demoHint: '<b>Demo account:</b> ID <b dir="ltr">momatin</b> or <b dir="ltr">09120000001</b>, password <b dir="ltr">1234</b> — that is “Matin”.',
    navChats: "Chats", navSettings: "Settings",
    fAll: "All", fGroups: "Groups & channels", fUnread: "Unread", fBlocked: "Blocked",
    searchPh: "Search or contact...", msgPh: "Write a message...",
    welcomeH: "Welcome to Morse",
    welcomeP: "Pick a conversation from the list<br>or create a group or channel with ✚.",
    online: "Online", lastSeenMin: "last seen __N__ min ago",
    lastSeenH: "last seen __N__ h ago", lastSeenD: "last seen __N__ d ago",
    today: "Today", yesterday: "Yesterday",
    startChat: "Start chatting...", noMsgCh: "No posts yet", noMsgGr: "Fresh group",
    emptyGroups: "No groups or channels yet.<br>Create one with ✚.",
    emptyBlocked: "You have not blocked anyone.",
    emptyUnread: "Everything is read. ✅",
    emptyAll: "No contact found.<br>Start a new chat with ✚.",
    secInfo: "Info", secOther: "Other", rowName: "Name", rowPhone: "Phone / email",
    rowAbout: "About", rowKind: "Type", rowMembers: "Members", rowStarred: "Starred messages",
    rowMute: "Mute notifications", call: "Call", searchIn: "Search",
    contactInfo: "Contact info", groupInfo: "Group info", channelInfo: "Channel info",
    blockUser: "Block user", unblock: "Unblock", blocked: "Blocked",
    delChat: "Delete chat", delGroup: "Delete group", leaveGroup: "Leave group",
    member: "member", members: "members", owner: "owner", admin: "admin",
    groupKind: "Group (everyone posts)", channelKind: "Channel (admins post)",
    grpPrefix: "Group · ", chPrefix: "Channel · ",
    phDM: "Write a message...", phGroup: "Message __N__...",
    phChannelRO: "Only admins can post in a channel",
    newChat: "New conversation", newGroup: "New group", newChannel: "New channel",
    makeGroup: "Create group", makeChannel: "Create channel",
    grpName: "Group name", chName: "Channel name", pickMembers: "Choose members",
    grpNamePh: "e.g. Friends", chNamePh: "e.g. News",
    createdGrp: "__K__ “__N__” created 🎉", grp: "Group", channel: "Channel",
    addMember: "Add member", add: "Add", addedN: "__N__ member(s) added ✅",
    close: "Close", cancel: "Cancel", save: "Save", delete: "Delete", leave: "Leave", remove: "Leave",
    starOn: "Message starred ⭐", starOff: "Star removed",
    starredTitle: "Starred messages", noStarred: "No starred messages in this chat.",
    muted: "Notifications muted 🔕", unmuted: "Notifications on 🔔",
    blockConfirm: "__N__ won't be able to message you.",
    unblockConfirm: "Remove __N__ from the blocked list?",
    blockedToast: "User blocked 🚫", unblockedToast: "Unblocked",
    delChatConfirm: "Delete all messages in this chat (starred ones stay)?",
    delChatToast: "Chat deleted 🗑️",
    delGrpConfirm: "Delete “__N__” for everyone?",
    leaveGrpConfirm: "Leave “__N__”?",
    delGrpToast: "Group deleted 🗑️", leftGrpToast: "You left the group",
    logoutTitle: "Log out", logoutText: "Are you sure you want to log out?",
    logoutBtn: "Log out",
    callTitle: "Voice call with __N__",
    callText: "Calling... (this demo build does not make real calls)",
    callEnd: "End call",
    grpNotFound: "Group not found", sendFail: "Failed to send", err: "Error",
    nameShort: "Name must be at least 2 characters", passShort: "Password must be at least 4 characters",
    identEmpty: "Enter a phone number or email",
    passMismatch: "Passwords do not match", codeIncomplete: "Enter the full 6-digit code",
    editProfile: "Edit profile", name: "Name", about: "About",
    photo: "Profile photo", pickPhoto: "Choose from gallery", removePhoto: "Remove photo",
    photoSaved: "Profile photo saved ✅", photoRemoved: "Photo removed",
    photoTooBig: "Image is too large", photoBad: "Not a valid image file",
    profileSaved: "Profile saved ✅",
    secGeneral: "General", language: "Language", security: "Security", twoStep: "Two-step login (demo)",
    notifications: "Notifications", notifSub: "Sound & previews", blockedUsers: "Blocked contacts",
    aboutMorse: "About Morse", aboutSub: "Groups, channels and profile photos",
    logout: "Log out", langFa: "فارسی", fa: "فا", en: "EN",
    twoOn: "Two-step login on", twoOff: "Two-step login off",
    emptyBlkList: "Blocked list is empty.", blockedTitle: "Blocked contacts",
    nContacts: "__N__ contacts", empty: "Empty",
    youTxt: "You", statusTitle: "Status", statusSub: "Updates from the last 24 hours",
    membersOf: "Members of __N__", addMemberHint: "Use the button below to add new members.",
    errGeneric: "Error",
  },
};
let lang = store.get("morse_lang") || "fa";
const T = (k, sub) => {
  let s = I18N[lang] && I18N[lang][k] != null ? I18N[lang][k] : (I18N.fa[k] != null ? I18N.fa[k] : k);
  if (sub) for (const [a, b] of Object.entries(sub)) s = s.split("__" + a + "__").join(b);
  return s;
};
const FA = (n) => I18N[lang].num(n);

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = I18N[lang].dir;
  document.body.classList.toggle("en", lang === "en");
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = T(el.dataset.i18n); });
  $("#langBtn") && ($("#langBtn").textContent = lang === "fa" ? "EN" : "فا");
  $("#langBtnAuth") && ($("#langBtnAuth").textContent = lang === "fa" ? "EN" : "فا");
  $("#langBtn").title = lang === "fa" ? "English" : "فارسی";
  $("#search").placeholder = T("searchPh");
  $("#msgInput").placeholder = T("msgPh");
  $("#welcomeH").textContent = T("welcomeH");
  $("#welcomeP").innerHTML = T("welcomeP");
  $("#demoHint").innerHTML = T("demoHint");
  $("#langCur").textContent = lang === "fa" ? T("langFa") : "English";
  document.querySelectorAll("#langSeg button").forEach((b) => b.classList.toggle("on", b.dataset.l === lang));
  setAuthMode(authMode);
  if (state.me) renderMe();
  renderList();
}

function setLang(l) {
  lang = l; store.set("morse_lang", l);
  applyLang();
}

let state = {
  token: store.get("morse_token") || "",
  me: null, users: [], groups: [], peer: null, gpeer: null, view: "chats",
  filter: "all", q: "", peerUser: null, poll: null, lastId: 0, mute: false,
  gname: null, pendingIdent: "", mode: "dm",
};

/* ---------- helpers ---------- */
function toast(msg, err) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "show" + (err ? " err" : "");
  setTimeout(() => (t.className = ""), 2600);
}
function fmtTime(ts) {
  const d = new Date(ts * 1000);
  const s = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  return lang === "fa" ? FA(s) : s;
}
function fmtDay(ts) {
  const d = new Date(ts * 1000);
  const today = new Date(); const y = new Date(Date.now() - 864e5);
  const eq = (a, b) => a.toDateString() === b.toDateString();
  if (eq(d, today)) return T("today");
  if (eq(d, y)) return T("yesterday");
  return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", { day: "numeric", month: "long" });
}
function online(u) { return Date.now() / 1000 - u.last_seen < 65; }
function lastSeenTxt(u) {
  if (online(u)) return T("online");
  const mm = Math.floor((Date.now() / 1000 - u.last_seen) / 60);
  if (mm < 60) return T("lastSeenMin", { N: FA(Math.max(1, mm)) });
  const h = Math.floor(mm / 60);
  if (h < 24) return T("lastSeenH", { N: FA(h) });
  return T("lastSeenD", { N: FA(Math.floor(h / 24)) });
}
function initial(n) { return (n || "؟").trim()[0] || "؟"; }
function avColor(u) { return (u && u.color) || "#E8833A"; }
function esc(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
function avHtml(u, cls, dot = true) {
  const d = dot && online(u) ? "" : " off";
  const img = u.avatar
    ? `<img class="av-img" src="${esc(u.avatar)}" alt="">`
    : esc(initial(u.name));
  return `<span class="av ${cls || ""}" style="background:${avColor(u)}">${img}${dot ? `<span class="dot${d}"></span>` : ""}</span>`;
}

/* ---------- modal ---------- */
function modal(title, text, buttons) {
  $("#mTitle").textContent = title;
  const p = $("#mText");
  p.style.color = "";
  if (text) { p.textContent = text; } else { p.innerHTML = ""; }
  const acts = $("#mActs"); acts.innerHTML = "";
  buttons.forEach((b) => {
    const el = document.createElement("button");
    el.className = "btn " + (b.cls || "pri");
    el.textContent = b.label;
    el.onclick = () => { $("#modalBg").classList.remove("on"); b.fn && b.fn(); };
    acts.appendChild(el);
  });
  $("#modalBg").classList.add("on");
}
$("#modalBg").onclick = (e) => { if (e.target.id === "modalBg") $("#modalBg").classList.remove("on"); };

/* ================= AUTH ================= */
let authMode = "login";
function setAuthMode(m) {
  authMode = m;
  $("#tabLogin").classList.toggle("on", m === "login");
  $("#tabReg").classList.toggle("on", m === "reg");
  $("#fName").style.display = m === "reg" ? "" : "none";
  $("#fPass2").style.display = m === "reg" ? "" : "none";
  $("#fMid").style.display = m === "reg" ? "" : "none";
  $("#authTitle").textContent = m === "login" ? T("authTitleLogin") : T("authTitleReg");
  $("#authSub").textContent = m === "login" ? T("authSubLogin") : T("authSubReg");
  $("#authGo").textContent = m === "login" ? T("login") : T("register");
  $("#authErr").textContent = "";
}
$("#tabLogin").onclick = () => setAuthMode("login");
$("#tabReg").onclick = () => setAuthMode("reg");

$("#authGo").onclick = async () => {
  const ident = $("#iPhone").value.trim();
  const pass = $("#iPass").value;
  const err = (m) => ($("#authErr").textContent = m);
  if (authMode === "reg") {
    const name = $("#iName").value.trim();
    if (name.length < 2) return err(T("nameShort"));
    if ($("#iPass2").value !== pass) return err(T("passMismatch"));
    const r = await API("/register", { method: "POST", body: { name, ident, password: pass, mid: $("#iMid").value.trim() } });
    if (!r.ok) return err(r.error || T("err"));
    enter(r);
  } else {
    if (!ident) return err(T("identEmpty"));
    if (pass.length < 4) return err(T("passShort"));
    const r = await API("/login", { method: "POST", body: { ident, password: pass } });
    if (!r.ok) return err(r.error || T("err"));
    enter(r);
  }
};
$("#iPass").addEventListener("keydown", (e) => e.key === "Enter" && $("#authGo").click());
$("#iMid").addEventListener("keydown", (e) => e.key === "Enter" && $("#authGo").click());

function enter(r) {
  state.token = r.token; state.me = r.user;
  store.set("morse_token", r.token);
  $("#auth").style.display = "none";
  $("#app").classList.add("on");
  renderMe();
  loadAll();
  startPolling();
  layoutChat();
}
function renderMe() {
  $("#meName").textContent = state.me.name;
  $("#meAv").outerHTML = avHtml(state.me, "", true).replace('class="av ', 'id="meAv" class="av ');
  // settings drawer identity
  $("#sName").textContent = state.me.name;
  $("#sSub").textContent = state.me.mid ? "@" + state.me.mid : (state.me.email || "+" + state.me.phone.replace(/^0/, "98"));
  $("#sAv").outerHTML = avHtml(state.me, "lg", false).replace('class="av ', 'id="sAv" class="av ');
}
$("#logoutBtn").onclick = () => openSettings(); // topbar gear removed; keep chip → settings
$("#meChip").onclick = () => openSettings();
$("#logoutBtn2").onclick = () => modal(T("logoutTitle"), T("logoutText"), [
  { label: T("cancel"), cls: "ghost" },
  { label: T("logoutBtn"), cls: "red", fn: () => { store.del("morse_token"); location.reload(); } },
]);

/* language buttons */
$("#langBtn").onclick = () => setLang(lang === "fa" ? "en" : "fa");
$("#langBtnAuth").onclick = () => setLang(lang === "fa" ? "en" : "fa");
document.querySelectorAll("#langSeg button").forEach((b) => {
  b.onclick = () => setLang(b.dataset.l);
});

/* ================= NAV ================= */
document.querySelectorAll("#nav button").forEach((b) => {
  b.onclick = () => b.dataset.v === "chats" ? setView("chats") : openSettings();
});
function setView(v) {
  state.view = v;
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === v));
  closeSettings();
  $("#listCol").style.display = "";
  $("#chatCol").style.display = "";
  $("#panel").classList.remove("on");
  layoutChat();
}
function layoutChat() {
  const mobile = matchMedia("(max-width:860px)").matches;
  if (mobile && state.peer == null && state.gpeer == null) $("#chatCol").classList.remove("open");
}

/* ================= SETTINGS DRAWER ================= */
function openSettings() {
  renderMe();
  loadBlockedCount();
  $("#settingsWrap").style.display = "";
  requestAnimationFrame(() => $("#settings").classList.add("on"));
}
function closeSettings() {
  $("#settings").classList.remove("on");
  setTimeout(() => ($("#settingsWrap").style.display = "none"), 250);
}
$("#settingsClose").onclick = closeSettings;
$("#settingsBg").onclick = closeSettings;

$("#t2fa").onclick = (e) => { e.target.classList.toggle("on"); toast(e.target.classList.contains("on") ? T("twoOn") : T("twoOff")); };
$("#tNotif").onclick = (e) => { e.target.classList.toggle("on"); };
$("#seeBlk").onclick = async () => {
  const r = await API("/blocked");
  modal(T("blockedTitle"),
    r.ok && r.blocked.length ? r.blocked.map((b) => "• " + b.name).join("\n") : T("emptyBlkList"),
    [{ label: T("close"), cls: "ghost" }]);
};
async function loadBlockedCount() {
  const r = await API("/blocked");
  if (r.ok) { const e = $("#blkCount"); if (e) e.textContent = r.blocked.length ? FA(r.blocked.length) : FA(0); }
}

/* ================= CHAT LIST ================= */
$("#search").oninput = (e) => { state.q = e.target.value.trim(); renderList(); };
document.querySelectorAll("#filters button").forEach((b) => {
  b.onclick = () => {
    state.filter = b.dataset.f;
    document.querySelectorAll("#filters button").forEach((x) => x.classList.toggle("on", x === b));
    renderList();
  };
});

async function loadAll() {
  const [ru, rg] = await Promise.all([API("/users"), API("/groups")]);
  if (ru.ok) state.users = ru.users;
  if (rg.ok) state.groups = rg.groups;
  renderList();
  const unread = state.users.reduce((a, u) => a + u.unread, 0)
               + state.groups.reduce((a, g) => a + g.unread, 0);
  const nb = $("#navUnread");
  nb.style.display = unread ? "" : "none";
  nb.textContent = FA(unread);
  $("#fUnread").textContent = FA(state.users.filter((u) => u.unread).length
    + state.groups.filter((g) => g.unread).length);
}

function renderList() {
  const list = $("#chatList");
  if (!list) return;
  const q = state.q.replace(/^@/, "");
  let rows = [];
  const dm = state.users.filter((u) => !q || u.user.name.includes(q) || u.user.phone.includes(q) || (u.user.mid || "").includes(q))
    .map((u) => ({ type: "dm", ...u }));
  const gr = state.groups.filter((g) => !q || g.name.includes(q))
    .map((g) => ({ type: "group", ...g }));
  if (state.filter === "all") rows = [...dm, ...gr];
  else if (state.filter === "groups") rows = gr;
  else if (state.filter === "unread") rows = [...dm, ...gr].filter((r) => r.unread > 0);
  else if (state.filter === "blocked") rows = dm.filter((r) => r.blocked);
  list.innerHTML = "";
  if (!rows.length) {
    list.innerHTML = `<div class="list-empty">${
      state.filter === "groups" ? T("emptyGroups")
      : state.filter === "blocked" ? T("emptyBlocked")
      : state.filter === "unread" ? T("emptyUnread")
      : T("emptyAll")}</div>`;
    return;
  }
  rows.forEach((row) => {
    const el = document.createElement("div");
    if (row.type === "dm") {
      const u = row.user;
      el.className = "chat-item" + (state.peer === u.id ? " on" : "");
      const tick = row.last && row.last.mine ? '<span class="tick">✓✓</span> ' : "";
      const blockedIc = row.blocked ? '<span class="blocked-ic">🚫</span>' : "";
      el.innerHTML = `
        ${avHtml(u)}
        <div class="mid">
          <div class="row1"><b>${esc(u.name)}</b><span class="time">${row.last ? fmtTime(row.last.ts) : ""}</span></div>
          <div class="row2"><p>${tick}${esc((row.last && row.last.text) || T("startChat"))}</p>${blockedIc}
          ${row.unread ? `<span class="unread">${FA(row.unread)}</span>` : ""}</div>
        </div>`;
      el.onclick = () => openChat(u.id);
    } else {
      const isCh = row.kind === "channel";
      el.className = "chat-item" + (state.gpeer === row.id ? " on" : "");
      el.innerHTML = `
        <span class="av" style="background:${isCh ? "#8A5A2B" : "#A96A33"}">${isCh ? "📣" : "👥"}</span>
        <div class="mid">
          <div class="row1"><b>${esc(row.name)}</b><span class="time">${row.last ? fmtTime(row.last.ts) : ""}</span></div>
          <div class="row2"><p>${row.last ? esc(row.last.sender) + ": " + esc(row.last.text) : (isCh ? T("noMsgCh") : T("noMsgGr"))}</p>
          ${row.unread ? `<span class="unread">${FA(row.unread)}</span>` : ""}</div>
        </div>`;
      el.onclick = () => openGroup(row.id);
    }
    list.appendChild(el);
  });
}

/* ================= DM CHAT ================= */
async function openChat(id) {
  state.gpeer = null;
  state.peer = id;
  state.lastId = 0; state.mode = "dm";
  $("#msgs").innerHTML = "";
  $("#chatClosed").style.display = "none";
  $("#chatActive").style.display = "flex";
  $("#chatCol").classList.add("open");
  const row = state.users.find((u) => u.user.id === id);
  state.peerUser = row.user;
  $("#cName").textContent = row.user.name;
  $("#cAv").outerHTML = avHtml(row.user, "", true).replace('class="av ', 'id="cAv" class="av ');
  updateHeadStatus();
  $("#msgInput").placeholder = T("phDM");
  $("#msgInput").focus();
  if (matchMedia("(min-width:861px)").matches) closePanel();
  renderList();
  await loadMsgs();
  row.unread = 0; renderList(); loadAll();
}
function updateHeadStatus() {
  const u = state.peerUser;
  if (!u || state.mode !== "dm") return;
  const el = $("#cStatus");
  if (rowBlocked()) { el.textContent = T("blocked"); el.className = "st off"; return; }
  if (online(u)) { el.textContent = T("online"); el.className = "st"; }
  else { el.textContent = lastSeenTxt(u); el.className = "st off"; }
}
function rowBlocked() {
  const row = state.users.find((u) => u.user.id === state.peer);
  return row && row.blocked;
}

async function loadMsgs() {
  if (state.peer == null) return;
  const r = await API("/messages/" + state.peer + "?after_id=" + state.lastId);
  if (!r.ok) return;
  if (r.read_ids) r.read_ids.forEach((id) => {
    const t = document.querySelector('#msgs .msg[data-id="' + id + '"] .meta span:last-child');
    if (t) t.classList.add("read");
  });
  const msgs = $("#msgs");
  let dayShown = lastDay();
  r.messages.forEach((m) => {
    const day = fmtDay(m.ts);
    if (day !== dayShown) {
      dayShown = day;
      const sep = document.createElement("div");
      sep.className = "day-sep"; sep.textContent = day;
      msgs.appendChild(sep);
    }
    addMsgEl(m, false);
    state.lastId = Math.max(state.lastId, m.id);
  });
  if (r.messages.length) msgs.scrollTop = msgs.scrollHeight;
}
function lastDay() {
  const seps = document.querySelectorAll("#msgs .day-sep");
  return seps.length ? seps[seps.length - 1].textContent : "";
}
function addMsgEl(m, scroll = true, groupInfo = null) {
  const msgs = $("#msgs");
  const el = document.createElement("div");
  el.className = "msg " + (m.mine ? "out" : "in");
  el.dataset.id = m.id;
  const star = m.starred ? " on" : "";
  const ticks = m.mine
    ? (state.mode === "dm" ? (m.read ? '<span class="read">✓✓</span>' : "<span>✓✓</span>") : "")
    : "";
  const sender = groupInfo && !m.mine
    ? `<div class="sender" style="color:${groupInfo.color}">${esc(groupInfo.name)}</div>` : "";
  el.innerHTML = `${sender}${esc(m.text).replace(/\n/g, "<br>")}
    <div class="meta"><span class="star${star}" title="★">★</span><span>${fmtTime(m.ts)}</span>${ticks}</div>`;
  el.querySelector(".star").onclick = async () => {
    const r = await API("/star/" + m.id, { method: "POST" });
    if (r.ok) { el.querySelector(".star").classList.toggle("on", r.starred); toast(r.starred ? T("starOn") : T("starOff")); }
  };
  msgs.appendChild(el);
  if (scroll) msgs.scrollTop = msgs.scrollHeight;
}

async function sendMsg() {
  const inp = $("#msgInput");
  const text = inp.value.trim();
  if (!text) return;
  if (state.mode === "group") return sendGroupMsg(text, inp);
  if (state.peer == null) return;
  inp.value = "";
  const r = await API("/messages", { method: "POST", body: { to: state.peer, text } });
  if (!r.ok) { inp.value = text; return toast(r.error || T("sendFail"), true); }
  addMsgEl(r.message);
  state.lastId = Math.max(state.lastId, r.message.id);
  const row = state.users.find((u) => u.user.id === state.peer);
  if (row) { row.last = { text, ts: r.message.ts, mine: true }; renderList(); }
}
$("#sendBtn").onclick = sendMsg;
$("#msgInput").addEventListener("keydown", (e) => e.key === "Enter" && sendMsg());

/* head actions */
document.querySelectorAll("#chatHead .acts .icon-btn").forEach((b) => {
  b.onclick = async (e) => {
    e.stopPropagation();
    const act = b.dataset.act;
    if (act === "more") return openPanel();
    if (state.mode === "dm" && state.peer != null) {
      await API("/call", { method: "POST", body: { peer: state.peer } });
      modal(T("callTitle", { N: state.peerUser.name }), T("callText"), [{ label: T("callEnd"), cls: "red" }]);
    } else if (state.mode === "group") {
      openPanel();
    }
  };
});
$("#chatHead").onclick = () => openPanel();
$("#backBtn").onclick = (e) => {
  e.stopPropagation();
  $("#chatCol").classList.remove("open");
  state.peer = null; state.gpeer = null;
};

/* ================= GROUP CHAT ================= */
async function openGroup(id) {
  state.peer = null;
  state.gpeer = id;
  state.lastId = 0; state.mode = "group";
  $("#msgs").innerHTML = "";
  $("#chatClosed").style.display = "none";
  $("#chatActive").style.display = "flex";
  $("#chatCol").classList.add("open");
  let g = state.groups.find((x) => x.id === id);
  if (!g) { await loadAll(); g = state.groups.find((x) => x.id === id); }
  if (!g) return toast(T("grpNotFound"), true);
  state.gname = g;
  const isCh = g.kind === "channel";
  $("#cName").textContent = g.name;
  $("#cAv").style.background = isCh ? "#8A5A2B" : "#A96A33";
  $("#cAv").innerHTML = isCh ? "📣" : "👥";
  $("#cStatus").textContent = (isCh ? T("chPrefix") : T("grpPrefix")) + FA(g.members) + " " + (g.members === 1 ? T("member") : T("members"));
  $("#cStatus").className = "st off";
  $("#msgInput").placeholder = isCh && g.role === "member" ? T("phChannelRO") : T("phGroup", { N: g.name });
  renderList();
  await loadGMsgs();
  g.unread = 0; renderList(); loadAll();
}
async function loadGMsgs() {
  if (state.gpeer == null) return;
  const r = await API("/gmessages/" + state.gpeer + "?after_id=" + state.lastId);
  if (!r.ok) return;
  const msgs = $("#msgs");
  let dayShown = lastDay();
  r.messages.forEach((m) => {
    const day = fmtDay(m.ts);
    if (day !== dayShown) {
      dayShown = day;
      const sep = document.createElement("div");
      sep.className = "day-sep"; sep.textContent = day;
      msgs.appendChild(sep);
    }
    addMsgEl(m, false, { name: m.sender, color: m.scolor || "#E8833A" });
    state.lastId = Math.max(state.lastId, m.id);
  });
  if (r.messages.length) msgs.scrollTop = msgs.scrollHeight;
}
async function sendGroupMsg(text, inp) {
  inp.value = "";
  const r = await API("/gmessages/" + state.gpeer, { method: "POST", body: { text } });
  if (!r.ok) { inp.value = text; return toast(r.error || T("sendFail"), true); }
  addMsgEl({ ...r.message }, true, null);
  state.lastId = Math.max(state.lastId, r.message.id);
  const g = state.groups.find((x) => x.id === state.gpeer);
  if (g) { g.last = { text, ts: r.message.ts, sender: state.me.name }; renderList(); }
}

/* new chat / group / channel button */
$("#newChatBtn").onclick = () => {
  modal(T("newChat"), "", [
    { label: T("newGroup"), cls: "pri", fn: () => newGroupModal("group") },
    { label: T("newChannel"), cls: "pri", fn: () => newGroupModal("channel") },
    { label: T("cancel"), cls: "ghost" },
  ]);
};
function newGroupModal(kind) {
  modal(kind === "group" ? T("makeGroup") : T("makeChannel"), "", [
    { label: kind === "group" ? T("makeGroup") : T("makeChannel"), cls: "pri", fn: async () => {
        const name = $("#ngName").value.trim();
        if (name.length < 2) return toast(T("nameShort"), true);
        const members = [...document.querySelectorAll("#ngMembers input:checked")].map((c) => +c.value);
        const r = await API("/groups", { method: "POST", body: { name, kind, members } });
        if (r.ok) { toast(T("createdGrp", { K: kind === "group" ? T("grp") : T("channel"), N: name })); await loadAll(); await openGroup(r.id); }
        else toast(r.error || T("err"), true);
      } },
    { label: T("cancel"), cls: "ghost" },
  ]);
  const p = $("#mText");
  p.style.color = "var(--txt)";
  p.innerHTML = `
    <div class="field"><label>${kind === "group" ? T("grpName") : T("chName")}</label>
      <div class="inp"><span>${kind === "group" ? "👥" : "📣"}</span><input id="ngName" placeholder="${kind === "group" ? T("grpNamePh") : T("chNamePh")}"></div></div>
    <div class="field"><label>${T("pickMembers")}</label><div class="member-pick" id="ngMembers">
      ${state.users.map((u) => `<label class="mp">${avHtml(u.user, "sm", false).replace('class="av', 'style="background:' + avColor(u.user) + '" class="av')}
        <input type="checkbox" value="${u.user.id}"><b>${esc(u.user.name)}</b></label>`).join("")}
    </div></div>`;
}

/* ================= PROFILE PANEL ================= */
function openPanel() {
  if (state.mode === "dm" && state.peerUser) {
    const u = state.peerUser;
    $("#panelTitle").textContent = T("contactInfo");
    $("#pAv").outerHTML = avHtml(u, "lg", true).replace('class="av ', 'id="pAv" class="av ');
    $("#pName").textContent = u.name;
    $("#pSub").textContent = "+" + u.phone.replace(/^0/, "98");
    $("#pAbout").textContent = u.about || "—";
    $("#pAbout").style.display = "";
    $("#pQuick").style.display = "";
    $("#infoTitle").style.display = "";
    $("#dmInfo").style.display = "";
    $("#grpInfo").style.display = "none";
    $("#piName").textContent = u.name;
    $("#piPhone").textContent = u.mid ? "@" + u.mid : (u.email ? u.email : "+" + u.phone.replace(/^0/, "98"));
    $("#piAbout").textContent = u.about || "—";
    $("#blockLabel").textContent = rowBlocked() ? T("unblock") : T("blockUser");
    $("#deleteLabel").textContent = T("delChat");
    $("#rowBlock").style.display = "";
  } else if (state.mode === "group" && state.gname) {
    const g = state.gname;
    $("#panelTitle").textContent = g.kind === "channel" ? T("channelInfo") : T("groupInfo");
    $("#pAv").innerHTML = g.kind === "channel" ? "📣" : "👥";
    $("#pAv").style.background = "#8A5A2B";
    $("#pName").textContent = g.name;
    $("#pSub").textContent = (g.kind === "channel" ? T("chPrefix") : T("grpPrefix")) + FA(g.members) + " " + (g.members === 1 ? T("member") : T("members"));
    $("#pAbout").style.display = "none";
    $("#pQuick").style.display = "none";
    $("#infoTitle").style.display = "none";
    $("#dmInfo").style.display = "none";
    $("#grpInfo").style.display = "";
    $("#giKind").textContent = g.kind === "channel" ? T("channelKind") : T("groupKind");
    $("#deleteLabel").textContent = g.role === "owner" ? T("delGroup") : T("leaveGroup");
    $("#rowBlock").style.display = "none";
    loadMemberCount();
  } else return;
  $("#rowDelete").style.display = "";
  $("#panel").classList.add("on");
  loadStarCount();
}
function closePanel() { $("#panel").classList.remove("on"); }
$("#panelClose").onclick = closePanel;

async function loadStarCount() {
  if (state.mode === "dm" && state.peer == null) return;
  const r = await API("/starred");
  if (!r.ok) return;
  const key = state.mode === "group" ? "g" + state.gpeer : state.peer;
  $("#starCount").textContent = FA(r.messages.filter((m) => m.peer_id == key).length);
}

async function loadMemberCount() {
  const r = await API("/groups/" + state.gpeer + "/members");
  if (r.ok) $("#memCount").textContent = FA(r.members.length);
}
$("#rowMembers").onclick = async () => {
  const r = await API("/groups/" + state.gpeer + "/members");
  if (!r.ok) return;
  const g = state.gname;
  const canAdd = g.kind === "group" || g.role !== "member";
  const html = r.members.map((m) =>
    "• " + m.name + (m.role === "owner" ? " (" + T("owner") + ")" : m.role === "admin" ? " (" + T("admin") + ")" : "")).join("\n")
    + (canAdd ? "\n\n" + T("addMemberHint") : "");
  modal(T("membersOf", { N: g.name }), html,
    canAdd ? [{ label: T("addMember"), cls: "pri", fn: () => addMemberModal() }, { label: T("close"), cls: "ghost" }]
           : [{ label: T("close"), cls: "ghost" }]);
};
function addMemberModal() {
  modal(T("addMember"), "", [
    { label: T("add"), cls: "pri", fn: async () => {
        const sel = [...document.querySelectorAll("#amList input:checked")].map((c) => +c.value);
        for (const uid of sel) await API("/groups/" + state.gpeer + "/add", { method: "POST", body: { uid } });
        if (sel.length) { toast(T("addedN", { N: FA(sel.length) })); loadAll(); openPanel(); }
      } },
    { label: T("cancel"), cls: "ghost" },
  ]);
  const p = $("#mText");
  p.style.color = "var(--txt)";
  p.innerHTML = `<div class="member-pick" id="amList">
    ${state.users.map((u) => `<label class="mp">${avHtml(u.user, "sm", false)}
      <input type="checkbox" value="${u.user.id}"><b>${esc(u.user.name)}</b></label>`).join("")}
  </div>`;
}
$("#rowStarred").onclick = async () => {
  const r = await API("/starred");
  if (!r.ok) return;
  const key = state.mode === "group" ? "g" + state.gpeer : state.peer;
  const mine = r.messages.filter((m) => m.peer_id == key);
  modal(T("starredTitle"), mine.length ? mine.map((m) => "• " + m.text + (m.gsender ? " — " + m.gsender : "")).join("\n") : T("noStarred"), [{ label: T("close"), cls: "ghost" }]);
};
$("#rowMute").onclick = () => {
  state.mute = !state.mute;
  $("#muteT").classList.toggle("on", state.mute);
  toast(state.mute ? T("muted") : T("unmuted"));
};
$("#rowBlock").onclick = () => {
  if (state.mode !== "dm") return;
  const blocked = rowBlocked();
  modal(blocked ? T("unblock") : T("blockUser"),
    blocked ? T("unblockConfirm", { N: state.peerUser.name }) : T("blockConfirm", { N: state.peerUser.name }),
    [{ label: T("cancel"), cls: "ghost" },
     { label: blocked ? T("unblock") : T("blockUser"), cls: "red", fn: async () => {
        const r = await API("/block/" + state.peer, { method: "POST", body: { blocked: !blocked } });
        if (r.ok) { toast(r.blocked ? T("blockedToast") : T("unblockedToast")); loadAll(); updateHeadStatus(); openPanel(); }
     } }]);
};
$("#rowDelete").onclick = () => {
  if (state.mode === "group") {
    const g = state.gname;
    const own = g.role === "owner";
    modal(own ? T("delGroup") : T("leaveGroup"),
      own ? T("delGrpConfirm", { N: g.name }) : T("leaveGrpConfirm", { N: g.name }),
      [{ label: T("cancel"), cls: "ghost" },
       { label: own ? T("delete") : T("leave"), cls: "red", fn: async () => {
          const r = await API("/groups/" + state.gpeer + "/leave", { method: "POST" });
          if (r.ok) { toast(own ? T("delGrpToast") : T("leftGrpToast")); closePanel();
            $("#chatClosed").style.display = ""; $("#chatActive").style.display = "none";
            state.gpeer = null; loadAll(); }
       } }]);
  } else {
    modal(T("delChat"), T("delChatConfirm"),
      [{ label: T("cancel"), cls: "ghost" },
       { label: T("delete"), cls: "red", fn: async () => {
          const r = await API("/delete_chat", { method: "POST", body: { peer: state.peer } });
          if (r.ok) { toast(T("delChatToast")); closePanel(); state.lastId = 0; $("#msgs").innerHTML = ""; loadAll(); }
       } }]);
  }
};

/* ================= PROFILE EDIT (with photo) ================= */
$("#edProf").onclick = () => editProfile();
function editProfile() {
  modal(T("editProfile"), "", [
    { label: T("save"), cls: "pri", fn: async () => {
        const name = $("#epName").value.trim(), about = $("#epAbout").value.trim();
        const r = await API("/profile", { method: "POST", body: { name, about } });
        if (r.ok) { state.me = r.user; renderMe(); toast(T("profileSaved")); }
        else toast(r.error || T("err"), true);
        if (state.pickedAvatar != null) {
          if (state.pickedAvatar === "") {
            const rr = await API("/profile", { method: "POST", body: { avatar: "" } });
            if (rr.ok) { state.me = rr.user; renderMe(); toast(T("photoRemoved")); }
          } else {
            const rr = await API("/avatar", { method: "POST", body: { data: state.pickedAvatar } });
            if (rr.ok) { state.me = { ...state.me, avatar: rr.avatar }; renderMe(); loadAll(); toast(T("photoSaved")); }
            else toast(rr.error === "bad image" ? T("photoBad") : (rr.error || T("err")), true);
          }
          state.pickedAvatar = null;
        }
      } },
    { label: T("cancel"), cls: "ghost" },
  ]);
  state.pickedAvatar = null;
  const p = $("#mText");
  p.style.color = "var(--txt)";
  p.innerHTML = `
    <div class="ep-photo">
      <span class="av lg" id="epAv"></span>
      <div class="ep-acts">
        <button class="btn ghost" id="epPick">${T("pickPhoto")}</button>
        ${state.me.avatar ? `<button class="btn ghost" id="epDel">${T("removePhoto")}</button>` : ""}
      </div>
      <input type="file" id="epFile" accept="image/png,image/jpeg,image/webp" style="display:none">
    </div>
    <div class="field"><label>${T("name")}</label><div class="inp"><input id="epName" value="${esc(state.me.name)}"></div></div>
    <div class="field"><label>${T("about")}</label><div class="inp"><input id="epAbout" value="${esc(state.me.about || "")}"></div></div>`;
  const renderEpAv = () => {
    const a = $("#epAv");
    if (state.pickedAvatar) a.innerHTML = `<img class="av-img" src="${state.pickedAvatar}">`;
    else if (state.me.avatar) a.innerHTML = `<img class="av-img" src="${esc(state.me.avatar)}">`;
    else { a.style.background = avColor(state.me); a.textContent = initial(state.me.name); }
  };
  renderEpAv();
  $("#epPick").onclick = () => $("#epFile").click();
  $("#epFile").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 1500000) return toast(T("photoTooBig"), true);
    const rd = new FileReader();
    rd.onload = () => { state.pickedAvatar = rd.result; renderEpAv(); };
    rd.readAsDataURL(f);
  };
  const del = $("#epDel");
  if (del) del.onclick = () => { state.pickedAvatar = ""; $("#epAv").innerHTML = esc(initial(state.me.name)); $("#epAv").style.background = avColor(state.me); };
}

/* ================= POLLING ================= */
function startPolling() {
  clearInterval(state.poll);
  state.poll = setInterval(async () => {
    if (state.view !== "chats") return;
    await loadAll();
    if (state.mode === "dm" && state.peer != null) {
      await loadMsgs();
      updateHeadStatus();
    } else if (state.mode === "group" && state.gpeer != null) {
      await loadGMsgs();
    }
  }, 3000);
}

/* ================= BOOT ================= */
applyLang();
if (state.token) {
  API("/me").then((r) => {
    if (r.ok) { enter({ ...r, token: state.token }); }
    else { store.del("morse_token"); setAuthMode("login"); }
  });
} else {
  setAuthMode("login");
}
