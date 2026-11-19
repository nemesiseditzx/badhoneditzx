import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const ready = Object.values(firebaseConfig).every(value => value && !value.startsWith("REPLACE_"));
if (!ready) {
  console.info("Firebase is not configured yet; showing the built-in portfolio content.");
} else {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snapshot = await getDoc(doc(db, "site", "content"));
    if (snapshot.exists() && typeof window.applyBadhonCMS === "function") {
      window.applyBadhonCMS(snapshot.data());
    }
  } catch (error) {
    console.warn("Firebase content is not available; built-in content remains visible.", error);
  }
}
