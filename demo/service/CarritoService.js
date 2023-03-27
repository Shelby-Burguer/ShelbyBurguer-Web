import getConfig from 'next/config';

export class CarritoService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async postOrdenCarrito() {

        let resOrdenCarrito;

        const responseProducto = fetch('http://localhost:10000/orden/create', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );
      
        return resOrdenCarrito;
    }

    async postCarrito(idProducto, idOrden) {

        let resOrdenCarrito;

        const responseProducto = fetch('http://localhost:10000/carrito/create', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                idProducto:idProducto,
                idOrden: idOrden

            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );
        console.log('ResCarrito', resOrdenCarrito);
        return resOrdenCarrito;
    }

        async postProductosOrden(ProductosOrden) {

        let resOrdenCarrito;

        const responseProducto = fetch('http://localhost:10000/carrito/create/ProductoOrdene', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(ProductosOrden)
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );

        console.log('ResCarrito', resOrdenCarrito);
        return resOrdenCarrito;
    }

    async getCarrito() {

        let resOrdenCarrito;

        const responseProducto = fetch('http://localhost:10000/carrito/all', {
            headers: { 'Cache-Control': 'no-cache' },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));

        console.log('ResCarrito', resOrdenCarrito);

        return resOrdenCarrito;
    }

    DeleteCarrito() {
        return fetch('http://localhost:10000/carrito/delete', {
            method: 'DELETE'
        });
    }

    DeleteProductoCarrito(idProducto) {
        return fetch('http://localhost:10000/carrito/delete/'+ idProducto, {
            method: 'DELETE'
        });
    }

}