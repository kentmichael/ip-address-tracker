/*
  On the initial page load, the user will see their own IP
  address on the map. The user can also search for any IP 
  addresses or domains and see the key information and location.
*/
class Map{
  constructor(formIP, inputIP, proceedBtn){
    this.formIP = formIP;
    this.inputIP = inputIP;
    this.proceedBtn = proceedBtn;

    formIP.addEventListener('submit', e => {e.preventDefault()});
    proceedBtn.addEventListener('click', this.searchIP);
  }

  searchIP = () => {
    const inputInvalid = document.querySelector('#input-ip');
    const ip = /\d+.\d+.\d+.\d+/;
    let param = '';
    if(this.inputIP.value){
      param = ip.test(this.inputIP.value) ? 
      `&ipAddress=${this.inputIP.value}` : 
      `&domain=${this.inputIP.value}`;
    }
    
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_qDLKzQBDXrbfWr20zJqbFAP2elzlr${param}`)
    .then(response => {
      if(!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(data => {
      this.displayMap(data);
      inputInvalid.style.outline = "2px solid lightblue";
    })
    .catch(err => {
      inputInvalid.style.outline = "2px solid hotpink";
      console.error(err);
    });
  }

  displayMap = ({ip, location, isp}) => {
    const {region, city, lat, lng, timezone} = location;
    const ipAddress = document.querySelector('#ip-address');
    const ipLocation = document.querySelector('#ip-location');
    const ipTimezone = document.querySelector('#ip-timezone');
    const ipISP = document.querySelector('#ip-isp');
    ipAddress.innerText = ip;
    ipLocation.innerText = `${region}, ${city}`;
    ipTimezone.innerText = `UTC${timezone}`;
    ipISP.innerText = isp;
    this.searchInMap(lat, lng);
    if(!this.inputIP.value) this.inputIP.value = ip;
  }

  searchInMap = (lat, lng) => {
    const main = document.querySelector('main');
    const oldExistingMap = document.querySelector('#map');
    const newDivMap = document.createElement('div');
    oldExistingMap.remove();
    newDivMap.setAttribute('id', 'map');
    main.appendChild(newDivMap);

    let map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoia2VudG1pY2hhZWwiLCJhIjoiY2wxYXFrNzYwMDBpMjNrcG03NmZibG1oaCJ9._XlkoT35F9vnidHeLvH4oQ'
    }).addTo(map);

    const myIcon = L.icon({
      iconUrl: '../images/icon-location.svg',
      iconSize: [25, 35],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });
    
    L.marker([lat, lng], {icon: myIcon}).addTo(map);
  }
}

const formIP = document.querySelector('.input-container');
const inputIP = document.querySelector('#input-ip');
const proceedBtn = document.querySelector('#proceed-ip');
const displayDefault = new Map(formIP, inputIP, proceedBtn);

displayDefault.searchIP();