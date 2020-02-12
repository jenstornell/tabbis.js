class tabbisClass {
	init(options) {
		this.structure = [];

		this.setOptions(options);
		this.setMemory();
		this.setTabs();
		this.setPanes();
	}

	// Set tabs event
	setTabs() {
		document.querySelectorAll(this.options.tab.group).forEach((group, i) => {
			this.setActive(i);
			this.resetClasses([ ...group.children ]); // Reset tabs

			[ ...group.children ].forEach((tab, j) => {
				tab.i = i;
				tab.j = j;

				if (j === this.active) {
					this.activateTabClass(tab);
				}

				tab.addEventListener('click', (e) => {
					const current = e.currentTarget;

					this.resetClasses([ ...current.parentNode.children ]); // Reset tabs
					this.resetClasses(this.structure[tab.i]); // Reset panes

					this.activateTabClass(current);
					this.activatePaneClass(tab.i, tab.j);
					this.saveMemory(current);

					this.setCallback(current, this.structure[current.i][current.j]);
				});
			});
		});
	}

	// Set panes to structure
	setPanes() {
		this.structure = [];

		document.querySelectorAll(this.options.pane.group).forEach((group, i) => {
			this.structure[i] = [];

			this.setActive(i);
			this.resetClasses([ ...group.children ]); // Reset panes

			[ ...group.children ].forEach((element, j) => {
				this.structure[i][j] = element;

				if (j === this.active) {
					this.activatePaneClass(i, j);
				}
			});
		});
	}

	// Set active
	setActive(i) {
		const memory = this.loadMemory(i);

		if (typeof memory !== 'undefined') {
			this.active = memory;
		} else {
			const element = document
				.querySelectorAll(this.options.tab.group)
				[i].querySelector(this.options.tab.activeData);

			if (element) {
				const index = [ ...element.parentElement.children ].indexOf(element);
				this.active = index;
			} else {
				this.active = 0;
			}
		}
	}

	// CLASSES

	// Reset
	resetClasses(elements) {
		elements.forEach((element) => {
			element.classList.remove('active');
		});
	}

	// Activate tab
	activateTabClass(tab) {
		tab.classList.add(this.options.tab.activeClass);
	}

	// Activate pane
	activatePaneClass(i, j) {
		this.structure[i][j].classList.add(this.options.pane.activeClass);
	}

	// MEMORY

	// Load memory
	loadMemory(i) {
		if (!this.options.memory) return;
		if (typeof this.memory[i] === 'undefined' || this.memory[i] == null) return;

		return parseInt(this.memory[i]);
	}

	// Save memory
	saveMemory(tab) {
		if (!this.options.memory) return;

		this.memory[tab.i] = tab.j;

		localStorage.setItem(this.options.memory, JSON.stringify(this.memory));
	}

	// Set memory
	setMemory() {
		if (!this.options.memory) return;

		this.memory = [];
		const store = localStorage.getItem(this.options.memory);

		if (store === null || store.length == 0) return;

		this.memory = Object.values(JSON.parse(store));
	}

	// OPTIONS

	// Defaults
	defaults() {
		return {
			tab: {
				group: '[data-tabs]',
				activeData: '[data-active]',
				activeClass: 'active'
			},
			pane: {
				group: '[data-panes]',
				activeClass: 'active'
			},
			memory: false
		};
	}

	// Set options
	setOptions(options) {
		this.options = this.mergeObjectsDeep(this.defaults(), options);

		if (this.options.memory === true) {
			this.options.memory = 'tabbis';
		}
	}

	// Set callback
	setCallback(tab, pane) {
		if (typeof this.options.callback === 'function') {
			this.options.callback(tab, pane);
		}
	}

	// Merge objects deep
	mergeObjectsDeep() {
		for (var o = {}, i = 0; i < arguments.length; i++) {
			if (arguments[i].constructor !== Object) continue;
			for (var k in arguments[i]) {
				if (arguments[i].hasOwnProperty(k)) {
					o[k] =
						arguments[i][k].constructor === Object
							? this.mergeObjectsDeep(o[k] || {}, arguments[i][k])
							: arguments[i][k];
				}
			}
		}
		return o;
	}
}

function tabbis(options = {}) {
	let tabs = new tabbisClass();
	tabs.init(options);
}
