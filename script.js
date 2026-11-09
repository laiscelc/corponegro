const $ = (selector) => document.querySelector(selector);

// Menu mobile
$('#menuBtn').addEventListener('click', (event) => {
  const aberto = event.currentTarget.getAttribute('aria-expanded') !== 'true';

  event.currentTarget.setAttribute('aria-expanded', String(aberto));
  $('#menu').classList.toggle('open', aberto);
});

$('#menu').querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    $('#menu').classList.remove('open');
    $('#menuBtn').setAttribute('aria-expanded', 'false');
  });
});

// Alto contraste
$('#contrast').addEventListener('click', (event) => {
  const ativo = document.body.classList.toggle('contrast');
  event.currentTarget.setAttribute('aria-pressed', String(ativo));
});

// Fonte de leitura
$('#dyslexia').addEventListener('click', (event) => {
  const ativa = document.body.classList.toggle('dyslexia');
  event.currentTarget.setAttribute('aria-pressed', String(ativa));
});

// Tamanho do texto
let tamanhoTexto = 16;

$('#smaller').addEventListener('click', () => {
  tamanhoTexto = Math.max(14, tamanhoTexto - 1);
  document.documentElement.style.setProperty('--base', `${tamanhoTexto}px`);
});

$('#larger').addEventListener('click', () => {
  tamanhoTexto = Math.min(22, tamanhoTexto + 1);
  document.documentElement.style.setProperty('--base', `${tamanhoTexto}px`);
});

// Simulador de espectro
function atualizarEspectro() {
  const temperatura = Number($('#temp').value);
  const pico = 2.898e6 / temperatura;
  const xPico = Math.max(72, Math.min(548, 70 + (pico / 2000) * 480));
  const picoEscalado = (xPico - 70) / 480;
  const pontos = [];

  for (let x = 70; x <= 550; x += 4) {
    const u = Math.max(0.025, (x - 70) / 480);
    const razao = Math.min(1, picoEscalado / u);
    const intensidade = Math.pow(razao, 5) * Math.exp(5 * (1 - razao));
    pontos.push(`${x},${245 - intensidade * 190}`);
  }

  $('#curve').setAttribute('d', `M${pontos.join(' L')}`);
  $('#peakLine').setAttribute('x1', xPico);
  $('#peakLine').setAttribute('x2', xPico);
  $('#tempOut').textContent = `${temperatura.toLocaleString('pt-BR')} K`;
  $('#peak').textContent = `≈ ${Math.round(pico)} nm`;

  let faixa;

  if (pico < 380) {
    faixa = 'ultravioleta';
  } else if (pico <= 750) {
    faixa = 'visível';
  } else {
    faixa = 'infravermelho';
  }

  $('#band').textContent = `Faixa ${faixa}`;
  $('#chartSummary').textContent = `Pico estimado na faixa ${faixa}.`;
  $('#chartDesc').textContent =
    `Curva qualitativa para ${temperatura} kelvin com pico em aproximadamente ` +
    `${Math.round(pico)} nanômetros, na faixa ${faixa}.`;
}

$('#temp').addEventListener('input', atualizarEspectro);
atualizarEspectro();

// Comparação entre superfícies
$('#surface').addEventListener('change', (event) => {
  const escura = event.target.value === 'dark';

  $('#demo div').style.background = escura ? '#203b3d' : '#e6eeee';
  $('#demo').setAttribute(
    'aria-label',
    `Ilustração de coletor solar com superfície ${escura ? 'escura' : 'clara'}`
  );
  $('#surfaceText').textContent =
    `Coletor de superfície ${escura ? 'escura' : 'clara'}`;
  $('#absorb').textContent = escura
    ? 'Superfície escura: tende a absorver mais radiação visível.'
    : 'Superfície clara: tende a refletir mais luz visível e absorver menos.';
});

// Sensores e bomba
function atualizarBomba() {
  const piscina = Number($('#poolTemp').value);
  const coletor = Number($('#collectorTemp').value);

  $('#pOut').textContent = `${piscina} °C`;
  $('#cOut').textContent = `${coletor} °C`;
  $('#status').textContent = coletor > piscina + 2
    ? 'Bomba ligada: coletor mais quente.'
    : 'Bomba desligada: diferença térmica insuficiente.';
}

$('#poolTemp').addEventListener('input', atualizarBomba);
$('#collectorTemp').addEventListener('input', atualizarBomba);
atualizarBomba();
