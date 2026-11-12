import type { EmailTemplatePreviewDto, EmailTemplateType } from '../../../types/admin.types';

/**
 * Universal HTML Email Wrapper with responsive table markup, safe styling, and institutional branding.
 */
function wrapHtmlEmail({
  title,
  preheader,
  headerTitle,
  primaryColor = '#2563eb',
  contentHtml,
  footerHtml,
}: {
  title: string;
  preheader: string;
  headerTitle: string;
  primaryColor?: string;
  contentHtml: string;
  footerHtml?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .content-cell { padding: 24px 20px !important; }
      .header-cell { padding: 24px 20px !important; }
      .button-cta { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  <!-- Preview Text Spacing Fix -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td class="header-cell" style="background-color: ${primaryColor}; padding: 32px 36px; text-align: left;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">
                      School ERP Platform
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">
                      ${headerTitle}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="content-cell" style="padding: 36px; color: #1e293b; font-size: 14px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
              ${
                footerHtml ||
                `<p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">
                  Sent securely via School ERP Multi-Tenant Cloud
                </p>
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                  This is an automated administrative notification. Please do not reply directly to this email.
                </p>`
              }
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const CANONICAL_EMAIL_TEMPLATES: Record<EmailTemplateType, EmailTemplatePreviewDto> = {
  USER_INVITATION: {
    id: 'USER_INVITATION',
    name: 'User Invitation & Staff Onboarding',
    category: 'Onboarding',
    subject: "You're invited to join {{organizationName}} on School ERP",
    description:
      'Sent when an administrator invites a new teacher, staff member, or manager to join an educational workspace.',
    sampleVariables: {
      recipientName: 'Dr. Sarah Jenkins',
      inviterName: 'Principal Arthur Pendelton',
      organizationName: 'Greenwood International Academy',
      roleName: 'Department Head - Sciences',
      campusName: 'North Campus & Main Campus',
      acceptUrl: 'https://erp.greenwood.edu/accept-invitation?token=inv_98f7e2a4bc0',
      expiresInDays: '7',
      supportEmail: 'admin@greenwood.edu',
      primaryColor: '#2563eb',
    },
    htmlContent: wrapHtmlEmail({
      title: "You're invited to join {{organizationName}}",
      preheader: '{{inviterName}} has invited you to join the School ERP workspace.',
      headerTitle: 'Welcome to {{organizationName}}',
      primaryColor: '{{primaryColor}}',
      contentHtml: `
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
          Hello {{recipientName}},
        </p>
        <p style="margin: 0 0 20px 0; color: #334155;">
          <strong>{{inviterName}}</strong> has invited you to join <strong>{{organizationName}}</strong> as an active team member on School ERP.
        </p>

        <!-- Role & Scope Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #64748b; width: 140px; font-weight: 600;">Assigned Role:</td>
                  <td style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">{{roleName}}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #64748b; font-weight: 600;">Authorized Campuses:</td>
                  <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #334155;">{{campusName}}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #64748b; font-weight: 600;">Invitation Expiration:</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #dc2626; font-weight: 600;">Valid for {{expiresInDays}} days</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Primary CTA Button -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
          <tr>
            <td align="center" style="border-radius: 10px; background-color: {{primaryColor}};">
              <a href="{{acceptUrl}}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Accept Invitation & Set Up Account
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
          If the button above does not work, copy and paste this link into your web browser:
        </p>
        <p style="margin: 0 0 24px 0; font-size: 11px; word-break: break-all; color: #2563eb; background: #f1f5f9; padding: 10px 14px; border-radius: 8px; font-family: monospace;">
          {{acceptUrl}}
        </p>

        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          If you were not expecting this invitation, you can safely ignore this email or contact <a href="mailto:{{supportEmail}}" style="color: #64748b; text-decoration: underline;">{{supportEmail}}</a>.
        </p>
      `,
    }),
    plainTextContent: `Hello {{recipientName}},

{{inviterName}} has invited you to join {{organizationName}} as an active team member on School ERP.

Assigned Role: {{roleName}}
Authorized Campuses: {{campusName}}
Invitation Expiration: Valid for {{expiresInDays}} days

To accept this invitation and configure your account password, click the link below:
{{acceptUrl}}

If you were not expecting this invitation, you can safely ignore this email or contact {{supportEmail}}.

Sent securely via School ERP Multi-Tenant Cloud`,
  },

  ORG_WELCOME: {
    id: 'ORG_WELCOME',
    name: 'Organization Workspace Welcome',
    category: 'Onboarding',
    subject: 'Welcome to School ERP - {{organizationName}} Workspace Ready',
    description:
      'Sent to the institutional founder or head of school immediately after their organization tenant is provisioned.',
    sampleVariables: {
      recipientName: 'Chairman David Sterling',
      organizationName: 'Greenwood International Academy',
      organizationCode: 'GREENWOOD-EDU',
      adminEmail: 'founder@greenwood.edu',
      consoleUrl: 'https://erp.greenwood.edu/admin',
      supportEmail: 'support@schoolerp.io',
      primaryColor: '#2563eb',
    },
    htmlContent: wrapHtmlEmail({
      title: 'Welcome to School ERP',
      preheader: 'Your {{organizationName}} institutional cloud workspace is ready for setup.',
      headerTitle: 'Workspace Ready: {{organizationName}}',
      primaryColor: '{{primaryColor}}',
      contentHtml: `
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
          Dear {{recipientName}},
        </p>
        <p style="margin: 0 0 20px 0; color: #334155;">
          Congratulations! Your dedicated School ERP tenant workspace for <strong>{{organizationName}}</strong> has been successfully provisioned and is ready for institutional onboarding.
        </p>

        <!-- Workspace Credentials -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #64748b; width: 140px; font-weight: 600;">Organization Code:</td>
                  <td style="padding: 4px 0; font-size: 13px; font-family: monospace; font-weight: 700; color: #0f172a;">{{organizationCode}}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #64748b; font-weight: 600;">Root Admin Email:</td>
                  <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #334155;">{{adminEmail}}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 12px; color: #64748b; font-weight: 600;">Subscription Tier:</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #16a34a; font-weight: 700;">Active Institutional Plan</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a;">Recommended 4-Step Onboarding Checklist:</h3>
        <ol style="margin: 0 0 24px 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.7;">
          <li><strong>Configure Campuses:</strong> Add branch locations, classrooms, and administrative offices.</li>
          <li><strong>Set Up Integrations:</strong> Connect your institutional SMTP email server and Razorpay payment gateway.</li>
          <li><strong>Invite Staff & Faculty:</strong> Assign granular custom roles to teachers and department heads.</li>
          <li><strong>Import Student Rosters:</strong> Upload student records and configure fee structures.</li>
        </ol>

        <!-- CTA Button -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
          <tr>
            <td align="center" style="border-radius: 10px; background-color: {{primaryColor}};">
              <a href="{{consoleUrl}}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Launch Administration Console
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
          Need implementation guidance? Reach out to our customer success team at <a href="mailto:{{supportEmail}}" style="color: #64748b; text-decoration: underline;">{{supportEmail}}</a>.
        </p>
      `,
    }),
    plainTextContent: `Dear {{recipientName}},

Congratulations! Your dedicated School ERP tenant workspace for {{organizationName}} has been successfully provisioned.

Workspace Details:
Organization Code: {{organizationCode}}
Root Admin Email: {{adminEmail}}
Subscription Tier: Active Institutional Plan

4-Step Onboarding Checklist:
1. Configure Campuses: Add branch locations, classrooms, and offices.
2. Set Up Integrations: Connect your SMTP email server and Razorpay payment gateway.
3. Invite Staff & Faculty: Assign granular roles to teachers and department heads.
4. Import Student Rosters: Upload student records and configure fee structures.

Launch your administration console here:
{{consoleUrl}}

Need help? Contact support at {{supportEmail}}.

Sent securely via School ERP Multi-Tenant Cloud`,
  },

  PASSWORD_RESET: {
    id: 'PASSWORD_RESET',
    name: 'Password Reset & Verification Code',
    category: 'Security',
    subject: 'Reset Your School ERP Password - Security Notice',
    description:
      'Sent when an authenticated user or administrator requests a cryptographic single-use password reset.',
    sampleVariables: {
      recipientName: 'Eleanor Vance',
      organizationName: 'Greenwood International Academy',
      otpCode: '749201',
      resetUrl: 'https://erp.greenwood.edu/reset-password?token=rst_83e72c819',
      expiresInMinutes: '15',
      ipAddress: '198.51.100.42 (Springfield, USA)',
      requestTime: '12 Nov 2026, 15:45 GMT+5:30',
      supportEmail: 'security@greenwood.edu',
      primaryColor: '#2563eb',
    },
    htmlContent: wrapHtmlEmail({
      title: 'Reset Your Password',
      preheader: 'Use verification code {{otpCode}} to reset your School ERP password.',
      headerTitle: 'Security Notice: Password Reset',
      primaryColor: '#dc2626', // High-contrast security alert red
      contentHtml: `
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
          Hello {{recipientName}},
        </p>
        <p style="margin: 0 0 20px 0; color: #334155;">
          We received a request to reset your password for your <strong>{{organizationName}}</strong> account on School ERP.
        </p>

        <!-- OTP Highlight Box -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 24px; text-align: center;">
          <tr>
            <td style="padding: 24px 20px;">
              <span style="font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px;">Your Single-Use Verification Code</span>
              <div style="font-size: 32px; font-family: monospace; font-weight: 800; color: #dc2626; letter-spacing: 6px; margin-top: 8px;">
                {{otpCode}}
              </div>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #b91c1c; font-weight: 600;">
                Expires in {{expiresInMinutes}} minutes
              </p>
            </td>
          </tr>
        </table>

        <!-- Direct Reset CTA -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
          <tr>
            <td align="center" style="border-radius: 10px; background-color: #dc2626;">
              <a href="{{resetUrl}}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Reset Password Directly
              </a>
            </td>
          </tr>
        </table>

        <!-- Security Audit Metadata -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; font-size: 11px; color: #64748b;">
          <tr>
            <td style="padding: 12px 16px;">
              <div><strong>Requested at:</strong> {{requestTime}}</div>
              <div style="margin-top: 2px;"><strong>Source IP Address:</strong> {{ipAddress}}</div>
            </td>
          </tr>
        </table>

        <div style="padding: 12px 16px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; font-size: 12px; color: #92400e; line-height: 1.5;">
          <strong>Security Warning:</strong> If you did not initiate this request, someone may be trying to access your account. Please notify your school administrator immediately at <a href="mailto:{{supportEmail}}" style="color: #b45309; text-decoration: underline;">{{supportEmail}}</a>.
        </div>
      `,
    }),
    plainTextContent: `Hello {{recipientName}},

We received a request to reset your password for your {{organizationName}} account on School ERP.

Your Single-Use Verification Code:
{{otpCode}}
(Expires in {{expiresInMinutes}} minutes)

Alternatively, reset your password directly using this secure link:
{{resetUrl}}

Security Details:
Requested at: {{requestTime}}
Source IP: {{ipAddress}}

If you did not request this, please notify your school administrator immediately at {{supportEmail}}.

Sent securely via School ERP Multi-Tenant Cloud`,
  },

  EMAIL_VERIFICATION: {
    id: 'EMAIL_VERIFICATION',
    name: 'Email Address Verification',
    category: 'Account',
    subject: 'Verify Your Email Address - {{organizationName}}',
    description:
      'Sent to verify ownership of a newly registered institutional email address or profile update.',
    sampleVariables: {
      recipientName: 'Michael Chang',
      organizationName: 'Greenwood International Academy',
      verifyUrl: 'https://erp.greenwood.edu/verify-email?token=ver_9921bc19e',
      otpCode: '382910',
      expiresInMinutes: '30',
      supportEmail: 'support@greenwood.edu',
      primaryColor: '#2563eb',
    },
    htmlContent: wrapHtmlEmail({
      title: 'Verify Your Email Address',
      preheader: 'Please confirm your institutional email address for {{organizationName}}.',
      headerTitle: 'Email Verification',
      primaryColor: '{{primaryColor}}',
      contentHtml: `
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
          Hello {{recipientName}},
        </p>
        <p style="margin: 0 0 20px 0; color: #334155;">
          Please confirm that this is your institutional email address to complete your registration for <strong>{{organizationName}}</strong> on School ERP.
        </p>

        <!-- Verification Code -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; text-align: center;">
          <tr>
            <td style="padding: 20px;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Verification Code</span>
              <div style="font-size: 28px; font-family: monospace; font-weight: 800; color: #0f172a; letter-spacing: 4px; margin-top: 6px;">
                {{otpCode}}
              </div>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b;">
                Code expires in {{expiresInMinutes}} minutes
              </p>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
          <tr>
            <td align="center" style="border-radius: 10px; background-color: {{primaryColor}};">
              <a href="{{verifyUrl}}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                Verify Email Address
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
          If you did not sign up for this account, you can safely disregard this email.
        </p>
      `,
    }),
    plainTextContent: `Hello {{recipientName}},

Please confirm that this is your institutional email address for {{organizationName}} on School ERP.

Your Verification Code: {{otpCode}}
(Expires in {{expiresInMinutes}} minutes)

Or verify directly with this link:
{{verifyUrl}}

Sent securely via School ERP Multi-Tenant Cloud`,
  },
};

/**
 * Replaces all {{variableKey}} with their real or sample values.
 */
export function renderEmailTemplate(
  templateType: EmailTemplateType,
  variables: Record<string, string> = {}
): { subject: string; html: string; text: string } {
  const tpl = CANONICAL_EMAIL_TEMPLATES[templateType];
  if (!tpl) {
    throw new Error(`Email template not found: ${templateType}`);
  }

  const merged = { ...tpl.sampleVariables, ...variables };

  let subject = tpl.subject;
  let html = tpl.htmlContent;
  let text = tpl.plainTextContent;

  Object.entries(merged).forEach(([key, val]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, val);
    html = html.replace(regex, val);
    text = text.replace(regex, val);
  });

  return { subject, html, text };
}

