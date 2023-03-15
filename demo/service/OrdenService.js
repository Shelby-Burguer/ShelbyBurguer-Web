import getConfig from 'next/config';

export class OrdenService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async getProductoOrden(id) {

        let resOrdenCarrito;

        const responseProducto = fetch('http://localhost:10000/orden/all/'+ id, {
            headers: { 'Cache-Control': 'no-cache' },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));

        console.log('ResCarrito', resOrdenCarrito);

        return resOrdenCarrito;
    }


}    
    
