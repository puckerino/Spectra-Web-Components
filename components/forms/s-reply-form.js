export default class SReplyForm extends HTMLElement {

  connectedCallback() {

    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const placeholder =
      this.getAttribute("placeholder") ||
      "Escribe tu respuesta...";

    const button =
      this.getAttribute("button") ||
      "Responder";

    const template =
      this.getAttribute("template") || "";

    const topicId =
      this.getTopicId();

    if (!topicId) {

      this.innerHTML = `
        <p>
          No se pudo detectar
          el tema actual.
        </p>
      `;

      return;

    }

    const slot =
      this.innerHTML;

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

          border:
            1px solid var(--mono-border1);

          border-radius:
            var(--br);

          background:
            var(--mono-surface2);

          color:
            var(--mono-text1);

          padding:
            var(--spacing);

          font:
            var(--f-m)
            var(--f-body);

        }

        s-reply-form textarea {

          min-height: 12rem;

          resize: vertical;

        }

        s-reply-form input[type="submit"] {

          width: auto;

          justify-self: end;

          border:
            1px solid var(--mono-border1);

          border-radius:
            var(--br-pill);

          background:
            var(--mono-component1);

          color:
            var(--mono-text1);

          padding:
            var(--spacing-xs)
            var(--spacing-l);

          font:
            var(--f-s)
            var(--f-display-sans);

          text-transform:
            uppercase;

          cursor: pointer;

        }

      </style>

      <form
        class="s-reply-form"
        action="/post"
        method="post"
      >

        <input
          type="hidden"
          name="mode"
          value="reply"
        >

        <input
          type="hidden"
          name="t"
          value="${topicId}"
        >

        <div class="s-reply-fields">

          ${slot}

        </div>

        <textarea
          class="s-reply-output"
          name="message"
          id="message"
          placeholder="${placeholder}"
          required
          hidden
        ></textarea>

        <input
          type="submit"
          name="post"
          value="${button}"
        >

      </form>

    `;

    const form =
      this.querySelector("form");

    const output =
      this.querySelector(".s-reply-output");

    form.addEventListener(
      "submit",
      () => {

        output.value =
          this.buildOutput(template);

      }
    );

  }

  buildOutput(template) {

    const fields =
      this.querySelectorAll(
        "[data-field]"
      );

    const values = {};

    fields.forEach(field => {

      values[
        field.dataset.field
      ] = field.value || "";

    });

    // TEMPLATE SCENE
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

    // TEMPLATE EVENT
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

    // TEMPLATE ITEM
    if (template === "item") {

      return `

<s-item
  item="${values.item || ""}"
  cantidad="${values.cantidad || ""}"
  status="${values.status || ""}"
></s-item>

      `.trim();

    }

    // DEFAULT
    let output = "";

    fields.forEach(field => {

      output += `
${field.dataset.field}: ${field.value}
`;

    });

    return output.trim();

  }

  getTopicId() {

    const url =
      new URL(window.location.href);

    const topicFromQuery =
      url.searchParams.get("t");

    if (topicFromQuery) {

      return topicFromQuery;

    }

    const match =
      window.location.pathname.match(
        /t(\d+)/
      );

    if (match) {

      return match[1];

    }

    return "";

  }

}
