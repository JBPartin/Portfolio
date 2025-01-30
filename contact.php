<?php
if (isset($_POST["website"]) && empty($_POST["website"])) {
    if ((isset($_POST['name-input']) && isset($_POST['email-input']) && isset($_POST['message-input'])) && (!empty($_POST['name-input']) && !empty($_POST['email-input']) && !empty($_POST['message-input']))) {
        $to      = 'jakebpartin@gmail.com';
        $name = $_POST["name-input"];
        $subject = "Portfolio Contact by " . $name;
        $email = $_POST["email-input"];
        $message = "Name: " . $name . "\r\n" ."Email: " . $email . "\r\n\n" . $_POST["message-input"] ;
        $headers = '';
        mail($to, $subject, $message, $headers);
        echo "Thanks for contacting. Your message was sent successfully. ";
    } else {
        echo "Please fill all the fields.";
    }
  } else {
    http_response_code(400);
    exit;
  }
?>
