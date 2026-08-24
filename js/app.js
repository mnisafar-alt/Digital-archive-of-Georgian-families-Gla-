
document.addEventListener('DOMContentLoaded', () => {
    const cardsWrapper = document.getElementById('cardsWrapper');
    const searchInput = document.getElementById('searchInput');
    let familiesData = [];

    // بارگذاری فایل داده‌های خاندان‌ها
    fetch('data/families.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('خطا در بارگذاری فایل JSON');
            }
            return response.json();
        })
        .then(data => {
            familiesData = data;
            renderCards(familiesData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            if (cardsWrapper) {
                cardsWrapper.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; color: #7d1f2b; padding: 20px;">
                        خطا در بارگذاری اطلاعات خاندان‌ها. لطفاً اتصال اینترنت یا مسیر فایل داده را بررسی کنید.
                    </div>
                `;
            }
        });

    // تابع تولید و نمایش کارت‌ها
    function renderCards(list) {
        if (!cardsWrapper) return;
        cardsWrapper.innerHTML = '';

        if (list.length === 0) {
            cardsWrapper.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: #666; padding: 30px; font-size: 1.1rem;">
                    هیچ خاندانی با این مشخصات یافت نشد.
                </div>
            `;
            return;
        }

        list.forEach(fam => {
            const card = document.createElement('div');
            card.className = 'card family-card';

            const badgeText = fam.access === 'premium' ? 'اشتراک ویژه' : 'عمومی';
            const badgeClass = fam.access === 'premium' ? 'badge-premium' : 'badge-free';
            const locationsText = fam.locations_fa && fam.locations_fa.length > 0 
                ? fam.locations_fa.join('، ') 
                : 'ثبت نشده';

            card.innerHTML = `
                <div class="card-header-flex">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                    <h3>${fam.name_fa} <span class="georgian-sub">(${fam.name_ka || ''})</span></h3>
                </div>
                <div class="card-body-text">
                    <p><strong>خاستگاه:</strong> ${fam.origin_fa || 'نامشخص'}</p>
                    <p><strong>محل‌های استقرار:</strong> ${locationsText}</p>
                    <p class="summary-text">${fam.summary_fa || ''}</p>
                </div>
                <div class="card-footer-action">
                    <a href="families/${fam.id}.html" class="action-btn">مشاهده شناسنامه و شجره‌نامه</a>
                </div>
            `;
            cardsWrapper.appendChild(card);
        });
    }

    // اتصال جستجوی لحظه‌ای (فارسی، گرجی و انگلیسی)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.trim().toLowerCase();
            if (!term) {
                renderCards(familiesData);
                return;
            }

            const filtered = familiesData.filter(item => {
                const nameFa = (item.name_fa || '').toLowerCase();
                const nameKa = (item.name_ka || '').toLowerCase();
                const nameEn = (item.name_en || '').toLowerCase();
                const origin = (item.origin_fa || '').toLowerCase();
                const locations = (item.locations_fa || []).join(' ').toLowerCase();

                return nameFa.includes(term) || 
                       nameKa.includes(term) || 
                       nameEn.includes(term) || 
                       origin.includes(term) || 
                       locations.includes(term);
            });

            renderCards(filtered);
        });
    }
});
