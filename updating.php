<?php
session_start();
if (isset($_SESSION['username'])) {
    $_SESSION['last_activity'] = date("Y-m-d H:i:s");
    echo "Session updated successfully!<br>";
    echo "Last activity time: " . $_SESSION['last_activity'];
    echo "<br><a href='welcome.php'>Go Back</a>";
} else {
    echo "No active session found!";
}
?>
