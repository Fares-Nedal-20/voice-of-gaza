// expireStorage.js
import storage from "redux-persist/lib/storage"; // default localStorage

const EXPIRATION_KEY = "persist_expiration_time";
const EXPIRATION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const customStorage = {
  async setItem(key, value) {
    const now = Date.now();
    const expirationTime = now + EXPIRATION_DURATION;

    localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
    return storage.setItem(key, value);
  },

  async getItem(key) {
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);
    const now = Date.now();

    if (expirationTime && now > parseInt(expirationTime, 10)) {
      // expired
      await storage.removeItem(key);
      localStorage.removeItem(EXPIRATION_KEY);
      return null;
    }

    return storage.getItem(key);
  },

  async removeItem(key) {
    localStorage.removeItem(EXPIRATION_KEY);
    return storage.removeItem(key);
  },
};

export default customStorage;
