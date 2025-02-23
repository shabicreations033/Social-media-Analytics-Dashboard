document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const recentReportsList = document.getElementById('recentReportsList');
    const scheduledReportsPlaceholder = document.getElementById('scheduledReportsPlaceholder');
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


    function loadReportsData() {
        fetch('php/fetch_dashboard_data.php?page=reports')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    recentReportsList.innerHTML = generateReportsListHTML(data.recentReports);
                    // Future: Handle schedule data if needed - scheduledReportsPlaceholder.innerHTML = data.scheduledReports;
                } else {
                    recentReportsList.innerHTML = `<li class="placeholder-text" style="color:red;">Failed to load recent reports.</li>`;
                    scheduledReportsPlaceholder.innerHTML = `<p style="text-align:center; color:red;">Error loading schedule data.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching reports data:', error);
                recentReportsList.innerHTML = `<li class="placeholder-text" style="color:red;">Error loading recent reports.</li>`;
                scheduledReportsPlaceholder.innerHTML = `<p style="text-align:center; color:red;">Error loading schedule data.</p>`;
            });
    }

    function generateReportsListHTML(reports) {
        let html = '';
        if (reports && reports.length > 0) {
            reports.forEach(report => {
                html += `<li><a href="${report.link}">${report.title}</a></li>`;
            });
        } else {
            html = `<li class="placeholder-text">No recent reports available.</li>`;
        }
        return html;
    }


    if (isLoggedIn) {
        loadReportsData();
    } else {
        recentReportsList.innerHTML = generateReportsListHTML([
            { title: 'Demo Summary Report - Last Month (Demo Data)', link: '#' },
            { title: 'Demo Engagement Report - Last Week (Demo Data)', link: '#' }
        ]);
        scheduledReportsPlaceholder.innerHTML = `[Scheduled Reports Management Placeholder] - Demo Mode`;
    }


    function updateLastUpdatedTime() {
        const now = new Date();
        lastUpdatedSpan.textContent = `${now.toLocaleTimeString()}`;
    }

    updateLastUpdatedTime();
    setInterval(updateLastUpdatedTime, 60000);
    setInterval(loadReportsData, 15000);
});