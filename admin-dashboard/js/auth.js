// admin-dashboard/js/auth.js
function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'login.html';
}