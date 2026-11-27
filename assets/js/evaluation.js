/*
 * PausaSegura - saves the result of the guided evaluation (8 questions)
 * in the history of the signed-in user (v1.1.0).
 *
 * The steps and the risk level are still shown with CSS (:target and
 * :has(:checked)). This script only reads the answers and stores them.
 */
(function () {
  'use strict';

  const account = window.PausaSegura && window.PausaSegura.account;
  const form = document.querySelector('.evaluation');
  if (!account || !form) {
    return;
  }

  const statusElement = form.querySelector('[data-save-status]');

  // Same signals and order as the "Señales detectadas" list in index.html.
  const SIGNALS = [
    ['urg-yes', 'Urgencia o presión'],
    ['code-yes', 'Piden una clave o código'],
    ['ask-bank', 'Piden datos bancarios'],
    ['ask-data', 'Piden datos personales'],
    ['ask-money', 'Piden dinero'],
    ['ask-install', 'Piden instalar una app'],
    ['cc-whatsapp', 'Cambio de canal'],
    ['cc-link', 'Enlace sospechoso'],
    ['ask-click', 'Enlace sospechoso'],
    ['mm-yes', 'Posible suplantación'],
    ['of-prize', 'Premio inesperado'],
    ['of-job', 'Oferta con pago previo'],
    ['of-advance', 'Pago adelantado']
  ];

  let currentEvaluationId = null;

  function labelOf(input) {
    const label = input.closest('label');
    return label ? label.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function checkedLabel(name) {
    const input = form.querySelector('input[name="' + name + '"]:checked');
    return input ? labelOf(input) : null;
  }

  // Same rule as the CSS: any "flag-high" answer = high, any "flag-medium" = medium.
  function getRiskLevel() {
    if (form.querySelector('.flag-high:checked')) {
      return 'high';
    }
    if (form.querySelector('.flag-medium:checked')) {
      return 'medium';
    }
    return 'low';
  }

  function getSignals() {
    const signals = [];
    SIGNALS.forEach(function (signal) {
      const input = document.getElementById(signal[0]);
      if (input && input.checked && signals.indexOf(signal[1]) === -1) {
        signals.push(signal[1]);
      }
    });
    return signals;
  }

  function buildRecord() {
    return {
      level: getRiskLevel(),
      channel: checkedLabel('channel'),
      sender: checkedLabel('sender'),
      requests: Array.from(form.querySelectorAll('#q3 input:checked')).map(labelOf),
      signals: getSignals(),
      decision: checkedLabel('decision'),
      useful: checkedLabel('feedback')
    };
  }

  function showStatus(isSaved) {
    if (!statusElement) {
      return;
    }
    const link = document.createElement('a');
    statusElement.textContent = '';
    statusElement.classList.toggle('result__saved--guest', !isSaved);

    if (isSaved) {
      statusElement.append('✔ Resultado guardado en tu historial. ');
      link.href = 'historial.html';
      link.textContent = 'Ver mis resultados';
    } else {
      statusElement.append('Este resultado aún no se guarda. ');
      link.href = 'login.html?next=historial.html';
      link.textContent = 'Inicia sesión o crea una cuenta para guardarlo';
    }
    statusElement.append(link);
    statusElement.hidden = false;
  }

  function saveResult() {
    const record = buildRecord();

    if (!account.getCurrentUser()) {
      account.savePendingEvaluation(record);
      showStatus(false);
      return;
    }

    if (currentEvaluationId) {
      account.updateEvaluation(currentEvaluationId, record);
    } else {
      currentEvaluationId = account.addEvaluation(record).id;
    }
    showStatus(true);
  }

  window.addEventListener('hashchange', function () {
    if (window.location.hash === '#eval-result') {
      saveResult();
    } else if (window.location.hash === '#eval-start') {
      // Back to the start: the next result is a new evaluation.
      currentEvaluationId = null;
    }
  });

  // The decision and the "was it useful?" answer are added to the same record.
  form.addEventListener('change', function (event) {
    const name = event.target.name;
    if (window.location.hash === '#eval-result' && (name === 'decision' || name === 'feedback')) {
      saveResult();
    }
  });

  form.addEventListener('reset', function () {
    currentEvaluationId = null;
  });

  // After signing out, the result on screen was already saved: only update the message.
  document.addEventListener('pausasegura:session-changed', function () {
    currentEvaluationId = null;
    if (window.location.hash === '#eval-result') {
      showStatus(false);
    }
  });
}());
