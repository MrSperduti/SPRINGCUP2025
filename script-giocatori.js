
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
  const div = document.getElementById("giocatori");
  const partite = data[cat]?.partite || [];
  const giocatori = {};
  partite.forEach(p => {
    if (p.giocatore) giocatori[p.giocatore] = (giocatori[p.giocatore] || 0) + 1;
  });
  div.innerHTML = "<ul>" +
    Object.entries(giocatori).sort((a,b) => b[1]-a[1])
      .map(([n,v]) => `<li>${n}: ${v} voti</li>`).join("") + "</ul>";
});
