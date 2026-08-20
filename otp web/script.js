/**
 * Jannat OTP — Virtual Number Verification Platform Engine
 * Professional production-grade frontend logic
 */

/* ====================================================
   COUNTRY DATABASE — Real dial codes, area codes, 
   realistic stock counts & pricing tiers (PKR)
   ==================================================== */
const countries = {
    '0': { name: 'Any Country (Fastest)', flag: '⚡', code: '+1', areas: ['202', '213', '312', '415', '646', '718', '305', '404', '713', '206'], numLen: 7 },
    '1': { name: 'USA / Canada', flag: '🇺🇸', code: '+1', areas: ['202', '213', '312', '415', '646', '718', '305', '404', '713', '206', '917', '347', '212', '310', '424', '323', '408', '510', '914', '516'], numLen: 7 },
    '44': { name: 'United Kingdom', flag: '🇬🇧', code: '+44', areas: ['7911', '7457', '7700', '7521', '7384', '7835', '7440', '7912', '7453', '7891'], numLen: 6 },
    '91': { name: 'India', flag: '🇮🇳', code: '+91', areas: ['98200', '98100', '97177', '98300', '94150', '99100', '98110', '97170', '94200', '98400'], numLen: 5 },
    '7': { name: 'Russia', flag: '🇷🇺', code: '+7', areas: ['916', '926', '903', '905', '915', '929', '985', '917', '909', '904'], numLen: 7 },
    '2': { name: 'Kazakhstan', flag: '🇰🇿', code: '+7', areas: ['701', '702', '705', '707', '708', '747', '771', '775', '776', '778'], numLen: 7 },
    '62': { name: 'Indonesia', flag: '🇮🇩', code: '+62', areas: ['812', '813', '852', '853', '857', '858', '878', '896', '895', '897'], numLen: 8 },
    '92': { name: 'Pakistan', flag: '🇵🇰', code: '+92', areas: ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '331', '332', '333', '334', '335', '336', '340', '341', '342', '343', '344', '345', '346', '347'], numLen: 7 },
    '55': { name: 'Brazil', flag: '🇧🇷', code: '+55', areas: ['11', '21', '31', '41', '51', '61', '71', '81', '91', '85'], numLen: 9 },
    '86': { name: 'China', flag: '🇨🇳', code: '+86', areas: ['138', '139', '150', '151', '152', '158', '159', '186', '187', '188'], numLen: 8 },
    '49': { name: 'Germany', flag: '🇩🇪', code: '+49', areas: ['151', '152', '157', '160', '162', '163', '170', '171', '175', '176'], numLen: 8 },
    '33': { name: 'France', flag: '🇫🇷', code: '+33', areas: ['6', '7'], numLen: 8 },
    '31': { name: 'Netherlands', flag: '🇳🇱', code: '+31', areas: ['6'], numLen: 8 },
    '380': { name: 'Ukraine', flag: '🇺🇦', code: '+380', areas: ['63', '67', '68', '93', '95', '96', '97', '98', '99', '50'], numLen: 7 },
    '63': { name: 'Philippines', flag: '🇵🇭', code: '+63', areas: ['917', '918', '919', '920', '921', '927', '928', '929', '936', '937'], numLen: 7 },
    '234': { name: 'Nigeria', flag: '🇳🇬', code: '+234', areas: ['803', '805', '806', '807', '808', '809', '810', '811', '812', '813'], numLen: 7 },
    '84': { name: 'Vietnam', flag: '🇻🇳', code: '+84', areas: ['32', '33', '34', '35', '36', '37', '38', '39', '56', '58'], numLen: 7 },
    '90': { name: 'Turkey', flag: '🇹🇷', code: '+90', areas: ['530', '531', '532', '533', '534', '535', '536', '537', '538', '539'], numLen: 7 }
};

/* ====================================================
   SERVICE DATABASE — Real services with country-specific
   pricing tiers in PKR (no cost/profit shown)
   ==================================================== */
