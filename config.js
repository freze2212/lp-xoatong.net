/**
 * Cấu hình Domain & Dynamic Redirect Link cho Landing Page
 * Tự động nhận diện Domain (hỗ trợ tự động www và non-www, không phân biệt hoa thường).
 * Chỉ cần khai báo tên miền gốc (ví dụ: "g88tong.net").
 */
(function () {
    'use strict';

    var DEFAULT_REGISTER_URL = 'https://gg8835.com/?id=850584167';

    // Fallback nếu không tải được file domains.json (ví dụ chạy offline file://)
    var INLINE_DOMAINS = {
        "_default": DEFAULT_REGISTER_URL,
        "g88tong.net": "https://gg8835.com/?id=850584167",
        "hug8.net": "https://gg8844.com/?id=909695030",
        "g88tong.com": "https://gg8826.com/?id=916332602",
        "ggvip1.com": "https://gg8846.com/?id=782516068"
    };

    function normalizeHost(h) {
        return (h || '').trim().toLowerCase().replace(/^www\./i, '');
    }

    function pickUrl(entry) {
        if (!entry) return null;
        if (typeof entry === 'string') return entry;
        return entry.main_url || entry.target_url || entry.register_url || entry.url || null;
    }

    function findEntry(data, currentHost) {
        if (!data) return null;
        var cleanTarget = normalizeHost(currentHost);
        
        // 1. Khớp chính xác
        if (data[cleanTarget]) return data[cleanTarget];
        if (data[currentHost]) return data[currentHost];

        // 2. Tự động chuẩn hóa www / hoa thường cho tất cả key
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (normalizeHost(key) === cleanTarget) {
                    return data[key];
                }
            }
        }
        return null;
    }

    function applyConfig(data) {
        data = data || INLINE_DOMAINS;
        var rawHost = window.location.hostname || '';
        var currentHost = normalizeHost(rawHost);

        var entry = findEntry(data, currentHost);
        var targetUrl = pickUrl(entry) || pickUrl(data._default) || DEFAULT_REGISTER_URL;

        // Cho phép override link qua query param: ?target=... hoặc ?link=... hoặc ?aff=...
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.has('target')) targetUrl = params.get('target');
            else if (params.has('link')) targetUrl = params.get('link');
            else if (params.has('aff')) targetUrl = params.get('aff');
        } catch (e) {}

        window.SITE_CONFIG = {
            rawHost: rawHost,
            currentHost: currentHost,
            targetUrl: targetUrl,
            data: data
        };

        // Cập nhật tất cả các link CTA và nút đăng ký
        function updateLinks() {
            var elements = document.querySelectorAll('a.main-cta, a[data-register-link], a[data-dynamic-link], .cta-target, a.cta-btn');
            elements.forEach(function (el) {
                el.href = targetUrl;
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            });

            var allLinks = document.querySelectorAll('a');
            allLinks.forEach(function (a) {
                var href = a.getAttribute('href') || '';
                if (href.indexOf('gg88') !== -1 || href.indexOf('25llwin.com') !== -1 || href === '#' || a.classList.contains('main-cta')) {
                    a.href = targetUrl;
                }
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateLinks);
        } else {
            updateLinks();
        }

        // Tự động gán click handler cho các game card chuyển tiếp tới targetUrl
        function bindGameCards() {
            var cards = document.querySelectorAll('.game-card');
            cards.forEach(function (card) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    if (e.target.tagName !== 'A') {
                        window.open(window.SITE_CONFIG.targetUrl || targetUrl, '_blank', 'noopener,noreferrer');
                    }
                });
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindGameCards);
        } else {
            bindGameCards();
        }
    }

    // Khởi tạo ngay lập tức với INLINE_DOMAINS trước để tránh delay
    applyConfig(INLINE_DOMAINS);

    // Sau đó fetch domains.json để lấy dữ liệu mới nhất (nếu có cập nhật)
    if (window.location.protocol !== 'file:') {
        fetch('domains.json?v=' + Date.now())
            .then(function (res) {
                if (!res.ok) throw new Error('Cannot load domains.json');
                return res.json();
            })
            .then(function (jsonData) {
                applyConfig(jsonData);
            })
            .catch(function (err) {
                console.warn('Fallback to inline domain config:', err.message);
                applyConfig(INLINE_DOMAINS);
            });
    }

    // Helper toàn cục để mở link bất kỳ lúc nào
    window.getRegisterUrl = function () {
        return (window.SITE_CONFIG && window.SITE_CONFIG.targetUrl) || DEFAULT_REGISTER_URL;
    };
    window.openRegister = function () {
        window.open(window.getRegisterUrl(), '_blank', 'noopener,noreferrer');
    };
})();


// Universal domains.json real-time synchronization
(function() {
  try {
    fetch('/domains.json')
      .then(function(r) { return r.json(); })
      .then(function(dj) {
        if (!dj) return;
        var h = (window.location.hostname || '').toLowerCase();
        var normH = h.replace(/^www\./, '');
        var entry = dj[h] || dj[normH] || dj['www.' + normH];
        if (entry) {
          var target = entry.main_url || entry.url || entry.link || (typeof entry === 'string' ? entry : '');
          if (target) {
            window.REDIRECT_URL = target;
            if (window.SITE_CONFIG) {
              window.SITE_CONFIG.defaultLink = target;
              window.SITE_CONFIG.registerUrl = target;
              if (window.SITE_CONFIG.linksByDomain) {
                window.SITE_CONFIG.linksByDomain[normH] = target;
                window.SITE_CONFIG.linksByDomain[h] = target;
              }
            }
            if (window.LINK_CONFIG) {
              window.LINK_CONFIG.default = target;
              if (window.LINK_CONFIG.domains) {
                window.LINK_CONFIG.domains[normH] = target;
                window.LINK_CONFIG.domains[h] = target;
              }
            }
            if (window.LP_CONFIG) {
              window.LP_CONFIG.gameUrl = target;
            }
            var links = document.querySelectorAll('a.redirect-link, a.btn-register, a.cta-btn');
            for (var i = 0; i < links.length; i++) {
              links[i].href = target;
            }
          }
        }
      })
      .catch(function() {});
  } catch(e) {}
})();
