document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const topPostsList = document.getElementById('topPostsList');
    const schedulePlaceholder = document.getElementById('schedulePlaceholder');
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


    function loadContentData() {
        fetch('php/fetch_dashboard_data.php?page=content') // Fetch data for content page
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    topPostsList.innerHTML = data.topPosts;
                    // Future: Handle schedule data if needed - schedulePlaceholder.innerHTML = data.publishingSchedule;
                } else {
                    topPostsList.innerHTML = `<p style="text-align:center; color:red;">Error loading top posts.</p>`;
                    schedulePlaceholder.innerHTML = `<p style="text-align:center; color:red;">Error loading schedule data.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching content data:', error);
                topPostsList.innerHTML = `<p style="text-align:center; color:red;">Error loading top posts.</p>`;
                schedulePlaceholder.innerHTML = `<p style="text-align:center; color:red;">Error loading schedule data.</p>`;
            });
    }


    if (isLoggedIn) {
        loadContentData();
    } else {
        topPostsList.innerHTML = `
            <div class="post-item">
                <img src="img/placeholder-post-image.jpg" alt="Post Preview" class="post-image">
                <div class="post-details">
                    <h3><a href="#">Demo Post 1 -  Checklist for Analytics</a></h3>
                    <p class="post-metrics"><strong>Engagement:</strong> 4.5% | <strong>Reach:</strong> 10K | <strong>Likes:</strong> 300</p>
                </div>
            </div>
            <div class="post-item">
                <img src="img/placeholder-post-image.jpg" alt="Post Preview" class="post-image">
                <div class="post-details">
                    <h3><a href="#">Demo Post 2 -  Insights of the Week</a></h3>
                    <p class="post-metrics"><strong>Engagement:</strong> 5.2% | <strong>Reach:</strong> 12K | <strong>Likes:</strong> 450</p>
                </div>
            </div>
             `;
        schedulePlaceholder.innerHTML = `[Publishing Schedule Suggestions Placeholder] - Demo Mode`;
    }


    function updateLastUpdatedTime() {
        const now = new Date();
        lastUpdatedSpan.textContent = `${now.toLocaleTimeString()}`;
    }

    updateLastUpdatedTime();
    setInterval(updateLastUpdatedTime, 60000);
    setInterval(loadContentData, 15000); // Update content data periodically


    const contentTypeChartCtx = document.getElementById('contentTypeChart').getContext('2d');
    new Chart(contentTypeChartCtx, {
        type: 'pie',
        data: {
            labels: ['Images', 'Videos', 'Links', 'Text Posts'],
            datasets: [{
                label: 'Content Performance',
                data: [40, 30, 15, 15],
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#88d8b0'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
});