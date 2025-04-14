
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
  const div = document.getElementById("portieri");
  const partite = data[cat]?.partite || [];
  const portieri = {};
  partite.forEach(p => {
    if (p.portiere) portieri[p.portiere] = (portieri[p.portiere] || 0) + 1;
  });
  div.innerHTML = "<ul>" +
    Object.entries(portieri).sort((a,b) => b[1]-a[1])
      .map(([n,v]) => `<li>${n}: ${v} voti</li>`).join("") + "</ul>";
});
