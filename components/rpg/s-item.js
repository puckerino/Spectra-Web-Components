export default class SItem extends HTMLElement {

  async connectedCallback() {

    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const itemId =
      this.getAttribute("item") || "";

    const cantidad =
      this.getAttribute("cantidad") || "";

    const status =
      this.getAttribute("status") || "";

    const itemsKey =
      this.getAttribute("items-key") ||
      "TIENDA_ITEMS";

    this.innerHTML = `
      <article class="s-item">
        Cargando...
      </article>
    `;

    const loaded =
      await this.waitForItems(itemsKey);

    if (!loaded) {

      this.innerHTML = `
        <article class="s-item">
          No se encontró
          window.${itemsKey}
        </article>
      `;

      return;

    }

    const items =
      window[itemsKey] || [];

    const item = items.find(i =>
      String(i.id).toLowerCase() ===
      String(itemId).toLowerCase()
    );

    if (!item) {

      this.innerHTML = `
        <article class="s-item">
          Item no encontrado:
          ${itemId}
        </article>
      `;

      return;

    }

    this.render(
      item,
      cantidad,
      status
    );

  }

  waitForItems(itemsKey) {

    return new Promise(resolve => {

      if (Array.isArray(window[itemsKey])) {

        resolve(true);
        return;

      }

      window.addEventListener(
        "spectra:items-ready",
        () => {

          resolve(
            Array.isArray(window[itemsKey])
          );

        },
        { once: true }
      );

      setTimeout(() => {

        resolve(
          Array.isArray(window[itemsKey])
        );

      }, 8000);

    });

  }

  render(item, cantidad, status) {

    const nombre =
      item.nombre || "";

    const bonus =
      item.bonus || "";

    this.innerHTML = `

      <style>

        s-item {
          display: block;

          border:
            1px solid var(--mono-border1);

          border-radius:
            var(--br);

          background:
            var(--mono-surface2);

          overflow: clip;
        }

        s-item .s-item-inner {

          display: grid;

          gap: var(--spacing);

          padding:
            var(--spacing-l);

        }

        s-item .s-item-header {

          display: flex;

          flex-wrap: wrap;

          align-items: center;

          justify-content: space-between;

          gap: var(--spacing);

        }

        s-item .s-item-name {

          margin: 0;

          font:
            300
            var(--f-base)
            var(--f-display-sans);
            text-transform: uppercase;

        }

        s-item .s-item-meta {

          display: flex;

          flex-wrap: wrap;

          gap: var(--spacing-xs);

        }

        s-item .s-item-chip {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding:
            var(--spacing-3xs)
            var(--spacing-s);

          border-radius:
            var(--br-pill);

          border:
            1px solid var(--mono-border1);

          background:
            var(--mono-component1);

          font:
            var(--f-s)
            var(--f-mono);

          text-transform: uppercase;

          color:
            var(--mono-text2);

        }

        s-item .s-item-status.is-active {

          background:
            var(--success-surface);

          border-color:
            var(--success-border);

          color:
            var(--success-text);

        }

        s-item .s-item-status.is-empty {

          background:
            var(--danger-surface);

          border-color:
            var(--danger-border);

          color:
            var(--danger-text);

        }

        s-item .s-item-bonus {

          border-top:
            1px solid var(--mono-border1);

          padding-top:
            var(--spacing);

          line-height: 1.5;

        }

      </style>

      <article class="s-item-inner">

        <header class="s-item-header">

          <h3 class="s-item-name">

            ${nombre}

          </h3>

          <div class="s-item-meta">

            ${
              cantidad
                ? `
                  <span class="s-item-chip">
                    x${cantidad}
                  </span>
                `
                : ""
            }

            ${
              status === "activo"
                ? `
                  <span
                    class="
                      s-item-chip
                      s-item-status
                      is-active
                    "
                  >
                    activo
                  </span>
                `
                : ""
            }

            ${
              status === "agotado"
                ? `
                  <span
                    class="
                      s-item-chip
                      s-item-status
                      is-empty
                    "
                  >
                    agotado
                  </span>
                `
                : ""
            }

          </div>

        </header>

        <div class="s-item-bonus">

          ${bonus}

        </div>

      </article>

    `;

  }

}
