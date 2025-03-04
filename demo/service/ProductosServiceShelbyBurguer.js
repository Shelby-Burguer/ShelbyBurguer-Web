import getConfig from 'next/config';

export class ProductService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    /*getProductsSmall() {
        return fetch(this.contextPath + '/demo/data/productos-ShelbyBurguer-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }*/

    getProducts() {
        return fetch(this.contextPath + '/demo/data/Producto-ShaelbyBurguer.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

        getTypeProducts() {
        return fetch(this.contextPath + '/demo/data/tipo_productos.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    /*getProductsWithOrdersSmall() {
        return fetch(this.contextPath + '/demo/data/productos-ShelbyBurguer-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }*/
}
