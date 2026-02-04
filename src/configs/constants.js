// configs/constants.js
export const API_STATUS = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
};

export const LOCAL_STORAGE_KEYS = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER_PREFERENCES: "userPreferences",
    THEME: "theme",
    LANGUAGE: "language",
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};

export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 2,
    USERNAME_MAX_LENGTH: 30,
    POST_MAX_LENGTH: 500,
    COMMENT_MAX_LENGTH: 300,
};

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile/:username",
    POST_DETAIL: "/post/:id",
    SEARCH: "/search",
    ACTIVITY: "/activity",
    SETTINGS: "/settings",
};
