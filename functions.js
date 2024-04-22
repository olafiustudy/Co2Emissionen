// JavaScript-Funktionen
// Beispiel für die Interaktion mit der Karte (mithilfe von Dummy-Daten)
const companyData = {
    "Deutschland": [
        { name: "Volkswagen", emissions: 5000 },
        { name: "BASF", emissions: 7000 },
        { name: "Siemens", emissions: 3000 },
        { name: "Daimler", emissions: 6000 },
        { name: "BMW", emissions: 4000 }
    ],
    "Frankreich": [
        { name: "Total SE", emissions: 8000 },
        { name: "Renault", emissions: 9000 },
        { name: "EDF", emissions: 6000 }
    ],
    "Vereinigte Staaten": [
        { name: "ExxonMobil", emissions: 10000 },
        { name: "Apple", emissions: 4000 },
        { name: "Microsoft", emissions: 7000 },
        { name: "Google", emissions: 6000 }
    ],
    "China": [
        { name: "PetroChina", emissions: 11000 },
        { name: "Sinopec", emissions: 12000 },
        { name: "Bank of China", emissions: 5000 }
    ],
    "Brasilien": [
        { name: "Petrobras", emissions: 8000 },
        { name: "Vale", emissions: 6000 },
        { name: "JBS", emissions: 3000 }
    ],
    "Indien": [
        { name: "Reliance Industries", emissions: 8000 },
        { name: "Tata Group", emissions: 5000 },
        { name: "Coal India", emissions: 3000 }
    ],
    "Russland": [
        { name: "Gazprom", emissions: 10000 },
        { name: "Lukoil", emissions: 8000 },
        { name: "Rosneft", emissions: 7000 },
        { name: "Sberbank", emissions: 3000 }
    ],
    "Japan": [
        { name: "Toyota", emissions: 6000 },
        { name: "Sony", emissions: 5000 },
        { name: "Honda", emissions: 4000 },
        { name: "Nissan", emissions: 3000 }
    ],
    // Weitere Länder und Unternehmen hinzufügen ...
};

// Länder mit ihren Koordinaten
const countries = {
    "Deutschland": [51.1657, 10.4515],
    "Frankreich": [46.6034, 1.8883],
    "Vereinigte Staaten": [37.0902, -95.7129],
    "China": [35.8617, 104.1954],
    "Brasilien": [-14.2350, -51.9253],
    "Indien": [20.5937, 78.9629],
    "Russland": [61.5240, 105.3188],
    "Japan": [36.2048, 138.2529],
    // Weitere Länder hinzufügen ...
};

// Aktuell ausgewähltes Land
let currentCountry = null;

// Initialisiere Leaflet Karte
var map = L.map('map').setView([20, 0], 2);

// Füge OpenStreetMap Kacheln hinzu
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Füge Marker für jedes Land hinzu
Object.entries(countries).forEach(([country, coordinates]) => {
    L.marker(coordinates).addTo(map)
        .bindPopup(country)
        .on('click', function(e) {
            updateTable(country);
        });
});

// Funktionalität für Klick auf einen Marker
const tableBody = document.querySelector('#company-table tbody');

function updateTable(country) {
    currentCountry = country; // Aktuelles Land aktualisieren
    tableBody.innerHTML = ""; // Tabelle leeren

    const companies = companyData[country];
    if (companies) {
        companies.forEach(company => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${company.name}</td>
                <td>${company.emissions}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    // DataTables initialisieren
    $('#company-table').DataTable();
}

// JavaScript für das Menü
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', function() {
    menu.classList.toggle('active');
});

// JavaScript für die Positionierung des Menüs basierend auf der Leserichtung
const direction = getComputedStyle(document.body).direction; // Leserichtung der Webseite
if (direction === 'rtl') { // Wenn von rechts nach links gelesen wird
    menu.style.right = '20px'; // Menü rechts ausrichten
    menu.style.left = 'auto'; // linke Position auf automatisch setzen
} else { // Wenn von links nach rechts gelesen wird
    menu.style.left = '20px'; // Menü links ausrichten
    menu.style.right = 'auto'; // rechte Position auf automatisch setzen
}

// Funktion zum Sortieren der Tabelle
function sortTable(columnIndex) {
    const table = $('#company-table').DataTable();
    // Filtern der Daten für das aktuelle Land
    const companies = companyData[currentCountry];
    if (companies) {
        // Aufbau eines Arrays mit den Unternehmensnamen und Emissionen
        const data = companies.map(company => [company.name, company.emissions]);
        // Sortieren des Arrays basierend auf dem ausgewählten Spaltenindex
        data.sort((a, b) => {
            // 'a' und 'b' sind Arrays mit Unternehmensdaten [name, emissions]
            return a[columnIndex] - b[columnIndex];
        });
        // Leeren der Tabelle
        table.clear();
        // Hinzufügen der sortierten Daten zur Tabelle
        data.forEach(row => {
            table.row.add(row);
        });
        // Neu zeichnen der Tabelle
        table.draw();
    }
}