
async function loadMarcatori() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('marcatori');
  const marcatori = {};
  (dati[cat]?.partite || []).forEach(p => {
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
document.addEventListener('DOMContentLoaded', loadMarcatori);
