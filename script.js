document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('data-container');
    const searchInput = document.getElementById('searchInput');
    const sourceFilter = document.getElementById('sourceFilter');
    let allData = [];

    function loadData() {
        fetch('stalker_data.json')
            .then(response => response.json())
            .then(data => {
                allData = data;
                
                const sources = new Set();
                allData.forEach(function(item) {
                    if (item.quellen && item.quellen.length > 0) {
                        sources.add(item.quellen[0].details);
                    }
                });
                
                sources.forEach(function(s) {
                    const opt = document.createElement('option');
                    opt.value = s;
                    opt.textContent = s;
                    sourceFilter.appendChild(opt);
                });

                render(allData);
            })
            .catch(function(error) {
                container.innerHTML = '<p style="color:red;">Fehler beim Laden der Daten. Prüfe die Konsole (F12).</p>';
                console.error(error);
            });
    }

    function render(data) {
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p style="color:#8b949e;">Keine Ergebnisse gefunden.</p>';
            return;
        }
        
        data.forEach(function(item) {
            const card = document.createElement('div');
            card.className = 'card';
            
            let macsHtml = '';
            if (item.macs && item.macs.length > 0) {
                item.macs.forEach(function(mac) {
                    macsHtml += '<div class="mac-item">';
                    macsHtml += '<span>' + mac + '</span>';
                    macsHtml += '<button class="copy-btn" onclick="copyMac(\'' + mac + '\', this)">Kopieren</button>';
                    macsHtml += '</div>';
                });
            } else {
                macsHtml = '<p style="color:#8b949e; font-size:0.8rem;">Keine MACs hinterlegt</p>';
            }

            const sourceText = (item.quellen && item.quellen.length > 0) ? item.quellen[0].details : 'Unbekannt';
            const statusText = item.status || 'Unbekannt';

            card.innerHTML = '<div class="portal-url">' + item.url + '</div>' +
                             '<div class="mac-list">' + macsHtml + '</div>' +
                             '<div class="status">Status: ' + statusText + '</div>' +
                             '<div class="status">Quelle: ' + sourceText + '</div>';
                             
            container.appendChild(card);
        });
    }

    function filterData() {
        const term = searchInput.value.toLowerCase();
        const src = sourceFilter.value;
        
        const filtered = allData.filter(function(item) {
            const matchTerm = item.url.toLowerCase().includes(term);
            const itemSource = (item.quellen && item.quellen.length > 0) ? item.quellen[0].details : '';
            const matchSrc = src === '' || itemSource === src;
            return matchTerm && matchSrc;
        });
        
        render(filtered);
    }

    searchInput.addEventListener('input', filterData);
    sourceFilter.addEventListener('change', filterData);
    
    loadData();
});

function copyMac(mac, btnElement) {
    navigator.clipboard.writeText(mac).then(function() {
        const originalText = btnElement.textContent;
        btnElement.textContent = 'Kopiert!';
        setTimeout(function() { btnElement.textContent = originalText; }, 2000);
    });
}
