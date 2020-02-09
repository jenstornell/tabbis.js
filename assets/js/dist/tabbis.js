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

      [...group.children].forEach((tab, j) => {
        tab.i = i;
        tab.j = j;

        if (j === this.active) {
          this.activateTab(tab);
        }

        tab.addEventListener("click", e => {
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

      [...group.children].forEach((element, j) => {
        this.structure[i][j] = element;

        if (j === this.active) {
          this.activatePane(i, j);
        }
      });
    });
  }

  // Reset tabs
  resetTabs(tab) {
    [...tab.parentNode.children].forEach(item => {
      item.classList.remove("active");
    });
  }

  resetTabsChildren(group) {
    [...group.children].forEach(item => {
      item.classList.remove("active");
    });
  }

  // Reset panes
  resetPanes(tab) {
    this.structure[tab.i].forEach(element => {
      element.classList.remove("active");
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
    if (typeof this.memory === "undefined") return;

    this.active = parseInt(this.memory[i]);
  }

  saveMemory(tab) {
    if (!this.options.memory) return;

    if (typeof this.memory === "undefined") {
      this.memory = [];
    }
    this.memory[tab.i] = tab.j;

    localStorage.setItem(this.options.memoryName, JSON.stringify(this.memory));
  }

  // Defaults
  defaults() {
    return {
      tabGroup: "[data-tabs]",
      paneGroup: "[data-panes]",
      tabActive: "active",
      paneActive: "active",
      tabActiveData: "active",
      paneActiveData: "active",
      memory: true,
      memoryName: "tabbis"
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
    if (typeof this.options.callback === "function") {
      this.options.callback(tab, pane);
    }
  }
}

/*
Om Minne saknas eller är inaktivt, sätt data-active till aktiv istället (option)
Gör det i loadmemory? (option)

Om data-tab-active saknas, sätt till första elementet (option)

Bättre css med animeringar mobilanpassning osv

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

var tabbis = (function() {
  var fn = {};

  var data;
  var types = ["tab", "pane"];
  var type;
  var groups = [];
  var activeGroups = [];
  var activeChildren = [];
  var activeItems = [];
  var indexGroup;
  var indexItem;
  var memory = [];

  fn.init = function(options) {
    data = options;
    fn.setDefaults();
    fn.setMemory();

    groups["tab"] = document.querySelectorAll(data.tabGroup);
    groups["pane"] = document.querySelectorAll(data.paneGroup);

    for (var groupIndex = 0; groupIndex < groups["tab"].length; groupIndex++) {
      var tabItems = groups["tab"][groupIndex].children;

      for (var itemIndex = 0; itemIndex < tabItems.length; itemIndex++) {
        tabItems[itemIndex].addEventListener(
          "click",
          fn.onClick.bind(this, groupIndex, itemIndex),
          false
        );

        indexGroup = groupIndex;
        indexItem = itemIndex;

        if (!fn.hasMemory()) continue;
        fn.setNodes(groupIndex, itemIndex);
      }
    }
  };

  fn.onClick = function(groupIndex, itemIndex) {
    fn.setNodes(groupIndex, itemIndex);

    fn.setCallback(indexGroup, indexItem);
  };

  fn.setNodes = function(groupIndex, itemIndex) {
    indexGroup = groupIndex;
    indexItem = itemIndex;

    for (var i = 0; i < types.length; i++) {
      type = types[i];

      fn.setActiveGroup();
      fn.setActiveChildren();
      fn.setActiveItems();
      fn.putActiveClass();
    }

    memory[groupIndex] = [];
    memory[groupIndex][itemIndex] = true;

    localStorage.setItem("tabbis", JSON.stringify(memory));
  };

  fn.hasMemory = function() {
    if (typeof memory === "undefined") return;
    if (typeof memory[indexGroup] === "undefined") return;
    if (typeof memory[indexGroup][indexItem] === "undefined") return;
    if (memory[indexGroup][indexItem] !== true) return;
    return true;
  };

  fn.setMemory = function() {
    if (localStorage.getItem("tabbis") === null) return;
    if (localStorage.getItem("tabbis").length == 0) return;

    memory = Object.values(JSON.parse(localStorage.getItem("tabbis")));
  };

  fn.putActiveClass = function() {
    for (var i = 0; i < activeChildren[type].length; i++) {
      activeChildren[type][i].classList.remove(data[type + "Active"]);
    }

    activeItems[type].classList.add(data[type + "Active"]);
  };

  fn.setDefaults = function() {
    for (var i = 0; i < types.length; i++) {
      type = types[i];

      fn.setOption(type + "Group", "[data-" + type + "s]");
      fn.setOption(type + "Active", "active");
    }
  };

  fn.setOption = function(key, value) {
    data = data || [];
    data[key] = data[key] || value;
  };

  fn.setActiveGroup = function() {
    activeGroups[type] = groups[type][indexGroup];
  };

  fn.setActiveChildren = function() {
    activeChildren[type] = activeGroups[type].children;
  };

  fn.setActiveItems = function() {
    activeItems[type] = activeChildren[type][indexItem];
  };

  fn.setCallback = function() {
    if (typeof data.callback === "function") {
      data.callback(activeItems.tab, activeItems.pane);
    }
  };

  fn.reset = function() {
    for (var groupIndex = 0; groupIndex < groups["tab"].length; groupIndex++) {
      tabItems = groups["tab"][groupIndex].children;
      paneItems = groups["pane"][groupIndex].children;

      for (var itemIndex = 0; itemIndex < tabItems.length; itemIndex++) {
        tabItems[itemIndex].classList.remove(data["tabActive"]);
        paneItems[itemIndex].classList.remove(data["paneActive"]);
      }
    }
    localStorage.removeItem("tabbis");
  };

  return fn;
})();

var tabbis = (function() {
  var fn = {};

  var data;
  var types = ["tab", "pane"];
  var type;
  var groups = [];
  var activeGroups = [];
  var activeChildren = [];
  var activeItems = [];
  var indexGroup;
  var indexItem;
  var memory = [];

  fn.init = function(options) {
    data = options;
    fn.setDefaults();
    fn.setMemory();

    groups["tab"] = document.querySelectorAll(data.tabGroup);
    groups["pane"] = document.querySelectorAll(data.paneGroup);

    for (var groupIndex = 0; groupIndex < groups["tab"].length; groupIndex++) {
      var tabItems = groups["tab"][groupIndex].children;

      for (var itemIndex = 0; itemIndex < tabItems.length; itemIndex++) {
        tabItems[itemIndex].addEventListener(
          "click",
          fn.onClick.bind(this, groupIndex, itemIndex),
          false
        );

        indexGroup = groupIndex;
        indexItem = itemIndex;

        if (!fn.hasMemory()) continue;
        fn.setNodes(groupIndex, itemIndex);
      }
    }
  };

  fn.onClick = function(groupIndex, itemIndex) {
    fn.setNodes(groupIndex, itemIndex);
    fn.setCallback(indexGroup, indexItem);
  };

  fn.setNodes = function(groupIndex, itemIndex) {
    indexGroup = groupIndex;
    indexItem = itemIndex;

    for (var i = 0; i < types.length; i++) {
      type = types[i];

      fn.setActiveGroup();
      fn.setActiveChildren();
      fn.setActiveItems();
      fn.putActiveClass();
    }

    memory[groupIndex] = [];
    memory[groupIndex][itemIndex] = true;

    try {
      localStorage.setItem("tabbis", JSON.stringify(memory));
    } catch (e) {
      console.log("Tabs local storage failed. Most likely IE in use.");
    }
  };

  //fn.hasMemory = function () {
  //    if (typeof memory === 'undefined') return;
  //    if (typeof memory[indexGroup] === 'undefined') return;
  //    if (typeof memory[indexGroup][indexItem] === 'undefined') return;
  //    if (memory[indexGroup][indexItem] !== true) return;
  //    return true;
  //};

  fn.hasMemory = function() {
    // https://stackoverflow.com/questions/41902495/javascript-multidimensional-array-is-valid

    if (typeof memory === "undefined") return;
    if (typeof memory[indexGroup] === "undefined") return;
    if (memory[indexGroup] === null) return;
    if (typeof memory[indexGroup][indexItem] === "undefined") return;
    if (memory[indexGroup][indexItem] === null) return;
    if (memory[indexGroup][indexItem] !== true) return;
    return true;
  };

  fn.setMemory = function() {
    try {
      if (localStorage.getItem("tabbis") === null) return;
      if (localStorage.getItem("tabbis").length == 0) return;

      memory = Object.values(JSON.parse(localStorage.getItem("tabbis")));
    } catch (e) {
      console.log("Tabs local storage failed. Most likely IE in use.");
    }
  };

  fn.putActiveClass = function() {
    for (var i = 0; i < activeChildren[type].length; i++) {
      activeChildren[type][i].classList.remove(data[type + "Active"]);
    }

    activeItems[type].classList.add(data[type + "Active"]);
  };

  fn.setDefaults = function() {
    for (var i = 0; i < types.length; i++) {
      type = types[i];

      fn.setOption(type + "Group", "[data-" + type + "s]");
      fn.setOption(type + "Active", "active");
    }
  };

  fn.setOption = function(key, value) {
    data = data || [];
    data[key] = data[key] || value;
  };

  fn.setActiveGroup = function() {
    activeGroups[type] = groups[type][indexGroup];
  };

  fn.setActiveChildren = function() {
    activeChildren[type] = activeGroups[type].children;
  };

  fn.setActiveItems = function() {
    activeItems[type] = activeChildren[type][indexItem];
  };

  fn.setCallback = function() {
    if (typeof data.callback === "function") {
      data.callback(activeItems.tab, activeItems.pane);
    }
  };

  fn.reset = function() {
    for (var groupIndex = 0; groupIndex < groups["tab"].length; groupIndex++) {
      tabItems = groups["tab"][groupIndex].children;
      paneItems = groups["pane"][groupIndex].children;

      for (var itemIndex = 0; itemIndex < tabItems.length; itemIndex++) {
        tabItems[itemIndex].classList.remove(data["tabActive"]);
        paneItems[itemIndex].classList.remove(data["paneActive"]);
      }
    }
    localStorage.removeItem("tabbis");
  };

  return fn;
})();