const servicesData = [
    {
        code: 'wa', name: 'WhatsApp', fa: 'fa-brands fa-whatsapp', iconClass: 'icon-wa',
        prices: { '0': 0, '1': 120, '44': 140, '91': 45, '7': 35, '2': 40, '62': 30, '92': 80, '55': 65, '86': 90, '49': 130, '33': 125, '31': 135, '380': 30, '63': 35, '234': 25, '84': 28, '90': 55 },
        stocks: { '0': 18420, '1': 4310, '44': 2870, '91': 9250, '7': 12500, '2': 5300, '62': 14200, '92': 3100, '55': 6800, '86': 5400, '49': 2200, '33': 1980, '31': 1560, '380': 11200, '63': 8700, '234': 9900, '84': 10500, '90': 7600 }
    },
    {
        code: 'tg', name: 'Telegram', fa: 'fa-brands fa-telegram', iconClass: 'icon-tg',
        prices: { '0': 40, '1': 95, '44': 110, '91': 35, '7': 25, '2': 30, '62': 22, '92': 65, '55': 50, '86': 70, '49': 105, '33': 100, '31': 115, '380': 22, '63': 28, '234': 20, '84': 22, '90': 45 },
        stocks: { '0': 22150, '1': 3800, '44': 2450, '91': 11300, '7': 16800, '2': 7200, '62': 18900, '92': 2500, '55': 5600, '86': 4800, '49': 1900, '33': 1700, '31': 1350, '380': 14600, '63': 10200, '234': 12100, '84': 13400, '90': 8200 }
    },
    {
        code: 'fb', name: 'Facebook', fa: 'fa-brands fa-facebook-f', iconClass: 'icon-fb',
        prices: { '0': 0, '1': 85, '44': 95, '91': 28, '7': 20, '2': 25, '62': 18, '92': 55, '55': 40, '86': 60, '49': 90, '33': 88, '31': 95, '380': 18, '63': 22, '234': 15, '84': 18, '90': 38 },
        stocks: { '0': 31200, '1': 5600, '44': 3200, '91': 14100, '7': 19500, '2': 8400, '62': 22800, '92': 4200, '55': 8100, '86': 6300, '49': 2800, '33': 2400, '31': 1800, '380': 17800, '63': 12600, '234': 15400, '84': 16200, '90': 10800 }
    },
    {
        code: 'go', name: 'Google / Gmail', fa: 'fa-brands fa-google', iconClass: 'icon-go',
        prices: { '0': 45, '1': 110, '44': 125, '91': 40, '7': 30, '2': 35, '62': 25, '92': 72, '55': 55, '86': 80, '49': 120, '33': 115, '31': 125, '380': 28, '63': 30, '234': 22, '84': 25, '90': 50 },
        stocks: { '0': 15600, '1': 3200, '44': 2100, '91': 8800, '7': 11400, '2': 4900, '62': 12800, '92': 2800, '55': 4900, '86': 3900, '49': 1650, '33': 1450, '31': 1200, '380': 10200, '63': 7800, '234': 8900, '84': 9600, '90': 6900 }
    },
    {
        code: 'ai', name: 'OpenAI / ChatGPT', fa: 'fa-solid fa-robot', iconClass: 'icon-ai',
        prices: { '0': 85, '1': 180, '44': 200, '91': 75, '7': 60, '2': 65, '62': 55, '92': 140, '55': 100, '86': 150, '49': 190, '33': 185, '31': 195, '380': 50, '63': 55, '234': 45, '84': 48, '90': 90 },
        stocks: { '0': 4120, '1': 890, '44': 620, '91': 2100, '7': 3400, '2': 1500, '62': 3800, '92': 680, '55': 1400, '86': 1100, '49': 480, '33': 420, '31': 350, '380': 2900, '63': 2200, '234': 2600, '84': 2800, '90': 1900 }
    },
    {
        code: 'lf', name: 'TikTok', fa: 'fa-brands fa-tiktok', iconClass: 'icon-tk',
        prices: { '0': 35, '1': 90, '44': 100, '91': 30, '7': 22, '2': 28, '62': 20, '92': 60, '55': 45, '86': 65, '49': 95, '33': 92, '31': 100, '380': 20, '63': 25, '234': 18, '84': 20, '90': 42 },
        stocks: { '0': 19800, '1': 4800, '44': 2900, '91': 12500, '7': 17200, '2': 7500, '62': 20100, '92': 3600, '55': 7200, '86': 5600, '49': 2500, '33': 2100, '31': 1650, '380': 15800, '63': 11400, '234': 13800, '84': 14600, '90': 9500 }
    },
    {
        code: 'ig', name: 'Instagram', fa: 'fa-brands fa-instagram', iconClass: 'icon-ig',
        prices: { '0': 0, '1': 95, '44': 108, '91': 32, '7': 25, '2': 30, '62': 22, '92': 0, '55': 48, '86': 68, '49': 100, '33': 95, '31': 108, '380': 22, '63': 27, '234': 20, '84': 22, '90': 45 },
        stocks: { '0': 17600, '1': 4200, '44': 2700, '91': 11000, '7': 15400, '2': 6800, '62': 18400, '92': 3200, '55': 6500, '86': 5100, '49': 2300, '33': 1950, '31': 1500, '380': 14200, '63': 10400, '234': 12400, '84': 13200, '90': 8600 }
    },
    {
        code: 'tw', name: 'Twitter / X', fa: 'fa-brands fa-x-twitter', iconClass: 'icon-tw',
        prices: { '0': 32, '1': 88, '44': 98, '91': 28, '7': 22, '2': 26, '62': 18, '92': 58, '55': 42, '86': 62, '49': 92, '33': 88, '31': 98, '380': 18, '63': 24, '234': 16, '84': 18, '90': 40 },
        stocks: { '0': 14300, '1': 3500, '44': 2300, '91': 9200, '7': 12800, '2': 5600, '62': 15200, '92': 2700, '55': 5400, '86': 4200, '49': 1850, '33': 1600, '31': 1280, '380': 11800, '63': 8600, '234': 10200, '84': 10800, '90': 7200 }
    },
    {
        code: 'bn', name: 'Binance', fa: 'fa-solid fa-coins', iconClass: 'icon-bn',
        prices: { '0': 95, '1': 200, '44': 220, '91': 85, '7': 70, '2': 75, '62': 60, '92': 160, '55': 115, '86': 170, '49': 210, '33': 205, '31': 215, '380': 58, '63': 62, '234': 50, '84': 55, '90': 100 },
        stocks: { '0': 3200, '1': 680, '44': 450, '91': 1600, '7': 2600, '2': 1150, '62': 2900, '92': 520, '55': 1050, '86': 850, '49': 380, '33': 320, '31': 270, '380': 2200, '63': 1700, '234': 2000, '84': 2100, '90': 1450 }
    },
    {
        code: 'dc', name: 'Discord', fa: 'fa-brands fa-discord', iconClass: 'icon-dc',
        prices: { '0': 42, '1': 100, '44': 112, '91': 36, '7': 28, '2': 32, '62': 24, '92': 68, '55': 52, '86': 72, '49': 108, '33': 102, '31': 112, '380': 24, '63': 30, '234': 22, '84': 24, '90': 48 },
        stocks: { '0': 9400, '1': 2300, '44': 1500, '91': 5800, '7': 8200, '2': 3600, '62': 9600, '92': 1700, '55': 3400, '86': 2700, '49': 1200, '33': 1050, '31': 820, '380': 7400, '63': 5500, '234': 6400, '84': 6900, '90': 4500 }
    },
    {
        code: 'sp', name: 'Snapchat', fa: 'fa-brands fa-snapchat', iconClass: 'icon-sn',
        prices: { '0': 40, '1': 98, '44': 110, '91': 35, '7': 26, '2': 30, '62': 22, '92': 65, '55': 50, '86': 70, '49': 105, '33': 98, '31': 108, '380': 22, '63': 28, '234': 20, '84': 22, '90': 46 },
        stocks: { '0': 8700, '1': 2100, '44': 1400, '91': 5400, '7': 7600, '2': 3300, '62': 8900, '92': 1550, '55': 3100, '86': 2500, '49': 1100, '33': 980, '31': 760, '380': 6800, '63': 5100, '234': 5900, '84': 6400, '90': 4200 }
    },
    {
        code: 'ms', name: 'Microsoft / Outlook', fa: 'fa-brands fa-microsoft', iconClass: 'icon-ms',
        prices: { '0': 50, '1': 115, '44': 130, '91': 42, '7': 35, '2': 38, '62': 28, '92': 78, '55': 60, '86': 85, '49': 125, '33': 118, '31': 128, '380': 30, '63': 35, '234': 25, '84': 28, '90': 55 },
        stocks: { '0': 11200, '1': 2800, '44': 1800, '91': 7200, '7': 9800, '2': 4300, '62': 11800, '92': 2100, '55': 4200, '86': 3400, '49': 1500, '33': 1300, '31': 1020, '380': 8800, '63': 6600, '234': 7800, '84': 8400, '90': 5600 }
    },
    {
        code: 'am', name: 'Amazon', fa: 'fa-brands fa-amazon', iconClass: 'icon-am',
        prices: { '0': 60, '1': 130, '44': 145, '91': 50, '7': 42, '2': 45, '62': 35, '92': 90, '55': 70, '86': 100, '49': 140, '33': 135, '31': 145, '380': 38, '63': 40, '234': 30, '84': 32, '90': 65 },
        stocks: { '0': 7800, '1': 1900, '44': 1250, '91': 4900, '7': 6800, '2': 2950, '62': 8100, '92': 1450, '55': 2900, '86': 2300, '49': 1020, '33': 900, '31': 700, '380': 6100, '63': 4500, '234': 5400, '84': 5800, '90': 3900 }
    },
    {
        code: 'lk', name: 'LinkedIn', fa: 'fa-brands fa-linkedin-in', iconClass: 'icon-lk',
        prices: { '0': 48, '1': 108, '44': 120, '91': 40, '7': 32, '2': 35, '62': 26, '92': 72, '55': 55, '86': 78, '49': 115, '33': 110, '31': 120, '380': 28, '63': 32, '234': 23, '84': 25, '90': 52 },
        stocks: { '0': 6500, '1': 1600, '44': 1050, '91': 4100, '7': 5700, '2': 2500, '62': 6800, '92': 1200, '55': 2400, '86': 1950, '49': 860, '33': 750, '31': 590, '380': 5100, '63': 3800, '234': 4500, '84': 4800, '90': 3200 }
    },
    {
        code: 'yd', name: 'Yandex', fa: 'fa-brands fa-yandex-international', iconClass: 'icon-yd',
        prices: { '0': 28, '1': 75, '44': 85, '91': 25, '7': 15, '2': 18, '62': 15, '92': 50, '55': 38, '86': 55, '49': 80, '33': 78, '31': 85, '380': 14, '63': 18, '234': 12, '84': 14, '90': 32 },
        stocks: { '0': 24500, '1': 1200, '44': 800, '91': 3500, '7': 28600, '2': 12800, '62': 5200, '92': 900, '55': 1800, '86': 6400, '49': 650, '33': 550, '31': 430, '380': 19200, '63': 2800, '234': 3200, '84': 3600, '90': 5800 }
    },
    {
        code: 'la', name: 'Line App', fa: 'fa-brands fa-line', iconClass: 'icon-la',
        prices: { '0': 45, '1': 105, '44': 115, '91': 38, '7': 30, '2': 34, '62': 20, '92': 70, '55': 55, '86': 55, '49': 110, '33': 105, '31': 115, '380': 26, '63': 22, '234': 20, '84': 18, '90': 48 },
        stocks: { '0': 5800, '1': 1400, '44': 950, '91': 3700, '7': 4200, '2': 1850, '62': 15600, '92': 1050, '55': 2100, '86': 8200, '49': 780, '33': 680, '31': 530, '380': 3800, '63': 9400, '234': 2200, '84': 12800, '90': 3400 }
    }
];

