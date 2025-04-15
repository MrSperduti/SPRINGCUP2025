
// Funzioni principali per leggere e visualizzare i dati dell'app SPRING CUP 2025

async function caricaDati() {
  const response = await fetch('dati.json');
  return await response.json();
}

// Funzione per ottenere parametri URL
function getParam(name) {
  const url = new URL(window.location.href);
  return decodeURIComponent(url.searchParams.get(name) || '');
}

document.addEventListener('DOMContentLoaded', async () => {
  const pagina = location.pathname.split('/').pop();
  const dati = await caricaDati();

  if (pagina === 'index.html') {
    const container = document.getElementById('categorie');
    Object.keys(dati).forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat;
      btn.className = 'category-button';
      btn.onclick = () => location.href = 'categoria.html?categoria=' + encodeURIComponent(cat);
      container.appendChild(btn);
    });
  }

  const categoria = getParam('categoria');
  if (pagina === 'categoria.html' && categoria) {
    document.getElementById('categoria-titolo').textContent = categoria;
    const menu = document.getElementById('menu');
    [
      ['Calendario', 'calendario.html'],
      ['Classifica', 'classifica.html'],
      ['Marcatori', 'classifica-marcatori.html'],
      ['Portieri', 'classifica-portieri.html'],
      ['Giocatori', 'classifica-giocatori.html'],
      ['Gironi', 'girone.html']
    ].forEach(([nome, file]) => {
      const btn = document.createElement('button');
      btn.textContent = nome;
      btn.className = 'category-button';
      btn.onclick = () => location.href = file + '?categoria=' + encodeURIComponent(categoria);
      menu.appendChild(btn);
    });
  }

  if (pagina === 'calendario.html' && categoria) {
    const div = document.getElementById('calendario');
    const partite = dati[categoria]?.partite || [];
    partite.forEach(p => {
      const card = document.createElement('div');
      card.innerHTML = `
        <h3>${p.squadraA} vs ${p.squadraB}</h3>
        <p>🗓️ ${p.data || ''} ⏰ ${p.orario || ''} 🏟️ ${p.campo || ''}</p>
        ${p.golA != null && p.golB != null ? `<p><strong>Risultato:</strong> ${p.golA} - ${p.golB}</p>` : ''}
        ${p.girone ? `<p><strong>Girone:</strong> ${p.girone}</p>` : ''}
      `;
      card.className = 'container';
      div.appendChild(card);
    });
  }

  if (pagina === 'classifica.html' && categoria) {
    const div = document.getElementById('classifica');
    const squadre = {};
    (dati[categoria]?.partite || []).forEach(p => {
      if (p.golA != null && p.golB != null) {
        squadre[p.squadraA] = squadre[p.squadraA] || { punti: 0, gf: 0, gs: 0 };
        squadre[p.squadraB] = squadre[p.squadraB] || { punti: 0, gf: 0, gs: 0 };
        squadre[p.squadraA].gf += p.golA;
        squadre[p.squadraA].gs += p.golB;
        squadre[p.squadraB].gf += p.golB;
        squadre[p.squadraB].gs += p.golA;
        if (p.golA > p.golB) squadre[p.squadraA].punti += 3;
        else if (p.golB > p.golA) squadre[p.squadraB].punti += 3;
        else { squadre[p.squadraA].punti += 1; squadre[p.squadraB].punti += 1; }
      }
    });
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Squadra</th><th>Punti</th><th>GF</th><th>GS</th></tr>';
    Object.entries(squadre).sort((a, b) => b[1].punti - a[1].punti).forEach(([nome, stat]) => {
      table.innerHTML += `<tr><td>${nome}</td><td>${stat.punti}</td><td>${stat.gf}</td><td>${stat.gs}</td></tr>`;
    });
    div.appendChild(table);
  }

  if (pagina === 'classifica-marcatori.html' && categoria) {
    const div = document.getElementById('marcatori');
    const marcatori = {};
    (dati[categoria]?.partite || []).forEach(p => {
      (p.marcatori || []).forEach(m => {
        if (!marcatori[m.nome]) marcatori[m.nome] = 0;
        marcatori[m.nome] += m.gol || 0;
      });
    });
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Giocatore</th><th>Gol</th></tr>';
    Object.entries(marcatori).sort((a, b) => b[1] - a[1]).forEach(([nome, gol]) => {
      table.innerHTML += `<tr><td>${nome}</td><td>${gol}</td></tr>`;
    });
    div.appendChild(table);
  }

  if (pagina === 'classifica-portieri.html' && categoria) {
    const div = document.getElementById('portieri');
    const count = {};
    (dati[categoria]?.partite || []).forEach(p => {
      if (p.portiere) {
        count[p.portiere] = (count[p.portiere] || 0) + 1;
      }
    });
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Portiere</th><th>Presenze</th></tr>';
    Object.entries(count).sort((a, b) => b[1] - a[1]).forEach(([nome, n]) => {
      table.innerHTML += `<tr><td>${nome}</td><td>${n}</td></tr>`;
    });
    div.appendChild(table);
  }

  if (pagina === 'classifica-giocatori.html' && categoria) {
    const div = document.getElementById('giocatori');
    const count = {};
    (dati[categoria]?.partite || []).forEach(p => {
      if (p.giocatore) {
        count[p.giocatore] = (count[p.giocatore] || 0) + 1;
      }
    });
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Giocatore</th><th>Presenze</th></tr>';
    Object.entries(count).sort((a, b) => b[1] - a[1]).forEach(([nome, n]) => {
      table.innerHTML += `<tr><td>${nome}</td><td>${n}</td></tr>`;
    });
    div.appendChild(table);
  }

  if (pagina === 'girone.html' && categoria) {
    const div = document.getElementById('girone');
    const gironi = dati[categoria]?.gironi || {};
    Object.entries(gironi).forEach(([nome, squadre]) => {
      const section = document.createElement('div');
      section.innerHTML = `<h3>Girone ${nome}</h3><ul>${squadre.map(s => `<li>${s}</li>`).join('')}</ul>`;
      div.appendChild(section);
    });
  }
});
