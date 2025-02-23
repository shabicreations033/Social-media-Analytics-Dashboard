document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const statsGrid = document.getElementById('statsGrid');
    const platformStats = document.getElementById('platformStats');
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

    const growthChartCtx = document.getElementById('growthChart').getContext('2d');
    let growthChart = new Chart(growthChartCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Follower Growth',
                data: [],
                borderColor: '#2563eb',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    const engagementChartCtx = document.getElementById('engagementChart').getContext('2d');
    let engagementChart = new Chart(engagementChartCtx, {
        type: 'bar',
        data: {
            labels: ['Likes', 'Comments', 'Shares', 'Saves'],
            datasets: [{
                label: 'Engagement Type',
                data: [],
                backgroundColor: ['#4ade80', '#facc15', '#f87171', '#67e8f9']
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const contentChartCtx = document.getElementById('contentChart').getContext('2d');
    let contentChart = new Chart(contentChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Posts', 'Likes', 'Comments'],
            datasets: [{
                label: 'Content Metrics',
                data: [],
                backgroundColor: ['#67e8f9', '#a78bfa', '#fde047'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            cutout: '60%',
             plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });


    function updateGrowthChart(chartData) {
        const dataToUse = chartData || generateRandomGrowthData();
        growthChart.data.datasets[0].data = dataToUse;
        growthChart.update();
    }

    function updateEngagementChart(chartData) {
        const dataToUse = chartData || generateRandomEngagementData();
        engagementChart.data.datasets[0].data = dataToUse;
        engagementChart.update();
    }

    function updateContentChart(chartData) {
        const dataToUse = chartData || generateRandomContentData();
        contentChart.data.datasets[0].data = dataToUse;
        contentChart.update();
    }


    function loadDashboardContent() {
        fetch('php/fetch_dashboard_data.php?page=dashboard') // Fetch data for dashboard
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    statsGrid.innerHTML = data.stats;
                    platformStats.innerHTML = data.platformStats;
                    updateGrowthChart(data.growthChartData);
                    updateEngagementChart(data.engagementChartData);
                    updateContentChart(data.contentChartData);
                } else {
                    statsGrid.innerHTML = `<p style="text-align: center; color: red;">Failed to load user data: ${data.message || 'Unknown error'}. Loading demo data instead. <a href="#" id="loadDemoDataLink">Load Demo Data</a></p>`;
                    platformStats.innerHTML = '';
                    updateGrowthChart(generateRandomGrowthData());
                    updateEngagementChart(generateRandomEngagementData());
                    updateContentChart(generateRandomContentData());

                    const loadDemoDataLink = document.getElementById('loadDemoDataLink');
                    if (loadDemoDataLink) {
                        loadDemoDataLink.addEventListener('click', function(event) {
                            event.preventDefault();
                            loadDemoStats();
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
                statsGrid.innerHTML = `<p style="text-align: center; color: red;">Error loading dashboard data. Loading demo data instead.  <a href="#" id="loadDemoDataLink">Load Demo Data</a></p>`;
                platformStats.innerHTML = '';
                updateGrowthChart(generateRandomGrowthData());
                updateEngagementChart(generateRandomEngagementData());
                updateContentChart(generateRandomContentData());

                const loadDemoDataLink = document.getElementById('loadDemoDataLink');
                if (loadDemoDataLink) {
                    loadDemoDataLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        loadDemoStats();
                    });
                }
            });
    }


    function loadDemoStats() {
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Total Followers</h3>
                <p class="stat-value">23.4K</p>
                <p class="stat-trend positive">+12%</p>
            </div>
            <div class="stat-card">
                <h3>Engagement Rate</h3>
                <p class="stat-value">4.3%</p>
                <p class="stat-trend positive">+2.1%</p>
            </div>
            <div class="stat-card">
                <h3>Total Reach</h3>
                <p class="stat-value">45.2K</p>
                <p class="stat-trend positive">+8.5%</p>
            </div>
            <div class="stat-card">
                <h3>Total Shares</h3>
                <p class="stat-value">1.2K</p>
                <p class="stat-trend positive">+5.2%</p>
            </div>
        `;
        platformStats.innerHTML = `
            <div class="platform-card facebook">
                <h3>Facebook</h3>
                <div class="platform-metrics">
                    <div class="metric">
                        <span>Followers</span>
                        <p>12.5K</p>
                    </div>
                    <div class="metric">
                        <span>Engagement</span>
                        <p>3.2%</p>
                    </div>
                    <div class="metric">
                        <span>Posts</span>
                        <p>45</p>
                    </div>
                    <div class="metric">
                        <span>Reach</span>
                        <p>25.6K</p>
                    </div>
                </div>
            </div>
            <div class="platform-card twitter">
                <h3>Twitter</h3>
                <div class="platform-metrics">
                    <div class="metric">
                        <span>Followers</span>
                        <p>8.2K</p>
                    </div>
                    <div class="metric">
                        <span>Engagement</span>
                        <p>4.8%</p>
                    </div>
                    <div class="metric">
                        <span>Posts</span>
                        <p>128</p>
                    </div>
                    <div class="metric">
                        <span>Reach</span>
                        <p>15.3K</p>
                    </div>
                </div>
            </div>
            <div class="platform-card instagram">
                <h3>Instagram</h3>
                <div class="platform-metrics">
                    <div class="metric">
                        <span>Followers</span>
                        <p>15.3K</p>
                    </div>
                    <div class="metric">
                        <span>Engagement</span>
                        <p>5.1%</p>
                    </div>
                    <div class="metric">
                        <span>Posts</span>
                        <p>67</p>
                    </div>
                    <div class="metric">
                        <span>Reach</span>
                        <p>35.8K</p>
                    </div>
                </div>
            </div>
        `;
        updateGrowthChart(generateRandomGrowthData());
        updateEngagementChart(generateRandomEngagementData());
        updateContentChart(generateRandomContentData());
    }


    loadDashboardContent();

    setInterval(() => {
        loadDashboardContent();
        updateLastUpdatedTime();
    }, 15000);

    function updateLastUpdatedTime() {
        const now = new Date();
        lastUpdatedSpan.textContent = `${now.toLocaleTimeString()}`;
    }

    updateLastUpdatedTime();
    setInterval(updateLastUpdatedTime, 60000);

    function generateRandomGrowthData() {
        const baseValue = 2500;
        const fluctuation = 300;
        return Array.from({ length: 12 }, () => baseValue + Math.random() * fluctuation - fluctuation / 2);
    }

    function generateRandomEngagementData() {
        return [
            3500 + Math.random() * 500 - 250,
            800 + Math.random() * 200 - 100,
            1200 + Math.random() * 300 - 150,
            2500 + Math.random() * 400 - 200
        ];
    }

    function generateRandomContentData() {
        return [
            50 + Math.random() * 10 - 5,
            4500 + Math.random() * 500 - 250,
            900 + Math.random() * 200 - 100,
        ];
    }
});