/* ====================================================
   STOCK FLUCTUATION — Simulate live stock changes
   ==================================================== */
function getStockWithFluctuation(baseStock) {
    const variance = Math.floor(baseStock * 0.04 * (Math.random() - 0.5));
    return Math.max(0, baseStock + variance);
}

/* ====================================================
   APPLICATION STATE
   ==================================================== */
let activeOrder = null;
let pollTimer = null;
let countTimer = null;
let orderHistory = [];
let loggedInUser = null;

try {
    orderHistory = JSON.parse(localStorage.getItem('shampoo_orders') || '[]');
} catch (e) {
    orderHistory = [];
}

/* ====================================================
   INIT — Auto-run on load
   ==================================================== */
const ADMIN_PIN = '786786';
let isAdmin = localStorage.getItem('jannat_admin_mode') === 'true';

function setupMobileSidebar() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (sidebar) sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    }

    document.querySelectorAll('.sidebar .nav-list li').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
            }
        });
    });
}

function initApp() {
    checkUrlReferralCode();
    renderServices();
    renderHistory();
    setupNavigation();
    setupMobileSidebar();
    setupModals();
    restoreSession();
    initWebappTempMail();
    initDepositSystem();

    // Recharge form
    document.getElementById('recharge-proof-form')?.addEventListener('submit', handleRechargeSubmit);

    // Active order control buttons
    document.getElementById('cancel-order-btn')?.addEventListener('click', cancelActiveOrder);
    document.getElementById('finish-order-btn')?.addEventListener('click', finishActiveOrder);

    // Admin sidebar visibility
    toggleAdminUI();

    // Refresh header auth UI & balance & referral link
    updateBalanceDisplay();
    updateAuthUI();
    renderReferralUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    setTimeout(initApp, 50);
}

/* ====================================================
   LOGIN GATE — Block actions if not logged in
   ==================================================== */
function requireLogin() {
    if (loggedInUser) return true;
    showToast('⚠️ Please Login or Register first to use this feature.', 'error');
    const loginModal = document.getElementById('login-modal');
    if (loginModal) loginModal.style.display = 'flex';
    return false;
}

function doLogin(user) {
    loggedInUser = user;

    // Ensure a new user account starts with Rs. 0.00 by default.
    const key = 'jannat_balance_' + (loggedInUser.username || loggedInUser.id || 'default');
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, '0.00');
    }

    updateBalanceDisplay();
    updateAuthUI();
}

function doLogout() {
    fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'logout' }) }).catch(() => { });
    loggedInUser = null;
    updateBalanceDisplay();
    updateAuthUI();
    showToast('🔒 Logged out successfully.');
}

async function authRequest(payload) {
    const response = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({ message: 'Authentication service returned an invalid response.' }));
    if (!response.ok || !result.success) throw new Error(result.message || 'Authentication failed.');
    return result;
}

