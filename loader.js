function loadComponent(tag) {

  // evitar registrar dos veces
  if (customElements.get(tag)) return;

  // mapa de componentes
  const COMPONENTS = {

    // POSTS
    "s-rol": "rol/s-rol.js",

    // RPG
    "s-eco": "rpg/s-eco.js",

    // UI
    "s-spoiler": "ui/s-spoiler.js"
    "s-tabs": "ui/s-tabs.js",
    "s-tab": "ui/s-tab.js",
    "s-accordion": "ui/s-accordion.js",

  };

  // archivo asociado
  const file = COMPONENTS[tag];

  // si no existe en el mapa
  if (!file) return;

  // base dinámica
  const base =
    import.meta.url.replace("/loader.js", "");

  // importar componente
  import(`${base}/components/${file}?v=1`)
    .then(module => {

      const comp =
        module.default || module;

      customElements.define(tag, comp);

    })
    .catch(err => {

      console.error(
        `Error cargando ${tag}`,
        err
      );

    });

}

function scan(root = document) {

  root
    .querySelectorAll("*")
    .forEach(el => {

      if (
        el.tagName.includes("-")
      ) {

        loadComponent(
          el.tagName.toLowerCase()
        );

      }

    });

}

// carga inicial
scan();

// observar cambios dinámicos
new MutationObserver(mutations => {

  mutations.forEach(m => {

    m.addedNodes.forEach(node => {

      if (node.nodeType === 1) {

        scan(node);

      }

    });

  });

}).observe(document.body, {

  childList: true,
  subtree: true

});
