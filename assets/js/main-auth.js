import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const authSection = document.getElementById('authSection');

/**
 * ===== Hàm render giao diện khi đã đăng nhập =====
 * @param {Object} user - Đối tượng user từ Firebase Auth
 */
async function renderUserMenu(user) {
  try {
    // Lấy thông tin từ Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let displayName = "";

    if (userSnap.exists() && userSnap.data().username) {
      // Nếu có username trong Firestore
      displayName = userSnap.data().username;
    } else if (user.displayName) {
      // Nếu là đăng nhập bằng Google (có displayName sẵn)
      displayName = user.displayName;
    } else if (user.email) {
      // Fallback cuối cùng là email
      displayName = user.email;
    } else {
      displayName = "Người dùng";
    }

    // Render UI
    authSection.innerHTML = `
      <div class="flex items-center gap-3">
        <span 
          class="text-white font-medium truncate max-w-[150px]" 
          title="${displayName}">
          ${displayName}
        </span>
        <button 
          id="logoutBtn" 
          class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    `;

    // Sự kiện Logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Lỗi khi logout:", error.message);
        alert('Có lỗi xảy ra khi đăng xuất.');
      }
    });

  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error.message);

    // Nếu Firestore chưa sẵn sàng hoặc lỗi mạng, vẫn render email
    authSection.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-white font-medium">${user.email || "Người dùng"}</span>
        <button 
          id="logoutBtn" 
          class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    `;
  }
}

/**
 * ===== Hàm render giao diện khi chưa đăng nhập =====
 */
function renderLoginButton() {
  authSection.innerHTML = `
    <a
      href="login.html"
      id="loginBtn"
      class="px-4 py-2 text-sm font-semibold text-white bg-butterscotch rounded-lg hover:bg-yellow-400 transition"
    >
      Login
    </a>
  `;
}

/**
 * ===== Theo dõi trạng thái đăng nhập =====
 */
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderUserMenu(user);
  } else {
    renderLoginButton();
  }
});
