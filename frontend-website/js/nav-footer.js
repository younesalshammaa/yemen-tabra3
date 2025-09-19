// --- إنشاء الناف بار ديناميكيًا ---
function createNavbar() {
  const navbarHTML = `
    <div class="container">
      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <img src="uploads/logo.svg" alt="Logo" style="height: 50px; margin-left: 10px;">
          <div>
            <div style="font-weight: bold; color: #0a6e3c; font-size: 1.1rem;">المنصة الوطنية للتبرعات</div>
            <small style="color: #555; font-size: 0.85rem;">National Donations Platform</small>
          </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="index.html">الرئيسية</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                فرص التبرع
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="opportunities.html">جميع الفرص</a></li>
                <li><a class="dropdown-item" href="#">أيتام</a></li>
                <li><a class="dropdown-item" href="#">طبية</a></li>
                <li><a class="dropdown-item" href="#">إغاثة</a></li>
                <li><a class="dropdown-item" href="#">مشاريع صغيرة</a></li>
                <li><a class="dropdown-item" href="#">تعليم</a></li>
                <li><a class="dropdown-item" href="#">الأنعام</a></li>
                <li><a class="dropdown-item" href="#">الأوقاف</a></li>
                <li><a class="dropdown-item" href="#">زكاة</a></li>
                <li><a class="dropdown-item" href="#">صدقة</a></li>
                <li><a class="dropdown-item" href="#">كفارة</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">الجمعيات</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  `;
  document.querySelector('header.main-header').innerHTML = navbarHTML;
}

// --- إنشاء الفوتر ديناميكيًا ---
function createFooter() {
  const footerHTML = `
    <div class="container">
      <div class="footer-links">
        <a href="#">مركز العرفة</a>
        <a href="#">الشروط و الأحكام</a>
        <a href="#">الشركاء</a>
      </div>
      <div class="social-icons">
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
      <div class="app-links">
        <a href="#">تطبيق أندرويد للجوال</a>
        <a href="#">تطبيق IOS للجوال</a>
      </div>
      <div class="powered-by">
        <img src="uploads/takamol-logo.png" alt="Takamol">
      </div>
      <p>جميع الحقوق محفوظة. المنصة الوطنية للتبرعات © 2025</p>
    </div>
  `;
  document.querySelector('footer.footer').innerHTML = footerHTML;
}

// --- تفعيل الصفحة النشطة ---
function setActiveLink() {
  const path = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('.navbar-nav .nav-link');
  links.forEach(link => {
    if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- تحميل الناف بار والفوتر عند التحميل ---
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('header.main-header')) createNavbar();
  if (document.querySelector('footer.footer')) createFooter();
  setActiveLink();
});