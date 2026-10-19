document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('data-container');
    const searchInput = document.getElementById('searchInput');
    const sourceFilter = document.getElementById('sourceFilter');
    let allData = [];

    async function loadData() {
        try {
            const resp = await fetch('stalker_data.json');
            allData = await resp.json();
            
            // Quellen filtern
            const sources = new Set();
            allData.forEach(item => {
                if(item.quellen && item.quellen.length > 0) sources.add(item.quellen[0].details);
            });
            sources.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s; opt.textContent = s;
                sourceFilter.appendChild(opt);
            });

            render(allData);
        } catch (e) {
            container.innerHTML = '<p>Fehler beim Laden der Daten.</p>';
        }
    }

    function render(data) {
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p style="color:#8b949e;">Keine Ergebnisse gefunden.</p>';
            return;
        }
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
            let macsHtml = '';
            if (item.macs && item.macs.length > 0) {
                item.macs.forEach(mac => {
                    macsHtml += `
                        <div class="mac-item">
                            <span>${mac}</span>
                            <button class="copy-btn" onclick="navigator.clipboard.writeText('${mac}'); this.textContent='Kopiert!'; setTimeout(()=>this.textContent='Kopieren', 2000)">Kopieren</button>
                        </div>`;
                });
            } else {
                macsHtml = '<p style="color:#8b949e; font-size:0.8rem;">Keine MACs hinterlegt</p>';
            }

            const sourceText = item.quellen && item.quellen.length > 0 ? item.quellen[0].details : 'Unbekannt';

            card.innerHTML = `
                <div class="portal-url">${item.url}</div>
                <div class="mac-list">${macsHtml}</div>
                <div class="status">Status: ${item.status || 'Unbekannt'}</div>
                <div class="status">Quelle: ${sourceText}</div>
            `;
            container.appendChild(card);
        });
    }

    function filterData() {
        const term = searchInput.value.toLowerCase();
        const src = sourceFilter.value;
        
        const filtered = allData.filter(item => {
            const matchTerm = item.url.toLowerCase().includes(term);
            const itemSource = item.quellen && item.quellen.length > 0 ? item.quellen[0].details : '';
            const matchSrc = src === '' || itemSource === src;
            return matchTerm && matchSrc;
        });
        render(filtered);
    }

    searchInput.addEventListener('input', filterData);
    sourceFilter.addEventListener('change', filterData);
    loadData();
});loadData();
});
