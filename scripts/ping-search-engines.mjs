// Script tự động khai báo Sitemap và IndexNow cho website Giáo Viên AI Toàn Năng
// Website: https://giao-vien-ai-toan-nang3.vercel.app/

const SITE_URL = 'https://giao-vien-ai-toan-nang3.vercel.app';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = 'c0e86d2643a6479ebffb53e87877e699';

const URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/#chuan-hoa-vb`,
  `${SITE_URL}/#tao-de-toan`,
  `${SITE_URL}/#tao-de-van`,
  `${SITE_URL}/#tao-de-tieng-anh`,
  `${SITE_URL}/#tao-de-khtn`,
  `${SITE_URL}/#tao-de-sudia`,
  `${SITE_URL}/#tao-de-tin`,
  `${SITE_URL}/#tao-de-gdcd`,
  `${SITE_URL}/#tao-de-cn`,
  `${SITE_URL}/#tach-gop-pdf`,
  `${SITE_URL}/#smart-listening`,
  `${SITE_URL}/#sinh-de-bien-the`,
  `${SITE_URL}/#screen-record`,
  `${SITE_URL}/#cleaner-pro`,
  `${SITE_URL}/#nls-ai`
];

async function pingIndexNow() {
  console.log('🚀 Đang gửi thông báo IndexNow đến máy chủ tìm kiếm quốc tế...');
  try {
    const payload = {
      host: 'giao-vien-ai-toan-nang3.vercel.app',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: URLS
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`✅ Kết quả IndexNow: HTTP ${res.status} (${res.statusText || 'Success'})`);
    if (res.status === 200 || res.status === 202) {
      console.log('🎉 Các công cụ tìm kiếm đã tiếp nhận URL và bắt đầu cào dữ liệu tự động!');
    }
  } catch (error) {
    console.error('❌ Lỗi khi gửi IndexNow:', error.message);
  }
}

async function pingGoogleSitemap() {
  console.log('📡 Đang gửi thông báo sitemap tới Google...');
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const res = await fetch(googlePingUrl);
    console.log(`✅ Kết quả Google Ping: HTTP ${res.status}`);
  } catch (error) {
    console.log('ℹ️ Google Ping:', error.message);
  }
}

async function main() {
  console.log('=====================================================');
  console.log('🌟 TỰ ĐỘNG QUẢNG CÁO & LẬP CHỈ MỤC TÌM KIẾM GOOGLE 0 ĐỒNG 🌟');
  console.log(`Website: ${SITE_URL}`);
  console.log(`Sitemap: ${SITEMAP_URL}`);
  console.log('=====================================================');

  await pingIndexNow();
  await pingGoogleSitemap();

  console.log('=====================================================');
  console.log('✅ Hoàn tất quá trình gửi tín hiệu cào dữ liệu!');
}

main();
