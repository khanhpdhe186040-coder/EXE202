import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const loginPopup = document.getElementById('loginPopup');
const closePopup = document.getElementById('closePopup');

let currentUser = null;

// Theo dõi trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

// Lấy tất cả các nút download
const downloadButtons = document.querySelectorAll('.download-btn');

downloadButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    const fileUrl = button.getAttribute('data-download');

    if (!currentUser) {
      // Chưa đăng nhập -> hiện popup
      loginPopup.classList.remove('hidden');
    } else {
      // Đã đăng nhập -> tải file
      window.location.href = fileUrl;
    }
  });
});

// Đóng popup
closePopup.addEventListener('click', () => {
  loginPopup.classList.add('hidden');
});
