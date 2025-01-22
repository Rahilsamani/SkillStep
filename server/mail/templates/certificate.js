const certificateTemplate = (userName, courseName, completionDate) => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion</title>
        <style>
            body {
                background-color: #f4f4f9;
                font-family: "Helvetica Neue", Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #333333;
            }
            
            .certificate-container {
                max-width: 900px;
                margin: 50px auto;
                background: #ffffff;
                border: 10px solid #0047ab;
                padding: 40px;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .header {
                font-size: 24px;
                font-weight: bold;
                color: #0047ab;
                margin-bottom: 20px;
            }
            
            .logo {
                max-width: 150px;
                margin: 20px auto;
            }
            
            .body {
                font-size: 18px;
                line-height: 1.8;
                margin: 20px 0;
            }
            
            .highlight {
                font-size: 22px;
                font-weight: bold;
                color: #0047ab;
            }
            
            .date {
                font-size: 16px;
                margin-top: 30px;
                color: #555555;
            }
            
            .signature {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .signature .sign {
                text-align: center;
                font-size: 16px;
            }
            
            .signature .sign img {
                width: 100px;
                margin-bottom: 10px;
            }
            
            .footer {
                margin-top: 40px;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="certificate-container">
            <img src="https://github.com/Rahilsamani/SkillStep/blob/main/src/assets/Logo/logo.jpeg?raw=true" alt="SkillStep Logo" class="logo">
            <div class="header">Certificate of Completion</div>
            <div class="body">
                <p>This is to certify that</p>
                <p class="highlight">${userName}</p>
                <p>has successfully completed the course</p>
                <p class="highlight">${courseName}</p>
            </div>
            <div class="date">Date of Completion: ${completionDate}</div>
            <div class="signature">
                <div class="sign">
                    <img src="https://raw.githubusercontent.com/Rahilsamani/SkillStep/main/src/assets/Signatures/ceo-signature.png" alt="CEO Signature">
                    <div>CEO, SkillStep</div>
                </div>
                <div class="sign">
                    <img src="https://raw.githubusercontent.com/Rahilsamani/SkillStep/main/src/assets/Signatures/course-instructor-signature.png" alt="Instructor Signature">
                    <div>Instructor</div>
                </div>
            </div>
            <div class="footer">
                Powered by <strong>SkillStep</strong>. For inquiries, contact us at <a href="mailto:info@SkillStep.com">info@SkillStep.com</a>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = certificateTemplate;
