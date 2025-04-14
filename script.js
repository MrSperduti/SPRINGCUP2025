
function mostraTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
}

fetch('dati.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('categoria').textContent = data.categoria;

    const partite = data.partite;
    const calendario = document.getElementById('tab-calendario');
    const risultati = document.getElementById('tab-risultati');

    calendario.innerHTML = "<h2>📅 Calendario</h2><ul>" +
      partite.map(p => `<li>${p.data}: ${p.squadraA} vs ${p.squadraB}</li>`).join("") + "</ul>";

    risultati.innerHTML = "<h2>📖 Risultati</h2><ul>" +
      partite.map(p => `<li>${p.data}: ${p.squadraA} ${p.golA} - ${p.golB} ${p.squadraB}</li>`).join("") + "</ul>";

    // Classifica
    const classifica = {};
    partite.forEach(p => {
      const { squadraA: a, squadraB: b, golA: ga, golB: gb } = p;
      for (let squadra of [a, b]) {
        if (!classifica[squadra]) classifica[squadra] = { punti: 0, gf: 0, gs: 0 };
      }
      classifica[a].gf += ga; classifica[a].gs += gb;
      classifica[b].gf += gb; classifica[b].gs += ga;
      if (ga > gb) classifica[a].punti += 3;
      else if (gb > ga) classifica[b].punti += 3;
      else { classifica[a].punti += 1; classifica[b].punti += 1; }
    });

    const classificaArray = Object.entries(classifica).map(([s, val]) => ({
      squadra: s, punti: val.punti, gf: val.gf, gs: val.gs, dr: val.gf - val.gs
    })).sort((a, b) => b.punti - a.punti || b.dr - a.dr || b.gf - a.gf);

    const tabClassifica = document.getElementById("tab-classifica");
    tabClassifica.innerHTML = "<h2>🏆 Classifica</h2><table><tr><th>Squadra</th><th>Punti</th><th>GF</th><th>GS</th><th>DR</th></tr>" +
      classificaArray.map(s => `<tr><td>${s.squadra}</td><td>${s.punti}</td><td>${s.gf}</td><td>${s.gs}</td><td>${s.dr}</td></tr>`).join("") +
      "</table>";
  });
