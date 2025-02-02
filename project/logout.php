<?php
session_start();
session_unset();
session_destroy();
header("Location: social_login.html");
exit();
?>
