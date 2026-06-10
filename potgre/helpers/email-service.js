import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';

const createTransporter = () => {
  if (!config.smtp.username || !config.smtp.password) {
    console.warn(
      'SMTP credentials not configured. Email functionality will not work.'
    );
    return null;
  }

  const isSecurePort = Number(config.smtp.port) === 465;
  if (config.smtp.enableSsl && !isSecurePort) {
    console.warn(
      `SMTP_ENABLE_SSL=true con puerto ${config.smtp.port}. Se usará STARTTLS (secure:false).`
    );
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: isSecurePort,
    requireTLS: !isSecurePort,
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });
};

const transporter = createTransporter();

const ensureTransporter = () => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }
};

export const sendVerificationEmail = async (
  email,
  name,
  verificationToken,
  activationCode
) => {
  ensureTransporter();

  const frontendUrl = config.app.frontendUrl || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: '🩸 Activá tu cuenta de BloodLink',
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Activá tu cuenta</title></head>
<body style="margin:0;padding:0;background-color:#0D0A12;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0D0A12;padding:40px 20px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

    <!-- Brand -->
    <tr><td align="center" style="padding-bottom:28px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="width:44px;height:44px;background:linear-gradient(135deg,#D42040,#B81C32);border-radius:11px;text-align:center;vertical-align:middle;font-size:22px;box-shadow:0 0 20px rgba(212,32,64,0.5);">🩸</td>
        <td style="padding-left:12px;vertical-align:middle;">
          <div style="font-size:22px;font-weight:500;line-height:1;"><span style="color:#FFFFFF;">Blood</span><span style="color:#D42040;">Link</span></div>
          <div style="font-size:9px;color:#C8942A;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px;">Banco de Sangre</div>
        </td>
      </tr></table>
    </td></tr>

    <!-- Card -->
    <tr><td style="background:linear-gradient(135deg,#1A0810 0%,#200A14 50%,#1A0810 100%);border-radius:20px;border:1px solid rgba(212,32,64,0.2);overflow:hidden;">

      <!-- Red top bar -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="height:3px;background:linear-gradient(90deg,transparent,#D42040 30%,#C8942A 50%,#D42040 70%,transparent);"></td>
      </tr></table>

      <!-- Content -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px;">

        <!-- Label + greeting -->
        <tr><td style="padding-bottom:6px;">
          <div style="font-size:9px;font-weight:700;color:#D42040;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">● Verificación de cuenta</div>
          <div style="font-size:28px;font-weight:400;color:#FFFFFF;line-height:1.2;margin:0;">Hola, <strong style="font-weight:700;">${name}</strong></div>
        </td></tr>

        <!-- Subtext -->
        <tr><td style="padding:12px 0 30px;">
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;font-weight:300;">
            Gracias por unirte a BloodLink. Para completar tu registro y activar tu cuenta, usá el código de verificación o el botón a continuación.
          </p>
        </td></tr>

        <!-- Code box -->
        <tr><td style="padding-bottom:30px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(212,32,64,0.07);border:1px solid rgba(212,32,64,0.22);border-radius:14px;">
            <tr><td align="center" style="padding:28px 20px;">
              <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px;">Tu código de activación</div>
              <div style="font-size:46px;font-weight:700;color:#FFFFFF;letter-spacing:14px;font-family:'Courier New',Courier,monospace;">${activationCode}</div>
              <div style="font-size:11px;color:rgba(200,148,42,0.65);margin-top:14px;letter-spacing:0.04em;">Expira en 24 horas</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- CTA Button -->
        <tr><td align="center" style="padding-bottom:28px;">
          <a href="${verificationUrl}" style="display:inline-block;background:linear-gradient(135deg,#D42040,#B81C32);color:#FFFFFF;text-decoration:none;border-radius:11px;padding:15px 40px;font-size:15px;font-weight:600;letter-spacing:0.02em;">
            Activar mi cuenta &rarr;
          </a>
        </td></tr>

        <!-- Fallback URL -->
        <tr><td style="padding-bottom:28px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;">
            <tr><td style="padding:14px 16px;">
              <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.25);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:7px;">O copiá este enlace</div>
              <a href="${verificationUrl}" style="font-size:11px;color:#4A8ACC;word-break:break-all;text-decoration:none;">${verificationUrl}</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Warning -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(200,148,42,0.06);border:1px solid rgba(200,148,42,0.18);border-radius:10px;">
            <tr>
              <td style="padding:14px 6px 14px 14px;width:24px;vertical-align:top;font-size:14px;">⚠️</td>
              <td style="padding:14px 14px 14px 4px;">
                <p style="margin:0;font-size:12px;color:rgba(200,148,42,0.75);line-height:1.6;font-weight:300;">Si no creaste esta cuenta en BloodLink, podés ignorar este correo con seguridad.</p>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td align="center" style="padding-top:28px;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.18);line-height:1.7;">
        &copy; 2026 BloodLink &middot; Banco de Sangre &middot; Sistema Nacional de Donaci&oacute;n<br>
        Este correo fue enviado a <span style="color:rgba(255,255,255,0.3);">${email}</span>
      </p>
    </td></tr>

  </table>
  </td></tr>
</table>
</body></html>`,
  });
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  ensureTransporter();

  const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: 'Recuperación de contraseña - BloodLink',
    html: `
      <h2>Hola ${name}</h2>
      <p>Recibimos una solicitud para recuperar tu contraseña.</p>
      <a href='${resetUrl}' style='background-color: #dc3545; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
        Restablecer contraseña
      </a>
      <p>Si no puedes hacer clic, copia esta URL:</p>
      <p>${resetUrl}</p>
      <p>Este enlace expira en 1 hora.</p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  ensureTransporter();

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: 'Tu cuenta BloodLink fue activada',
    html: `
      <h2>Hola ${name}</h2>
      <p>Tu cuenta fue activada correctamente.</p>
      <p>Ya puedes iniciar sesión y usar BloodLink.</p>
    `,
  });
};

export const sendPasswordChangedEmail = async (email, name) => {
  ensureTransporter();

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: 'Contraseña actualizada correctamente',
    html: `
      <h2>Hola ${name}</h2>
      <p>Tu contraseña fue actualizada correctamente.</p>
      <p>Si no realizaste este cambio, contacta soporte inmediatamente.</p>
    `,
  });
};

export const verifyEmailTransport = async () => {
  ensureTransporter();
  return transporter.verify();
};
