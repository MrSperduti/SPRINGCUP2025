
function getCategoria() {
  const params = new URLSearchParams(window.location.search);
  return params.get('categoria');
}
function groupBy(arr, key) {
  return arr.reduce((acc, obj) => {
    const k = obj[key] || "Unico";
    acc[k] = acc[k] || [];
    acc[k].push(obj);
    return acc;
  }, {});
}

fetch('dati.json').then(r => r.json()).then(data => {
  const cat = getCategoria();
  const div = document.getElementById("classifica");
  const partite = data[cat]?.partite || [];
  const perGirone = groupBy(partite, "girone");
  div.innerHTML = "";
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
    div.innerHTML += `<h3>Girone ${g}</h3><table><tr><th>Squadra</th><th>Punti</th><th>GF</th><th>GS</th><th>DR</th></tr>` +
      array.map(r => `<tr><td>${r.squadra}</td><td>${r.punti}</td><td>${r.gf}</td><td>${r.gs}</td><td>${r.dr}</td></tr>`).join("") + "</table>";
  }
});
