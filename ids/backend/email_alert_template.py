email_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Security Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #e4e4e4;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #d9534f;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 0 0 10px;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #e4e4e4;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Network Intrusion Detected</h1>
    </div>
    <div class="content">
        <p>Hello,</p>
        <p>The MedSecurance Intrusion Detection System just process the following network trace file: %s </p>
        <p>Based on the initial analysis <strong>the network trace include and attack.</strong></p>
        <p>Please review your network security and the coresponding network trace for fearther details related to the attack including the <strong> attack type and affected devices. </strong></p>
        <p>If you have any questions or need further assistance, please contact the support team.</p>
        <p>Thank you for your attention to this matter.</p>
        <p>Best regards,</p>
        <p>MedSecurance Team</p>
    </div>
    <div class="footer">
        <p>&copy; %s MedSecurance. All rights reserved.</p>
        <p>This is an automated message, please do not reply.</p>
    </div>
</div>
</body>
</html>
"""