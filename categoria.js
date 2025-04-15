
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}
document.addEventListener('DOMContentLoaded', () => {
  const categoria = getParam('categoria');
  document.getElementById('categoria-titolo').textContent = categoria;
  const menu = document.getElementById('menu');
  [
    ['Calendario', 'calendario.html'],
    ['Classifica', 'classifica.html'],
    ['Marcatori', 'classifica-marcatori.html'],
    ['Portieri', 'classifica-portieri.html'],
    ['Giocatori', 'classifica-giocatori.html'],
    ['Gironi', 'girone.html']
  ].forEach(([nome, file]) => {
    const btn = document.createElement('button');
    btn.textContent = nome;
    btn.className = 'category-button';
    btn.onclick = () => location.href = file + '?categoria=' + encodeURIComponent(categoria);
    menu.appendChild(btn);
  });
});
