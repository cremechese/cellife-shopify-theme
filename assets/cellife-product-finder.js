/* UI only. Rules and evidence are separate modules; health answers never leave memory. */
if (!customElements.get('cellife-product-finder')) {
  customElements.define('cellife-product-finder', class extends HTMLElement {
    async connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const controller = this.controller;
      this.answers = {};
      this.step = 0;
      this.started = false;
      this.showingResult = false;
      this.stage = this.querySelector('[data-finder-stage]');
      try {
        this.config = JSON.parse(this.querySelector('[data-finder-config]').textContent);
        // The published-theme hold is also rendered by Liquid; never start a health flow there.
        if (this.config.mode !== 'draft') return;
        const [{evaluate, connectDestination}, {catalog, questions}] = await Promise.all([import(this.config.engineUrl), import(this.config.dataUrl)]);
        if (this.controller !== controller || controller.signal.aborted) return;
        this.evaluate = evaluate;
        this.connectDestination = connectDestination;
        this.catalog = catalog;
        this.questions = questions;
        const options = {signal:this.controller.signal};
        this.addEventListener('click', event => {
          const action = event.target.closest('[data-finder-action]')?.dataset.finderAction;
          if (action === 'start') { this.started = true; this.showQuestion(0); }
          if (action === 'restart') this.reset();
          if (action === 'back') {
            if (this.showingResult) { this.showingResult = false; this.showQuestion(this.step); }
            else this.showQuestion(Math.max(0,this.step - 1));
          }
        }, options);
        this.addEventListener('change', event => this.changed(event), options);
        this.addEventListener('submit', event => { event.preventDefault(); this.advance(); }, options);
        // A bfcache restoration must not resurrect health answers or a previous result.
        window.addEventListener('pagehide', () => this.clear(), options);
        window.addEventListener('pageshow', event => { if (event.persisted) this.reset(); }, options);
        this.reset();
      } catch {
        this.stage.replaceChildren(this.node('p','The draft finder could not load. Please try again later or speak with a pharmacist.'));
      }
    }
    disconnectedCallback() { this.clear(); this.controller?.abort(); this.controller = null; }
    clear() {
      this.answers = {};
      this.step = 0;
      this.started = false;
      this.showingResult = false;
      this.stage?.replaceChildren();
      this.querySelector('[data-finder-evidence-content]')?.replaceChildren();
    }
    reset() {
      this.clear();
      const initial = this.evaluate({},this.catalog,this.config.mode);
      if (initial.status === 'DATA_HOLD') return this.showResult(initial);
      const panel = this.node('div',null,'cellife-finder__panel');
      panel.append(this.button(this.config.startLabel || 'Start the product finder','start'));
      this.stage.append(panel);
      this.updateEvidence(null);
    }
    node(tag, text, className) {
      const element = document.createElement(tag);
      if (text !== null && text !== undefined) element.textContent = text;
      if (className) element.className = className;
      return element;
    }
    button(label, action, secondary = false) {
      const button = this.node('button',label,secondary?'cellife-finder__secondary':'');
      button.type = 'button'; button.dataset.finderAction = action;
      return button;
    }
    question() {
      const question = this.questions[this.step];
      return this.step === 4 ? {...question,...question.branches[this.answers.goal]} : question;
    }
    showQuestion(index) {
      this.step = index;
      this.showingResult = false;
      const q = this.question();
      if (!q.options) return this.reset();
      const form = this.node('form',null,'cellife-finder__panel');
      form.noValidate = true;
      const progress = this.node('p',`Question ${index + 1} of up to 5`,'cellife-finder__progress');
      progress.setAttribute('role','status');
      const fieldset = this.node('fieldset'), legend = this.node('legend',q.label);
      legend.tabIndex = -1;
      fieldset.append(legend);
      const choices = this.node('div',null,'cellife-finder__options');
      for (const option of q.options) {
        const label = this.node('label',null,'cellife-finder__option'), input = document.createElement('input');
        input.type = q.type === 'multi' ? 'checkbox' : 'radio';
        input.name = 'finder-choice'; input.value = option.value;
        input.checked = q.type === 'multi' ? (this.answers[q.key] || []).includes(option.value) : this.answers[q.key] === option.value;
        label.append(input,this.node('span',option.label)); choices.append(label);
      }
      const error = this.node('p','','cellife-finder__error');
      error.dataset.finderError = ''; error.id = `FinderError-${this.dataset.instance || ''}-${index}`;
      error.setAttribute('role','alert');
      fieldset.setAttribute('aria-describedby',error.id);
      fieldset.append(choices);
      const actions = this.node('div',null,'cellife-finder__actions');
      if (index > 0) actions.append(this.button('Back','back',true));
      const next = this.node('button',index === 4 ? 'See result' : 'Continue'); next.type = 'submit';
      actions.append(next,this.button('Restart','restart',true));
      form.append(progress,fieldset,error,actions);
      this.stage.replaceChildren(form);
      this.updateEvidence(null);
      legend.focus({preventScroll:true});
    }
    changed(event) {
      if (this.showingResult || !(event.target instanceof HTMLInputElement)) return;
      const q = this.question(), inputs = [...this.stage.querySelectorAll('input')];
      if (q.type === 'multi') {
        if (event.target.checked) {
          if (q.exclusive.includes(event.target.value)) inputs.forEach(i=>{if (i!==event.target) i.checked=false;});
          else inputs.filter(i=>q.exclusive.includes(i.value)).forEach(i=>i.checked=false);
        }
        this.answers[q.key] = inputs.filter(i=>i.checked).map(i=>i.value);
      } else {
        if (q.key === 'goal' && this.answers.goal !== event.target.value) delete this.answers.detail;
        this.answers[q.key] = event.target.value;
      }
      this.querySelector('[data-finder-error]').textContent = '';
    }
    advance() {
      const q = this.question(), value = this.answers[q.key];
      if (value === undefined || (Array.isArray(value) && !value.length)) {
        this.querySelector('[data-finder-error]').textContent = 'Choose an answer before continuing.';
        return;
      }
      const result = this.evaluate(this.answers,this.catalog,this.config.mode);
      if (['REVIEW','NO_MATCH','DATA_HOLD','INVALID'].includes(result.status)) return this.showResult(result);
      if (this.step < 4) return this.showQuestion(this.step + 1);
      this.showResult(result);
    }
    showResult(engineResult) {
      this.showingResult = true;
      const {result,destination} = this.connectDestination(engineResult,this.config.mappings,location.origin);
      const mapped = result.status === 'MATCH' ? this.config.mappings[result.productIds[0]] : null;
      const panel = this.node('div',null,'cellife-finder__panel');
      const titles = {MATCH:'One product to explore',REVIEW:'Individual review comes first',NO_MATCH:'No clear product-sheet match',DATA_HOLD:'This finder is awaiting review',INCOMPLETE:'More information is needed',INVALID:'Please check your answers'};
      const heading = this.node('h3',titles[result.status],'cellife-finder__result-title'); heading.tabIndex=-1; panel.append(heading);
      if (result.status === 'MATCH') {
        const id = result.productIds[0], record = this.catalog.products.find(p=>p.id===id);
        const goal = this.questions[0].options.find(o=>o.value===this.answers.goal)?.label;
        panel.append(this.node('p',`Why it appeared: You selected ${goal.toLowerCase()}. The supplied Cellife sheet includes this goal in its advertising. This is a supplier claim, not independently verified evidence of effectiveness.`));
        const card = this.node('div',null,'cellife-finder__product');
        if (mapped.image) { const img = document.createElement('img'); img.src=mapped.image; img.alt=''; img.width=140; img.height=180; card.append(img); }
        const detail = this.node('div'); detail.append(this.node('h3',mapped.title),this.node('p',mapped.price));
        const link = this.node('a','View draft product information','cellife-finder__product-link'); link.href=destination; detail.append(link); card.append(detail); panel.append(card);
        panel.append(this.node('p','Before use: Read the current label and follow its directions. This quiz does not establish suitability. Ask a pharmacist about medicines, other supplements or ingredients. No dose is selected by this finder.'));
        for (const warning of record.sheetWarnings) panel.append(this.node('p','Supplier-sheet warning (not yet checked against the current label): '+warning));
        panel.append(this.node('p','New, severe or persistent symptoms need individual assessment.'));
      } else if (result.status === 'REVIEW') {
        panel.append(this.node('p','Your answers need individual review before we suggest a product. Please speak with a pharmacist or healthcare professional.'));
        panel.append(this.node('p','This is a conservative quiz safeguard, not a finding that every product is contraindicated. Seek prompt medical attention for severe or sudden symptoms.'));
      } else if (result.status === 'NO_MATCH') {
        panel.append(this.node('p',this.answers.goal === 'other' ? 'We do not have a clear product-sheet match for that goal.' : 'We could not identify a product-sheet match that meets your answers. A pharmacist or healthcare professional can help review suitable options.'));
      } else if (result.status === 'DATA_HOLD') {
        if (result.reasonIds.includes('R7_SOURCE_IDENTITY_HOLD')) panel.append(this.node('p','The Royal Jelly catalogue connection needs an updated source sheet. The brief describes propolis; its formulation claims and warnings cannot be transferred to a different product.'));
        panel.append(this.node('p','No product can be suggested until the source records, current labels, claims and product destinations are reviewed. A missing destination is never replaced with another product.'));
      } else panel.append(this.node('p','No product has been selected. Go back to check your answers or restart.'));
      for (const [id, reasons] of Object.entries(result.exclusionReasons)) {
        const p = this.catalog.products.find(p=>p.id===id);
        if (reasons.some(r=>r.startsWith('W_') || r==='P_AMPK_DIET_REVIEW')) for (const warning of p.sheetWarnings) panel.append(this.node('p',`${p.name} — supplier-sheet warning: ${warning}`));
        if (reasons.includes('F_FISH_OIL')) panel.append(this.node('p',`${p.name}: the sheet lists fish oil, which does not meet a vegan requirement.`));
        if (reasons.includes('F_OYSTER_SHELL')) panel.append(this.node('p',`${p.name}: the sheet lists oyster shell, which does not meet a vegan requirement.`));
        if (reasons.includes('P_VEGAN_UNVERIFIED')) panel.append(this.node('p',`${p.name}: full capsule and excipient compatibility has not been verified. This is a quiz safeguard.`));
      }
      const actions = this.node('div',null,'cellife-finder__actions');
      if (this.started) actions.append(this.button('Back to answers','back',true));
      actions.append(this.button('Restart','restart',true)); panel.append(actions);
      this.stage.replaceChildren(panel); this.updateEvidence(result); heading.focus({preventScroll:true});
    }
    updateEvidence(result) {
      const target = this.querySelector('[data-finder-evidence-content]');
      if (!target) return;
      target.replaceChildren();
      if (!result) { target.textContent='Draft review references will appear here. Answers are not logged.'; return; }
      target.append(this.node('p',`Rules version: ${result.rulesVersion}. Rules: ${result.reasonIds.join(', ')}.`));
      for (const id of result.evidenceIds) {
        const record = this.catalog.evidence.find(e=>e.evidenceId===id);
        if (record) target.append(this.node('p',`${record.evidenceId} · ${record.kind} · ${record.sourceId}, p${record.page}, ${record.section}: ${record.paraphrase}`));
      }
    }
  });
}
