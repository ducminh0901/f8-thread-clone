const requiredEnvVars = ["VITE_API_BASE_URL", "VITE_APP_NAME"];

// Validate required environment variables
requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

// Parse boolean values
const parseBoolean = (value) => value === "true";

// Parse number values
const parseNumber = (value, defaultValue) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

const env = {
    // API
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    apiTimeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 30000),

    // App
    appName: import.meta.env.VITE_APP_NAME,
    appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",

    // Features (boolean)
    enableAnalytics: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS),
    enableSentry: parseBoolean(import.meta.env.VITE_ENABLE_SENTRY),
    enableDebug: parseBoolean(import.meta.env.VITE_ENABLE_DEBUG),

    // Environment
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,

    // Upload
    maxFileSize: parseNumber(import.meta.env.VITE_MAX_FILE_SIZE, 5242880),
    allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(",") || [],
};

// Freeze object to prevent modifications
export default Object.freeze(env);
