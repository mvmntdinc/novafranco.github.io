// ── CONFIGURAÇÃO DO FORMSPREE ──
// Substitua o valor abaixo pelo seu ID oficial do Formspree (encontrado após criar o formulário em formspree.io)
const FORMSPREE_FORM_ID = 'xredyqar';

// ── PILL SELECTION ──
function selectPill(btn, group) {
  const container = document.getElementById(group + '-pills');
  container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const hiddenMap = { valor: 'hidden-valor-divida', municipio: 'hidden-municipio' };
  const hidden = document.getElementById(hiddenMap[group]);
  if (hidden) hidden.value = btn.getAttribute('data-value');
}

document.addEventListener('DOMContentLoaded', function() {
  // Inicialização das interações
  initSimulator();
  initFormMasks();
  initFormSubmission();
  initHeaderScroll();
});

// ── HEADER STATE ON SCROLL ──
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ── TABS CONTROL ──
function switchTab(tabId) {
  // Remover estados ativos
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Ativar aba selecionada
  const activeBtn = document.getElementById(`tab-${tabId}-btn`);
  const activeContent = document.getElementById(`tab-${tabId}`);
  
  if (activeBtn && activeContent) {
    activeBtn.classList.add('active');
    activeContent.classList.add('active');
  }
}

function goToProposalTab() {
  // Sincronizar dados calculados com os inputs ocultos do formulário
  const esferaSelect = document.getElementById('sim-esfera');
  const rangeInput = document.getElementById('sim-range');
  const payoutVal = document.getElementById('sim-estimated-payout').textContent;

  const esferaText = esferaSelect.options[esferaSelect.selectedIndex].text;
  const valorText = formatCurrency(parseFloat(rangeInput.value));

  document.getElementById('hidden-esfera').value = esferaText;
  document.getElementById('hidden-valor').value = valorText;
  document.getElementById('hidden-estimativa').value = payoutVal;

  // Trocar para a aba de cadastro
  switchTab('cadastro');
  
  // Focar no primeiro campo para melhorar a experiência
  setTimeout(() => {
    const nameInput = document.getElementById('lead-name');
    if (nameInput) nameInput.focus();
  }, 100);
}

// ── INTERACTIVE SIMULATOR ──
function initSimulator() {
  const rangeInput = document.getElementById('sim-range');
  if (rangeInput) {
    updateSliderVal(rangeInput.value);
  }
}

function updateSliderVal(val) {
  const sliderValLabel = document.getElementById('slider-val');
  if (sliderValLabel) {
    sliderValLabel.textContent = formatCurrency(parseFloat(val)).replace(',00', '');
  }
  calculateSimulation();
}

function calculateSimulation() {
  const rangeInput = document.getElementById('sim-range');
  const esferaSelect = document.getElementById('sim-esfera');
  const payoutDisplay = document.getElementById('sim-estimated-payout');

  if (!rangeInput || !esferaSelect || !payoutDisplay) return;

  const originalValue = parseFloat(rangeInput.value);
  const esfera = esferaSelect.value;

  // Coeficientes de desconto (deságio) aproximados baseados no mercado atual
  // Federal: ~18% deságio (recebe 82%)
  // Estadual: ~32% deságio (recebe 68%)
  // Municipal: ~38% deságio (recebe 62%)
  let factor = 0.82;
  if (esfera === 'estadual') {
    factor = 0.68;
  } else if (esfera === 'municipal') {
    factor = 0.62;
  }

  const estimatedPayout = originalValue * factor;
  payoutDisplay.textContent = formatCurrency(estimatedPayout);
}

// Auxiliar: Formatar moeda BRL
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// ── FORM MASKS ──
function initFormMasks() {
  const phoneInput = document.getElementById('lead-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }
}

// ── FAQ ACCORDION ──
function toggleFaq(button) {
  const item = button.parentElement;
  const content = item.querySelector('.faq-content');
  const isActive = item.classList.contains('active');

  // Fechar todos os FAQs abertos (UX premium)
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('active');
    el.querySelector('.faq-content').style.maxHeight = null;
  });

  if (!isActive) {
    item.classList.add('active');
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

// ── SUBMISSION LOGIC ──
function initFormSubmission() {
  const form = document.getElementById('contato-form');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('https://formspree.io/f/xredyqar', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function() {
      window.location.href = 'obrigado.html';
    })
    .catch(function() {
      window.location.href = 'obrigado.html';
    });
  });
}

function showSuccessState(form, submitBtn, originalText) {
  // Mostrar Toast Success
  const toast = document.getElementById('toast-success');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);

  // Alterar botão temporariamente para sucesso
  submitBtn.textContent = '✓ Proposta Solicitada';
  submitBtn.style.background = 'var(--success)';
  submitBtn.style.borderColor = 'var(--success)';

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.style.background = '';
    submitBtn.style.borderColor = '';
    submitBtn.disabled = false;
    form.reset();
  }, 3000);
}
