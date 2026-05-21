export default class SItem extends HTMLElement {
  async connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const itemId = this.getAttribute("item-id") || "";
    const itemsKey = this.getAttribute("items-key") || "TIENDA_ITEMS";

    this.innerHTML = `
      <article class="s-item">
        Cargando...
      </article>
    `;

    await this.waitForItems(itemsKey);

    const items = window[itemsKey] || [];
    const item = items.find(i => String(i.id) === String(itemId));

    if (!item) {
      this.innerHTML = `
        <article class="s-item">
          Item no encontrado.
        </article>
      `;
      return;
    }

    this.render(item);
  }

  waitForItems(itemsKey) {
    return new Promise(resolve => {
      if (Array.isArray(window[itemsKey])) {
        resolve();
        return;
      }

      const interval = setInterval(() => {
        if (Array.isArray(window[itemsKey])) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  render(item) {
    const nombre = item.nombre || "";
    const categoria = item.categoria || "";
    const tipo = item.tipo || "";
    const precio = item.precio !== undefined ? item.precio : "";
    const descripcion = item.descripcion || "";
    const bonus = item.bonus || "";
    const imagen = item.imagen || "";

    this.innerHTML = `
      <style>
        s-item {
          display: block;
          border: 1px solid var(--mono-border1);
          border-radius: var(--br);
          background: var(--mono-surface2);
          overflow: clip;
        }

        s-item .s-item-inner {
          display: grid;
          gap: var(--spacing);
          padding: var(--spacing-l);
        }

        s-item .s-item-media:empty,
        s-item .s-item-meta span:empty,
        s-item .s-item-bonus:empty {
          display: none;
        }

        s-item .s-item-media img {
          display: block;
          max-width: 100%;
        }

        s-item .s-item-name {
          margin: 0;
          font: var(--f-xl) var(--f-display-sans);
        }

        s-item .s-item-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          font: var(--f-s) var(--f-mono);
          text-transform: uppercase;
          color: var(--mono-text2);
        }

        s-item .s-item-price {
          font-weight: bold;
          color: var(--accent-text1);
        }

        s-item .s-item-description {
          line-height: 1.5;
        }

        s-item .s-item-bonus {
          border-top: 1px solid var(--mono-border1);
          padding-top: var(--spacing);
        }
      </style>

      <article class="s-item-inner">
        <figure class="s-item-media">
          ${imagen ? `<img src="${imagen}" alt="${nombre}">` : ""}
        </figure>

        <header>
          <h3 class="s-item-name">${nombre}</h3>

          <div class="s-item-meta">
            <span>${categoria}</span>
            <span>${tipo}</span>
            <span class="s-item-price">${precio}</span>
          </div>
        </header>

        <div class="s-item-description">
          ${descripcion}
        </div>

        <div class="s-item-bonus">
          ${bonus}
        </div>
      </article>
    `;
  }
}
