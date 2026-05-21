export default class SpectraRol extends HTMLElement {
    connectedCallback() {
        const titulo = this.getAttribute("titulo");
        const subtitulo = this.getAttribute("subtitulo");
        const lugar = this.getAttribute("lugar");
        const fecha = this.getAttribute("fecha");
        const pjs = this.getAttribute("pjs");
        const triggers = this.getAttribute("triggers");
        this.innerHTML = ` 
        <hgroup>
        <h2 class="sp-rol-title">${titulo}</h2>
        <span class="sp-rol-subtitle">${subtitulo}</span>
        </hgroup>
        <menu class="sp-rol-data">
        <li>${lugar}</li>
        <li>${fecha}</li>
        <li>${pjs}</li>
        </menu>
        <article class="sp-rol-content">
        <article class="tw">
        <span class="sp-tw-title">TRIGGER WARNINGS:</span>
        <span class="sp-triggers">${triggers}</span>
        </article>
        <slot></slot>
        </article>
        `;
    }
}
