// Import module từ Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8fdN2GUazZ9nrdrL4La08Y9-ei7zLjVQ",
  authDomain: "ftech-project.firebaseapp.com",
  projectId: "ftech-project",
  storageBucket: "ftech-project.appspot.com", // ✅ sửa lại
  messagingSenderId: "703825320861",
  appId: "1:703825320861:web:55b90433bb17fc6e0bad74",
  measurementId: "G-EZX3CV5RQW",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Export ra để dùng bên ngoài
export const auth = getAuth(app);
export const db = getFirestore(app);
