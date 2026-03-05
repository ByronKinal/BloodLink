import crypto from 'crypto';

const generateSecureToken = (length) => {
  const bytes = crypto.randomBytes(length);
  return bytes
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const generateEmailVerificationToken = () => generateSecureToken(32);

export const generatePasswordResetToken = () => generateSecureToken(32);

export const generateActivationCode = () => {
  const code = crypto.randomInt(100000, 1000000);
  return String(code);
};
