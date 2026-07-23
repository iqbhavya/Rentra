
const map = L.map('map', {
    scrollWheelZoom: false
}).setView([coordinates[1], coordinates[0]], 11);


L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);


map.on('click', () => {
    if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
    } else {
        map.scrollWheelZoom.enable();
    }
});


const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);


marker.bindPopup(`
    <div class="map-popup-card" style="font-family: 'Plus Jakarta Sans', sans-serif;">
        <h6 style="margin: 0 0 4px 0; font-size: 0.95rem; font-weight: 700; color: #ff385c;">${listingTitle}</h6>
        <p style="margin: 0; font-size: 0.8rem; color: #717171; line-height: 1.3;">Exact location will be provided after reservation confirmation.</p>
    </div>
`, {
    closeButton: false,
    offset: L.point(0, -10)
}).openPopup();
