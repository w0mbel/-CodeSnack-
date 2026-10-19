document.addEventListener('DOMContentLoaded', function() {
    
    // --- TAB STEUERUNG ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Aktive Klasse entfernen
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Neue aktive Klasse setzen
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- SLIDER STEUERUNG ---
    const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    // Automatischer Wechsel alle 5 Sekunden
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);

    // Klick auf Punkte
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });


    // --- DATEN LADEN & KARTEN RENDERN ---
    const container = document.getElementById('data-container');
    const searchInput = document.getElementById('searchInput');
    let allData = [];

    function loadData() {
        fetch('stalker_data.json')
            .then(response => response.json())
            .then(data => {
                allData = data;
                render(allData);
            })
            .catch(error => {
                container.innerHTML = '<p style="color:red;">Fehler beim Laden der Daten. Prüfe die Konsole (F12).</p>';
                console.error(error);
            });
    }

    function render(data) {
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888;">Keine Ergebnisse gefunden.</p>';
            return;
        }
        
        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // URL Zeile mit Copy Button
            let urlHtml = `
                <div class="url-row">
                    <span class="portal-url">${item.url}</span>
                    <button class="btn-copy" onclick="copyText('${item.url}', this)">URL Kopieren</button>
                </div>
            `;

            // MACs verarbeiten (max 4 anzeigen)
            let macsArray = item.macs || [];
            let visibleMacs = macsArray.slice(0, 4);
            let hiddenMacs = macsArray.slice(4);

            let macsHtml = '<div class="mac-grid">';
            visibleMacs.forEach(mac => {
                macsHtml += `
                    <div class="mac-item">
                        <span>${mac}</span>
                        <button class="btn-copy" onclick="copyText('${mac}', this)">Kopieren</button>
                    </div>
                `;
            });
            macsHtml += '</div>';

            // Wenn mehr als 4 MACs, ausklappbaren Bereich bauen
            if (hiddenMacs.length > 0) {
                let hiddenMacsHtml = '<div class="mac-grid hidden-macs" id="hidden-macs-' + index + '">';
                hiddenMacs.forEach(mac => {
                    hiddenMacsHtml += `
                        <div class="mac-item">
                            <span>${mac}</span>
                            <button class="btn-copy" onclick="copyText('${mac}', this)">Kopieren</button>
                        </div>
                    `;
                });
                hiddenMacsHtml += '</div>';
                
                macsHtml += hiddenMacsHtml;
                macsHtml += `<button class="btn-show-more" onclick="toggleMacs(${index}, this)">+ ${hiddenMacs.length} weitere MACs anzeigen</button>`;
            }

            // Zusammensetzen
            card.innerHTML = `
                <div class="card-header">• DAILY UPDATES • CodeSnack •</div>
                ${urlHtml}
                ${macsHtml}
            `;
            
            container.appendChild(card);
        });
    }

    // Suche
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(item => item.url.toLowerCase().includes(term));
        render(filtered);
    });

    loadData();
});

// Copy Funktion
function copyText(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = 'Kopiert!';
        setTimeout(() => { btnElement.textContent = originalText; }, 2000);
    });
}

// Ausklapp-Funktion für MACs
function toggleMacs(index, btnElement) {
    const hiddenDiv = document.getElementById('hidden-macs-' + index);
    if (hiddenDiv.classList.contains('show')) {
        hiddenDiv.classList.remove('show');
        btnElement.textContent = `+ weitere MACs anzeigen`;
    } else {
        hiddenDiv.classList.add('show');
        btnElement.textContent = `- Weniger anzeigen`;
    }
}
