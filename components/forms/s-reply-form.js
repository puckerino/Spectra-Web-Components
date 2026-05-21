export default class SReplyForm extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const button = this.getAttribute("button") || "Responder";
    const template = this.getAttribute("template") || "";
    const topicId = this.getTopicId();
    const slot = this.innerHTML;

    if (!topicId) {
      this.innerHTML = `<p>No se pudo detectar el tema actual.</p>`;
      return;
    }

    this.innerHTML = `
      <style>
        s-reply-form {
          display: block;
        }

        s-reply-form .s-reply-form {
          display: grid;
          gap: var(--spacing);
        }

        s-reply-form .s-reply-fields {
          display: grid;
          gap: var(--spacing);
        }

        s-reply-form input,
        s-reply-form textarea,
        s-reply-form select {
          width: 100%;
          border: 1px solid var(--mono-border1);
          border-radius: var(--br);
          background: var(--mono-surface2);
          color: var(--mono-text1);
          padding: var(--spacing);
          font: var(--f-m) var(--f-body);
        }

        s-reply-form textarea {
          min-height: 12rem;
          resize: vertical;
        }

        s-reply-form button {
          width: max-content;
          justify-self: end;
          border: 1px solid var(--mono-border1);
          border-radius: var(--br-pill);
          background: var(--mono-component1);
          color: var(--mono-text1);
          padding: var(--spacing-xs) var(--spacing-l);
          font: var(--f-s) var(--f-display-sans);
          text-transform: uppercase;
          cursor: pointer;
        }
      </style>

      <form class="s-reply-form">
        <div class="s-reply-fields">
          ${slot}
        </div>

        <button type="submit">
          ${button}
        </button>
      </form>
    `;

    const form = this.querySelector("form");

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const message = this.buildOutput(template);

      if (!message.trim()) {
        alert("El mensaje está vacío.");
        return;
      }

      const data = new FormData();
      data.append("mode", "reply");
      data.append("t", topicId);
      data.append("message", message);
      data.append("post", "Enviar");

      try {
        const res = await fetch("/post", {
          method: "POST",
          body: data,
          credentials: "same-origin"
        });

        if (!res.ok) {
          alert("No se pudo enviar la respuesta.");
          return;
        }

        window.location.reload();

      } catch (err) {
        console.error("[s-reply-form] Error:", err);
        alert("Error enviando la respuesta.");
      }
    });
  }

  buildOutput(template) {
    const fields = this.querySelectorAll("[data-field]");
    const values = {};

    fields.forEach(field => {
      values[field.dataset.field] = field.value || "";
    });

    if (template === "item") {
      return `
<s-item
  item="${values.item || ""}"
  cantidad="${values.cantidad || ""}"
  status="${values.status || ""}"
></s-item>
      `.trim();
    }

    if (template === "event") {
      return `
<s-event
  titulo="${values.titulo || ""}"
  fecha="${values.fecha || ""}"
  lugar="${values.lugar || ""}"
>
${values.contenido || ""}
</s-event>
      `.trim();
    }

    if (template === "scene") {
      return `
<s-scene
  titulo="${values.titulo || ""}"
  lugar="${values.lugar || ""}"
  fecha="${values.fecha || ""}"
>
${values.contenido || ""}
</s-scene>
      `.trim();
    }

    let output = "";

    fields.forEach(field => {
      output += `${field.dataset.field}: ${field.value}\n`;
    });

    return output.trim();
  }

  getTopicId() {
    const url = new URL(window.location.href);

    const topicFromQuery = url.searchParams.get("t");
    if (topicFromQuery) return topicFromQuery;

    const match = window.location.pathname.match(/t(\d+)/);
    if (match) return match[1];

    return "";
  }
}
