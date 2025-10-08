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
    if (!fileUrl) {
      alert("Không tìm thấy liên kết tải xuống!");
      return;
    }

    // Nếu chưa đăng nhập → bật popup
    if (!currentUser) {
      loginPopup.classList.remove('hidden');
      return;
    }

    // Nếu là link ngoài (http hoặc https)
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      // Xử lý riêng link Google Drive: tự động chuyển sang dạng download
      let finalUrl = fileUrl;
      const driveMatch = fileUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
      if (driveMatch) {
        const id = driveMatch[1];
        finalUrl = `https://drive.google.com/uc?export=download&id=${id}`;
      }

      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }

    // Nếu là file cục bộ trong dự án
    else {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileUrl.split('/').pop(); // Tên file
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
});

// Đóng popup
closePopup.addEventListener('click', () => {
  loginPopup.classList.add('hidden');
});
