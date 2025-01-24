const certificateTemplate = (
  firstName,
  lastName,
  Author,
  endDate,
) => {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Certificate of Completion</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
      }
      .cert-container {
        width: 750px;
        height: 520px;
        position: relative;
        padding: 20px;
        background-image: url('https://github.com/Rahilsamani/SkillStep/blob/main/server/mail/certificate/border1.png?raw=true');
        background-size: cover;
        background-position: center;
        box-sizing: border-box;
      }
      .cert-content {
        text-align: center;
        padding: 20px;
        font-family: Georgia, serif;
        position: relative;
        z-index: 1;
      }
      .cert-subtitle {
        margin-top: 110px;
        font-size: 24px;
        font-style: italic;
        color: #555;
        margin-bottom: 25px;
      }
      .cert-details {
        font-size: 16px;
        line-height: 1.7;
        text-align: justify;
        margin: 0 auto;
        width: 90%;
        color: #333;
      }
      .highlight {
        font-weight: bold;
        color: #3f51b5;
        padding: 2px 5px;
      }
      .signature-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 60px;
      }
      .signature-box {
        text-align: center;
        font-size: 12px;
        color: #555;
      }
      .signature-box img {
        width: 120px;
        margin-top: 10px;
      }
      .seal {
        width: 70px;
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="cert-container">
      <div class="cert-content">
        <div class="cert-subtitle">This certifies that</div>
        <div class="cert-details">
          <p>
            <span class="highlight">${firstName} ${lastName},</span> has
            successfully completed the professional course
            <span class="highlight">${Author}</span> on
            <span class="highlight">SkillStep</span>, demonstrating exceptional skills and a comprehensive understanding of the subject. The course was completed on <span class="highlight">${endDate}</span>, and this certificate is issued as a recognition of the candidate's outstanding achievement.
          </p>
        </div>
        <div class="signature-section">
          <div class="signature-box">
            <div>Authorized Signature</div>
            <img
              src="https://github.com/Rahilsamani/SkillStep/blob/main/server/mail/certificate/signature.png?raw=true"
              alt="Signature"
            />
          </div>
        </div>
        <img
          class="seal"
          src="https://github.com/Rahilsamani/SkillStep/blob/main/server/mail/certificate/seal.png?raw=true"
          alt="Seal"
        />
      </div>
    </div>
  </body>
</html>
`;
};

module.exports = certificateTemplate;
