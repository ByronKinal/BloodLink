import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../configs/config.js';

const signToken = (payload, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, config.jwt.secret, options, (err, token) => {
      if (err) {
        console.error('Error generating JWT:', err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.jwt.secret,
      {
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
      },
      (err, decoded) => {
        if (err) {
          console.error('Error verifying JWT:', err);
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

const buildPayload = (userId, tokenType, extraClaims = {}) => ({
  sub: String(userId),
  type: tokenType,
  jti: crypto.randomUUID(),
  iat: Math.floor(Date.now() / 1000),
  ...extraClaims,
});

export const generateAccessToken = async (userId, extraClaims = {}) => {
  return signToken(buildPayload(userId, 'access', extraClaims), {
    expiresIn: config.jwt.expiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
  });
};

export const generateRefreshToken = async (userId, extraClaims = {}) => {
  return signToken(buildPayload(userId, 'refresh', extraClaims), {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
  });
};

export const generateTokenPair = async (userId, extraClaims = {}) => {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(userId, extraClaims),
    generateRefreshToken(userId, extraClaims),
  ]);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token) => {
  const decoded = await verifyToken(token);

  if (decoded.type !== 'access') {
    const error = new Error('Token inválido para acceso');
    error.name = 'JsonWebTokenError';
    throw error;
  }

  return decoded;
};

export const verifyRefreshToken = async (token) => {
  const decoded = await verifyToken(token);

  if (decoded.type !== 'refresh') {
    const error = new Error('Token inválido para refresh');
    error.name = 'JsonWebTokenError';
    throw error;
  }

  return decoded;
};

export const generateJWT = generateAccessToken;
export const verifyJWT = verifyAccessToken;

export const generateVerificationToken = (userId, type, expiresIn = '24h') => {
  return signToken(
    {
      sub: String(userId),
      type,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
    },
    {
      expiresIn,
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    }
  );
};

export const verifyVerificationToken = async (token) => {
  return verifyToken(token);
};

export const getExpirationTimeInMs = (timeString, fallbackMs = 30 * 60 * 1000) => {
  if (!timeString || typeof timeString !== 'string') {
    return fallbackMs;
  }

  const numeric = parseInt(timeString, 10);
  if (Number.isNaN(numeric)) {
    return fallbackMs;
  }

  const unit = timeString.replace(String(numeric), '').trim().toLowerCase();
  switch (unit) {
    case 's':
      return numeric * 1000;
    case 'm':
      return numeric * 60 * 1000;
    case 'h':
      return numeric * 60 * 60 * 1000;
    case 'd':
      return numeric * 24 * 60 * 60 * 1000;
    default:
      return fallbackMs;
  }
};