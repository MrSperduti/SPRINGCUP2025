
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
  const div = document.getElementById("calendario");
  const partite = data[cat]?.partite || [];
  const perGirone = groupBy(partite, "girone");
  div.innerHTML = "";
  for (let g in perGirone) {
    div.innerHTML += `<h3>Girone ${g}</h3><ul>` +
      perGirone[g].map(p => `<li>${p.data}: ${p.squadraA} vs ${p.squadraB}</li>`).join("") + "</ul>";
  }
});
