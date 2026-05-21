function loadComponent(tag) {
    if (customElements.get(tag)) return;

    //base dinámica (funciona desde CDN o local)
    const base = import.meta.url.replace("/loader.js", "");

    import(`${base}/components/${tag}.js`)
    .then(module => {
        const comp = module.default || module;
        customElements.define(tag,comp);
    })
    .catch(() => {
        //opcional: ignorar si no existe
    });
}

function scan(root = document) {
    root.querySelectorAll("*").forEach(el => {
        if(el.tagName.includes("-")) {
            loadComponent(el.tagName.toLowerCase());
        }
    });
}

//cargar inicial
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