async function restoreSession() {
    try { 
        const result = await authRequest({ action: 'session' }); 
        if (result.user) { 
            loggedInUser = result.user; 
            updateBalanceDisplay();
            updateAuthUI(); 
        } 
    } catch (_) { }
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function updateAuthUI() {
    updateBalanceDisplay();
    renderReferralUI();
    const authBtns = document.getElementById('auth-buttons');
    if (!authBtns) return;
    if (loggedInUser) {
        authBtns.innerHTML = `
            <button class="btn-auth" onclick="promptAdminLogin()" title="Admin Panel" style="background:transparent; border:1px solid rgba(255,255,255,0.08); font-size:14px; padding:6px 10px; cursor:pointer; color:var(--text-muted);"><i class="fa-solid fa-shield-halved"></i></button>
            <span style="color:#a78bfa; font-size:13px; font-weight:600;" title="${escapeHtml(loggedInUser.name)}"><i class="fa-solid fa-circle-user" style="margin-right:4px;"></i>@${escapeHtml(loggedInUser.username || loggedInUser.name)}</span>
            <button class="btn-auth btn-login-modal" onclick="doLogout()" style="background:rgba(239,68,68,0.15); color:#f87171; border-color:rgba(239,68,68,0.3);"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;
    } else {
        authBtns.innerHTML = `
            <button class="btn-auth" onclick="promptAdminLogin()" title="Admin Panel" style="background:transparent; border:1px solid rgba(255,255,255,0.08); font-size:14px; padding:6px 10px; cursor:pointer; color:var(--text-muted);"><i class="fa-solid fa-shield-halved"></i></button>
            <button class="btn-auth btn-login-modal" id="open-login"><i class="fa-solid fa-right-to-bracket"></i> Login</button>
            <button class="btn-auth btn-register-modal" id="open-register"><i class="fa-solid fa-user-plus"></i> Register</button>
        `;
        // Re-attach modal openers
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        document.getElementById('open-login')?.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'flex';
        });
        document.getElementById('open-register')?.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'flex';
        });
    }
}

/* ====================================================
   RENDER SERVICE CARDS — Country-specific prices
   No cost/profit info — only final price shown
   ==================================================== */
function renderServices() {
    const countryVal = document.getElementById('country-filter')?.value || '0';
    const grid = document.getElementById('store-grid');

    if (!grid) return;

    grid.innerHTML = servicesData.map(s => {
        const price = 0; // All OTP rates set to Rs. 0 as requested
        const stock = getStockWithFluctuation(s.stocks[countryVal] || s.stocks['0']);
        const stockColor = stock > 5000 ? '#34d399' : stock > 1000 ? '#fbbf24' : '#ef4444';
        const stockLabel = stock > 5000 ? 'Available' : stock > 1000 ? 'Limited' : 'Low Stock';

        return `
            <div class="card-item" data-name="${s.name.toLowerCase()}" data-code="${s.code}">
                <div class="card-top">
                    <div class="card-icon ${s.iconClass}"><i class="${s.fa}"></i></div>
                    <div>
                        <div class="card-title">${s.name}</div>
                        <div class="card-sub">
                            <span style="color:${stockColor}; font-weight:600;">●</span>
                            ${stock.toLocaleString()} numbers
                            <span style="color:${stockColor}; font-size:10px; margin-left:4px;">${stockLabel}</span>
                        </div>
                    </div>
                </div>
                <div class="card-bottom">
                    <div>
                        <span class="price">Rs. 0</span>
                    </div>
                    <button class="btn-buy" onclick="buyService('${s.code}', '${s.name}', 0)">Buy Number</button>
                </div>
            </div>
        `;
    }).join('');

    // Live Search
    const searchEl = document.getElementById('store-search');
    if (searchEl) {
        // Remove old listener by cloning
        const newSearch = searchEl.cloneNode(true);
        searchEl.parentNode.replaceChild(newSearch, searchEl);
        newSearch.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.card-item').forEach(card => {
                const name = card.getAttribute('data-name');
                card.style.display = name.includes(q) ? 'flex' : 'none';
            });
        });
    }
}

/* ====================================================
   BUY SERVICE — Request a number from the provider API
   ==================================================== */
async function buyService(code, name, price) {
    if (!requireLogin()) return;

    const country = document.getElementById('country-filter')?.value || 'any';

    const currentBal = getAccountBalance();
    if (currentBal < price) {
        showToast(`❌ Insufficient Balance! Account Balance: Rs. ${currentBal.toFixed(0)} | Required: Rs. ${price}. Please Recharge.`, 'error');
        return;
    }

    try {
        const response = await fetch('/api/get-number.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service: code,
                country
            })
        });
        const result = await response.json();
        const zenex = result?.zenex_response;
        const data = zenex?.data || result?.data;
        const providerNumber = String(data?.number || '');
        const normalizedNumber = providerNumber.replace(/^\+/, '');

        if (!response.ok || zenex?.meta?.status !== 'success' || !providerNumber || (country !== 'any' && !normalizedNumber.startsWith(country))) {
            showToast(`❌ ${zenex?.message || result?.message || 'Number is currently unavailable. Please try again later.'}`, 'error');
            return;
        }

        const orderId = Date.now().toString().slice(-8);
        setAccountBalance(currentBal - price);
        activeOrder = {
            id: orderId,
            code,
            name,
            countryName: result?.requested_country || data.country || 'Provider allocation',
            countryCode: country === 'any' ? '' : `+${country}`,
            phone: data.number,
            status: 'WAITING',
            price,
            time: new Date().toLocaleString('en-PK', { hour12: true })
        };

        orderHistory.unshift(activeOrder);
        localStorage.setItem('shampoo_orders', JSON.stringify(orderHistory.slice(0, 50)));
        showActivePanel();
        startTimer(900);
        renderHistory();
        showToast(`✅ Number allocated: ${data.number} (Rs. ${price} deducted)`);
    } catch (error) {
        console.error('Buy Number error:', error);
        showToast('❌ Number is currently unavailable. Please try again later.', 'error');
    }
}

/* ====================================================
   ACTIVE PANEL CONTROLS
   ==================================================== */
function showActivePanel() {
    const elName = document.getElementById('active-service-name');
    const elCountry = document.getElementById('active-country-name');
    const elPhone = document.getElementById('active-num-val');
    const elOtp = document.getElementById('active-otp-val');
    const elPanel = document.getElementById('active-panel');

    if (elName) elName.innerText = activeOrder.name;
    if (elCountry) elCountry.innerText = activeOrder.countryCode
        ? `— ${activeOrder.countryName} (${activeOrder.countryCode})`
        : `— ${activeOrder.countryName}`;
    if (elPhone) elPhone.innerText = activeOrder.phone;
    if (elOtp) elOtp.innerText = '------';
    if (elPanel) elPanel.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelActiveOrder() {
    if (!activeOrder) return;
    clearInterval(pollTimer);
    clearInterval(countTimer);

    // Refund price back to user balance
    const currentBal = getAccountBalance();
    setAccountBalance(currentBal + activeOrder.price);

    activeOrder.status = 'CANCELLED';
    const elPanel = document.getElementById('active-panel');
    if (elPanel) elPanel.style.display = 'none';

    renderHistory();
    showToast(`🔄 Activation cancelled. Rs. ${activeOrder.price} refunded to your account.`);
    activeOrder = null;
}

function finishActiveOrder() {
    if (!activeOrder) return;
    clearInterval(pollTimer);
    clearInterval(countTimer);

    activeOrder.status = 'COMPLETED';
    const elPanel = document.getElementById('active-panel');
    if (elPanel) elPanel.style.display = 'none';

    renderHistory();
    showToast(`✅ Order completed successfully.`);
    activeOrder = null;
}

function receiveOTP(code) {
    clearInterval(pollTimer);
    activeOrder.code = code;
    activeOrder.status = 'RECEIVED';
    const elOtp = document.getElementById('active-otp-val');
    const elLoader = document.getElementById('status-loader');

    if (elOtp) elOtp.innerText = code;
    if (elLoader) elLoader.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#34d399"></i> SMS OTP Received!';
    showToast(`🎉 Verification Code: ${code}`);
    renderHistory();
}

function startTimer(seconds) {
    clearInterval(countTimer);
    let rem = seconds;
    countTimer = setInterval(() => {
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        const timerBox = document.getElementById('timer-box');
        if (timerBox) timerBox.innerHTML = `<i class="fa-regular fa-clock"></i> ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        if (--rem < 0) clearInterval(countTimer);
    }, 1000);
}

/* ====================================================
   NAVIGATION TAB SWITCHER
   ==================================================== */
function setupNavigation() {
    function activateSection(page) {
        if (!page) page = 'store';
        
        document.querySelectorAll('.sidebar .nav-list li').forEach(item => {
            const p = item.getAttribute('data-page');
            if (p === page) item.classList.add('active');
            else item.classList.remove('active');
        });

        document.querySelectorAll('.page-sec').forEach(sec => sec.classList.remove('active'));

        let target = document.getElementById(`page-${page}`);
        if (!target && page.includes('records')) {
            target = document.getElementById('page-records');
        }
        if (!target) {
            target = document.getElementById('page-store');
        }

        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (page === 'invites') renderReferralUI();
        if (page === 'deposit-approval') renderAdminUsersTable();
    }

    document.querySelectorAll('.sidebar .nav-list li').forEach(item => {
        item.addEventListener('click', function (e) {
            const page = this.getAttribute('data-page');
            if (page) {
                activateSection(page);
            }
        });
    });

    function handleHashNav() {
        const hash = window.location.hash.replace('#', '').split('?')[0];
        if (hash) {
            activateSection(hash);
        }
    }

    window.addEventListener('hashchange', handleHashNav);
    if (window.location.hash) {
        setTimeout(handleHashNav, 50);
    }
}

/* ====================================================
   RENDER ORDERS TABLE
   ==================================================== */
function renderHistory() {
    const tbody = document.getElementById('orders-tbl-body');
    const recordsBody = document.getElementById('records-tbl-body');

    if (!orderHistory.length) return;

    const rows = orderHistory.map(item => `
        <tr>
            <td>#${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.phone}</td>
            <td style="color: ${item.code !== '------' ? '#34d399' : 'inherit'}; font-weight: bold;">${item.code}</td>
            <td><span style="background: rgba(16,185,129,0.1); color: #34d399; padding: 3px 8px; border-radius: 12px; font-size: 11px;">${item.status}</span></td>
            <td>${item.time}</td>
        </tr>
    `).join('');

    if (tbody) tbody.innerHTML = rows;
    if (recordsBody) recordsBody.innerHTML = rows;
}

