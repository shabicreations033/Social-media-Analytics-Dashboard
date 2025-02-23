<?php
require_once 'db_connect.php';
session_start();

$page = $_GET['page'] ?? 'dashboard';
$userId = $_SESSION['user_id'] ?? null;

function getPageData($page, $userId) {
    if ($userId) {
        return getUserSpecificData($page, $userId);
    } else {
        return getDemoData($page);
    }
}


function getUserSpecificData($page, $userId) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT facebook_link, twitter_link, instagram_link FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $userProfile = $stmt->fetch(PDO::FETCH_ASSOC);
        $platform = '';

        if ($userProfile) {
            $facebookLink = $userProfile['facebook_link'];
            $twitterLink = $userProfile['twitter_link'];
            $instagramLink = $userProfile['instagram_link'];

            if (!empty($facebookLink)) $platform = 'facebook';
            elseif (!empty($twitterLink)) $platform = 'twitter';
            elseif (!empty($instagramLink)) $platform = 'instagram';

            $filePath = "data/{$platform}_data.json";
            if (file_exists($filePath)) {
                $dashboardData = readJsonData($filePath);
                return generateDataForPage($page, $dashboardData);
            }
        }
        return getDemoData($page);
    } catch (PDOException $e) {
        return getDemoData($page);
    }
}


function getDemoData($page) {
    $demoData = readJsonData('data/default_data.json');
    if ($page === 'reports') {
        $demoData = readJsonData('data/reports_data.json'); // Load reports-specific demo data
        return generateDataForPage($page, $demoData);
    }
    return generateDataForPage($page, $demoData);
}


function generateDataForPage($page, $dashboardData) {
    switch ($page) {
        case 'activity':
            return [
                'status' => 'success',
                'activityFeed' => generateActivityFeedHTML(),
                'quickStats' => generateActivityQuickStatsHTML()
            ];
        case 'audience':
            return [
                'status' => 'success',
                'audienceOverviewStats' => generateAudienceOverviewStatsHTML($dashboardData->stats),
                'demographicsChartData' => $dashboardData->demographicsChartData ?? null,
                'locationMap' => generateLocationMapHTML()
            ];
        case 'content':
            return [
                'status' => 'success',
                'topPosts' => generateTopPostsHTML(),
                'contentTypeChartData' => $dashboardData->contentChartData ?? null,
                'publishingSchedule' => generatePublishingScheduleHTML()
            ];
        case 'reports':
            return [
                'status' => 'success',
                'recentReports' => generateRecentReportsHTML($dashboardData->recentReports), // Pass recentReports data
                'scheduledReports' => generateScheduledReportsHTML()
            ];
        case 'dashboard':
        default:
            return [
                'status' => 'success',
                'stats' => generateStatsHTML($dashboardData->stats),
                'platformStats' => generatePlatformStatsHTML($dashboardData->platformStats),
                'growthChartData' => $dashboardData->growthChartData,
                'engagementChartData' => $dashboardData->engagementChartData,
                'contentChartData' => $dashboardData->contentChartData
            ];
    }
}


function readJsonData($filePath) {
    $jsonData = file_get_contents($filePath);
    if ($jsonData) {
        return json_decode($jsonData);
    }
    return null;
}


function generateStatsHTML($statsData) {
    return '
        <div class="stat-card">
            <h3>Total Followers</h3>
            <p class="stat-value">' . $statsData->followers . '</p>
            <p class="stat-trend positive">' . $statsData->followerTrend . '</p>
        </div>
        <div class="stat-card">
            <h3>Engagement Rate</h3>
            <p class="stat-value">' . $statsData->engagementRate . '</p>
            <p class="stat-trend positive">' . $statsData->engagementTrend . '</p>
        </div>
        <div class="stat-card">
            <h3>Total Reach</h3>
            <p class="stat-value">' . $statsData->totalReach . '</p>
            <p class="stat-trend positive">' . $statsData->reachTrend . '</p>
        </div>
        <div class="stat-card">
            <h3>Total Shares</h3>
            <p class="stat-value">' . $statsData->totalShares . '</p>
            <p class="stat-trend positive">' . $statsData->sharesTrend . '</p>
        </div>
    ';
}


