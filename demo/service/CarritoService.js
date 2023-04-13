import getConfig from 'next/config';

export class CarritoService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async postOrdenCarrito() {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}`},
            method: 'POST'
        });

        await responseProducto.then((dat) => dat.json().then((res) => (resOrdenCarrito = res)));

        return resOrdenCarrito;
    }

    async postCarrito(idProducto, idOrden) {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/carrito/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify({
                idProducto: idProducto,
                idOrden: idOrden
            })
        });

        await responseProducto.then((dat) => dat.json().then((res) => (resOrdenCarrito = res)));
        console.log('ResCarrito', resOrdenCarrito);
        return resOrdenCarrito;
    }

    async postProductosOrden(ProductosOrden) {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/carrito/create/ProductoOrdene`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify(ProductosOrden)
        });

        await responseProducto.then((dat) => dat.json().then((res) => (resOrdenCarrito = res)));

        console.log('ResCarrito', resOrdenCarrito);
        return resOrdenCarrito;
    }

    async getCarrito() {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/carrito/all`, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));

        console.log('ResCarrito', resOrdenCarrito);

        return resOrdenCarrito;
    }

    DeleteCarrito() {
        return fetch(`http://${this.ipAddress}:10000/carrito/delete`, {
            headers: { 'Authorization': `Bearer ${this.token}` },
            method: 'DELETE'
        });
    }

    DeleteProductoCarrito(idProducto) {
        return fetch(`http://${this.ipAddress}:10000/carrito/delete/` + idProducto, {
            headers: { 'Authorization': `Bearer ${this.token}` },
            method: 'DELETE'
        });
    }
}
