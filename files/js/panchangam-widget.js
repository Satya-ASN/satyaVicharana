/**
 * Telugu Panchangam popup widget for satyavicharana.com
 * -------------------------------------------------------
 * Requires panchangam-engine.min.js to be loaded first (defines window.TeluguPanchangam).
 *
 * Usage on your page:
 *   <button id="panchangam-btn">ఈరోజు పంచాంగం</button>
 *   <script src="panchangam-engine.min.js"></script>
 *   <script src="panchangam-widget.js"></script>
 *
 * To add more cities later: add an entry to CITIES below.
 * To add more panchangam details later: add an entry to FIELDS below —
 * each entry just needs a `get(p)` that reads from the computed result.
 */
(function () {

  // ---- Configure cities here ----
  var CITIES = [
    { key: "Toronto", te: "టొరాంటో", en: "Toronto", lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
    { key: "Visakhapatnam", te: "విశాఖపట్నం", en: "Visakhapatnam", lat: 17.6868, lng: 83.2185, tz: "Asia/Kolkata" }
    // Add more cities here later, e.g.:
    // { key: "Hyderabad", te: "హైదరాబాద్", en: "Hyderabad", lat: 17.3850, lng: 78.4867, tz: "Asia/Kolkata" },
  ];

  // ---- Configure detail cards here — add more later by pushing new entries ----
  var FIELDS = [
    
    {
      label: { te: "సంవత్సరం", en: "Samvatsaram" },
      get: function (p) { return p.samvatsaram.te + " (" + p.samvatsaram.en + ")"; },
      meta: function () { return ""; }
    },
    {
      label: { te: "నక్షత్రం", en: "Nakshatra" },
      get: function (p) { return p.nakshatra.te + " (" + p.nakshatra.en + ", పాద " + p.nakshatra.pada + ")"; },
      meta: function (p) { return "వరకు " + fmt12(p.nakshatra.endsAt); }
    },
    {
      label: { te: "యోగం", en: "Yoga" },
      get: function (p) { return p.yoga.te + " (" + p.yoga.en + ")"; },
      meta: function (p) { return "వరకు " + fmt12(p.yoga.endsAt); }
    },
    {
      label: { te: "కరణం", en: "Karana" },
      get: function (p) { return p.karana.te + " (" + p.karana.en + ")"; },
      meta: function (p) { return "వరకు " + fmt12(p.karana.endsAt); }
    },
    {
      label: { te: "తిథి ముగింపు", en: "Tithi Ends" },
      get: function (p) { return fmt12(p.tithi.endsAt); },
      meta: function (p) { return "తర్వాత " + p.tithi.nextTithi.te + " (" + p.tithi.nextTithi.en + ")"; }
    },
    {
      label: { te: "చంద్ర దశ", en: "Moon Phase" },
      get: function (p) { return p.moonPhase.te + " (" + p.moonPhase.en + ")"; },
      meta: function (p) { return p.moonPhase.illuminationPercent + "% ప్రకాశం"; }
    }
    // Add more fields here later, e.g.:
    // { label: {te:"ఆయనం", en:"Ayana"}, get: function(p){ return p.ayana.te; }, meta: function(){ return ""; } },
  ];

  // ---- Helpers ----
  function timeParts(iso) {
    var clock = iso.split("T")[1];
    var bits = clock.split(":");
    return { h: Number(bits[0]), m: Number(bits[1]), minutes: Number(bits[0]) * 60 + Number(bits[1]) };
  }
  function fmt12(iso) {
    if (!iso) return "—";
    var t = timeParts(iso);
    var period = t.h < 12 ? "AM" : "PM";
    var h12 = t.h % 12; if (h12 === 0) h12 = 12;
    return h12 + ":" + String(t.m).padStart(2, "0") + " " + period;
  }
  function pct(minutes, start, end) {
    return Math.max(0, Math.min(100, ((minutes - start) / (end - start)) * 100));
  }
  function fmtDate(dateStr) {
    var bits = dateStr.split("-").map(Number);
    var dt = new Date(Date.UTC(bits[0], bits[1] - 1, bits[2]));
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  }
  function nowIndicator(city, dateStr, sunriseMin, sunsetMin) {
    try {
      var now = new Date();
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
      var h = Number(parts.find(function (p) { return p.type === "hour"; }).value);
      var m = Number(parts.find(function (p) { return p.type === "minute"; }).value);
      var nowMin = h * 60 + m;
      var nowDateStr = new Intl.DateTimeFormat("en-CA", { timeZone: city.tz }).format(now);
      if (nowDateStr !== dateStr) return null;
      if (nowMin < sunriseMin || nowMin > sunsetMin) return null;
      return pct(nowMin, sunriseMin, sunsetMin);
    } catch (e) { return null; }
  }

  // ---- CSS (scoped inside shadow root, safe to re-theme via these variables) ----
  var CSS = [
    ":host{all:initial;}",
    "*{box-sizing:border-box;margin:0;padding:0;}",
    ".tp-root{--bg-0:#2b2158;--bg-2:#453579;--card:#3a2d6bcc;--card-border:#7867ad66;--gold:#e0ac52;--gold-soft:#f3d38f;--gold-dim:#a88c56;--cream:#f7f2e7;--muted:#c9c0e6;--muted-dim:#9a8fc4;--vermillion:#d1655c;--amber:#d99a56;--umber:#b58860;--auspicious:#7fbb98;--divider:#6552a0;",
    "  position:fixed;inset:0;z-index:99999;display:none;font-family:'Noto Sans Telugu','Segoe UI',sans-serif;",
    "}",
    ".tp-root.tp-open{display:block;}",
    ".tp-overlay{position:absolute;inset:0;background:#05061aee;backdrop-filter:blur(2px);}",
    ".tp-modal{position:relative;max-width:520px;width:92%;max-height:86vh;overflow-y:auto;margin:5vh auto 0;background:linear-gradient(180deg,var(--bg-0),var(--bg-2));border:1px solid var(--card-border);border-radius:18px;padding:24px 20px 20px;box-shadow:0 20px 60px #000000aa;color:var(--cream);}",
    ".tp-close{position:absolute;top:14px;right:14px;background:transparent;border:1px solid var(--card-border);color:var(--muted);width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;line-height:1;}",
    ".tp-close:hover{color:var(--gold-soft);border-color:var(--gold-dim);}",
    ".tp-title{text-align:center;font-size:1.3rem;color:var(--gold-soft);margin-bottom:14px;letter-spacing:0.02em;}",
    ".tp-tabs{display:flex;gap:8px;margin-bottom:18px;}",
    ".tp-tabs button{flex:1;background:transparent;border:1px solid var(--card-border);color:var(--muted);font-size:1rem;padding:9px 6px;border-radius:999px;cursor:pointer;}",
    ".tp-tabs button.tp-active{background:linear-gradient(180deg,#2a2260,#1c1748);border-color:var(--gold);color:var(--gold-soft);}",
    ".tp-hero{text-align:center;padding:6px 4px 18px;border-bottom:1px solid var(--divider);margin-bottom:16px;}",
    ".tp-date{font-size:1rem;color:var(--muted);font-style:italic;}",
    ".tp-vara{font-size:1.9rem;color:var(--gold-soft);margin:6px 0 2px;}",
    ".tp-tithi{font-size:1.05rem;color:var(--cream);}",
    ".tp-tithi small{display:block;color:var(--muted);font-size:1rem;font-style:italic;}",
    ".tp-masa{margin-top:6px;color:var(--muted);font-size:1rem;}",
    ".tp-arc-wrap{background:var(--card);border:1px solid var(--card-border);border-radius:14px;padding:16px 14px;margin-bottom:16px;}",
    ".tp-arc-title{display:flex;justify-content:space-between;font-size:0.82rem;color:var(--muted);margin-bottom:10px;}",
    ".tp-arc-track{position:relative;height:12px;background:linear-gradient(90deg,#2a2555,#4a3f7a,#2a2555);border-radius:999px;margin:6px 0;}",
    ".tp-band{position:absolute;top:0;height:100%;border-radius:4px;opacity:0.92;}",
    ".tp-now{position:absolute;top:-6px;width:2px;height:24px;background:var(--gold-soft);box-shadow:0 0 8px 2px #f0cd8899;}",
    ".tp-legend{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;font-size:1rem;color:var(--muted);}",
    ".tp-legend .tp-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px;}",
    ".tp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}",
    ".tp-card{background:var(--card);border:1px solid var(--card-border);border-radius:12px;padding:12px 12px 10px;}",
    ".tp-card .tp-label{font-size:1rem;letter-spacing:0.05em;text-transform:uppercase;color:var(--muted-dim);font-style:italic;}",
    ".tp-card .tp-value{font-size:1.05rem;color:var(--gold-soft);margin-top:3px;line-height:1.3;}",
    ".tp-card .tp-meta{font-size:1rem;color:var(--muted);margin-top:5px;}",
    ".tp-loading, .tp-error{text-align:center;padding:30px 10px;color:var(--muted);font-size:0.9rem;}"
  ].join("\n");

  // ---- Build DOM once ----
  var host = document.createElement("div");
  host.id = "tp-widget-host";
  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();

  var shadow, rootEl, activeCity = CITIES[0].key;

  function init() {
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent = CSS;
    shadow.appendChild(style);

    rootEl = document.createElement("div");
    rootEl.className = "tp-root";
    rootEl.innerHTML =
      '<div class="tp-overlay" data-close="1"></div>' +
      '<div class="tp-modal">' +
        '<button class="tp-close" aria-label="Close">✕</button>' +
        '<div class="tp-title">తెలుగు పంచాంగం</div>' +
        '<div class="tp-tabs"></div>' +
        '<div class="tp-body"></div>' +
      '</div>';
    shadow.appendChild(rootEl);

    var tabsEl = rootEl.querySelector(".tp-tabs");
    CITIES.forEach(function (city) {
      var b = document.createElement("button");
      b.textContent = city.te;
      b.className = city.key === activeCity ? "tp-active" : "";
      b.addEventListener("click", function () { setActiveCity(city.key); });
      b.dataset.city = city.key;
      tabsEl.appendChild(b);
    });

    rootEl.querySelector(".tp-close").addEventListener("click", closeModal);
    rootEl.querySelector(".tp-overlay").addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });

    // Wire up the trigger button, if present on the page
    var trigger = document.getElementById("panchangam-btn");
    if (trigger) trigger.addEventListener("click", openModal);

    // Expose a manual open function too, in case you trigger it from elsewhere
    window.openPanchangam = openModal;
  }

  function openModal() {
    rootEl.classList.add("tp-open");
    renderActiveCity();
  }
  function closeModal() {
    rootEl.classList.remove("tp-open");
  }
  function setActiveCity(key) {
    activeCity = key;
    rootEl.querySelectorAll(".tp-tabs button").forEach(function (b) {
      b.classList.toggle("tp-active", b.dataset.city === key);
    });
    renderActiveCity();
  }

  function renderActiveCity() {
    var bodyEl = rootEl.querySelector(".tp-body");
    var city = CITIES.filter(function (c) { return c.key === activeCity; })[0];
    bodyEl.innerHTML = '<div class="tp-loading">లోడ్ అవుతోంది...</div>';

    setTimeout(function () {
      try {
        if (!window.TeluguPanchangam) throw new Error("engine not loaded");
        var p = window.TeluguPanchangam.getToday({ lat: city.lat, lng: city.lng, tz: city.tz });
        bodyEl.innerHTML = renderPanchangam(city, p);
      } catch (e) {
        bodyEl.innerHTML = '<div class="tp-error">పంచాంగం లోడ్ కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.<br><small>' + e.message + '</small></div>';
      }
    }, 10);
  }

  function renderPanchangam(city, p) {
    var sunriseT = timeParts(p.sunrise).minutes;
    var sunsetT = timeParts(p.sunset).minutes;
    var rahu = { s: timeParts(p.rahukalam.start).minutes, e: timeParts(p.rahukalam.end).minutes };
    var gulika = { s: timeParts(p.gulikaKalam.start).minutes, e: timeParts(p.gulikaKalam.end).minutes };
    var yama = { s: timeParts(p.yamagandam.start).minutes, e: timeParts(p.yamagandam.end).minutes };
    var nowP = nowIndicator(city, p.date, sunriseT, sunsetT);

    var fieldsHtml = FIELDS.map(function (f) {
      return '<div class="tp-card"><div class="tp-label">' + f.label.te + '</div>' +
        '<div class="tp-value">' + f.get(p) + '</div>' +
        '<div class="tp-meta">' + f.meta(p) + '</div></div>';
    }).join("");

    return (
      '<div class="tp-hero">' +
        '<div class="tp-date">' + city.te + ' · ' + fmtDate(p.date) + '</div>' +
        '<div class="tp-vara">' + p.vara.te + '</div>' +
        '<div class="tp-tithi">' + p.paksha.te + ' · ' + p.tithi.te + ' తిథి<small>' + p.paksha.en + ' · ' + p.tithi.en + '</small></div>' +
        '<div class="tp-masa">' + p.masa.te + ' మాసం · ' + p.ritu.te + ' · ' + p.ayana.te + '</div>' +
      '</div>' +
      '<div class="tp-arc-wrap">' +
        '<div class="tp-arc-title"><span>🌅 ' + fmt12(p.sunrise) + '</span><span>🌇 ' + fmt12(p.sunset) + '</span></div>' +
        '<div class="tp-arc-track">' +
          '<div class="tp-band" style="left:' + pct(rahu.s, sunriseT, sunsetT) + '%;width:' + (pct(rahu.e, sunriseT, sunsetT) - pct(rahu.s, sunriseT, sunsetT)) + '%;background:var(--vermillion)"></div>' +
          '<div class="tp-band" style="left:' + pct(gulika.s, sunriseT, sunsetT) + '%;width:' + (pct(gulika.e, sunriseT, sunsetT) - pct(gulika.s, sunriseT, sunsetT)) + '%;background:var(--amber)"></div>' +
          '<div class="tp-band" style="left:' + pct(yama.s, sunriseT, sunsetT) + '%;width:' + (pct(yama.e, sunriseT, sunsetT) - pct(yama.s, sunriseT, sunsetT)) + '%;background:var(--umber)"></div>' +
          (nowP !== null ? '<div class="tp-now" style="left:' + nowP + '%"></div>' : '') +
        '</div>' +
        '<div class="tp-legend">' +
          '<span><span class="tp-dot" style="background:var(--vermillion)"></span>రాహుకాలం ' + fmt12(p.rahukalam.start) + '–' + fmt12(p.rahukalam.end) + '</span>' +
          '<span><span class="tp-dot" style="background:var(--amber)"></span>గులికకాలం ' + fmt12(p.gulikaKalam.start) + '–' + fmt12(p.gulikaKalam.end) + '</span>' +
          '<span><span class="tp-dot" style="background:var(--umber)"></span>యమగండం ' + fmt12(p.yamagandam.start) + '–' + fmt12(p.yamagandam.end) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="tp-grid">' + fieldsHtml + '</div>'
    );
  }

})();
