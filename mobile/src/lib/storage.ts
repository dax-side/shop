import * as SecureStore from "expo-secure-store";

// The session token and small settings, kept in the phone's keychain / keystore.
export const storage = {
  get: (key: string) => SecureStore.getItemAsync(key).catch(() => null),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value).catch(() => undefined),
  remove: (key: string) => SecureStore.deleteItemAsync(key).catch(() => undefined),
};