/* ====================================================
   RECHARGE FORM HANDLER & DEPOSIT REQUEST SYSTEM
   ==================================================== */
function getDepositRequests() {
    try { return JSON.parse(localStorage.getItem('jannat_deposit_requests') || '[]'); }
    catch (e) { return []; }
}
function saveDepositRequests(arr) {
    localStorage.setItem('jannat_deposit_requests', JSON.stringify(arr));
}
function updateBalanceDisplay() {
    const val = loggedInUser ? getAccountBalance() : 0;
    document.querySelectorAll('.user-balance-display').forEach(el => {
        el.innerText = 'Rs. ' + val.toFixed(0);
    });
}

function getAccountBalance() {
    if (!loggedInUser) return 0;
    const key = 'jannat_balance_' + (loggedInUser.username || loggedInUser.id || 'default');
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, '0.00');
    }
    return parseFloat(localStorage.getItem(key) || '0');
}
function setAccountBalance(val) {
    if (loggedInUser) {
        const key = 'jannat_balance_' + (loggedInUser.username || loggedInUser.id || 'default');
        localStorage.setItem(key, val.toFixed(2));
    }
    updateBalanceDisplay();
}

function handleRechargeSubmit(e) {
    e.preventDefault();
    if (!requireLogin()) return;

    const phone = document.getElementById('pay-phone-inp')?.value?.trim();
    const method = document.getElementById('pay-method-select')?.value;
    const amount = document.getElementById('pay-amount-inp')?.value;
    const trxId = document.getElementById('pay-trx-inp')?.value?.trim() || 'N/A';

    if (!phone || !amount || parseInt(amount) < 10) {
        showToast('⚠️ Please enter sender number and valid amount (min Rs.10)', 'error');
        return;
    }

    const requests = getDepositRequests();
    const newReq = {
        id: 'DEP-' + Date.now().toString(36).toUpperCase(),
        username: loggedInUser ? (loggedInUser.username || loggedInUser.name) : 'Guest',
        email: loggedInUser ? loggedInUser.email : 'N/A',
        name: loggedInUser ? loggedInUser.name : 'Guest',
        phone: phone,
        method: method,
        amount: parseInt(amount),
        trxId: trxId,
        status: 'pending',
        timestamp: new Date().toLocaleString('en-PK'),
    };
    requests.unshift(newReq);
    saveDepositRequests(requests);
    updatePendingBadge();
    renderDepositRequestsTable();

    showToast(`✅ Deposit request submitted! Rs. ${amount} via ${method}. Awaiting admin approval.`);
    e.target.reset();
}

function initDepositSystem() {
    updatePendingBadge();
    renderDepositRequestsTable();
    renderAdminUsersTable();
}

function updatePendingBadge() {
    const badge = document.getElementById('pending-deposits-badge');
    if (!badge) return;
    const pending = getDepositRequests().filter(r => r.status === 'pending').length;
    if (pending > 0) {
        badge.innerText = pending;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function renderDepositRequestsTable() {
    const tbody = document.getElementById('deposit-requests-tbl-body');
    if (!tbody) return;
    const requests = getDepositRequests();

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">No deposit requests yet.</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(req => {
        let statusBadge, actionBtns;
        if (req.status === 'pending') {
            statusBadge = '<span style="background:rgba(245,158,11,0.15); color:#fbbf24; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700;">⏳ Pending</span>';
            actionBtns = isAdmin
                ? `<button onclick="approveDeposit('${req.id}')" style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); padding:5px 10px; border-radius:8px; cursor:pointer; font-size:11px; margin-right:4px;"><i class='fa-solid fa-check'></i> Accept</button><button onclick="rejectDeposit('${req.id}')" style="background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.3); padding:5px 10px; border-radius:8px; cursor:pointer; font-size:11px;"><i class='fa-solid fa-xmark'></i> Reject</button>`
                : '<span style="font-size:11px; color:var(--text-muted);">Awaiting Admin</span>';
        } else if (req.status === 'accepted') {
            statusBadge = '<span style="background:rgba(16,185,129,0.15); color:#34d399; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700;">✅ Accepted</span>';
            actionBtns = '<span style="font-size:11px; color:#34d399;">Balance Added</span>';
        } else {
            statusBadge = '<span style="background:rgba(239,68,68,0.15); color:#f87171; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700;">❌ Rejected</span>';
            actionBtns = '<span style="font-size:11px; color:#f87171;">Declined</span>';
        }
        return `<tr>
            <td style="font-family:var(--font-mono); font-size:12px;">${req.id}</td>
            <td style="color:#a78bfa; font-weight:600;">@${escapeHtml(req.username || 'Guest')}</td>
            <td style="font-weight:600;">${req.phone}</td>
            <td>${req.method}</td>
            <td style="color:#60a5fa; font-weight:700;">Rs. ${req.amount}</td>
            <td style="font-family:var(--font-mono); font-size:12px;">${req.trxId}</td>
            <td>${statusBadge}</td>
            <td>${actionBtns}</td>
        </tr>`;
    }).join('');
}

async function renderAdminUsersTable() {
    const tbody = document.getElementById('admin-users-tbl-body');
    if (!tbody) return;
    try {
        const res = await authRequest({ action: 'list_users' });
        const users = res.users || [];
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">No registered user accounts found.</td></tr>';
            return;
        }
        tbody.innerHTML = users.map(u => {
            const key = 'jannat_balance_' + (u.username || u.id || 'default');
            const bal = parseFloat(localStorage.getItem(key) || '0.00').toFixed(0);
            return `<tr>
                <td style="font-family:var(--font-mono); font-size:12px;">#${u.id}</td>
                <td style="color:#a78bfa; font-weight:700;">@${escapeHtml(u.username)}</td>
                <td style="font-weight:600;">${escapeHtml(u.name)}</td>
                <td style="color:var(--text-muted); font-size:12px;">${escapeHtml(u.email)}</td>
                <td style="font-size:12px;">${escapeHtml(u.created_at || 'N/A')}</td>
                <td style="color:#34d399; font-weight:700;">Rs. ${bal}</td>
            </tr>`;
        }).join('');
    } catch (err) {
        console.error('Failed to load admin users:', err);
        tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">Unable to load registered accounts.</td></tr>';
    }
}

function approveDeposit(reqId) {
    const requests = getDepositRequests();
    const req = requests.find(r => r.id === reqId);
    if (!req || req.status !== 'pending') return;
    req.status = 'accepted';
    req.approvedAt = new Date().toLocaleString('en-PK');
    saveDepositRequests(requests);

    // Auto add balance to user
    const targetUsername = req.username || (loggedInUser ? loggedInUser.username : null);
    if (targetUsername) {
        const key = 'jannat_balance_' + targetUsername;
        const current = parseFloat(localStorage.getItem(key) || '0.00');
        localStorage.setItem(key, (current + req.amount).toFixed(2));
    }
    updateBalanceDisplay();

    updatePendingBadge();
    renderDepositRequestsTable();
    renderAdminUsersTable();
    showToast(`✅ Rs. ${req.amount} accepted & credited to @${req.username || 'user'}!`);
}

