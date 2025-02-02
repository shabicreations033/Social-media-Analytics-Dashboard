<?php
header('Content-Type: application/json');
include 'config.php'; // Database connection

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not authenticated"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$query = "SELECT platform, followers, engagement, posts, reach FROM social_media_data WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$stmt->close();
$conn->close();
?>
