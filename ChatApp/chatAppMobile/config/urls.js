const SOCKET = "ws://localhost:3000";
const API = "http://localhost:3000";
const urls = {
  SOCKET: SOCKET,
  API: API,
  AUTH: API + "/api/auth",
  REGISTER: API + "/api/auth/register",
  UPDATE_PROFILE: API + "/api/account",
  CHANGE_PASSWORD: API + "/api/account/password",
  AVATARS: API + "/uploads/",
};
export default urls;
