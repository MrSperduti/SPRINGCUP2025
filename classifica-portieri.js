
async function loadPortieri() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('portieri');
  const count = {};
  (dati[cat]?.partite || []).forEach(p => {
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
document.addEventListener('DOMContentLoaded', loadPortieri);
