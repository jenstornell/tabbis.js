"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var tabbisClass =
/*#__PURE__*/
function () {
  function tabbisClass() {
    _classCallCheck(this, tabbisClass);
  }

  _createClass(tabbisClass, [{
    key: "init",
    value: function init(options) {
      this.thisOptions(options);
      this.thisMemory();
      this.setup();
    } // Setup

  }, {
    key: "setup",
    value: function setup() {
      var _this = this;

      var panes = document.querySelectorAll(this.options.paneGroup);
      var tabs = document.querySelectorAll(this.options.tabGroup);
      tabs.forEach(function (tabGroups, groupIndex) {
        var paneGroups = panes[groupIndex];

        var activeIndex = _this.getActiveIndex(tabGroups, groupIndex);

        tabGroups.setAttribute('role', 'tablist'); // Reset items

        _this.resetTabs(_toConsumableArray(tabGroups.children));

        _this.resetPanes(_toConsumableArray(paneGroups.children));

        _toConsumableArray(tabGroups.children).forEach(function (tabItem, tabIndex) {
          var paneItem = paneGroups.children[tabIndex]; // Add attributes

          _this.addTabAttributes(tabItem, groupIndex);

          _this.addPaneAttributes(tabItem, paneItem);

          tabItem.groupIndex = groupIndex; // Trigger event

          tabItem.addEventListener(_this.options.trigger, function (e) {
            _this.activate(e.currentTarget, tabItem.groupIndex);
          }); // Key event

          if (_this.options.keyboardNavigation) {
            tabItem.addEventListener('keydown', function (e) {
              _this.eventKey(e);
            });
          }
        });

        if (activeIndex !== null) {
          _this.activateTab(_toConsumableArray(tabGroups.children)[activeIndex]);

          _this.activatePane(_toConsumableArray(paneGroups.children)[activeIndex]);
        }
      });
    } // Event key

  }, {
    key: "eventKey",
    value: function eventKey(e) {
      if ([13, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }

      if (e.keyCode == 13) {
        e.currentTarget.click();
      } else if ([39, 40].includes(e.keyCode)) {
        this.step(e, 1);
      } else if ([37, 38].includes(e.keyCode)) {
        this.step(e, -1);
      }
    } // Index

  }, {
    key: "index",
    value: function index(el) {
      return _toConsumableArray(el.parentElement.children).indexOf(el);
    } // Step

  }, {
    key: "step",
    value: function step(e, direction) {
      var children = e.currentTarget.parentElement.children;
      this.resetTabindex(children);
      var el = children[this.pos(e.currentTarget, children, direction)];
      el.focus();
      el.setAttribute('tabindex', 0);
    }
  }, {
    key: "resetTabindex",
    value: function resetTabindex(children) {
      _toConsumableArray(children).forEach(function (child) {
        child.setAttribute('tabindex', '-1');
      });
    } // Pos

  }, {
    key: "pos",
    value: function pos(tab, children, direction) {
      var pos = this.index(tab);
      pos += direction;

      if (children.length <= pos) {
        pos = 0;
      } else if (pos == -1) {
        pos = children.length - 1;
      }

      return pos;
    } // Emit event

  }, {
    key: "emitEvent",
    value: function emitEvent(tab, pane) {
      var event = new CustomEvent('tabbis', {
        bubbles: true,
        detail: {
          tab: tab,
          pane: pane
        }
      });
      tab.dispatchEvent(event);
    } // Set active

  }, {
    key: "getActiveIndex",
    value: function getActiveIndex(groupTabs, groupIndex) {
      var memory = this.loadMemory(groupIndex);

      if (typeof memory !== 'undefined') {
        return memory;
      } else {
        var element = groupTabs.querySelector(this.options.tabActive);

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
    } // ATTRIBUTES
    // Add tab attributes

  }, {
    key: "addTabAttributes",
    value: function addTabAttributes(tab, groupIndex) {
      var tabIndex = this.index(tab);
      var prefix = this.options.prefix;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', "".concat(prefix, "tabpanel-").concat(groupIndex, "-").concat(tabIndex));
      tab.setAttribute('id', "".concat(prefix, "tab-").concat(groupIndex, "-").concat(tabIndex));
    } // Add tabpanel attributes

  }, {
    key: "addPaneAttributes",
    value: function addPaneAttributes(tab, pane) {
      pane.setAttribute('role', 'tabpanel');
      pane.setAttribute('aria-labelledby', tab.getAttribute('id'));
      pane.setAttribute('id', tab.getAttribute('aria-controls'));
      pane.setAttribute('tabindex', '0');
    } // Activate

  }, {
    key: "activate",
    value: function activate(tab, i) {
      var pane = document.querySelector("#".concat(tab.getAttribute('aria-controls')));
      this.resetTabs(_toConsumableArray(tab.parentNode.children));
      this.resetPanes(_toConsumableArray(pane.parentElement.children));
      this.activateTab(tab);
      this.activatePane(pane);
      this.saveMemory(tab, i);
      this.emitEvent(tab, pane);
    } // Activate tab

  }, {
    key: "activateTab",
    value: function activateTab(tab) {
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
    } // Activate pane

  }, {
    key: "activatePane",
    value: function activatePane(pane) {
      pane.removeAttribute('hidden');
    } // Remove tab attributes

  }, {
    key: "resetTabs",
    value: function resetTabs(tabs) {
      tabs.forEach(function (el) {
        return el.setAttribute('aria-selected', 'false');
      });
      this.resetTabindex(tabs);
    } // Reset pane attributes

  }, {
    key: "resetPanes",
    value: function resetPanes(panes) {
      panes.forEach(function (el) {
        return el.setAttribute('hidden', '');
      });
    } // MEMORY
    // Load memory

  }, {
    key: "loadMemory",
    value: function loadMemory(groupIndex) {
      if (!this.options.memory) return;
      if (typeof this.memory[groupIndex] === 'undefined') return;
      if (this.memory[groupIndex] === null) return;
      return parseInt(this.memory[groupIndex]);
    } // Save memory

  }, {
    key: "saveMemory",
    value: function saveMemory(tab, groupIndex) {
      if (!this.options.memory) return;
      this.memory[groupIndex] = this.index(tab);
      localStorage.setItem(this.options.memory, JSON.stringify(this.memory));
    } // This memory

  }, {
    key: "thisMemory",
    value: function thisMemory() {
      if (!this.options.memory) return;
      var store = localStorage.getItem(this.options.memory);
      this.memory = store !== null ? JSON.parse(store) : [];
    } // OPTIONS
    // Defaults

  }, {
    key: "defaults",
    value: function defaults() {
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
    } // This options

  }, {
    key: "thisOptions",
    value: function thisOptions(options) {
      this.options = Object.assign(this.defaults(), options);
      if (this.options.memory !== true) return;
      this.options.memory = 'tabbis';
    }
  }]);

  return tabbisClass;
}(); // Function call


function tabbis() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var tabs = new tabbisClass();
  tabs.init(options);
}