function rejectDeposit(reqId) {
    const requests = getDepositRequests();
    const req = requests.find(r => r.id === reqId);
    if (!req || req.status !== 'pending') return;
    req.status = 'rejected';
    req.rejectedAt = new Date().toLocaleString('en-PK');
    saveDepositRequests(requests);
    updatePendingBadge();
    renderDepositRequestsTable();
    showToast(`❌ Deposit request ${req.id} from ${req.phone} rejected.`);
}

/* ====================================================
   ADMIN MODE — Toggle via secret PIN
   ==================================================== */
function toggleAdminUI() {
    const depositNav = document.querySelector('[data-page="deposit-approval"]');
    if (depositNav) {
        depositNav.style.display = isAdmin ? 'block' : 'none';
    }
    renderDepositRequestsTable();
}

function promptAdminLogin() {
    const pin = prompt('🔐 Enter Admin PIN to access Deposit & User Management Panel:');
    if (pin === ADMIN_PIN) {
        isAdmin = true;
        localStorage.setItem('jannat_admin_mode', 'true');
        toggleAdminUI();
        renderAdminUsersTable();
        showToast('🔓 Admin mode activated!');
        // Navigate to deposit-approval page
        document.querySelectorAll('.page-sec').forEach(s => s.classList.remove('active'));
        document.getElementById('page-deposit-approval')?.classList.add('active');
    } else if (pin !== null) {
        showToast('⚠️ Wrong PIN. Access denied.', 'error');
    }
}

function logoutAdmin() {
    isAdmin = false;
    localStorage.removeItem('jannat_admin_mode');
    toggleAdminUI();
    showToast('🔒 Admin mode deactivated.');
}

/* ====================================================
   MODALS
   ==================================================== */
function setupModals() {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    // Open Login Modal
    document.getElementById('open-login')?.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'flex';
    });

    // Open Register Modal
    document.getElementById('open-register')?.addEventListener('click', () => {
        const pendingRef = localStorage.getItem('jannat_pending_ref_code') || '';
        const refInp = document.getElementById('register-refcode');
        if (refInp && pendingRef) refInp.value = pendingRef;
        if (registerModal) registerModal.style.display = 'flex';
    });

    // Close Login Modal
    document.getElementById('close-login')?.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'none';
    });

    // Close Register Modal
    document.getElementById('close-register')?.addEventListener('click', () => {
        if (registerModal) registerModal.style.display = 'none';
    });

    // Switch: Login -> Register
    document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        const pendingRef = localStorage.getItem('jannat_pending_ref_code') || '';
        const refInp = document.getElementById('register-refcode');
        if (refInp && pendingRef) refInp.value = pendingRef;
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'flex';
    });

    // Switch: Register -> Login
    document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (registerModal) registerModal.style.display = 'none';
        if (loginModal) loginModal.style.display = 'flex';
    });

    // Click overlay background to close
    [loginModal, registerModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    // Login form submit
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const pass = document.getElementById('login-password')?.value;
        if (email && pass) {
            try {
                const result = await authRequest({ action: 'login', email, password: pass });
                doLogin(result.user);
                showToast('✅ Login successful! Welcome back.', 'info');
                if (loginModal) loginModal.style.display = 'none';
                e.target.reset();
            } catch (error) { showToast(`⚠️ ${error.message}`, 'error'); }
        }
    });

    // Register form submit
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name')?.value;
        const username = document.getElementById('register-username')?.value;
        const email = document.getElementById('register-email')?.value;
        const pass = document.getElementById('register-password')?.value;
        const refCode = document.getElementById('register-refcode')?.value || localStorage.getItem('jannat_pending_ref_code') || '';

        if (name && username && email && pass) {
            try {
                const result = await authRequest({ action: 'register', name, username, email, password: pass, ref_code: refCode });
                
                // Credit referral gift to referrer's account balance
                if (result.referral_reward_granted && result.referrer) {
                    const key = 'jannat_balance_' + result.referrer;
                    const currentBal = parseFloat(localStorage.getItem(key) || '0.00');
                    localStorage.setItem(key, (currentBal + 10).toFixed(2));
                }

                doLogin(result.user);
                localStorage.removeItem('jannat_pending_ref_code');
                showToast('🎉 Account created successfully! Welcome to Jannat OTP.', 'info');
                if (result.referral_reward_granted) {
                    showToast(`🎁 Rs. 10 Referral Gift credited to @${result.referrer}!`);
                }
                if (registerModal) registerModal.style.display = 'none';
                e.target.reset();
            } catch (error) { showToast(`⚠️ ${error.message}`, 'error'); }
        }
    });

}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}


/* ====================================================
   UTILITIES
   ==================================================== */
function copyText(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    const txt = el.innerText || el.value;
    navigator.clipboard.writeText(txt).catch(() => {
        // Fallback for file:// or insecure contexts
        const ta = document.createElement('textarea');
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    });
    showToast(msg);
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: ${type === 'error' ? '#ef4444' : '#2563eb'}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/* ====================================================
   STANDALONE TEMP MAIL ENGINE (Guerrilla Mail API Engine)
   ==================================================== */
let webappTempLogin = '';
let webappTempDomain = 'sharklasers.com';
let webappSidToken = '';
let webappSyncTimer = null;
let webappKnownIds = new Set();
let webappFetchedMailsMap = {};

function initWebappTempMail() {
    // Check if session token exists
    webappSidToken = localStorage.getItem('webapp_guerrilla_sid') || '';
    const savedLogin = localStorage.getItem('webapp_temp_login');
    const savedDomain = localStorage.getItem('webapp_temp_domain') || 'sharklasers.com';

    // Restore saved inbox messages
    try {
        const savedMails = JSON.parse(localStorage.getItem('webapp_inbox_messages') || '{}');
        if (savedMails && typeof savedMails === 'object') {
            webappFetchedMailsMap = savedMails;
        }
    } catch (e) { }

    if (webappSidToken && savedLogin) {
        webappTempLogin = savedLogin;
        webappTempDomain = savedDomain;
        updateTempEmailUI(`${webappTempLogin}@${webappTempDomain}`);
        renderWebappInboxList();
        checkWebappInbox(false);
    } else {
        initGuerrillaSession();
    }

    if (webappSyncTimer) clearInterval(webappSyncTimer);
    webappSyncTimer = setInterval(() => {
        checkWebappInbox(false);
    }, 5000);
}

async function fetchWithFallback(url) {
    // 1. Direct fetch
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data) return data;
        }
    } catch (e) {
        console.warn('Direct fetch failed, attempting proxy...', e);
    }

    // 2. AllOrigins raw proxy
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
        const res = await fetch(proxyUrl);
        if (res.ok) {
            const data = await res.json();
            if (data) return data;
        }
    } catch (e) {
        console.warn('Proxy 1 failed, attempting proxy 2...', e);
    }

    // 3. CorsProxy.io
    try {
        const proxyUrl2 = 'https://corsproxy.io/?' + encodeURIComponent(url);
        const res = await fetch(proxyUrl2);
        if (res.ok) {
            const data = await res.json();
            if (data) return data;
        }
    } catch (e) {
        console.warn('Proxy 2 failed...', e);
    }

    throw new Error('CORS fetch proxies failed');
}