function generatePlatformStatsHTML($platformStatsData) {
    $platformStatsHTML = '';
    if (is_array($platformStatsData) || is_object($platformStatsData)) {
        foreach ($platformStatsData as $platform) {
            $platformStatsHTML .= '
                <div class="platform-card ' . strtolower($platform->platform) . '">
                    <h3>' . $platform->platform . '</h3>
                    <div class="platform-metrics">
                        <div class="metric">
                            <span>Followers</span>
                            <p>' . $platform->followers . '</p>
                        </div>
                        <div class="metric">
                            <span>Engagement</span>
                            <p>' . $platform->engagement . '</p>
                        </div>
                        <div class="metric">
                            <span>Posts</span>
                            <p>' . $platform->posts . '</p>
                        </div>
                        <div class="metric">
                            <span>Reach</span>
                            <p>' . $platform->reach . '</p>
                        </div>
                    </div>
                </div>
            ';
        }
    }
    return $platformStatsHTML;
}


function generateActivityFeedHTML() {
    return '
        <div class="activity-item">
            <i class="fab fa-facebook facebook"></i>
            <p><strong>Facebook:</strong> Simulated activity - New likes on your post. <span class="time">Just now</span></p>
        </div>
        <div class="activity-item">
            <i class="fab fa-twitter twitter"></i>
            <p><strong>Twitter:</strong> Simulated activity - New follower. <span class="time">5 minutes ago</span></p>
        </div>
        <div class="activity-item">
            <i class="fab fa-instagram instagram"></i>
            <p><strong>Instagram:</strong> Simulated activity - Comment on your story. <span class="time">10 minutes ago</span></p>
        </div>
    ';
}


function generateActivityQuickStatsHTML() {
    return '
        <div class="stat-card">
            <h3>Demo New Followers (Today)</h3>
            <p class="stat-value">50+</p>
            <p class="stat-trend positive">Demo Data</p>
        </div>
        <div class="stat-card">
            <h3>Demo Mentions (Last 7 Days)</h3>
            <p class="stat-value">100+</p>
            <p class="stat-trend positive">Demo Data</p>
        </div>
        <div class="stat-card">
            <h3>Demo Post Interactions</h3>
            <p class="stat-value">200+</p>
            <p class="stat-trend positive">Demo Data</p>
        </div>
    ';
}


function generateAudienceOverviewStatsHTML($statsData) {
    return '
        <div class="stat-card">
            <h3>Total Followers</h3>
            <p class="stat-value">' . $statsData->followers . '</p>
            <p class="stat-trend positive">' . $statsData->followerTrend . '</p>
        </div>
        <div class="stat-card">
            <h3>Follower Growth (30 Days)</h3>
            <p class="stat-value">+1.2K</p>
            <p class="stat-trend positive">+5% growth</p>
        </div>
        <div class="stat-card">
            <h3>Audience Engagement Rate</h3>
            <p class="stat-value">' . $statsData->engagementRate . '</p>
            <p class="stat-trend positive">' . $statsData->engagementTrend . '</p>
        </div>
        <div class="stat-card">
            <h3>Avg. View Duration</h3>
            <p class="stat-value">2:30 min</p>
            <p class="stat-trend neutral">Demo Data</p>
        </div>
    ';
}


function generateLocationMapHTML() {
    return '[Interactive Map Placeholder] - Demo Mode';
}


function generateTopPostsHTML() {
    return '
        <div class="post-item">
            <img src="img/placeholder-post-image.jpg" alt="Post Preview" class="post-image">
            <div class="post-details">
                <h3><a href="#">Demo Top Post 1 -  Checklist for Analytics</a></h3>
                <p class="post-metrics"><strong>Engagement:</strong> 4.9% | <strong>Reach:</strong> 11K | <strong>Likes:</strong> 400</p>
            </div>
        </div>
        <div class="post-item">
            <img src="img/placeholder-post-image.jpg" alt="Post Preview" class="post-image">
            <div class="post-details">
                <h3><a href="#">Demo Top Post 2 -  Insights of the Week</a></h3>
                <p class="post-metrics"><strong>Engagement:</strong> 5.5% | <strong>Reach:</strong> 14K | <strong>Likes:</strong> 550</p>
            </div>
        </div>
    ';
}


function generatePublishingScheduleHTML() {
    return '[Publishing Schedule Suggestions Placeholder] - Demo Mode';
}


function generateRecentReportsHTML($recentReportsData) {
    $html = '';
    if (is_array($recentReportsData) || is_object($recentReportsData)) {
        foreach ($recentReportsData as $report) {
            $html .= '
                <li><a href="' . $report->link . '">' . $report->title . ' (Generated: ' . $report->generatedDate . ')</a></li>
            ';
        }
    } else {
        $html = `<li class="placeholder-text">No recent reports available.</li>`;
    }
    return $html;
}


function generateScheduledReportsHTML() {
    return '[Scheduled Reports Management Placeholder] - Demo Mode';
}


$pageData = getPageData($page, $userId);
header('Content-Type: application/json');
echo json_encode($pageData);
?>