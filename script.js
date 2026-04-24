document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentPersona: localStorage.getItem('spine_currentPersona') || 'henrique',
    completed: JSON.parse(localStorage.getItem('spine_completed')) || {},
    painLog: JSON.parse(localStorage.getItem('spine_painLog')) || [],
    week: 1
  };

  const els = {
    personaSelect: document.getElementById('persona-select'),
    personaDesc: document.getElementById('persona-desc'),
    weeksList: document.getElementById('weeks-list'),
    painSlider: document.getElementById('pain-slider'),
    painFeedback: document.getElementById('pain-feedback'),
    logPain: document.getElementById('log-pain'),
    painLog: document.getElementById('pain-log'),
    visualList: document.getElementById('visual-list'),
    exportBtn: document.getElementById('export-btn'),
    importBtn: document.getElementById('import-btn'),
    importFile: document.getElementById('import-file'),
    printBtn: document.getElementById('print-btn'),
    fontToggle: document.getElementById('font-toggle'),
    contrastToggle: document.getElementById('contrast-toggle')
  };

  function init() {
    renderPersona();
    renderWeeks();
    renderVisualGuide();
    updatePainFeedback();
    renderPainLog();
    loadAccessibility();
    setupEvents();
  }

  function renderPersona() {
    const p = personas[state.currentPersona];
    els.personaSelect.value = state.currentPersona;
    els.personaDesc.innerHTML = `
      <strong>${p.name}</strong><br>
      ${p.desc}<br>
      🏠 Casa: ${p.homeFreq} | 🏋️ Academia: ${p.gymFreq}
    `;
  }

  function getProgression(week) {
    if (week <= 4) return progression.w1_4;
    if (week <= 8) return progression.w5_8;
    return progression.w9_12;
  }

  function renderWeeks() {
    els.weeksList.innerHTML = '';
    const p = personas[state.currentPersona];
    
    for (let w = 1; w <= 12; w++) {
      const prog = getProgression(w);
      const tip = p.tips[`w${w <= 4 ? 1 : w <= 8 ? 5 : 9}`];
      
      const weekHtml = `
        <div class="accordion" data-week="${w}">
          <div class="accordion-header">Semana ${w}: ${prog.phase}</div>
          <div class="accordion-content">
            <div class="card">
              <h3>🏠 Protocolo Domiciliar (Diário)</h3>
              ${exercises.home.lumbar.map(ex => renderExerciseItem(ex, `h_w${w}_${ex.name}`)).join('')}
              ${p.hasGym || state.currentPersona === 'carmem' ? exercises.home.cervical.map(ex => renderExerciseItem(ex, `h_w${w}_${ex.name}`)).join('') : ''}
              <p><small>Isometria alvo: ${prog.homeHold} | Volume: ${prog.volume}</small></p>
            </div>
            ${p.hasGym ? `
            <div class="card">
              <h3>🏋️ Protocolo Academia (2-3x/semana)</h3>
              ${exercises.gym.map(ex => renderExerciseItem({...ex, reps: prog.volume.replace('3x','')}, `g_w${w}_${ex.name}`)).join('')}
              <p><small>Carga: ${prog.gymLoad} | Descanso: ${prog.rest}</small></p>
            </div>` : ''}
            <div class="tip-box">💡 <strong>Dica da Semana:</strong> ${tip}</div>
          </div>
        </div>
      `;
      els.weeksList.insertAdjacentHTML('beforeend', weekHtml);
    }

    // Accordion logic
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const acc = header.parentElement;
        acc.classList.toggle('active');
      });
    });

    // Checkbox listeners
    document.querySelectorAll('.exercise-item input').forEach(cb => {
      const id = cb.id;
      cb.checked = !!state.completed[id];
      cb.addEventListener('change', (e) => {
        state.completed[id] = e.target.checked;
        localStorage.setItem('spine_completed', JSON.stringify(state.completed));
      });
    });
  }

  function renderExerciseItem(ex, id) {
    return `
      <div class="exercise-item">
        <label for="${id}">
          <input type="checkbox" id="${id}" aria-label="Marcar ${ex.name} como concluído">
          <div>
            <strong>${ex.name}</strong><br>
            <small>${ex.desc}</small>
          </div>
        </label>
      </div>
    `;
  }

  function updatePainFeedback() {
    const val = parseInt(els.painSlider.value);
    const msgData = painMessages.find(m => val <= m.max) || painMessages[painMessages.length - 1];
    els.painFeedback.textContent = msgData.msg;
    els.painFeedback.className = `pain-msg ${msgData.type}`;
  }

  function renderPainLog() {
    els.painLog.innerHTML = state.painLog.slice(-5).map(log => 
      `<div class="log-item">📅 ${log.date} | 🩺 Dor: ${log.val}/10</div>`
    ).reverse().join('') || '<div class="log-item">Nenhum registro ainda.</div>';
  }

  function renderVisualGuide() {
    els.visualList.innerHTML = visualGuideData.map(item => `
      <div class="card">
        <h3>🖼️ ${item.name}</h3>
        <pre style="white-space: pre-wrap; font-family: inherit; background: #f5f5f5; padding: 0.8rem; border-radius: 6px;">${item.text}</pre>
      </div>
    `).join('');
  }

  function loadAccessibility() {
    if (localStorage.getItem('spine_largeFont') === 'true') document.body.classList.add('large-text');
    if (localStorage.getItem('spine_highContrast') === 'true') document.body.classList.add('high-contrast');
  }

  function setupEvents() {
    els.personaSelect.addEventListener('change', (e) => {
      state.currentPersona = e.target.value;
      localStorage.setItem('spine_currentPersona', state.currentPersona);
      renderPersona();
      renderWeeks();
    });

    els.painSlider.addEventListener('input', updatePainFeedback);
    
    els.logPain.addEventListener('click', () => {
      const val = parseInt(els.painSlider.value);
      const date = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      state.painLog.unshift({ date, val });
      localStorage.setItem('spine_painLog', JSON.stringify(state.painLog));
      renderPainLog();
      els.painFeedback.textContent = '✅ Registrado com sucesso!';
      setTimeout(updatePainFeedback, 1500);
    });

    els.exportBtn.addEventListener('click', () => {
      const data = { completed: state.completed, painLog: state.painLog, persona: state.currentPersona };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'spine-protocol-backup.json'; a.click();
    });

    els.importBtn.addEventListener('click', () => els.importFile.click());
    els.importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          state.completed = data.completed || {};
          state.painLog = data.painLog || [];
          state.currentPersona = data.persona || 'henrique';
          localStorage.setItem('spine_completed', JSON.stringify(state.completed));
          localStorage.setItem('spine_painLog', JSON.stringify(state.painLog));
          localStorage.setItem('spine_currentPersona', state.currentPersona);
          init();
          alert('✅ Progresso restaurado com sucesso!');
        } catch (err) {
          alert('❌ Erro ao ler o arquivo. Verifique o formato JSON.');
        }
      };
      reader.readAsText(file);
    });

    els.printBtn.addEventListener('click', window.print);
    
    els.fontToggle.addEventListener('click', () => {
      document.body.classList.toggle('large-text');
      localStorage.setItem('spine_largeFont', document.body.classList.contains('large-text'));
    });

    els.contrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      localStorage.setItem('spine_highContrast', document.body.classList.contains('high-contrast'));
    });
  }

  init();
});