function initGuerrillaSession() {
    const apiUrl = `https://api.guerrillamail.com/ajax.php?f=get_email_address`;

    fetchWithFallback(apiUrl)
        .then(res => {
            if (res && res.sid_token && res.email_addr) {
                webappSidToken = res.sid_token;
                localStorage.setItem('webapp_guerrilla_sid', webappSidToken);

                const parts = res.email_addr.split('@');
                webappTempLogin = parts[0];
                webappTempDomain = parts[1] || 'sharklasers.com';

                localStorage.setItem('webapp_temp_login', webappTempLogin);
                localStorage.setItem('webapp_temp_domain', webappTempDomain);

                updateTempEmailUI(res.email_addr);
                checkWebappInbox(true);
            }
        })
        .catch(err => {
            console.error('Guerrilla init error:', err);
            generateWebappRandomEmail();
        });
}

function updateTempEmailUI(fullEmail) {
    const displayEl = document.getElementById('webapp-temp-email-display');
    const userInp = document.getElementById('webapp-custom-user');
    const domSel = document.getElementById('webapp-custom-domain');

    if (displayEl) displayEl.value = fullEmail;
    if (userInp && webappTempLogin) userInp.value = webappTempLogin;
    if (domSel && webappTempDomain) domSel.value = webappTempDomain;
}

function generateRandomStr(len = 9) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    for (let i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
}

function generateWebappRandomEmail() {
    const randomUser = generateRandomStr(9);
    const selectedDomain = document.getElementById('webapp-custom-domain')?.value || 'sharklasers.com';
    setWebappCustomUserAndDomain(randomUser, selectedDomain);
}

function setWebappCustomEmail() {
    let customUser = document.getElementById('webapp-custom-user')?.value.trim();
    let selectedDomain = document.getElementById('webapp-custom-domain')?.value || 'sharklasers.com';

    if (!customUser) {
        customUser = generateRandomStr(9);
    } else {
        customUser = customUser.replace(/[^a-zA-Z0-9]/g, '');
    }

    setWebappCustomUserAndDomain(customUser, selectedDomain);
}

function setWebappCustomUserAndDomain(username, domain) {
    if (!webappSidToken) {
        initGuerrillaSession();
        return;
    }

    const apiUrl = `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(username)}&site=${encodeURIComponent(domain)}&sid_token=${encodeURIComponent(webappSidToken)}`;

    fetchWithFallback(apiUrl)
        .then(res => {
            if (res && res.email_addr) {
                const parts = res.email_addr.split('@');
                webappTempLogin = parts[0];
                webappTempDomain = parts[1] || domain;

                localStorage.setItem('webapp_temp_login', webappTempLogin);
                localStorage.setItem('webapp_temp_domain', webappTempDomain);

                // Reset inbox storage for new email address
                webappFetchedMailsMap = {};
                localStorage.setItem('webapp_inbox_messages', '{}');
                const pageOtpBanner = document.getElementById('webapp-page-otp-banner');
                if (pageOtpBanner) pageOtpBanner.style.display = 'none';

                webappKnownIds.clear();
                updateTempEmailUI(res.email_addr);
                checkWebappInbox(true);
                showToast(`✅ Active email: ${res.email_addr}`);
            }
        })
        .catch(err => {
            console.error('Guerrilla set error:', err);
            showToast('⚠️ Error setting email address', 'error');
        });
}

function copyWebappTempEmail() {
    copyText('webapp-temp-email-display', 'Temp Email copied to clipboard!');
}

function checkWebappInbox(isManual = false) {
    if (!webappSidToken) return;

    const syncIc = document.getElementById('webapp-sync-ic');
    if (syncIc) syncIc.classList.add('fa-spin');

    const apiUrl = `https://api.guerrillamail.com/ajax.php?f=check_email&seq=0&sid_token=${encodeURIComponent(webappSidToken)}`;

    fetchWithFallback(apiUrl)
        .then(data => {
            if (syncIc) syncIc.classList.remove('fa-spin');
            if (data && Array.isArray(data.list)) {
                data.list.forEach(msg => {
                    // Accumulate persistently in map
                    webappFetchedMailsMap[msg.mail_id] = msg;

                    // Auto-scan for OTP codes in subject or excerpt
                    const comboText = (msg.mail_subject || '') + ' ' + (msg.mail_excerpt || '');
                    const otpMatch = comboText.match(/\b\d{4,8}\b/);
                    if (otpMatch) {
                        const pageOtpBanner = document.getElementById('webapp-page-otp-banner');
                        const pageOtpVal = document.getElementById('webapp-page-otp-val');
                        const pageOtpSender = document.getElementById('webapp-page-otp-sender');

                        if (pageOtpBanner && pageOtpVal) {
                            pageOtpVal.innerText = otpMatch[0];
                            if (pageOtpSender) pageOtpSender.innerText = `From: ${msg.mail_from || 'Verification Service'} (${msg.mail_subject || ''})`;
                            pageOtpBanner.style.display = 'block';
                        }
                    }
                });
                // Persist in localStorage
                try {
                    localStorage.setItem('webapp_inbox_messages', JSON.stringify(webappFetchedMailsMap));
                } catch (e) { }
            }
            renderWebappInboxList();
            if (isManual) showToast('Inbox refreshed');
        })
        .catch(err => {
            console.error('Failed to fetch Guerrilla inbox:', err);
            if (syncIc) syncIc.classList.remove('fa-spin');
            if (isManual) showToast('⚠️ Connection error fetching inbox', 'error');
        });
}

