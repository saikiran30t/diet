document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Handle dummy action buttons for the demo
    const approveBtns = document.querySelectorAll('.action-btn.approve');
    const declineBtns = document.querySelectorAll('.action-btn.decline');

    approveBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status');

            statusBadge.textContent = 'Confirmed';
            statusBadge.className = 'status confirmed';

            // Remove the approve/decline buttons and replace with an edit button
            const actionTd = this.parentElement;
            actionTd.innerHTML = '<button class="action-btn edit"><i class="fa-solid fa-pen"></i></button>';
        });
    });

    declineBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            if (confirm('Are you sure you want to decline this appointment?')) {
                row.remove();
            }
        });
    });

    // --- Video Testimonials Management ---
    const addVideoForm = document.getElementById('addVideoForm');
    const adminVideoList = document.getElementById('adminVideoList');

    if (addVideoForm) {
        function renderAdminVideos() {
            const videos = JSON.parse(localStorage.getItem('adminVideos')) || [];
            adminVideoList.innerHTML = '';

            if (videos.length === 0) {
                adminVideoList.innerHTML = '<li style="color: #666; font-style: italic;">No custom videos published yet.</li>';
                return;
            }

            videos.forEach((vid, index) => {
                const li = document.createElement('li');
                li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #fcfaf6; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 10px;";
                li.innerHTML = `
                    <div>
                        <strong style="color: #2e5b3f; font-size: 1.1rem; display: block; margin-bottom: 4px;">${vid.title}</strong>
                        <span style="color: #5e5e5e; font-size: 0.9rem;">${vid.desc}</span>
                        <div style="font-size: 0.8rem; color: #888; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px;">
                            ${vid.url}
                        </div>
                    </div>
                    <button class="btn btn-sm action-btn decline" onclick="deleteVideo(${index})" style="background: white; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 8px; border-radius: 5px; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                adminVideoList.appendChild(li);
            });
        }

        addVideoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('videoTitle').value;
            const desc = document.getElementById('videoDesc').value;
            const fileInput = document.getElementById('videoFile');
            const file = fileInput.files[0];
            const btn = document.getElementById('addVideoBtn');

            if (!file) return;

            // Set max size limit to 2GB (approx 2147483648 bytes)
            if (file.size > 2 * 1024 * 1024 * 1024) {
                alert('File is too large! Please upload a video under 2GB. Note: Browsers may enforce lower storage limits.');
                return;
            }

            btn.innerText = 'Uploading...';
            btn.disabled = true;

            const reader = new FileReader();
            reader.onload = function (event) {
                const url = event.target.result;
                const videos = JSON.parse(localStorage.getItem('adminVideos')) || [];
                videos.push({ title, desc, url });

                try {
                    localStorage.setItem('adminVideos', JSON.stringify(videos));
                    addVideoForm.reset();
                    renderAdminVideos();
                } catch (err) {
                    alert('Could not save video due to storage limits. Try a smaller video or delete old videos.');
                }

                btn.innerText = 'Add Video';
                btn.disabled = false;
            };

            reader.readAsDataURL(file);
        });

        window.deleteVideo = function (index) {
            if (confirm('Are you sure you want to delete this video?')) {
                const videos = JSON.parse(localStorage.getItem('adminVideos')) || [];
                videos.splice(index, 1);
                localStorage.setItem('adminVideos', JSON.stringify(videos));
                renderAdminVideos();
            }
        };

        // Initial Render
        renderAdminVideos();
    }
});
