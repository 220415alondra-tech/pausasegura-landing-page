/*
 * PausaSegura - "Mis resultados" page (historial.html, v1.1.0).
 * Lists the evaluations saved by the signed-in user.
 */
(function () {
  'use strict';

  const account = window.PausaSegura && window.PausaSegura.account;
  if (!account) {
    return;
  }

  const user = account.getCurrentUser();
  if (!user) {
    window.location.replace('login.html?next=historial.html');
    return;
  }

  const LEVELS = {
    high: { label: 'Riesgo alto', pill: 'risk-pill--high', item: 'history-item--high' },
    medium: { label: 'Riesgo medio', pill: 'risk-pill--medium', item: 'history-item--medium' },
    low: { label: 'Riesgo bajo', pill: 'risk-pill--low', item: 'history-item--low' }
  };

  const list = document.querySelector('[data-history-list]');
  const emptyState = document.querySelector('[data-history-empty]');
  const filter = document.getElementById('history-filter');
  const dateFormat = new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short' });

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  }

  function addDetail(details, term, value) {
    details.append(createElement('dt', '', term));
    const description = createElement('dd');
    if (Array.isArray(value)) {
      const tags = createElement('ul', 'signal-list');
      value.forEach(function (text) {
        tags.append(createElement('li', 'signal-tag', text));
      });
      description.append(tags);
    } else {
      description.textContent = value;
    }
    details.append(description);
  }

  function renderItem(evaluation) {
    const level = LEVELS[evaluation.level] || LEVELS.low;
    const item = createElement('li', 'history-item ' + level.item);

    const top = createElement('div', 'history-item__top');
    top.append(createElement('p', 'risk-pill ' + level.pill, level.label));
    top.append(createElement('p', 'history-item__date', dateFormat.format(new Date(evaluation.date))));
    item.append(top);

    const details = createElement('dl', 'history-item__details');
    addDetail(details, 'Canal', evaluation.channel || 'Sin respuesta');
    addDetail(details, 'Quién dice ser', evaluation.sender || 'Sin respuesta');
    addDetail(details, 'Señales detectadas',
      evaluation.signals && evaluation.signals.length ? evaluation.signals : ['Sin señales claras']);
    addDetail(details, 'Tu decisión', evaluation.decision || 'Aún no decidiste');
    if (evaluation.useful) {
      addDetail(details, '¿Te fue útil?', evaluation.useful);
    }
    item.append(details);

    const actions = createElement('div', 'history-item__actions');
    const deleteButton = createElement('button', 'button button--ghost', 'Eliminar');
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', 'Eliminar la evaluación del ' + dateFormat.format(new Date(evaluation.date)));
    deleteButton.addEventListener('click', function () {
      if (window.confirm('¿Eliminar esta evaluación de tu historial?')) {
        account.deleteEvaluation(evaluation.id);
        render();
      }
    });
    actions.append(deleteButton);
    item.append(actions);

    return item;
  }

  function renderStats(history) {
    const count = function (level) {
      return history.filter(function (item) { return item.level === level; }).length;
    };
    document.querySelector('[data-stat="total"]').textContent = history.length;
    document.querySelector('[data-stat="high"]').textContent = count('high');
    document.querySelector('[data-stat="medium"]').textContent = count('medium');
    document.querySelector('[data-stat="low"]').textContent = count('low');
  }

  function render() {
    const history = account.getHistory();
    const selected = filter.value;
    const visible = history.filter(function (item) {
      return selected === 'all' || item.level === selected;
    });

    renderStats(history);
    list.textContent = '';
    visible.forEach(function (evaluation) {
      list.append(renderItem(evaluation));
    });
    emptyState.hidden = visible.length > 0;
    emptyState.querySelector('[data-empty-text]').textContent = history.length
      ? 'No hay evaluaciones con ese nivel de riesgo.'
      : 'Todavía no tienes evaluaciones guardadas. Haz una pausa y tu resultado aparecerá aquí.';
  }

  document.querySelectorAll('[data-account-name]').forEach(function (element) {
    element.textContent = user.name.split(' ')[0];
  });
  document.querySelector('[data-account-email]').textContent = user.email;

  filter.addEventListener('change', render);

  document.querySelector('[data-clear-history]').addEventListener('click', function () {
    if (window.confirm('¿Borrar todo tu historial? Esta acción no se puede deshacer.')) {
      account.clearHistory();
      render();
    }
  });

  document.querySelector('[data-delete-account]').addEventListener('click', function () {
    if (window.confirm('¿Eliminar tu cuenta y todo tu historial? Esta acción no se puede deshacer.')) {
      account.deleteAccount();
      window.location.href = 'index.html';
    }
  });

  render();
}());
