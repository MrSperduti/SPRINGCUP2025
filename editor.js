
let dati = {
  "Under 17": {},
  "Under 15": {},
  "Under 13": {},
  "2014/15": {},
  "2016/17": {},
  "Under 15 femminile": {},
  "Under 13 femminile": {}
};

document.getElementById('form-partita').addEventListener('submit', function (event) {
  event.preventDefault();
  let categoria = document.getElementById('categoria').value;
  let data = document.getElementById('data').value;
  let orario = document.getElementById('orario').value;
  let campo = document.getElementById('campo').value;
  
  if (!dati[categoria]) {
    alert('Categoria non trovata!');
    return;
  }

  let partita = { data, orario, campo };
  if (!dati[categoria].partite) {
    dati[categoria].partite = [];
  }
  dati[categoria].partite.push(partita);

  alert('Partita aggiunta con successo!');
});

document.getElementById('form-girone').addEventListener('submit', function (event) {
  event.preventDefault();
  let nomeGirone = document.getElementById('nome-girone').value;

  if (!dati["Under 17"].gironi) {
    dati["Under 17"].gironi = [];
  }

  dati["Under 17"].gironi.push({ nome: nomeGirone, squadre: [] });

  alert('Girone aggiunto con successo!');
});

document.getElementById('save-data').addEventListener('click', function () {
  const jsonData = JSON.stringify(dati, null, 2);
  
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dati.json';
  a.click();
  URL.revokeObjectURL(url);
});
