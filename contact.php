<?php
if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
    $to      = 'jakebpartin@gmail.com';
    $name = $_POST["name"];
    $subject = "Portfolio Contact by " . $name;
    $email = $_POST["email"];
    $message = "Name: " . $name . "\r\n" ."Email: " . $email . "\r\n\n" . $_POST["message"] ;
    $headers = '';
    mail($to, $subject, $message, $headers);
    echo "Thanks for contacting. Your message was sent successfully. ";
} else {
    echo "Please fill all the fields.";
}
?>