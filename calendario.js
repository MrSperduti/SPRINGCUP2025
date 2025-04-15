
async function loadCalendar() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('calendario');
  (dati[cat]?.partite || []).forEach(p => {
    const card = document.createElement('div');
    card.innerHTML = `
      <h3>${p.squadraA} vs ${p.squadraB}</h3>
      <p>🗓️ ${p.data || ''} ⏰ ${p.orario || ''} 🏟️ ${p.campo || ''}</p>
      ${p.golA != null && p.golB != null ? `<p><strong>Risultato:</strong> ${p.golA} - ${p.golB}</p>` : ''}
      ${p.girone ? `<p><strong>Girone:</strong> ${p.girone}</p>` : ''}
    `;
    card.className = 'container';
    div.appendChild(card);
  });
}
document.addEventListener('DOMContentLoaded', loadCalendar);
