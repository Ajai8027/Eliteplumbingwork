/* =========================================================
   Elite Plumbing Work — main script
   ========================================================= */
(function () {
  "use strict";

  var WHATSAPP = "919840055014";

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (toTop) toTop.classList.toggle("is-show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById("primaryNav");
  var navToggle = document.getElementById("navToggle");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Stat counters ---------- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq__q");
    var panel = item.querySelector(".faq__a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        var ob = other.querySelector(".faq__q");
        var op = other.querySelector(".faq__a");
        if (ob) ob.setAttribute("aria-expanded", "false");
        if (op) op.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  function syncFaqHeights() {
    faqItems.forEach(function (item) {
      if (!item.classList.contains("is-open")) return;
      var panel = item.querySelector(".faq__a");
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    });
  }
  window.addEventListener("resize", syncFaqHeights);
  window.addEventListener("orientationchange", syncFaqHeights);

  /* ---------- Gallery lightbox ---------- */
  var gallery = document.getElementById("gallery-grid");
  if (gallery) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<button class="lightbox__close" aria-label="Close">&times;</button><img alt="Plumbing work preview">';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");

    gallery.addEventListener("click", function (e) {
      var link = e.target.closest(".gallery__item");
      if (!link) return;
      e.preventDefault();
      lbImg.src = link.getAttribute("href");
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });

    function closeLb() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      lbImg.src = "";
    }
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__close")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("is-open")) closeLb();
    });
  }

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.getElementById("enquiryForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      var nameField = document.getElementById("f-name");
      var phoneField = document.getElementById("f-phone");
      var serviceField = document.getElementById("f-service");

      nameField.classList.remove("invalid");
      phoneField.classList.remove("invalid");
      serviceField.classList.remove("invalid");

      var errors = [];
      if (name.length < 2) { nameField.classList.add("invalid"); errors.push("name"); }
      if (!/^[+\d][\d\s-]{6,17}$/.test(phone)) { phoneField.classList.add("invalid"); errors.push("a valid phone number"); }
      if (!service) { serviceField.classList.add("invalid"); errors.push("a service"); }

      if (errors.length) {
        status.textContent = "Please enter " + errors.join(", ") + ".";
        status.className = "enquiry-form__status err";
        if (errors[0] === "name") nameField.focus();
        else if (errors[0] === "a valid phone number") phoneField.focus();
        else serviceField.focus();
        return;
      }

      var text =
        "New Enquiry – Elite Plumbing Work" +
        "\nName: " + name +
        "\nPhone: " + phone +
        "\nService: " + service +
        (message ? "\nMessage: " + message : "");

      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);

      status.textContent = "Opening WhatsApp with your enquiry…";
      status.className = "enquiry-form__status ok";

      window.open(url, "_blank", "noopener");
      form.reset();
      setTimeout(function () {
        status.textContent = "If WhatsApp did not open, tap the green WhatsApp button.";
      }, 2500);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
