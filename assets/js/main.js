/* ─── Interactive JavaScript for GEONEXUS ───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ─── Mobile Navigation Toggle ──────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
      this.setAttribute('aria-expanded', expanded);
      navList.classList.toggle('open');
    });

    // Close nav on click outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('open');
      }
    });
  }

  // ─── Mobile Dropdown Toggle ────────────────────────────────────────────────
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });

  // ─── Header Scroll Effect ──────────────────────────────────────────────────
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;

  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ─── Table of Contents Generator ───────────────────────────────────────────
  const tocContainer = document.getElementById('toc');
  const postBody = document.querySelector('.post-body');

  if (tocContainer && postBody) {
    const headings = postBody.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      const tocList = document.createElement('ul');

      headings.forEach(function(heading) {
        // Add ID if missing
        if (!heading.id) {
          heading.id = heading.textContent.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;

        if (heading.tagName === 'H2') {
          a.className = 'toc-h2';
        } else if (heading.tagName === 'H3') {
          a.className = 'toc-h3';
        }

        li.appendChild(a);
        tocList.appendChild(li);
      });

      tocContainer.appendChild(tocList);

      // Active TOC link highlighting
      const tocLinks = tocContainer.querySelectorAll('a');
      if (tocLinks.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              tocLinks.forEach(function(link) { link.classList.remove('active'); });
              var activeLink = tocContainer.querySelector('a[href="#' + entry.target.id + '"]');
              if (activeLink) activeLink.classList.add('active');
            }
          });
        }, { rootMargin: '-100px 0px -60% 0px' });

        headings.forEach(function(h) { observer.observe(h); });
      }
    }
  }

  // ─── Reading Time ──────────────────────────────────────────────────────────
  var readingTimeEl = document.querySelector('[data-read-time]');
  if (readingTimeEl) {
    var minutes = parseInt(readingTimeEl.getAttribute('data-read-time'));
    if (minutes > 0) {
      readingTimeEl.textContent = minutes + ' min read';
    }
  }

  // ─── Smooth Scroll for Anchor Links ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── GEO Score Visual Indicator (for blog posts) ──────────────────────────
  const geoScoreEls = document.querySelectorAll('.geo-score');
  geoScoreEls.forEach(function(el) {
    var score = parseFloat(el.getAttribute('data-score'));
    if (!isNaN(score)) {
      var color;
      if (score >= 80) color = 'var(--geo-score-high)';
      else if (score >= 50) color = 'var(--geo-score-medium)';
      else color = 'var(--geo-score-low)';
      el.style.setProperty('--score-color', color);
      el.style.background = 'conic-gradient(var(--score-color) 0% ' + score + '%, var(--color-border-light) ' + score + '% 100%)';
    }
  });

  // ─── Intersection Observer for Animations ──────────────────────────────────
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(function(el) { observer.observe(el); });
  }

  console.log('GEONEXUS — Built for the age of AI-driven discovery.');
});
