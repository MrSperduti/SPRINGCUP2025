
async function loadClassifica() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('classifica');
  const squadre = {};
  (dati[cat]?.partite || []).forEach(p => {
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
document.addEventListener('DOMContentLoaded', loadClassifica);
