const COMPONENTS = {
  // POSTS
  "s-rol": "rol/s-rol.js",
  "s-timeline": "rol/s-timeline.js",
  "s-event": "rol/s-event.js",
  "s-location": "rol/s-location.js",

  // RPG
  "s-eco": "rpg/s-eco.js",
  "s-item": "rpg/s-item.js",

  // UI
  "s-spoiler": "ui/s-spoiler.js",
  "s-tabs": "ui/s-tabs.js",
  "s-tab": "ui/s-tab.js",
  "s-carousel": "ui/s-carousel.js",
  "s-copy": "ui/s-copy.js",
  "s-accordion": "ui/s-accordion.js"
};

const loadingComponents = new Set();

function loadComponent(tag) {
  if (customElements.get(tag)) return;
  if (loadingComponents.has(tag)) return;

  const file = COMPONENTS[tag];
  if (!file) return;

  loadingComponents.add(tag);

  const base = import.meta.url.replace("/loader.js", "");

  import(`${base}/components/${file}?v=2`)
    .then(module => {
      if (customElements.get(tag)) return;

      const comp = module.default || module;
      customElements.define(tag, comp);
    })
    .catch(err => {
      console.error(`Error cargando ${tag}`, err);
    })
    .finally(() => {
      loadingComponents.delete(tag);
    });
}

function scan(root = document) {
  if (root.nodeType !== 1 && root.nodeType !== 9) return;

  if (root.nodeType === 1 && root.tagName.includes("-")) {
    loadComponent(root.tagName.toLowerCase());
  }

  root.querySelectorAll("*").forEach(el => {
    if (el.tagName.includes("-")) {
      loadComponent(el.tagName.toLowerCase());
    }
  });
}

scan();

new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      scan(node);
    });
  });
}).observe(document.body, {
  childList: true,
  subtree: true
});
