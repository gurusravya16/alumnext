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

  // ── Production safety checks ────────────────────
  if (nodeEnv === "production") {
    // Ensure no localhost references in critical URLs
    if (process.env.CLIENT_URL.includes("localhost")) {
      throw new Error(
        "❌ CLIENT_URL contains 'localhost' in production. Set it to your Vercel domain."
      );
    }
    if (process.env.DATABASE_URL.includes("localhost")) {
      throw new Error(
        "❌ DATABASE_URL contains 'localhost' in production. Set it to your Supabase URL."
      );
    }
    // Ensure CLIENT_URL has no trailing slash (CORS exact match)
    if (process.env.CLIENT_URL.endsWith("/")) {
      throw new Error(
        "❌ CLIENT_URL must NOT have a trailing slash. CORS requires an exact origin match."
      );
    }
    // Warn if DIRECT_URL is missing (migrations will fail)
    if (!process.env.DIRECT_URL) {
      console.warn(
        "⚠️  DIRECT_URL not set. Prisma migrations will use DATABASE_URL (may fail with connection pooling)."
      );
    }
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
