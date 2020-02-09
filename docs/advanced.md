# Advanced setup

The more advanced setup contains:

- Arguments with the script.
- Callback.
- Nested tabs.

## Scripts

Add this just before `</body>`:

```html
<script src="tabbis.js"></script>
<script>
  var tabs = tabbis.init({
    tabGroup: "[data-tabs]",
    paneGroup: "[data-panes]",
    tabActive: "active",
    paneActive: "active",
    memoryName: "tabbis",
    callback: function(tab, pane) {
      console.log(tab);
      console.log(pane);
    }
  });
</script>
```

#### `tabGroup` and `paneGroup`

- `tabGroup` is the selector of the direct parent of the tabs.
- `paneGroup` is the selector of the direct parent of the panes.

#### `tabActive` and `paneActive`

- `tabActive` is the classname that will be set when the tab is active.
- `paneActive` is the classname that will be set when the pane is active.

#### `memoryName`

By default the tab state is saved to local storage with the name `tabbis`. It can be changed to prevent collisions with another library.

#### `callback`

It's an anonymous function that will run when you click a tab. You will have access to the clicked `tab` and the respective `pane`.

To get all tabs within the group you can do this inside the anonymous function:

```js
console.log(tab.parentNode.children);
console.log(pane.parentNode.children);
```

## Stylesheet

Add this before `</head>`:

```html
<link rel="stylesheet" href="css/tabby.css" />
```

## Html

Nested tabs:

```html
<div data-tabs>
  <div>Tab1</div>
  <div>Tab2</div>
  <div>Tab3</div>
</div>

<div data-panes>
  <div>Pane1</div>
  <div>
    Pane2
    <div data-tabs>
      <div>Tab4</div>
      <div>Tab5</div>
    </div>

    <div data-panes>
      <div>Pane4</div>
      <div>
        Pane5
        <div data-tabs>
          <div>Tab6</div>
          <div>Tab7</div>
        </div>

        <div data-panes>
          <div>Pane6</div>
          <div>Pane7</div>
        </div>
      </div>
    </div>
  </div>
  <div>Pane3</div>
</div>
```
