
const coordinates = listingCoordinates;

// --- MapTiler config ---
maptilersdk.config.apiKey = MAPTILER_API_KEY;

// --- Normalize coordinates ---
let coordsArray;

if (Array.isArray(coordinates) && coordinates.length >= 2) {
  coordsArray = coordinates;
} else if (coordinates && Array.isArray(coordinates.coordinates)) {
  coordsArray = coordinates.coordinates;
} else if (coordinates && typeof coordinates.lng === "number" && typeof coordinates.lat === "number") {
  coordsArray = [coordinates.lng, coordinates.lat];
} else if (coordinates && typeof coordinates.lon === "number" && typeof coordinates.lat === "number") {
  coordsArray = [coordinates.lon, coordinates.lat];
} else {
  console.error("⚠️ Invalid coordinates:", coordinates);
  coordsArray = [77.2088, 28.6139]; // fallback (Delhi)
}

// --- Map render ---
const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordsArray,
  zoom: 10,
});

// --- Popup ---
const popup = new maptilersdk.Popup({ offset: 25 })
  .setHTML(`
    <div style="text-align:center; line-height:1.3; background:white; padding:8px 10px; border-radius:8px; box-shadow:0 1px 4px rgba(0,0,0,0.2);">
      <h1 style="margin:0; font-size:18px; font-weight:600; color:#222;">${listingTitle}</h1>
      <h4 style="margin:4px 0 6px; font-size:14px; font-weight:500; color:#444;">${listingLocation}</h4>
      <p style="margin:0; font-size:12px; color:#777;">Exact location provided after booking</p>
    </div>
  `);

// --- Marker ---
new maptilersdk.Marker({ color: "red" })
  .setLngLat(coordsArray)
  .setPopup(popup)
  .addTo(map);



