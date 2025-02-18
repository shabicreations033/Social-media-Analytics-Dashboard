<?php
session_start();

$username = $_POST['username'];
$password = $_POST['password'];

// Hardcoded credentials for demo
$valid_username = "admin";
$valid_password = "password123";

if ($username == $valid_username && $password == $valid_password) {
    $_SESSION['username'] = $username;
    $_SESSION['login_time'] = time();
    header("Location: welcome.php");
    exit();
} else {
    echo "Invalid username or password.";
}
?>
