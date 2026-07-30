const countryFlags = {
    "1": { name: "United States / Canada", flag: "🇺🇸" },
    "7": { name: "Russia / Kazakhstan", flag: "🇷🇺" },
    "20": { name: "Egypt", flag: "🇪🇬" },
    "27": { name: "South Africa", flag: "🇿🇦" },
    "30": { name: "Greece", flag: "🇬🇷" },
    "31": { name: "Netherlands", flag: "🇳🇱" },
    "32": { name: "Belgium", flag: "🇧🇪" },
    "33": { name: "France", flag: "🇫🇷" },
    "34": { name: "Spain", flag: "🇪🇸" },
    "36": { name: "Hungary", flag: "🇭🇺" },
    "39": { name: "Italy", flag: "🇮🇹" },
    "40": { name: "Romania", flag: "🇷🇴" },
    "41": { name: "Switzerland", flag: "🇨🇭" },
    "43": { name: "Austria", flag: "🇦🇹" },
    "44": { name: "United Kingdom", flag: "🇬🇧" },
    "45": { name: "Denmark", flag: "🇩🇰" },
    "46": { name: "Sweden", flag: "🇸🇪" },
    "47": { name: "Norway", flag: "🇳🇴" },
    "48": { name: "Poland", flag: "🇵🇱" },
    "49": { name: "Germany", flag: "🇩🇪" },
    "51": { name: "Peru", flag: "🇵🇪" },
    "52": { name: "Mexico", flag: "🇲🇽" },
    "54": { name: "Argentina", flag: "🇦🇷" },
    "55": { name: "Brazil", flag: "🇧🇷" },
    "56": { name: "Chile", flag: "🇨🇱" },
    "57": { name: "Colombia", flag: "🇨🇴" },
    "58": { name: "Venezuela", flag: "🇻🇪" },
    "60": { name: "Malaysia", flag: "🇲🇾" },
    "61": { name: "Australia", flag: "🇦🇺" },
    "62": { name: "Indonesia", flag: "🇮🇩" },
    "63": { name: "Philippines", flag: "🇵🇭" },
    "64": { name: "New Zealand", flag: "🇳🇿" },
    "65": { name: "Singapore", flag: "🇸🇬" },
    "66": { name: "Thailand", flag: "🇹🇭" },
    "81": { name: "Japan", flag: "🇯🇵" },
    "82": { name: "South Korea", flag: "🇰🇷" },
    "84": { name: "Vietnam", flag: "🇻🇳" },
    "86": { name: "China", flag: "🇨🇳" },
    "90": { name: "Turkey", flag: "🇹🇷" },
    "91": { name: "India", flag: "🇮🇳" },
    "92": { name: "Pakistan", flag: "🇵🇰" },
    "93": { name: "Afghanistan", flag: "🇦🇫" },
    "94": { name: "Sri Lanka", flag: "🇱🇰" },
    "95": { name: "Myanmar", flag: "🇲🇲" },
    "98": { name: "Iran", flag: "🇮🇷" },
    "212": { name: "Morocco", flag: "🇲🇦" },
    "213": { name: "Algeria", flag: "🇩🇿" },
    "216": { name: "Tunisia", flag: "🇹🇳" },
    "218": { name: "Libya", flag: "🇱🇾" },
    "220": { name: "Gambia", flag: "🇬🇲" },
    "233": { name: "Ghana", flag: "🇬🇭" },
    "234": { name: "Nigeria", flag: "🇳🇬" },
    "254": { name: "Kenya", flag: "🇰🇪" },
    "255": { name: "Tanzania", flag: "🇹🇿" },
    "256": { name: "Uganda", flag: "🇺🇬" },
    "260": { name: "Zambia", flag: "🇿🇲" },
    "263": { name: "Zimbabwe", flag: "🇿🇼" },
    "351": { name: "Portugal", flag: "🇵🇹" },
    "352": { name: "Luxembourg", flag: "🇱🇺" },
    "353": { name: "Ireland", flag: "🇮🇪" },
    "354": { name: "Iceland", flag: "🇮🇸" },
    "355": { name: "Albania", flag: "🇦🇱" },
    "358": { name: "Finland", flag: "🇫🇮" },
    "370": { name: "Lithuania", flag: "🇱🇹" },
    "371": { name: "Latvia", flag: "🇱🇻" },
    "372": { name: "Estonia", flag: "🇪🇪" },
    "380": { name: "Ukraine", flag: "🇺🇦" },
    "381": { name: "Serbia", flag: "🇷🇸" },
    "385": { name: "Croatia", flag: "🇭🇷" },
    "420": { name: "Czech Republic", flag: "🇨🇿" },
    "421": { name: "Slovakia", flag: "🇸🇰" },
    "502": { name: "Guatemala", flag: "🇬🇹" },
    "503": { name: "El Salvador", flag: "🇸🇻" },
    "504": { name: "Honduras", flag: "🇭🇳" },
    "505": { name: "Nicaragua", flag: "🇳🇮" },
    "506": { name: "Costa Rica", flag: "🇨🇷" },
    "507": { name: "Panama", flag: "🇵🇦" },
    "593": { name: "Ecuador", flag: "🇪🇨" },
    "595": { name: "Paraguay", flag: "🇵🇾" },
    "598": { name: "Uruguay", flag: "🇺🇾" },
    "852": { name: "Hong Kong", flag: "🇭🇰" },
    "855": { name: "Cambodia", flag: "🇰🇭" },
    "880": { name: "Bangladesh", flag: "🇧🇩" },
    "886": { name: "Taiwan", flag: "🇹🇼" },
    "960": { name: "Maldives", flag: "🇲🇻" },
    "961": { name: "Lebanon", flag: "🇱🇧" },
    "962": { name: "Jordan", flag: "🇯🇴" },
    "963": { name: "Syria", flag: "🇸🇾" },
    "964": { name: "Iraq", flag: "🇮🇶" },
    "965": { name: "Kuwait", flag: "🇰🇼" },
    "966": { name: "Saudi Arabia", flag: "🇸🇦" },
    "967": { name: "Yemen", flag: "🇾🇪" },
    "968": { name: "Oman", flag: "🇴🇲" },
    "971": { name: "United Arab Emirates", flag: "🇦🇪" },
    "972": { name: "Israel", flag: "🇮🇱" },
    "973": { name: "Bahrain", flag: "🇧🇭" },
    "974": { name: "Qatar", flag: "🇶🇦" },
    "975": { name: "Bhutan", flag: "🇧🇹" },
    "976": { name: "Mongolia", flag: "🇲🇳" },
    "977": { name: "Nepal", flag: "🇳🇵" },
    "992": { name: "Tajikistan", flag: "🇹🇯" },
    "993": { name: "Turkmenistan", flag: "🇹🇲" },
    "994": { name: "Azerbaijan", flag: "🇦🇿" },
    "995": { name: "Georgia", flag: "🇬🇪" },
    "996": { name: "Kyrgyzstan", flag: "🇰🇬" },
    "998": { name: "Uzbekistan", flag: "🇺🇿" }
};

function getCountryFromPhone(phone) {
    if (!phone) return null;
    
    // Strip everything except digits
    let clean = phone.replace(/\D/g, "");
    
    // In India, domestic mobile numbers starting with '0' are common
    if (clean.startsWith("0") && clean.length === 11) {
        return { name: "India", flag: "🇮🇳" };
    }
    
    // Check lengths 4, 3, 2, 1
    for (let len = 4; len >= 1; len--) {
        if (clean.length >= len) {
            let prefix = clean.substring(0, len);
            if (countryFlags[prefix]) {
                return countryFlags[prefix];
            }
        }
    }
    
    return null;
}

// Export for Node if module environment, else make it global for browser EJS scripts
if (typeof module !== "undefined" && module.exports) {
    module.exports = { countryFlags, getCountryFromPhone };
} else {
    window.countryFlags = countryFlags;
    window.getCountryFromPhone = getCountryFromPhone;
}
