document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const audienceOverviewStats = document.getElementById('audienceOverviewStats');
    const audienceOverviewPlaceholder = document.getElementById('audienceOverviewPlaceholder');
    const locationMapPlaceholder = document.getElementById('locationMapPlaceholder');
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

    function loadAudienceData() {
        fetch('php/fetch_dashboard_data.php?page=audience') // Fetch data for audience page
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    audienceOverviewStats.innerHTML = data.audienceOverviewStats;
                    // Future: Handle map data if needed - locationMapPlaceholder.innerHTML = data.locationMap;
                } else {
                    audienceOverviewPlaceholder.textContent = "Failed to load audience overview stats.";
                    locationMapPlaceholder.innerHTML = `<p style="text-align:center; color:red;">Error loading map data.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching audience data:', error);
                audienceOverviewPlaceholder.textContent = "Error loading audience overview stats.";
                locationMapPlaceholder.innerHTML = `<p style="text-align:center; color:red;">Error loading map data.</p>`;
            });
    }


    if (isLoggedIn) {
        loadAudienceData();
    } else {
        audienceOverviewStats.innerHTML = `
             <div class="stat-card">
                <h3>Total Followers</h3>
                <p class="stat-value">23.4K+</p>
                <p class="stat-trend positive">Demo Data</p>
            </div>
            <div class="stat-card">
                <h3>Follower Growth (30 Days)</h3>
                <p class="stat-value">+1.2K</p>
                <p class="stat-trend positive">Demo +5%</p>
            </div>
            <div class="stat-card">
                <h3>Engagement Rate</h3>
                <p class="stat-value">4.3%</p>
                <p class="stat-trend positive">Demo +2.1%</p>
            </div>
        `;
        audienceOverviewPlaceholder.textContent = ""; // Clear placeholder after loading demo data
        locationMapPlaceholder.innerHTML = `[Interactive Map Placeholder] - Demo Mode`;
    }


    function updateLastUpdatedTime() {
        const now = new Date();
        lastUpdatedSpan.textContent = `${now.toLocaleTimeString()}`;
    }

    updateLastUpdatedTime();
    setInterval(updateLastUpdatedTime, 60000);
    setInterval(loadAudienceData, 15000); // Update audience data periodically


    const demographicsChartCtx = document.getElementById('demographicsChart').getContext('2d');
    new Chart(demographicsChartCtx, {
        type: 'bar',
        data: {
            labels: ['18-24', '25-34', '35-44', '45+'],
            datasets: [{
                label: 'Male',
                data: [30, 45, 20, 5],
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            }, {
                label: 'Female',
                data: [35, 40, 15, 10],
                backgroundColor: 'rgba(255, 99, 132, 0.8)'
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false,
                }
            }
        }
    });
});