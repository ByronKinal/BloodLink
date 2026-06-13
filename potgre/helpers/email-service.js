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

  const frontendUrl = config.app.frontendUrl || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: '🔐 Recuperá tu contraseña de BloodLink',
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Recuperar contraseña</title></head>
<body style="margin:0;padding:0;background-color:#0D0A12;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0D0A12;padding:40px 20px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

    <!-- Brand -->
    <tr><td align="center" style="padding-bottom:28px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="width:44px;height:44px;background:linear-gradient(135deg,#D42040,#B81C32);border-radius:11px;text-align:center;vertical-align:middle;font-size:22px;">🩸</td>
        <td style="padding-left:12px;vertical-align:middle;">
          <div style="font-size:22px;font-weight:500;line-height:1;"><span style="color:#FFFFFF;">Blood</span><span style="color:#D42040;">Link</span></div>
          <div style="font-size:9px;color:#C8942A;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px;">Banco de Sangre</div>
        </td>
      </tr></table>
    </td></tr>

    <!-- Card -->
    <tr><td style="background:linear-gradient(135deg,#1A0810 0%,#200A14 50%,#1A0810 100%);border-radius:20px;border:1px solid rgba(212,32,64,0.2);overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="height:3px;background:linear-gradient(90deg,transparent,#D42040 30%,#C8942A 50%,#D42040 70%,transparent);"></td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px;">

        <!-- Icon + label -->
        <tr><td style="padding-bottom:18px;">
          <div style="width:52px;height:52px;background:rgba(212,32,64,0.1);border:1px solid rgba(212,32,64,0.25);border-radius:14px;text-align:center;line-height:52px;font-size:24px;margin-bottom:18px;">🔐</div>
          <div style="font-size:9px;font-weight:700;color:#D42040;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">Recuperación de contraseña</div>
          <div style="font-size:28px;font-weight:400;color:#FFFFFF;line-height:1.2;">Hola, <strong style="font-weight:700;">${name}</strong></div>
        </td></tr>

        <!-- Body text -->
        <tr><td style="padding-bottom:30px;">
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;font-weight:300;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta BloodLink. Si fuiste vos, hacé clic en el botón a continuación. Este enlace expira en <strong style="color:rgba(255,255,255,0.6);">1 hora</strong>.
          </p>
        </td></tr>

        <!-- CTA Button -->
        <tr><td align="center" style="padding-bottom:30px;">
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#D42040,#B81C32);color:#FFFFFF;text-decoration:none;border-radius:11px;padding:15px 44px;font-size:15px;font-weight:600;letter-spacing:0.02em;">
            Restablecer contraseña &rarr;
          </a>
        </td></tr>

        <!-- Expiry note -->
        <tr><td style="padding-bottom:28px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(200,148,42,0.06);border:1px solid rgba(200,148,42,0.18);border-radius:10px;">
            <tr><td style="padding:14px 16px;">
              <div style="font-size:11px;color:rgba(200,148,42,0.8);line-height:1.6;">
                &#x23F0; Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, podés ignorar este correo con seguridad — tu contraseña no cambiará.
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Fallback URL -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;">
            <tr><td style="padding:14px 16px;">
              <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.25);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:7px;">O copiá este enlace</div>
              <a href="${resetUrl}" style="font-size:11px;color:#4A8ACC;word-break:break-all;text-decoration:none;">${resetUrl}</a>
            </td></tr>
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

export const sendWelcomeEmail = async (email, name) => {
  ensureTransporter();

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: '🩸 ¡Bienvenido a BloodLink!',
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0D0A12;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0D0A12;padding:40px 20px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
    <tr><td align="center" style="padding-bottom:28px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="width:44px;height:44px;background:linear-gradient(135deg,#D42040,#B81C32);border-radius:11px;text-align:center;vertical-align:middle;font-size:22px;">🩸</td>
        <td style="padding-left:12px;vertical-align:middle;">
          <div style="font-size:22px;font-weight:500;"><span style="color:#FFFFFF;">Blood</span><span style="color:#D42040;">Link</span></div>
          <div style="font-size:9px;color:#C8942A;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px;">Banco de Sangre</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#1A0810,#200A14,#1A0810);border-radius:20px;border:1px solid rgba(40,160,96,0.2);overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="height:3px;background:linear-gradient(90deg,transparent,#28A060 30%,#C8942A 50%,#28A060 70%,transparent);"></td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px;">
        <tr><td style="padding-bottom:18px;">
          <div style="width:52px;height:52px;background:rgba(40,160,96,0.1);border:1px solid rgba(40,160,96,0.25);border-radius:14px;text-align:center;line-height:52px;font-size:24px;margin-bottom:18px;">✅</div>
          <div style="font-size:9px;font-weight:700;color:#28A060;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">Cuenta activada</div>
          <div style="font-size:28px;font-weight:400;color:#FFFFFF;line-height:1.2;">¡Bienvenido, <strong style="font-weight:700;">${name}</strong>!</div>
        </td></tr>
        <tr><td>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;font-weight:300;">Tu cuenta BloodLink fue verificada y activada correctamente. Ya podés iniciar sesión y ser parte del sistema nacional de donación de sangre.</p>
        </td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding-top:28px;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.18);">&copy; 2026 BloodLink &middot; Banco de Sangre</p>
    </td></tr>
  </table>
  </td></tr>
</table>
</body></html>`,
  });
};

export const sendPasswordChangedEmail = async (email, name) => {
  ensureTransporter();

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: '🔒 Tu contraseña fue actualizada — BloodLink',
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0D0A12;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0D0A12;padding:40px 20px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
    <tr><td align="center" style="padding-bottom:28px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="width:44px;height:44px;background:linear-gradient(135deg,#D42040,#B81C32);border-radius:11px;text-align:center;vertical-align:middle;font-size:22px;">🩸</td>
        <td style="padding-left:12px;vertical-align:middle;">
          <div style="font-size:22px;font-weight:500;"><span style="color:#FFFFFF;">Blood</span><span style="color:#D42040;">Link</span></div>
          <div style="font-size:9px;color:#C8942A;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px;">Banco de Sangre</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="background:linear-gradient(135deg,#1A0810,#200A14,#1A0810);border-radius:20px;border:1px solid rgba(212,32,64,0.2);overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="height:3px;background:linear-gradient(90deg,transparent,#D42040 30%,#C8942A 50%,#D42040 70%,transparent);"></td>
      </tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px;">
        <tr><td style="padding-bottom:18px;">
          <div style="width:52px;height:52px;background:rgba(212,32,64,0.08);border:1px solid rgba(212,32,64,0.2);border-radius:14px;text-align:center;line-height:52px;font-size:24px;margin-bottom:18px;">🔒</div>
          <div style="font-size:9px;font-weight:700;color:#D42040;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px;">Seguridad de cuenta</div>
          <div style="font-size:28px;font-weight:400;color:#FFFFFF;line-height:1.2;">Contraseña actualizada</div>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;font-weight:300;">Hola <strong style="color:rgba(255,255,255,0.7);">${name}</strong>, tu contraseña fue cambiada correctamente.</p>
        </td></tr>
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(212,32,64,0.06);border:1px solid rgba(212,32,64,0.2);border-radius:10px;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0;font-size:12px;color:rgba(255,100,120,0.85);line-height:1.6;">&#x26A0;&#xFE0F; Si no realizaste este cambio, contactá soporte inmediatamente. Tu cuenta podría estar comprometida.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding-top:28px;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.18);">&copy; 2026 BloodLink &middot; Banco de Sangre</p>
    </td></tr>
  </table>
  </td></tr>
</table>
</body></html>`,
  });
};

export const verifyEmailTransport = async () => {
  ensureTransporter();
  return transporter.verify();
};
