import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transporter using environment variables.
 * Falls back gracefully if SMTP is not configured.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });
  }

  // If no dedicated SMTP host is provided, check for common GMAIL setup
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return null;
}

/**
 * Sends a rich, branded Ticket Confirmation email to the ticket buyer
 */
export async function sendTicketEmail(booking) {
  const {
    bookingRef,
    eventTitle,
    venue,
    city,
    date,
    time,
    variantName,
    quantity,
    totalAmount,
    currency = 'GBP',
    userName,
    userEmail,
  } = booking;

  const transporter = getTransporter();

  const formattedAmount = totalAmount === 0 ? 'FREE' : `£${totalAmount.toFixed(2)}`;
  const fromEmail = process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || 'MeraIndia UK Tickets';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Ticket Confirmation - MeraIndia UK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #120314; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #120314; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background: #240727; border-radius: 24px; overflow: hidden; border: 1px solid #4a154e; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #f59e0b 100%); padding: 32px 28px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #240727; padding: 8px 18px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 12px;">
                      <span style="font-weight: 800; font-size: 18px; color: #f472b6;">Mera</span><span style="font-weight: 800; font-size: 18px; color: #fbbf24;">India</span>
                      <span style="font-size: 11px; background: rgba(236,72,153,0.3); color: #fdf2f8; padding: 2px 8px; border-radius: 4px; margin-left: 6px; text-transform: uppercase; font-weight: 700;">UK</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Booking Confirmed!</h1>
                    <p style="margin: 6px 0 0 0; color: #fdf2f8; font-size: 14px;">Your tickets are ready for the show</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Booking Reference Pill -->
          <tr>
            <td style="padding: 24px 28px 12px 28px; text-align: center;">
              <div style="background-color: #3b0f3f; border: 1px dashed #ec4899; border-radius: 14px; padding: 14px 20px; display: inline-block;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #f472b6; font-weight: 700;">Booking Reference</span>
                <span style="display: block; font-size: 22px; font-family: 'Courier New', monospace; font-weight: 800; color: #ffffff; letter-spacing: 2px; margin-top: 4px;">${bookingRef}</span>
              </div>
            </td>
          </tr>

          <!-- Attendee Greeting -->
          <tr>
            <td style="padding: 12px 28px;">
              <p style="margin: 0; font-size: 15px; color: #e9d5ff; line-height: 1.6;">
                Dear <strong style="color: #ffffff;">${userName}</strong>,<br>
                Thank you for booking with MeraIndia UK. We have reserved your tickets. Present this confirmation upon arrival at the venue.
              </p>
            </td>
          </tr>

          <!-- Event Details Ticket Card -->
          <tr>
            <td style="padding: 12px 28px 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1a041c; border-radius: 18px; border: 1px solid #3d0d42; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #ffffff;">${eventTitle}</h2>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; color: #c084fc; font-size: 13px; width: 35%;">Date & Time:</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${date} • ${time}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #c084fc; font-size: 13px;">Venue:</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${venue}, ${city}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #c084fc; font-size: 13px;">Ticket Tier:</td>
                        <td style="padding: 6px 0; color: #f472b6; font-size: 14px; font-weight: 700;">${variantName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #c084fc; font-size: 13px;">Quantity:</td>
                        <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${quantity} Ticket(s)</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0 0; color: #f59e0b; font-size: 14px; font-weight: 700; border-top: 1px solid #3b0f3f;">Total Paid:</td>
                        <td style="padding: 12px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 800; border-top: 1px solid #3b0f3f;">${formattedAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Simulated Barcode Box -->
          <tr>
            <td style="padding: 0 28px 24px 28px; text-align: center;">
              <div style="background-color: #ffffff; border-radius: 14px; padding: 18px; text-align: center;">
                <div style="font-family: 'Courier New', monospace; letter-spacing: 6px; font-size: 26px; font-weight: 900; color: #111827;">
                  ||| | ||||| || |||| ||| |||| | ||
                </div>
                <div style="font-family: monospace; font-size: 11px; color: #6b7280; margin-top: 6px;">
                  SCAN AT GATE • ${bookingRef}
                </div>
              </div>
            </td>
          </tr>

          <!-- Important Venue Entry Info -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: rgba(236,72,153,0.08); border: 1px solid rgba(236,72,153,0.25); border-radius: 14px; padding: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #f472b6; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Important Entry Guidelines</h4>
                <ul style="margin: 0; padding-left: 18px; color: #e9d5ff; font-size: 12px; line-height: 1.6;">
                  <li>Doors open 45 minutes prior to event showtime.</li>
                  <li>Please carry a valid photo ID matching the attendee name.</li>
                  <li>Have this digital ticket ready on your phone (no physical printout needed).</li>
                  <li>Tickets once booked are non-refundable as per event policy.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #19031c; padding: 24px; text-align: center; border-top: 1px solid #3d0d42;">
              <p style="margin: 0; font-size: 12px; color: #a855f7;">
                MeraIndia UK • Celebrating South Asian Culture, Music & Community across Britain
              </p>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #7e22ce;">
                London • Birmingham • Leicester • Manchester • Leeds
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (!transporter) {
    console.log(`[Nodemailer] No SMTP configured in environment. Skipped live email for ref: ${bookingRef}`);
    return { success: true, mode: 'logged_dev' };
  }

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: userEmail,
      subject: `🎟️ Your Tickets: ${eventTitle} (${bookingRef})`,
      html: htmlContent,
    });
    console.log('✅ Ticket confirmation email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Failed to send ticket email via Nodemailer:', err.message);
    // Don't crash the booking flow if email service has issues
    return { success: false, error: err.message };
  }
}
