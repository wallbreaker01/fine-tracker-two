export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Welcome to Fine Tracker</title>
  <style type="text/css">
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #141414 !important;
        border: 1px solid #30333A !important;
      }
      .dark-text {
        color: #ffffff !important;
      }
      .dark-text-secondary {
        color: #CCDADC !important;
      }
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: 0 !important;
      }
      .mobile-padding {
        padding: 24px !important;
      }
      .mobile-title {
        font-size: 22px !important;
        line-height: 1.3 !important;
      }
      .mobile-text {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              <h1 class="mobile-title dark-text" style="margin: 0 0 16px 0; font-size: 26px; font-weight: 700; color: #FDD458; line-height: 1.2;">
                Welcome aboard {{name}}
              </h1>
              <p class="mobile-text dark-text-secondary" style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
                {{intro}}
              </p>
              <p class="mobile-text dark-text-secondary" style="margin: 0 0 6px 0; font-size: 15px; line-height: 1.6; color: #CCDADC;">
                <strong>Email:</strong> {{email}}
              </p>
              <p class="mobile-text dark-text-secondary" style="margin: 0 0 22px 0; font-size: 15px; line-height: 1.6; color: #CCDADC;">
                <strong>Password:</strong> {{password}}
              </p>
              <p class="mobile-text dark-text-secondary" style="margin: 0; font-size: 14px; line-height: 1.6; color: #9CA3AF;">
                You can now sign in and start managing your fines.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const ALERT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Fine Tracker Alert</title>
  <style type="text/css">
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #141414 !important;
        border: 1px solid #30333A !important;
      }
      .dark-text {
        color: #ffffff !important;
      }
      .dark-text-secondary {
        color: #CCDADC !important;
      }
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: 0 !important;
      }
      .mobile-padding {
        padding: 24px !important;
      }
      .mobile-title {
        font-size: 22px !important;
        line-height: 1.3 !important;
      }
      .mobile-text {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              <h1 class="mobile-title dark-text" style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #FDD458; line-height: 1.2;">
                {{title}}
              </h1>
              <p class="mobile-text dark-text-secondary" style="margin: 0 0 14px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
                Hi {{name}},
              </p>
              <p class="mobile-text dark-text-secondary" style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
                {{message}}
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{actionUrl}}" style="display: inline-block; background-color: #E8BA40; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600;">
                      {{actionText}}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const welcome_email_template = WELCOME_EMAIL_TEMPLATE;
export const alert_email_template = ALERT_EMAIL_TEMPLATE;