function renderWebappInboxList() {
    const container = document.getElementById('webapp-inbox-list');
    const countBadge = document.getElementById('webapp-inbox-count');

    if (!container) return;

    // Get all accumulated messages
    const messages = Object.values(webappFetchedMailsMap).sort((a, b) => parseInt(b.mail_id) - parseInt(a.mail_id));

    if (countBadge) countBadge.innerText = messages.length;

    if (messages.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
                <i class="fa-regular fa-envelope-open" style="font-size: 38px; color: #64748b; margin-bottom: 12px;"></i>
                <h4 style="margin: 0 0 6px 0; color: #cbd5e1; font-weight: 600;">Inbox is empty</h4>
                <p style="font-size: 13px; margin: 0;">Waiting for incoming emails to <code>${webappTempLogin}@${webappTempDomain}</code>...</p>
            </div>
        `;
        return;
    }

    let html = '<div style="display: flex; flex-direction: column;">';

    messages.forEach(msg => {
        const msgId = msg.mail_id;
        const isNew = !webappKnownIds.has(msgId);
        webappKnownIds.add(msgId);

        const sender = msg.mail_from || 'System';
        const subject = msg.mail_subject || '(No Subject)';
        const date = msg.mail_date || '';

        html += `
            <div onclick="viewWebappEmail('${msgId}')" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; background: ${isNew ? 'rgba(168, 85, 247, 0.08)' : 'transparent'};" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='${isNew ? 'rgba(168, 85, 247, 0.08)' : 'transparent'}'">
                <div style="display: flex; align-items: center; gap: 14px; overflow: hidden; flex: 1;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #a855f7, #6366f1); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0; font-size: 14px;">
                        ${escapeWebappStr(sender.substring(0, 1).toUpperCase())}
                    </div>
                    <div style="overflow: hidden; flex: 1; padding-right: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-weight: 700; color: #fff; font-size: 13px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeWebappStr(sender)}</span>
                            ${isNew ? '<span style="background: #a855f7; color: #fff; font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 4px; text-transform: uppercase;">NEW</span>' : ''}
                        </div>
                        <div style="color: #cbd5e1; font-size: 12px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-top: 2px;">
                            ${escapeWebappStr(subject)}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
                    <span style="font-size: 11px; color: var(--text-muted);">${escapeWebappStr(date)}</span>
                    <button class="btn-sm" style="font-size: 11px; padding: 5px 10px;">
                        <i class="fa-solid fa-eye"></i> View Email
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function viewWebappEmail(msgId) {
    const modal = document.getElementById('webapp-email-modal');
    const bodyContainer = document.getElementById('webapp-modal-body');
    const subjectEl = document.getElementById('webapp-modal-subject');
    const fromEl = document.getElementById('webapp-modal-from');
    const dateEl = document.getElementById('webapp-modal-date');
    const otpBanner = document.getElementById('webapp-modal-otp-banner');
    const otpCodeEl = document.getElementById('webapp-modal-otp-code');

    if (!modal) return;
    modal.style.display = 'flex';
    bodyContainer.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: #a855f7;"></i><p>Loading email content...</p></div>';
    if (otpBanner) otpBanner.style.display = 'none';

    const apiUrl = `https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${encodeURIComponent(msgId)}&sid_token=${encodeURIComponent(webappSidToken)}`;

    fetchWithFallback(apiUrl)
        .then(email => {
            if (subjectEl) subjectEl.innerText = email.mail_subject || '(No Subject)';
            if (fromEl) fromEl.innerText = email.mail_from || '-';
            if (dateEl) dateEl.innerText = email.mail_date || '-';

            let bodyContent = email.mail_body || '<em>(Empty message body)</em>';
            bodyContainer.innerHTML = bodyContent;

            const fullText = (email.mail_subject + ' ' + (email.mail_excerpt || '') + ' ' + bodyContent).replace(/<[^>]*>?/gm, '');
            const otpMatch = fullText.match(/\b\d{4,8}\b/);
            if (otpMatch) {
                if (otpBanner && otpCodeEl) {
                    otpCodeEl.innerText = otpMatch[0];
                    otpBanner.style.display = 'block';
                }

                // Also update page banner
                const pageOtpBanner = document.getElementById('webapp-page-otp-banner');
                const pageOtpVal = document.getElementById('webapp-page-otp-val');
                const pageOtpSender = document.getElementById('webapp-page-otp-sender');

                if (pageOtpBanner && pageOtpVal) {
                    pageOtpVal.innerText = otpMatch[0];
                    if (pageOtpSender) pageOtpSender.innerText = `From: ${email.mail_from || 'Verification Service'} (${email.mail_subject || ''})`;
                    pageOtpBanner.style.display = 'block';
                }
            }
        })
        .catch(err => {
            console.error('Error fetching Guerrilla email details:', err);
            bodyContainer.innerHTML = '<p style="color: #ef4444;">Failed to load email message content.</p>';
        });
}

function clearWebappInboxHistory() {
    webappFetchedMailsMap = {};
    webappKnownIds.clear();
    localStorage.removeItem('webapp_inbox_messages');
    const pageOtpBanner = document.getElementById('webapp-page-otp-banner');
    if (pageOtpBanner) pageOtpBanner.style.display = 'none';
    renderWebappInboxList();
    showToast('Inbox history cleared');
}

function closeWebappEmailModal() {
    const modal = document.getElementById('webapp-email-modal');
    if (modal) modal.style.display = 'none';
}

function escapeWebappStr(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* ====================================================
   API DOCUMENTATION CODE TAB SWITCHER
   ==================================================== */
function switchDocTab(tab) {
    document.querySelectorAll('.doc-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'rgba(255,255,255,0.05)';
        btn.style.color = 'var(--text-muted)';
        btn.style.borderColor = 'rgba(255,255,255,0.1)';
    });
    document.querySelectorAll('.doc-code-block').forEach(blk => blk.style.display = 'none');

    const activeBtn = document.getElementById('doc-tab-' + tab);
    const activeBlock = document.getElementById('doc-code-' + tab);

    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = 'rgba(37,99,235,0.2)';
        activeBtn.style.color = '#60a5fa';
        activeBtn.style.borderColor = 'rgba(37,99,235,0.4)';
    }
    if (activeBlock) {
        activeBlock.style.display = 'block';
    }
}

/* ====================================================
   REFERRAL SYSTEM & INVITE MANAGEMENT
   ==================================================== */
function checkUrlReferralCode() {
    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref');
    if (!ref && window.location.hash.includes('ref=')) {
        const match = window.location.hash.match(/ref=([A-Za-z0-9_]+)/);
        if (match) ref = match[1];
    }
    if (ref && ref !== 'login_required' && ref !== 'guest') {
        localStorage.setItem('jannat_pending_ref_code', ref);
        const refInp = document.getElementById('register-refcode');
        if (refInp) refInp.value = ref;
    }
}

async function renderReferralUI() {
    const linkInput = document.getElementById('user-ref-link-input');
    const countEl = document.getElementById('ref-invited-count');
    const totalEl = document.getElementById('ref-earned-total');
    const tbody = document.getElementById('ref-history-tbl-body');

    if (!loggedInUser) {
        if (linkInput) linkInput.value = window.location.origin + window.location.pathname + '?ref=login_required';
        if (countEl) countEl.innerText = '0';
        if (totalEl) totalEl.innerText = 'Rs. 0';
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Please Login to view your unique referral link and earnings.</td></tr>';
        return;
    }

    const refUrl = window.location.origin + window.location.pathname + '?ref=' + loggedInUser.username;
    if (linkInput) linkInput.value = refUrl;

    try {
        const res = await authRequest({ action: 'get_referrals', username: loggedInUser.username });
        const list = res.referrals || [];
        if (countEl) countEl.innerText = list.length;
        if (totalEl) totalEl.innerText = 'Rs. ' + (list.length * 10);

        if (!tbody) return;
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">No referrals yet. Share your referral link to earn Rs. 10 per signup!</td></tr>';
            return;
        }

        tbody.innerHTML = list.map(r => `<tr>
            <td style="font-family:var(--font-mono); font-size:12px;">${r.id}</td>
            <td style="color:#a78bfa; font-weight:600;">@${escapeHtml(r.referred_username)}</td>
            <td style="font-weight:600;">${escapeHtml(r.referred_name)}</td>
            <td style="font-size:12px;">${escapeHtml(r.timestamp)}</td>
            <td style="color:#34d399; font-weight:700;">+ Rs. 10</td>
        </tr>`).join('');
    } catch (e) {
        console.error('Failed to load referral stats:', e);
    }
}

function shareRefOnWhatsApp() {
    const link = document.getElementById('user-ref-link-input')?.value;
    if (!link || link.includes('login_required')) {
        showToast('⚠️ Please Login first to get your unique referral link!', 'error');
        return;
    }
    const msg = `Hey! Join Jannat OTP Virtual Number Platform and get instant SMS OTPs! Create your account here: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}
