document.addEventListener('DOMContentLoaded', function () {
    function fetchData() {
        fetch('fetch_data.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                
                updateDashboard(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateDashboard(data) {
        document.querySelector('.stats-grid').innerHTML = '';
        data.forEach(item => {
            const card = `
                <div class="stat-card">
                    <h3>${item.platform}</h3>
                    <p class="stat-value">Followers: ${item.followers}</p>
                    <p class="stat-value">Engagement: ${item.engagement}%</p>
                    <p class="stat-value">Posts: ${item.posts}</p>
                    <p class="stat-value">Reach: ${item.reach}</p>
                </div>
            `;
            document.querySelector('.stats-grid').innerHTML += card;
        });
    }

    fetchData();
    setInterval(fetchData, 60000); // Refresh every 60 seconds
});
