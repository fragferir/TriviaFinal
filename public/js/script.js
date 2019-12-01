
function check(e) {
  console.log(e.id);
  const msg = document.getElementById('msg');
  if (e.value == 'true')
    msg.innerHTML = 'CORRECTA!';
  else
    msg.innerHTML = 'INCORRECTA!'
  setTimeout(() => { window.location.replace('/play') }, 1250)  
}
//faltaria ingresar un contador para tener puntaje