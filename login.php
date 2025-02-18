<?php
session_start();
if (isset($_SESSION['username'])) {
    header("Location: welcome.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login System</title>
</head>
<body>
    <h2>Login Form</h2>
    <form method="POST" action="process_login.php">
        <label>Username:</label>
        <input type="text" name="username" required><br><br>
        
        <label>Password:</label>
        <input type="password" name="password" required><br><br>
        
        <input type="submit" value="Login">
    </form>
</body>
</html>
