class tabbisClass {
	init(options) {
		this.thisOptions(options);
		this.thisMemory();
		this.setup();
	}

	// Setup
	setup() {
		const panes = document.querySelectorAll(this.options.paneGroup);
		const tabs = document.querySelectorAll(this.options.tabGroup);

		tabs.forEach((tabGroups, groupIndex) => {
			const paneGroups = panes[groupIndex];
			const activeIndex = this.getActiveIndex(tabGroups, groupIndex);

			tabGroups.setAttribute('role', 'tablist');

			// Reset items
			this.resetTabs([ ...tabGroups.children ]);
			this.resetPanes([ ...paneGroups.children ]);

			[ ...tabGroups.children ].forEach((tabItem, tabIndex) => {
				const paneItem = paneGroups.children[tabIndex];

				// Add attributes
				this.addTabAttributes(tabItem, groupIndex);
				this.addPaneAttributes(tabItem, paneItem);

				tabItem.groupIndex = groupIndex;

				// Trigger event
				tabItem.addEventListener(this.options.trigger, (e) => {
					this.activate(e.currentTarget, tabItem.groupIndex);
				});

				// Key event
				if (this.options.keyboardNavigation) {
					tabItem.addEventListener('keydown', (e) => {
						this.eventKey(e);
					});
				}
			});

			if (activeIndex !== null) {
				this.activateTab([ ...tabGroups.children ][activeIndex]);
				this.activatePane([ ...paneGroups.children ][activeIndex]);
			}
		});
	}

	// Event key
	eventKey(e) {
		if ([ 13, 37, 38, 39, 40 ].includes(e.keyCode)) {
			e.preventDefault();
		}

		if (e.keyCode == 13) {
			e.currentTarget.click();
		} else if ([ 39, 40 ].includes(e.keyCode)) {
			this.step(e, 1);
		} else if ([ 37, 38 ].includes(e.keyCode)) {
			this.step(e, -1);
		}
	}

	// Index
	index(el) {
		return [ ...el.parentElement.children ].indexOf(el);
	}

	// Step
	step(e, direction) {
		const children = e.currentTarget.parentElement.children;
		this.resetTabindex(children);

		let el = children[this.pos(e.currentTarget, children, direction)];
		el.focus();
		el.setAttribute('tabindex', 0);
	}

	resetTabindex(children) {
		[ ...children ].forEach((child) => {
			child.setAttribute('tabindex', '-1');
		});
	}

	// Pos
	pos(tab, children, direction) {
		let pos = this.index(tab);
		pos += direction;

		if (children.length <= pos) {
			pos = 0;
		} else if (pos == -1) {
			pos = children.length - 1;
		}

		return pos;
	}

	// Emit event
	emitEvent(tab, pane) {
		let event = new CustomEvent('tabbis', {
			bubbles: true,
			detail: {
				tab: tab,
				pane: pane
			}
		});

		tab.dispatchEvent(event);
	}

	// Set active
	getActiveIndex(groupTabs, groupIndex) {
		const memory = this.loadMemory(groupIndex);

		if (typeof memory !== 'undefined') {
			return memory;
		} else {
			let element = groupTabs.querySelector(this.options.tabActive);

			if (!element) {
				element = groupTabs.querySelector('[aria-selected="true"]');
			}

			if (element) {
				return this.index(element);
			} else if (this.options.tabActiveFallback !== false) {
				return this.options.tabActiveFallback;
			} else {
				return null;
			}
		}
	}

	// ATTRIBUTES

	// Add tab attributes
	addTabAttributes(tab, groupIndex) {
		const tabIndex = this.index(tab);
		const prefix = this.options.prefix;

		tab.setAttribute('role', 'tab');
		tab.setAttribute('aria-controls', `${prefix}tabpanel-${groupIndex}-${tabIndex}`);
		tab.setAttribute('id', `${prefix}tab-${groupIndex}-${tabIndex}`);
	}

	// Add tabpanel attributes
	addPaneAttributes(tab, pane) {
		pane.setAttribute('role', 'tabpanel');
		pane.setAttribute('aria-labelledby', tab.getAttribute('id'));
		pane.setAttribute('id', tab.getAttribute('aria-controls'));
		pane.setAttribute('tabindex', '0');
	}

	// Activate
	activate(tab, i) {
		const pane = document.querySelector(`#${tab.getAttribute('aria-controls')}`);

		this.resetTabs([ ...tab.parentNode.children ]);
		this.resetPanes([ ...pane.parentElement.children ]);

		this.activateTab(tab);
		this.activatePane(pane);

		this.saveMemory(tab, i);

		this.emitEvent(tab, pane);
	}

	// Activate tab
	activateTab(tab) {
		tab.setAttribute('aria-selected', 'true');
		tab.setAttribute('tabindex', '0');
	}

	// Activate pane
	activatePane(pane) {
		pane.removeAttribute('hidden');
	}

	// Remove tab attributes
	resetTabs(tabs) {
		tabs.forEach((el) => el.setAttribute('aria-selected', 'false'));
		this.resetTabindex(tabs);
	}

	// Reset pane attributes
	resetPanes(panes) {
		panes.forEach((el) => el.setAttribute('hidden', ''));
	}

	// MEMORY

	// Load memory
	loadMemory(groupIndex) {
		if (!this.options.memory) return;
		if (typeof this.memory[groupIndex] === 'undefined') return;
		if (this.memory[groupIndex] === null) return;

		return parseInt(this.memory[groupIndex]);
	}

	// Save memory
	saveMemory(tab, groupIndex) {
		if (!this.options.memory) return;
		this.memory[groupIndex] = this.index(tab);
		localStorage.setItem(this.options.memory, JSON.stringify(this.memory));
	}

	// This memory
	thisMemory() {
		if (!this.options.memory) return;
		const store = localStorage.getItem(this.options.memory);
		this.memory = store !== null ? JSON.parse(store) : [];
	}

	// OPTIONS

	// Defaults
	defaults() {
		return {
			keyboardNavigation: true,
			memory: false,
			paneGroup: '[data-panes]',
			prefix: '',
			tabActive: '[data-active]',
			tabActiveFallback: 0,
			tabGroup: '[data-tabs]',
			trigger: 'click'
		};
	}

	// This options
	thisOptions(options) {
		this.options = Object.assign(this.defaults(), options);
		if (this.options.memory !== true) return;
		this.options.memory = 'tabbis';
	}
}

// Function call
function tabbis(options = {}) {
	const tabs = new tabbisClass();
	tabs.init(options);
}
