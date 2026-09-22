/**
 * Single source of truth for the backend's base URL.
 *
 * Previously this string was hardcoded separately in ~10 different
 * component files. Change it here once (e.g. when deploying somewhere
 * other than localhost) instead of hunting through the whole app.
 */
export const API_BASE_URL = 'http://localhost/SkillBridge';
