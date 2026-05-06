// ==================== UTILITY FUNCTIONS (OWASP Compliant) ====================
const isAllowedDomain = (url) => {
    try {
        const hostname = new URL(url).hostname;
        return ALLOWED_API_DOMAINS.includes(hostname);
    } catch {
        return false;
    }
};

const sanitizeSearchQuery = (input) => {
    return input.replace(/[<>"&]/g, '').trim().slice(0, 100);
};

const safeStorage = {
    get: (key) => {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set: (key, value) => {
        try { localStorage.setItem(key, value); } catch { }
    },
    getJSON: (key, fallback) => {
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
    },
    setJSON: (key, value) => {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
    },
};

const getRatingColor = (rating) => {
    if (rating >= RATING_THRESHOLDS.EXCELLENT) return 'green';
    if (rating >= RATING_THRESHOLDS.GOOD) return 'yellow';
    return 'red';
};

const getRestaurantImage = (restaurant) => {
    const keyword = CUISINE_KEYWORDS[restaurant.cuisines[0]] || CUISINE_KEYWORDS['default'];
    return 'https://source.unsplash.com/600x400/?restaurant,' + keyword + '&sig=' + restaurant.id;
};

const getCityImage = (cityName) => {
    return 'https://source.unsplash.com/600x400/?city,' + cityName.toLowerCase() + ',india&sig=' + cityName;
};
