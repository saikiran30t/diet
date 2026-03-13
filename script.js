document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navigation on Scroll --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const icon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Toggle icon between bars and times (close)
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    /* --- 3. Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* --- 4. Smooth Scroll with Offset for Fixed Header --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Ignore if href is just "#" without id
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* --- 5. Contact Form Simulation --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Getting the submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            // Changing state to loading
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate API Request
            setTimeout(() => {
                alert('Thank you for reaching out! Your consultation request has been received. I will get back to you within 24 hours.');
                contactForm.reset();

                // Resetting button state
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';

            }, 1000);
        });
    }

    /* --- 6. Dynamic Video Render (from Admin) --- */
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid) {
        const adminVideos = JSON.parse(localStorage.getItem('adminVideos')) || [];

        // If there are admin videos, rendering them alongside or instead
        // For customizability, we will just completely replace the placeholders with admin videos if any exist.
        if (adminVideos.length > 0) {
            videoGrid.innerHTML = ''; // Clear defaults
            adminVideos.forEach((vid, index) => {
                const delay = index * 100; // Staggered delay for animation

                let embed = '';
                if (vid.url && vid.url.startsWith('data:video/')) {
                    embed = `<video width="100%" height="100%" controls style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius: 20px 20px 0 0; object-fit: cover; background: #000;">
                                <source src="${vid.url}">
                                Your browser does not support HTML5 video.
                             </video>`;
                } else {
                    embed = `
                        <div class="video-placeholder">
                            <i class="fa-solid fa-play"></i>
                            <p>Play Video</p>
                            <a href="${vid.url}" target="_blank" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"></a>
                        </div>
                    `;

                    if (vid.url && (vid.url.includes("youtube.com") || vid.url.includes("youtu.be"))) {
                        let videoId = "";
                        if (vid.url.includes("youtu.be/")) videoId = vid.url.split("youtu.be/")[1].split("?")[0];
                        else if (vid.url.includes("v=")) videoId = vid.url.split("v=")[1].split("&")[0];

                        if (videoId) {
                            embed = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius: 20px 20px 0 0;"></iframe>`;
                        }
                    }
                }

                const cardHtml = `
                    <div class="video-card reveal" style="transition-delay: ${delay}ms;">
                        <div class="video-wrapper">
                            ${embed}
                        </div>
                        <div class="video-info">
                            <h3>${vid.title}</h3>
                            <p>${vid.desc}</p>
                        </div>
                    </div>
                `;
                videoGrid.insertAdjacentHTML('beforeend', cardHtml);
            });

            // Re-bind the scroll reveal observation to the newly injected elements
            setTimeout(() => {
                const newReveals = videoGrid.querySelectorAll('.reveal');
                newReveals.forEach(el => {
                    revealOnScroll.observe(el);
                });
            }, 100);
        }
    }
});
