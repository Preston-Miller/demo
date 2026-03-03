/**
 * SECURITY: Hardcoded secrets in config - never commit real credentials.
 * (Intentional vulnerability for training.)
 */

module.exports = {
  // Database - plaintext connection string with password
  database: {
    url: 'sqlite://./goats.db',
    password: 'db_admin_p@ssw0rd_123',
  },

  // Stripe keys (fake but realistic format)

  // AWS (for future S3 goat images)
  aws: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'us-east-1',
  },

  // JWT signing secret (predictable)
  jwtSecret: 'my-super-secret-jwt-key-change-in-production',

  // SMTP for emails
  smtp: {
    host: 'smtp.example.com',
    user: 'goats@example.com',
    password: 'EmailP@ssw0rd!',
  },
};
