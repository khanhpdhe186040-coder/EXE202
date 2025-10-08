import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  setDoc,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Đăng nhập
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    alert('Lỗi đăng nhập: ' + error.message);
  }
});

// Đăng ký
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const username = document.getElementById('regUsername').value;
  const wantsNewsletter = document.getElementById('newsletterCheckbox').checked; 

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: username,
      role: "user",
      createdAt: new Date(),
      newsletter: wantsNewsletter 
    });

    alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
    toggleForms('login');
  } catch (error) {
    alert('Lỗi đăng ký: ' + error.message);
  }
});


// Quên mật khẩu
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Email khôi phục đã được gửi! Hãy kiểm tra hộp thư.');
    toggleForms('login');
  } catch (error) {
    alert('Lỗi khi gửi email: ' + error.message);
  }
});

// Hàm ẩn/hiện form
// ===== Toggle giữa các form =====
function toggleForms(form) {
  const loginSection = document.getElementById('loginSection');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');

  loginSection.classList.add('hidden');
  registerForm.classList.add('hidden');
  forgotPasswordForm.classList.add('hidden');

  if (form === 'login') {
    loginSection.classList.remove('hidden');
  } else if (form === 'register') {
    registerForm.classList.remove('hidden');
  } else if (form === 'forgot') {
    forgotPasswordForm.classList.remove('hidden');
  }
}


// ===== Gắn sự kiện cho các nút =====
document.getElementById('showRegisterForm').addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms('register');
});

document.getElementById('showLoginForm').addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms('login');
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms('forgot');
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms('login');
});

document.getElementById('googleLoginBtn').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Kiểm tra xem user đã tồn tại trong Firestore chưa
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Nếu chưa có thì tạo mới
      await setDoc(userRef, {
        username: user.displayName || "Người dùng",
        email: user.email,
        role: "user",
        createdAt: new Date()
      });
    }
    window.location.href = "index.html";
  } catch (error) {
    alert('Lỗi đăng nhập Google: ' + error.message);
  }
});

