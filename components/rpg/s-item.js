export default class SItem extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const itemId = this.getAttribute("id") || this.getAttribute("item-id") || "";

    if (!itemId) {
      this.innerHTML = "";
      return;
    }

    this.innerHTML = `
      <article class="s-item">
        Cargando...
      </article>
    `;

    const db = firebase.firestore();

    db.collection("tienda_items")
      .where("itemId", "==", itemId)
      .limit(1)
      .get()
      .then((snap) => {
        if (snap.empty) {
          this.innerHTML = `
            <article class="s-item">
              Item no encontrado.
            </article>
          `;
          return;
        }

        const data = snap.docs[0].data();

        const nombre = data.nombre || "";
        const categoria = data.categoria || "";
        const tipo = data.tipo || "";
        const precio = data.precio !== undefined ? data.precio : "";
        const descripcion = data.descripcion || "";
        const bonus = data.bonus || "";
        const imagen = data.imagen_url || data.imagen_svg || "";

        this.innerHTML = `
          <style>
            s-item {
              display: block;
              border: 1px solid var(--mono-border1);
              border-radius: var(--br);
              background: var(--mono-surface2);
              overflow: clip;
            }

            s-item .s-item {
              display: grid;
              gap: var(--spacing);
              padding: var(--spacing-l);
            }

            s-item .s-item-media:empty,
            s-item .s-item-meta:empty,
            s-item .s-item-bonus:empty {
              display: none;
            }

            s-item .s-item-media img {
              max-width: 100%;
              display: block;
            }

            s-item .s-item-name {
              font: var(--f-xl) var(--f-display-sans);
              margin: 0;
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

          <article class="s-item">
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
      })
      .catch((err) => {
        console.warn("[s-item] Error cargando item:", err);

        this.innerHTML = `
          <article class="s-item">
            No se pudo cargar el item.
          </article>
        `;
      });
  }
}
