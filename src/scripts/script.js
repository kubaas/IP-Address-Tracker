const API_KEY = 'at_X9jH5DZGpX7HsGe7WV5PAlsVTNcov';
const GEOLOCATION_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
const GEOLOCATION_WITH_IP_URL = `${GEOLOCATION_URL}&ipAddress=`;

const IP_REGEXP = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

const button = document.querySelector('.search-panel__button');
const form = document.querySelector('.search-panel__form');
const ipAddress = document.getElementById('ip-address');
const region = document.getElementById('location');
const timezone = document.getElementById('timezone');
const isp = document.getElementById('isp');

const map = L.map('map');
const marker = L.marker([0, 0]).addTo(map);

/** Event listeners */
button.addEventListener('click', event => onSearchLocation(event));
form.addEventListener('submit', event => onSearchLocation(event));

/** Main logic */
getLocation().then((result) => showIpAddress(result));
getCurrentPosition();

function showIpAddress(result) {
  ipAddress.innerHTML = result.ip;
  region.innerHTML = result.location.city + ', ' + result.location.country + ' ' + result.location.postalCode;
  timezone.innerHTML = 'UTC ' + result.location.timezone;
  isp.innerHTML = result.isp;
}

function getCurrentPosition() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    setMapNewLocation(latitude, longitude, true);
  });
}

function onSearchLocation(event) {
  event.preventDefault();
  const ip = document.querySelector('.search-panel__input').value;

  if (!ip) return;
  if(!IP_REGEXP.test(ip)) { alert('Invalid IP address!'); return; }

  getLocation(ip).then((result) => {
    showIpAddress(result);
    setMapNewLocation(result.location.lat, result.location.lng);
  });
}

/** Geolocation API results */
function getLocation(ipAddress) {
  return fetch(ipAddress ? (GEOLOCATION_WITH_IP_URL + ipAddress) : GEOLOCATION_URL, { method: 'GET' })
    .then((result) => result.json());
}

/** Leafletjs map */
function setMapNewLocation(latitude, longitude, shouldShowPopup) {
  const center = [latitude, longitude];
  map.setView(center, 14);
  marker.setLatLng(center);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  showOrHidePopup(shouldShowPopup)
}

function showOrHidePopup(shouldShowPopup) {
  shouldShowPopup ? marker.bindPopup(`<b>Here you are!</b>`).openPopup() : map.closePopup();
}
