
let datiGlobali = {};
let categoriaCorrente = "";

fetch("dati.json")
  .then(res => res.json())
  .then(dati => {
    datiGlobali = dati;
    const categorieContainer = document.getElementById("categorieContainer");
    for (let cat in dati) {
      const btn = document.createElement("button");
      btn.innerText = cat;
      btn.onclick = () => entraCategoria(cat);
      categorieContainer.appendChild(btn);
    }
  });

function entraCategoria(nome) {
  categoriaCorrente = nome;
  document.getElementById("home").style.display = "none";
  document.getElementById("categoria").style.display = "block";
  document.getElementById("titoloCategoria").innerText = nome;
  mostraTutti();
  mostraTab("calendario");
}

function tornaHome() {
  document.getElementById("home").style.display = "block";
  document.getElementById("categoria").style.display = "none";
}

function mostraTab(nome) {
  document.querySelectorAll(".tab-content").forEach(el => el.style.display = "none");
  document.getElementById("tab-" + nome).style.display = "block";
}

function mostraTutti() {
  const partite = datiGlobali[categoriaCorrente]?.partite || [];

  // Calendario
  const cal = document.getElementById("tab-calendario");
  cal.innerHTML = "<h3>📅 Calendario</h3>";
  const perGirone = groupBy(partite, "girone");
  for (let g in perGirone) {
    cal.innerHTML += `<h4>Girone ${g}</h4><ul>` +
      perGirone[g].map(p => `<li>${p.data}: ${p.squadraA} vs ${p.squadraB}</li>`).join("") + "</ul>";
  }

  // Risultati
  const res = document.getElementById("tab-risultati");
  res.innerHTML = "<h3>📖 Risultati</h3>";
  for (let g in perGirone) {
    res.innerHTML += `<h4>Girone ${g}</h4><ul>` +
      perGirone[g].filter(p => p.golA != null && p.golB != null)
        .map(p => `<li>${p.data}: ${p.squadraA} ${p.golA} - ${p.golB} ${p.squadraB}</li>`).join("") + "</ul>";
  }

  // Classifiche
  const classDiv = document.getElementById("tab-classifica");
  classDiv.innerHTML = "<h3>🏆 Classifiche per Girone</h3>";
  for (let g in perGirone) {
    let classifica = {};
    perGirone[g].filter(p => p.golA != null && p.golB != null).forEach(p => {
      const { squadraA: a, squadraB: b, golA: ga, golB: gb } = p;
      if (!classifica[a]) classifica[a] = { punti: 0, gf: 0, gs: 0 };
      if (!classifica[b]) classifica[b] = { punti: 0, gf: 0, gs: 0 };
      classifica[a].gf += ga; classifica[a].gs += gb;
      classifica[b].gf += gb; classifica[b].gs += ga;
      if (ga > gb) classifica[a].punti += 3;
      else if (ga < gb) classifica[b].punti += 3;
      else { classifica[a].punti += 1; classifica[b].punti += 1; }
    });
    const array = Object.entries(classifica).map(([s, st]) => ({
      squadra: s, punti: st.punti, gf: st.gf, gs: st.gs, dr: st.gf - st.gs
    })).sort((a, b) => b.punti - a.punti || b.dr - a.dr || b.gf - a.gf);
    classDiv.innerHTML += `<h4>Girone ${g}</h4><table><tr><th>Squadra</th><th>Punti</th><th>GF</th><th>GS</th><th>DR</th></tr>` +
      array.map(r => `<tr><td>${r.squadra}</td><td>${r.punti}</td><td>${r.gf}</td><td>${r.gs}</td><td>${r.dr}</td></tr>`).join("") + "</table>";
  }

  // Capocannonieri
  const capocannonieri = {};
  partite.forEach(p => {
    (p.marcatori || []).forEach(m => {
      const key = `${m.nome} (${m.squadra})`;
      capocannonieri[key] = (capocannonieri[key] || 0) + m.gol;
    });
  });
  const capDiv = document.getElementById("tab-capocannonieri");
  capDiv.innerHTML = "<h3>🎯 Capocannonieri</h3><ul>" +
    Object.entries(capocannonieri).sort((a, b) => b[1] - a[1])
      .map(([n, g]) => `<li>${n}: ${g} gol</li>`).join("") + "</ul>";

  // Miglior Giocatore
  const giocat = {};
  partite.forEach(p => {
    if (p.giocatore) giocat[p.giocatore] = (giocat[p.giocatore] || 0) + 1;
  });
  const giDiv = document.getElementById("tab-giocatori");
  giDiv.innerHTML = "<h3>👑 Miglior Giocatore</h3><ul>" +
    Object.entries(giocat).sort((a, b) => b[1] - a[1])
      .map(([n, v]) => `<li>${n}: ${v} voti</li>`).join("") + "</ul>";

  // Miglior Portiere
  const port = {};
  partite.forEach(p => {
    if (p.portiere) port[p.portiere] = (port[p.portiere] || 0) + 1;
  });
  const ptDiv = document.getElementById("tab-portieri");
  ptDiv.innerHTML = "<h3>🧤 Miglior Portiere</h3><ul>" +
    Object.entries(port).sort((a, b) => b[1] - a[1])
      .map(([n, v]) => `<li>${n}: ${v} voti</li>`).join("") + "</ul>";
}

function groupBy(arr, key) {
  return arr.reduce((acc, obj) => {
    const k = obj[key] || "Unico";
    acc[k] = acc[k] || [];
    acc[k].push(obj);
    return acc;
  }, {});
}
