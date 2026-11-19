// Firebase web configuration. These values are public identifiers, not admin secrets.
// Replace the placeholders with the config shown in Firebase Console > Project settings > Your apps.
export const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_PROJECT_ID",
  storageBucket: "REPLACE_WITH_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID"
};

// Must exactly match the admin email allowed in firestore.rules and storage.rules.
export const adminEmail = "REPLACE_WITH_ADMIN_EMAIL";
