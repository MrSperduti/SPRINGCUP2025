
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
  const div = document.getElementById("capocannonieri");
  const partite = data[cat]?.partite || [];
  const marcatori = {};
  partite.forEach(p => {
    (p.marcatori || []).forEach(m => {
      const key = `${m.nome} (${m.squadra})`;
      marcatori[key] = (marcatori[key] || 0) + m.gol;
    });
  });
  div.innerHTML = "<ul>" +
    Object.entries(marcatori).sort((a,b) => b[1]-a[1])
      .map(([n,g]) => `<li>${n}: ${g} gol</li>`).join("") + "</ul>";
});
