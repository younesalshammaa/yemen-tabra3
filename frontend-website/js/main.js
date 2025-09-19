// --- تحميل الإحصائيات ---
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('فشل جلب الإحصائيات');

    const stats = await res.json();
    const container = document.getElementById('stats-container');

    container.innerHTML = `
      <div class="col-md-4 mb-4">
        <div class="stats-card">
          <div class="stats-icon"><i class="fas fa-sun"></i></div>
          <div class="stats-number">${stats.availableOpportunities.toLocaleString()}</div>
          <div class="stats-label">عدد الفرص التبرعية المتاحة</div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="stats-card">
          <div class="stats-icon"><i class="fas fa-check-circle"></i></div>
          <div class="stats-number">${stats.completedOpportunities.toLocaleString()}</div>
          <div class="stats-label">الفرص المكتملة</div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="stats-card">
          <div class="stats-icon"><i class="fas fa-users"></i></div>
          <div class="stats-number">${stats.totalBeneficiaries.toLocaleString()}</div>
          <div class="stats-label">عدد المستفيدين الكلي</div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('فشل تحميل الإحصائيات:', error);
    document.getElementById('stats-container').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          تعذر تحميل الإحصائيات. تأكد من أن الخادم يعمل.
        </div>
      </div>
    `;
  }
}

// --- تحميل الفرص ---
async function loadOpportunities() {
  try {
    const res = await fetch('/api/donations');
    if (!res.ok) throw new Error('فشل جلب الفرص');

    const donations = await res.json();
    const container = document.getElementById('opportunities-list');
    const featured = donations.slice(0, 3);

    if (featured.length === 0) {
      container.innerHTML = '<p class="text-center">لا توجد فرص متاحة حاليًا</p>';
      return;
    }

    featured.forEach(d => {
      const progress = d.targetAmount > 0 ? (d.raisedAmount / d.targetAmount) * 100 : 0;
      const imageUrl = d.imageUrl && d.imageUrl.trim() !== '' 
        ? `/uploads/${d.imageUrl.split('/').pop()}`
        : 'https://via.placeholder.com/400x200?text=لا+توجد+صورة';

      container.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="opportunity-card">
            <img src="${imageUrl}" class="opportunity-img" alt="${d.title}">
            <div class="opportunity-tags">
              <span class="tag">${d.category}</span>
              <span class="tag">صدقة</span>
              <span class="tag">عامة للمجتمع</span>
            </div>
            <h4 class="opportunity-title">${d.title}</h4>
            <div class="opportunity-info">
              <span><i class="fas fa-map-marker-alt" style="color:#0a6e3c;"></i> ${d.location}</span>
              <span style="margin-right:10px;"><i class="fas fa-users" style="color:#0a6e3c;"></i> ${d.beneficiaries}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="donation-amount">${d.raisedAmount || 0} / ${d.targetAmount} ريال يمني</span>
              <span style="font-weight:600; color:#0a6e3c;">${Math.min(progress, 100).toFixed(0)}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <div class="mt-3">
              <label style="font-weight:600;">مبلغ التبرع</label>
              <input type="number" lang="en" class="form-control donation-input" value="30" style="width:100px; display:inline-block; margin-right:5px; background-color:#f7f7f7;"> ريال يمني
            </div>
            <div class="d-flex justify-content-between mt-3">
              <a href="details.html?id=${d.id}" class="btn btn-outline-secondary w-50 me-2">التفاصيل</a>
              <a href="donate.html?id=${d.id}" class="btn btn-success w-50">تبرع</a>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('فشل تحميل الفرص:', error);
    document.getElementById('opportunities-list').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          تعذر تحميل الفرص. تأكد من أن الخادم يعمل.
        </div>
      </div>
    `;
  }
}

// --- تحميل البيانات عند التحميل ---
window.onload = async () => {
  if (document.getElementById('stats-container')) await loadStats();
  if (document.getElementById('opportunities-list')) await loadOpportunities();
};