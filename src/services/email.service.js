const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const BRAND = {
    name: 'Ledgerly',
    tagline: 'Private banking, engineered like a ledger.',
    gold: '#c9982f',
    ink: '#0a0e1a',
    inkSoft: '#475066',
    border: '#e6e8ee',
    surface: '#f6f7fb',
    appUrl: process.env.FRONTEND_ORIGIN || '#',
    supportEmail: process.env.EMAIL_USER || 'support@ledgerly.app'
};

const formatCurrency = (amount, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(amount || 0));

const formatTimestamp = (date = new Date()) =>
    new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(date) + ' IST';

const maskAccountId = (accountId) => {
    const id = String(accountId || '');
    return id.length > 8 ? `•••• ${id.slice(-6)}` : id;
};

/**
 * Wraps inner content in a shared, table-based layout so it renders
 * consistently across email clients (Gmail, Outlook, Apple Mail, etc.).
 */
function renderLayout({ preheader, heading, accentColor = BRAND.gold, bodyHtml }) {
    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${BRAND.name}</title>
  </head>
  <body style="margin:0; padding:0; background-color:${BRAND.surface}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
    <span style="display:none; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden; mso-hide:all;">${preheader || ''}</span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.surface}; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid ${BRAND.border};">

            <tr>
              <td style="background-color:${BRAND.ink}; padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:0.2px;">
                      <span style="color:${accentColor};">&#9670;</span>&nbsp; ${BRAND.name}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${heading ? `
            <tr>
              <td style="padding:32px 32px 0 32px;">
                <h1 style="margin:0; font-size:20px; line-height:1.3; color:${BRAND.ink}; font-weight:700;">${heading}</h1>
              </td>
            </tr>` : ''}

            <tr>
              <td style="padding:16px 32px 32px 32px; color:${BRAND.inkSoft}; font-size:14px; line-height:1.65;">
                ${bodyHtml}
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px; background-color:${BRAND.surface}; border-top:1px solid ${BRAND.border};">
                <p style="margin:0 0 6px 0; font-size:12px; color:${BRAND.inkSoft};">
                  This is an automated message from ${BRAND.name}. If something looks off, contact us at
                  <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.ink};">${BRAND.supportEmail}</a>.
                </p>
                <p style="margin:0; font-size:12px; color:#8a91a6;">&copy; ${new Date().getFullYear()} ${BRAND.name}. ${BRAND.tagline}</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderButton(label, href, color = BRAND.ink) {
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:10px; background-color:${color};">
          <a href="${href}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function renderSummaryRow(label, value, valueColor = BRAND.ink) {
    return `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid ${BRAND.border}; font-size:13px; color:${BRAND.inkSoft};">${label}</td>
      <td style="padding:10px 0; border-bottom:1px solid ${BRAND.border}; font-size:13px; color:${valueColor}; font-weight:600; text-align:right;">${value}</td>
    </tr>`;
}

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"${BRAND.name}" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


async function sendRegistrationEmail(userEmail, name) {
    const subject = `Welcome to ${BRAND.name}, ${name.split(' ')[0]}`;

    const text = `Hello ${name},

Welcome to ${BRAND.name}. Your account has been created and a primary INR ledger account is ready to use.

What you can do next:
- Fund your account with a deposit
- Open additional accounts for different goals
- Send instant transfers with a full, transparent transaction history

If you didn't create this account, please contact us immediately at ${BRAND.supportEmail}.

Best regards,
The ${BRAND.name} Team`;

    const html = renderLayout({
        preheader: `Your ${BRAND.name} account is ready — here's how to get started.`,
        heading: `Welcome, ${name.split(' ')[0]}.`,
        bodyHtml: `
            <p>Thank you for opening a ${BRAND.name} account. Your profile has been created and a primary INR ledger account is ready to use right away.</p>
            <p style="margin-top:20px; font-weight:600; color:${BRAND.ink};">What you can do next</p>
            <ul style="margin:8px 0 0 0; padding-left:18px;">
                <li style="margin-bottom:6px;">Make your first deposit to activate your balance</li>
                <li style="margin-bottom:6px;">Open additional accounts to organize your funds</li>
                <li style="margin-bottom:6px;">Send instant transfers with a fully traceable ledger history</li>
            </ul>
            ${renderButton('Go to your dashboard', BRAND.appUrl)}
            <p style="font-size:12px; color:#8a91a6; margin-top:8px;">Didn't create this account? Contact us immediately at <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.ink};">${BRAND.supportEmail}</a>.</p>
        `
    });

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const formattedAmount = formatCurrency(amount);
    const timestamp = formatTimestamp();
    const subject = `Transfer confirmed — ${formattedAmount} sent`;

    const text = `Hello ${name},

Your transfer has been completed successfully.

Amount: ${formattedAmount}
To account: ${maskAccountId(toAccount)}
Date: ${timestamp}
Status: Completed

If you didn't authorize this transaction, contact us immediately at ${BRAND.supportEmail}.

Best regards,
The ${BRAND.name} Team`;

    const html = renderLayout({
        preheader: `Your transfer of ${formattedAmount} was completed successfully.`,
        heading: 'Transfer completed',
        accentColor: '#22c58b',
        bodyHtml: `
            <p>Hi ${name.split(' ')[0]}, your transfer has gone through and your ledger has been updated.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                ${renderSummaryRow('Amount', formattedAmount, '#0f9d63')}
                ${renderSummaryRow('To account', maskAccountId(toAccount))}
                ${renderSummaryRow('Date &amp; time', timestamp)}
                ${renderSummaryRow('Status', 'Completed', '#0f9d63')}
            </table>
            ${renderButton('View transaction history', BRAND.appUrl ? `${BRAND.appUrl}/transactions` : '#')}
            <p style="font-size:12px; color:#8a91a6; margin-top:8px;">Didn't recognize this activity? Contact us immediately at <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.ink};">${BRAND.supportEmail}</a>.</p>
        `
    });

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const formattedAmount = formatCurrency(amount);
    const timestamp = formatTimestamp();
    const subject = `Action needed — transfer of ${formattedAmount} could not be completed`;

    const text = `Hello ${name},

We were unable to complete your recent transfer.

Amount: ${formattedAmount}
To account: ${maskAccountId(toAccount)}
Date: ${timestamp}
Status: Failed

No funds have left your account. Please review your balance and try again, or contact us at ${BRAND.supportEmail} if the issue persists.

Best regards,
The ${BRAND.name} Team`;

    const html = renderLayout({
        preheader: `We couldn't complete your transfer of ${formattedAmount}. No funds were moved.`,
        heading: 'We couldn’t complete your transfer',
        accentColor: '#e0563f',
        bodyHtml: `
            <p>Hi ${name.split(' ')[0]}, your recent transfer didn't go through. No funds have left your account.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                ${renderSummaryRow('Amount', formattedAmount)}
                ${renderSummaryRow('To account', maskAccountId(toAccount))}
                ${renderSummaryRow('Date &amp; time', timestamp)}
                ${renderSummaryRow('Status', 'Failed', '#c94a35')}
            </table>
            <p style="margin-top:16px;">Please check your account balance and try again. If this keeps happening, our team is here to help.</p>
            ${renderButton('Try again', BRAND.appUrl, '#c94a35')}
            <p style="font-size:12px; color:#8a91a6; margin-top:8px;">Need help? Reach us at <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.ink};">${BRAND.supportEmail}</a>.</p>
        `
    });

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};
