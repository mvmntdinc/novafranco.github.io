// ── CONFIGURAÇÃO DO FORMSPREE ──
// Substitua o valor abaixo pelo seu ID oficial do Formspree (encontrado após criar o formulário em formspree.io)
const FORMSPREE_FORM_ID = 'SEU_FORM_ID'; 

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
    const originalText = submitBtn.textContent;

    // Atualizar estado de envio
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = {
      nome: formData.get('nome'),
      telefone: formData.get('telefone'),
      email: formData.get('email'),
      esfera: formData.get('esfera_selecionada'),
      valorOriginal: formData.get('valor_selecionado'),
      valorEstimadoVista: formData.get('estimativa_liquida'),
      timestamp: new Date().toISOString()
    };

    // 📊 EVENTOS DE RASTREAMENTO (GTM & Meta Pixel)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'lead_form_submit', {
        'form_name': 'precatario_simulador_btg',
        'email': data.email,
        'phone': data.telefone,
        'value': data.valorOriginal
      });
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Simulacao Precatório BTG',
        value: parseFloat(formData.get('valor_selecionado').replace(/\D/g, '')) / 100 || 0,
        currency: 'BRL'
      });
    }

    console.log('Dados prontos para envio:', data);

    // Se o usuário não alterou o ID, simula o sucesso para propósitos de teste local do cliente
    if (FORMSPREE_FORM_ID === 'SEU_FORM_ID') {
      setTimeout(() => {
        showSuccessState(form, submitBtn, originalText);
        console.warn('Formspree: ID padrão detectado ("SEU_FORM_ID"). Simulação de envio completada com sucesso. Substitua pelo ID real para receber emails.');
      }, 800);
    } else {
      // Envio real via Formspree
      fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          showSuccessState(form, submitBtn, originalText);
        } else {
          alert('Houve um erro ao enviar a solicitação. Por favor, tente novamente ou fale no WhatsApp.');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      })
      .catch(error => {
        console.error('Erro na submissão:', error);
        alert('Houve um erro de conexão. Por favor, tente novamente ou clique no botão do WhatsApp.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    }
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
    
    // Retornar o simulador para a primeira aba e redefinir valores
    switchTab('simulador');
    const rangeInput = document.getElementById('sim-range');
    if (rangeInput) {
      rangeInput.value = 150000;
      updateSliderVal(150000);
    }
  }, 3000);
}
