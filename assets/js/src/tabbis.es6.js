class tabbisES6 {
	init(options) {
		this.structure = [];

		this.setOptions(options);
		this.setMemory();
		this.setTabs();
		this.setPanes();
	}

	// Set tabs event
	setTabs() {
		document.querySelectorAll(this.options.tabGroup).forEach((group, i) => {
			this.loadMemory(i);
			this.resetTabsChildren(group);

			[ ...group.children ].forEach((tab, j) => {
				tab.i = i;
				tab.j = j;

				if (j === this.active) {
					this.activateTab(tab);
				}

				tab.addEventListener('click', (e) => {
					const current = e.currentTarget;

					this.resetTabs(current);
					this.resetPanes(current);
					this.activateTab(current);
					this.activatePane(tab.i, tab.j);
					this.saveMemory(current);

					this.setCallback(current, this.structure[current.i][current.j]);
				});
			});
		});
	}

	// Set panes to structure
	setPanes() {
		this.structure = [];

		document.querySelectorAll(this.options.paneGroup).forEach((group, i) => {
			this.structure[i] = [];

			this.loadMemory(i);
			this.resetTabsChildren(group);

			[ ...group.children ].forEach((element, j) => {
				this.structure[i][j] = element;

				if (j === this.active) {
					this.activatePane(i, j);
				}
			});
		});
	}

	// Reset tabs
	resetTabs(tab) {
		[ ...tab.parentNode.children ].forEach((item) => {
			item.classList.remove('active');
		});
	}

	resetTabsChildren(group) {
		[ ...group.children ].forEach((item) => {
			item.classList.remove('active');
		});
	}

	// Reset panes
	resetPanes(tab) {
		this.structure[tab.i].forEach((element) => {
			element.classList.remove('active');
		});
	}

	// Activate tab
	activateTab(tab) {
		tab.classList.add(this.options.tabActive);
	}

	// Activate pane
	activatePane(i, j) {
		this.structure[i][j].classList.add(this.options.paneActive);
	}

	loadMemory(i) {
		if (!this.options.memory) return;
		if (typeof this.memory === 'undefined') return;

		this.active = parseInt(this.memory[i]);
	}

	saveMemory(tab) {
		if (!this.options.memory) return;

		if (typeof this.memory === 'undefined') {
			this.memory = [];
		}
		this.memory[tab.i] = tab.j;

		localStorage.setItem(this.options.memoryName, JSON.stringify(this.memory));
	}

	// Defaults
	defaults() {
		return {
			tabGroup: '[data-tabs]',
			paneGroup: '[data-panes]',
			tabActive: 'active',
			paneActive: 'active',
			tabActiveData: 'active',
			paneActiveData: 'active',
			memory: true,
			memoryName: 'tabbis'
		};
	}

	// Set options
	setOptions(options) {
		this.options = Object.assign({}, this.defaults(), options);
	}

	// Set memory
	setMemory() {
		if (!this.options.memory) return;

		const store = localStorage.getItem(this.options.memoryName);

		if (store === null) return;
		if (store.length == 0) return;

		this.memory = Object.values(JSON.parse(store));
	}

	// Set callback
	setCallback(tab, pane) {
		if (typeof this.options.callback === 'function') {
			this.options.callback(tab, pane);
		}
	}
}

/*
Om Minne saknas eller är inaktivt, sätt data-active till aktiv istället (option)
Gör det i loadmemory? (option)

Om data-tab-active saknas, sätt till första elementet (option)

Slå ihop resetTabs and resetTabsChildren och resetTabs

DOCS
tabActiveData: "active",
paneActiveData: "active",
memory: true,
memoryName: "tabbis"

https://stackoverflow.com/questions/57918378/javascript-nested-objects-default-fallback-options

tab: {
  group: "",
  activeClass: "",
  activeData: "",
},
pane: {
  group: "",
  activeClass: "",
  activeData: ""
},
memory: {
  name: "asda"
},
callback: function()
*/
