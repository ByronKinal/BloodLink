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

  const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to: email,
    subject: 'Activa tu cuenta de BloodLink',
    html: `
      <h2>Hola ${name}</h2>
      <p>Tu código de activación es:</p>
      <h1 style='letter-spacing: 4px;'>${activationCode}</h1>
      <p>También puedes activar tu cuenta con este enlace:</p>
      <a href='${verificationUrl}' style='background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
        Activar cuenta
      </a>
      <p>Si no puedes hacer clic, copia esta URL:</p>
      <p>${verificationUrl}</p>
      <p>Este código y enlace expiran en 24 horas.</p>
    `,
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
