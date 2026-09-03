// ========================================================
// MODULE: security.js - Hệ Thống Bảo Vệ Bản Quyền & Chống Soi / Sửa Mã Nguồn Toàn Diện
// ========================================================
(function() {
  function ensureTamperToast() {
    let toast = document.getElementById('tamperWarning');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tamperWarning';
      toast.className = 'tamper-toast hidden';
      toast.innerHTML = '<i class="fa-solid fa-shield-halved"></i> <span id="tamperMsg">Mã nguồn đã được bảo vệ bản quyền!</span>';
      document.body.appendChild(toast);
    }
    return toast;
  }

  let toastTimer = null;
  function showTamperWarning(msg) {
    const toast = ensureTamperToast();
    const msgEl = document.getElementById('tamperMsg');
    if (msgEl) msgEl.textContent = msg || 'Mã nguồn đã được bảo vệ bản quyền!';
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  // 1. Chặn chuột phải (Disable Context Menu)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showTamperWarning('Chuột phải đã bị vô hiệu hóa để bảo vệ bản quyền!');
    return false;
  });

  // 2. Chặn các phím tắt DevTools, xem nguồn (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
      (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key))
    ) {
      e.preventDefault();
      e.stopPropagation();
      showTamperWarning('Tính năng kiểm tra mã nguồn (DevTools) đã bị khóa!');
      return false;
    }
  });

  // 3. Chặn kéo thả nội dung
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // 4. Khóa chọn văn bản trái phép trên toàn trang
  document.addEventListener('DOMContentLoaded', () => {
    ensureTamperToast();
  });
})();
