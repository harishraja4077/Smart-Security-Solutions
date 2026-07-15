/* -------------------------------------------------------------
 * Stackly - Smart Security Solutions Script
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Global Variables
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const scrollProgress = document.getElementById('scroll-progress');
  const progressPath = document.getElementById('progress-path');
  
  /* ==========================================================
   * 1. Header Scroll & Mobile Navigation
   * ========================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    const toggleMenu = (show) => {
      const shouldOpen = show !== undefined ? show : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', shouldOpen);
      mobileToggle.classList.toggle('active', shouldOpen);
      
      if (shouldOpen) {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.classList.add('menu-open');
      } else {
        const scrollY = document.body.style.top;
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // Animate hamburger lines
      const spans = mobileToggle.querySelectorAll('span');
      if (shouldOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close menu when clicking outside the menu & toggle button
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  /* ==========================================================
   * 2. Interactive CCTV Hero Viewfinder Telemetry
   * ========================================================== */
  const telemetryTime = document.getElementById('telemetry-time');
  const telemetryCoords = document.getElementById('telemetry-coords');
  const heroVisual = document.querySelector('.hero-visual');

  // Live Telemetry Date & Time
  function updateTelemetryTime() {
    if (!telemetryTime) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    telemetryTime.innerHTML = `SYS.REC // ON<br>${year}-${month}-${day}<br>${hours}:${minutes}:${seconds}<br>FPS: 60.00`;
  }
  setInterval(updateTelemetryTime, 1000);
  updateTelemetryTime();

  // Mouse Move Interaction in Hero (coordinates and viewfinder crosshair updates)
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      if (!telemetryCoords) return;
      const rect = heroVisual.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const pctX = ((x / rect.width) * 100).toFixed(2);
      const pctY = ((y / rect.height) * 100).toFixed(2);
      
      telemetryCoords.innerHTML = `TARGET LOC:<br>X: ${x}px (${pctX}%)<br>Y: ${y}px (${pctY}%)<br>ZOOM: 1.8X`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      if (!telemetryCoords) return;
      telemetryCoords.innerHTML = `TARGET LOC:<br>X: -- px (--%)<br>Y: -- px (--%)<br>ZOOM: AUTO`;
    });
  }

  /* ==========================================================
   * 3. Scrolling Stats Counter Animation
   * ========================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll('.stat-number');
        stats.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          const speed = 200; // lower is faster
          const updateCount = () => {
            const count = +stat.innerText;
            const inc = Math.ceil(target / speed);
            
            if (count < target) {
              stat.innerText = count + inc > target ? target : count + inc;
              setTimeout(updateCount, 1);
            } else {
              stat.innerText = target;
            }
          };
          updateCount();
        });
        observer.unobserve(entry.target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.3
  });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    statsObserver.observe(statsGrid);
  }

  /* ==========================================================
   * 4. FAQ Accordion Logic
   * ========================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  const progressFills = document.querySelectorAll('.progress-fill');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all answers
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Animate FAQ Section Progress Bars on Scroll
  const faqSection = document.querySelector('.faq-section');
  if (faqSection && progressFills.length > 0) {
    const animateFaqProgress = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width + '%';
          });
          observer.unobserve(entry.target);
        }
      });
    };

    const faqProgressObserver = new IntersectionObserver(animateFaqProgress, {
      threshold: 0.3
    });
    faqProgressObserver.observe(faqSection);
  }

  /* ==========================================================
   * 5. Interactive CCTV Live Feed Simulation
   * ========================================================== */
  const feedBtnCam01 = document.getElementById('feed-cam-1');
  const feedBtnCam02 = document.getElementById('feed-cam-2');
  const feedBtnCam03 = document.getElementById('feed-cam-3');
  const feedBtnScan = document.getElementById('feed-scan');
  const liveVideo = document.getElementById('live-video');
  const cameraLabel = document.getElementById('camera-label');

  // Video feeds (free placeholder high quality surveillance content)
  const videoFeeds = {
    cam1: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80', // CCTV Close
    cam2: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', // Server Room
    cam3: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'  // Access Control Room
  };

  function switchCamera(camId, label, activeBtn) {
    if (!liveVideo) return;
    
    // Highlight active camera button
    [feedBtnCam01, feedBtnCam02, feedBtnCam03].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    activeBtn.classList.add('active');

    // Add visual glitch during switch
    liveVideo.classList.add('video-glitch');
    setTimeout(() => {
      liveVideo.src = videoFeeds[camId];
      if (cameraLabel) cameraLabel.textContent = label;
      setTimeout(() => {
        liveVideo.classList.remove('video-glitch');
      }, 500);
    }, 300);
  }

  if (feedBtnCam01) {
    feedBtnCam01.addEventListener('click', () => switchCamera('cam1', 'CAM 01 // MAIN ENTRANCE', feedBtnCam01));
  }
  if (feedBtnCam02) {
    feedBtnCam02.addEventListener('click', () => switchCamera('cam2', 'CAM 02 // SERVER RACKS', feedBtnCam02));
  }
  if (feedBtnCam03) {
    feedBtnCam03.addEventListener('click', () => switchCamera('cam3', 'CAM 03 // HQ CONTROL', feedBtnCam03));
  }
  if (feedBtnScan) {
    feedBtnScan.addEventListener('click', () => {
      if (!liveVideo) return;
      liveVideo.classList.add('video-glitch');
      const prevLabel = cameraLabel.textContent;
      if (cameraLabel) cameraLabel.textContent = 'SCANNING FOR SIGNAL...';
      
      setTimeout(() => {
        liveVideo.classList.remove('video-glitch');
        if (cameraLabel) cameraLabel.textContent = prevLabel;
      }, 1500);
    });
  }

  /* ==========================================================
   * 6. Testimonial Slider / Carousel
   * ========================================================== */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentSlide = 0;

  function showSlide(index) {
    if (testimonialSlides.length === 0) return;
    
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    
    currentSlide = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides[currentSlide].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    
    // Auto slide
    let autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 6000);
    
    // Stop auto-slide on hover/click
    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };
    
    prevBtn.addEventListener('mouseenter', stopAutoSlide);
    nextBtn.addEventListener('mouseenter', stopAutoSlide);
  }

  /* ==========================================================
   * 7. Scroll Progress / Back to Top Button
   * ========================================================== */
  if (scrollProgress && progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const offset = pathLength - (progress * pathLength);
      
      progressPath.style.strokeDashoffset = offset;
      
      if (window.scrollY > 300) {
        scrollProgress.classList.add('show');
      } else {
        scrollProgress.classList.remove('show');
      }
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    scrollProgress.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================
   * 8. Scroll Reveal Animations
   * ========================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  const revealOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealOnScroll, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
