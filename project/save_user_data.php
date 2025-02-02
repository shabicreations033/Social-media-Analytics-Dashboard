<?php
header('Content-Type: application/json');

// Get the JSON data
$data = json_decode(file_get_contents("php://input"));

// Extract the data
if ($data->platform == 'facebook') {
    $platform = 'Facebook';
    $userId = $data->data->id;
    $userName = $data->data->name;
    $userEmail = $data->data->email;

    // Database connection
    $conn = new mysqli("localhost", "root", "", "users_db");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Check if the user already exists
    $checkUserQuery = "SELECT id FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($checkUserQuery);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'User already exists']);
    } else {
        // Insert new user data
        $insertQuery = "INSERT INTO users (platform, user_id, name, email) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ssss", $platform, $userId, $userName, $userEmail);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'User data saved successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save user data']);
        }
    }

    $stmt->close();
    $conn->close();
}
?>
