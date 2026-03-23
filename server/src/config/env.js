// ── Fail-fast environment validation ───────────────────────────────
// Imported once at startup. Throws immediately if any required var
// is missing so we never run with a half-configured server.

const REQUIRED = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLIENT_URL",
];

const VALID_ENVS = ["local", "development", "production"];

function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n   ${missing.join(", ")}\n` +
        `   Copy .env.example to .env and fill in all values.`
    );
  }

  const nodeEnv = process.env.NODE_ENV || "local";
  if (!VALID_ENVS.includes(nodeEnv)) {
    throw new Error(
      `❌ Invalid NODE_ENV="${nodeEnv}". Must be one of: ${VALID_ENVS.join(", ")}`
    );
  }

  return Object.freeze({
    NODE_ENV: nodeEnv,
    PORT: parseInt(process.env.PORT, 10) || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CLIENT_URL: process.env.CLIENT_URL,

    // Computed helpers
    isLocal: nodeEnv === "local",
    isDev: nodeEnv === "development",
    isProd: nodeEnv === "production",
  });
}

const config = validateEnv();
export default config;
