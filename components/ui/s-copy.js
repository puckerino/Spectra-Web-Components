export default class SCopy extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const label = this.getAttribute("label") || "Copiar";
    const copiedLabel = this.getAttribute("copied") || "Copiado";
    const contenido = this.innerHTML;

    this.innerHTML = `
      <style>
        s-copy {
          display: block;
          position: relative;
          border: 1px solid var(--mono-border1);
          border-radius: var(--br);
          background: var(--mono-surface2);
          overflow: clip;
        }

        s-copy .s-copy-header {
          display: flex;
          justify-content: flex-end;
          padding: var(--spacing-xs);
          border-bottom: 1px solid var(--mono-border1);
        }

        s-copy .s-copy-content {
          padding: var(--spacing);
          white-space: pre-wrap;
        }
      </style>

      <div class="s-copy-header">
        <button type="button" class="s-copy-btn">
          ${label}
        </button>
      </div>

      <div class="s-copy-content">
        ${contenido}
      </div>
    `;

    const button = this.querySelector(".s-copy-btn");
    const content = this.querySelector(".s-copy-content");

    button.addEventListener("click", async () => {
      const text = content.innerText.trim();

      try {
        await navigator.clipboard.writeText(text);
        button.textContent = copiedLabel;
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.append(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();

        button.textContent = copiedLabel;
      }

      setTimeout(() => {
        button.textContent = label;
      }, 1500);
    });
  }
}
