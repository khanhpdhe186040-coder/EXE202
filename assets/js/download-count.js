import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Lấy tất cả nút download
const downloadBtns = document.querySelectorAll('.download-btn');

downloadBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const li = btn.closest('li');
    const presetId = li.dataset.id; // mỗi li phải có data-id

    try {
      // ===== Count riêng của preset =====
      const presetRef = doc(db, 'downloads', presetId);
      const presetSnap = await getDoc(presetRef);
      if (!presetSnap.exists()) {
        await setDoc(presetRef, { count: 1 });
      } else {
        await updateDoc(presetRef, { count: increment(1) });
      }

      // ===== Count tổng lượt download =====
      const totalRef = doc(db, 'downloads', 'totalDownloads');
      const totalSnap = await getDoc(totalRef);
      if (!totalSnap.exists()) {
        await setDoc(totalRef, { count: 1 });
      } else {
        await updateDoc(totalRef, { count: increment(1) });
      }

      // ===== Mở link download =====
      let fileUrl = btn.dataset.download;
      const driveMatch = fileUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
      if (driveMatch) {
        const id = driveMatch[1];
        fileUrl = `https://drive.google.com/uc?export=download&id=${id}`;
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật lượt download:', error);
    }
  });
});
