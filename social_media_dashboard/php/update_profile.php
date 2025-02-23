<?php
require_once 'db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in.']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $facebookLink = $_POST['facebook_link'];
    $twitterLink = $_POST['twitter_link'];
    $instagramLink = $_POST['instagram_link'];
    $userId = $_SESSION['user_id'];

    try {
        $stmt = $pdo->prepare("UPDATE users SET facebook_link = ?, twitter_link = ?, instagram_link = ? WHERE id = ?");
        $stmt->execute([$facebookLink, $twitterLink, $instagramLink, $userId]);
        echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Profile update failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>