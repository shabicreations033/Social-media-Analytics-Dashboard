document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const activityFeedItems = document.getElementById('activityFeedItems');
    const quickStats = document.getElementById('quickStats');
    const quickStatsPlaceholder = document.getElementById('quickStatsPlaceholder');
    const lastUpdatedSpan = document.getElementById('lastUpdated');


    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline-block';
        profileLink.style.display = 'inline-block';
    } else {
        loginLink.textContent = 'Login';
        loginLink.style.display = 'inline-block';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
    }

    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });

    function loadActivityData() {
        fetch('php/fetch_dashboard_data.php?page=activity') // Fetch data for activity page
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    activityFeedItems.innerHTML = data.activityFeed;
                    quickStats.innerHTML = data.quickStats;
                } else {
                    activityFeedItems.innerHTML = `<p style="text-align:center; color:red;">Error loading activity data.</p>`;
                    quickStatsPlaceholder.textContent = "Failed to load quick stats.";
                }
            })
            .catch(error => {
                console.error('Error fetching activity data:', error);
                activityFeedItems.innerHTML = `<p style="text-align:center; color:red;">Error loading activity data.</p>`;
                quickStatsPlaceholder.textContent = "Error loading quick stats.";
            });
    }


    if (isLoggedIn) {
        loadActivityData();
    } else {
        activityFeedItems.innerHTML = `
             <div class="activity-item">
                <i class="fab fa-facebook facebook"></i>
                <p><strong>Facebook:</strong> Demo post - "Welcome to the Dashboard!" <span class="time">Just now</span></p>
            </div>
            <div class="activity-item">
                <i class="fab fa-twitter twitter"></i>
                <p><strong>Twitter:</strong> Demo tweet - Analytics are loading... <span class="time">2 minutes ago</span></p>
            </div>
        `;
        quickStats.innerHTML = `
             <div class="stat-card">
                <h3>Demo Followers Today</h3>
                <p class="stat-value">100+</p>
                <p class="stat-trend positive">Demo Data</p>
            </div>
            <div class="stat-card">
                <h3>Demo Mentions</h3>
                <p class="stat-value">50+</p>
                <p class="stat-trend positive">Demo Data</p>
            </div>
        `;
        quickStatsPlaceholder.textContent = ""; // Clear placeholder text after loading demo data
    }


    function updateLastUpdatedTime() {
        const now = new Date();
        lastUpdatedSpan.textContent = `${now.toLocaleTimeString()}`;
    }

    updateLastUpdatedTime();
    setInterval(updateLastUpdatedTime, 60000);
    setInterval(loadActivityData, 15000); // Update activity data periodically
});