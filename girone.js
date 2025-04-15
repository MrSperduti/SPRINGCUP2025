
async function loadGironi() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('girone');
  const gironi = dati[cat]?.gironi || {};
  Object.entries(gironi).forEach(([nome, squadre]) => {
    const section = document.createElement('div');
    section.innerHTML = `<h3>Girone ${nome}</h3><ul>${squadre.map(s => `<li>${s}</li>`).join('')}</ul>`;
    div.appendChild(section);
  });
}
document.addEventListener('DOMContentLoaded', loadGironi);
