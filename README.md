# LP-XOATONG.NET - Landing Page

Landing Page trích xuất từ `xoatong.net` với hệ thống cấu hình link đích (affiliate link) tự động theo từng tên miền.

## 📁 Cấu trúc thư mục

```text
LP-XOATONG.NET/
├── assets/
│   ├── games/
│   │   ├── game-1.png
│   │   ├── game-2.png
│   │   └── game-3.png
│   └── index-BLF_Jm.css
├── index.html        # Giao diện chính của Landing Page
├── config.js         # Script tự động xử lý và ánh xạ link theo Domain
├── domains.json      # File danh sách Domain -> Link chuyển hướng
└── README.md         # Hướng dẫn sử dụng
```

## ⚙️ Hướng dẫn cấu hình tên miền (Domain Config)

### 1. Thêm Domain mới vào `domains.json`

Mở file [domains.json](file:///c:/GG88/LANDING%20PAGE/LP-XOATONG.NET/domains.json) và thêm tên miền của bạn:

```json
{
  "_default": "https://www.25llwin.com/?id=663807915",
  "xoatong.net": "https://www.25llwin.com/?id=663807915",
  "domain-moi.com": "https://link-aff-moi.com/register"
}
```

### 2. Dự phòng trong `config.js` (Offline / Fallback)

Trong trường hợp mở trực tiếp file `index.html` (giao thức `file://`) hoặc môi trường không tải được `domains.json`, bạn có thể cập nhật thêm trong [config.js](file:///c:/GG88/LANDING%20PAGE/LP-XOATONG.NET/config.js) tại biến `INLINE_DOMAINS`.

### 3. Override link qua URL Query Parameter

Bạn có thể truyền trực tiếp link qua tham số query khi test hoặc chạy ads:
- `https://xoatong.net/?target=https://link-khac.com`
- `https://xoatong.net/?link=https://link-khac.com`
- `https://xoatong.net/?aff=https://link-khac.com`
