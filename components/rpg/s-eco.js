export default class ProductCard extends HTMLElement {
    connectedCallback() {
        const item = this.getAttribute("item");
        const nivel = this.getAttribute("nivel");
        const descripcion = this.getAttribute("descripcion");
        const efecto = this.getAttribute("efecto");
        const coste = this.getAttribute("coste");
        this.innerHTML = ` 
         <div class="s-eco">
         <span class="nombre">${item}</span>
         <div class="chip">NIVEL ${nivel}</div>
         <div class="coste">${coste}</div>
         <p>${descripcion}</p>
         <div class="efecto">
         ${efecto}
         </div>
         </div>
        `;
    }
}
