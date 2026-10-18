document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const searchInput = document.getElementById('searchInput');
    let allData = [];

    // Daten aus der JSON-Datei laden
    async function loadData() {
        try {
            const response = await fetch('stalker_data.json');
            if (!response.ok) throw new Error('Netzwerkantwort war nicht ok');
            allData = await response.json();
            renderCards(allData);
        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
            dataContainer.innerHTML = '<p class="no-results">Fehler beim Laden der Daten. Bitte versuche es später erneut.</p>';
        }
    }

    // Karten im DOM rendern
    function renderCards(data) {
        dataContainer.innerHTML = '';
        if (data.length === 0) {
            dataContainer.innerHTML = '<p class="no-results">Keine Ergebnisse gefunden.</p>';
            return;
        }

        data.forEach(entry => {
            const card = document.createElement('div');
            card.className = 'card';

            // Portal-URL
            const urlDiv = document.createElement('div');
            urlDiv.className = 'portal-url';
            urlDiv.textContent = entry.url;

            // MAC-Liste
            const macListDiv = document.createElement('div');
            macListDiv.className = 'mac-list';

            entry.macs.forEach(mac => {
                const macItem = document.createElement('div');
                macItem.className = 'mac-item';

                const macSpan = document.createElement('span');
                macSpan.textContent = mac;

                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.textContent = 'Kopieren';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(mac).then(() => {
                        copyBtn.textContent = 'Kopiert!';
                        setTimeout(() => { copyBtn.textContent = 'Kopieren'; }, 2000);
                    });
                };

                macItem.appendChild(macSpan);
                macItem.appendChild(copyBtn);
                macListDiv.appendChild(macItem);
            });

            // Status (optional)
            const statusDiv = document.createElement('div');
            statusDiv.className = 'status';
            statusDiv.textContent = entry.status || '';

            card.appendChild(urlDiv);
            card.appendChild(macListDiv);
            card.appendChild(statusDiv);
            dataContainer.appendChild(card);
        });
    }

    // Filterfunktion
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = allData.filter(entry =>
            entry.url.toLowerCase().includes(searchTerm)
        );
        renderCards(filteredData);
    });

    loadData();
});
