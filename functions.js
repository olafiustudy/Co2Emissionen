// Dummy-Daten für die Unternehmen inkl. Emissionen erzeugen
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
};

// Dummy Daten für Länder inkl. Koordinaten erzeugen zur Darstellung des PINs auf der Karte 
const countries = {
    "Deutschland": [51, 10],
    "Frankreich": [46, 2],
    "Vereinigte Staaten": [37, -96],
    "China": [35, 104],
    "Brasilien": [-14, -52],
    "Indien": [21, 79],
    "Russland": [62, 105],
    "Japan": [36, 138],
};

// Aktuell ausgewähltes Land speichern 
let currentCountry = null;

// Initialisiere interaktiven Leaflet Karte
var map = L.map('map').setView([20, 0], 2);

// Füge OpenStreetMap Kacheln hinzu, die als Hintergrund für Leatlet dient 
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

    // Tabelle mit Unternehmensinformation füllen 
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
            return a[columnIndex] - b[columnIndex];
        });

        table.clear();
        // Sortierte Daten der Tabelle hinzufügen 
        data.forEach(row => {
            table.row.add(row);
        });
        // Neu zeichnen der Tabelle
        table.draw();
    }
}

// Öffnen des Menüs 
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', function() {
    menu.classList.toggle('active');
});

// Positionierung des Menüs basierend auf der Leserichtung
const direction = getComputedStyle(document.body).direction; // Leserichtung der Webseite ermitteln
if (direction === 'rtl') { // Leserichtung rechts nach links - Menü rechts ausrichten
    menu.style.right = '20px'; 
} else { // Leserichtung links nach rechts - Menü links ausrichten
    menu.style.left = '20px'; 
}