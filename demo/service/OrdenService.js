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

    async getOrden(id) {

        let resOrden;

        const responseProducto = fetch('http://localhost:10000/orden/one/'+ id, {
            headers: { 'Cache-Control': 'no-cache' },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrden = data));

        console.log('ResCarrito', resOrden);

        return resOrden;
    }

        async getUpdateOrden(id, descuento, tipo_orden, clienteId, numMesa, lugarId, direccion) {

        let resOrden;

        const responseProducto = fetch('http://localhost:10000/orden/update/'+ id, {
            headers: { 'content-type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
            descuento: descuento,
            tipo_orden: tipo_orden,
            cliente_id: clienteId,
            numero_mesa: numMesa,
            lugar_id: lugarId,
            direccion: direccion
            })
        })

        await responseProducto.then((data) => (resOrden = data));

        console.log('ResCarrito', resOrden);

        return resOrden;
    }

    DeleteOrden(id) {
        return fetch('http://localhost:10000/orden/delete/'+ id, {
            method: 'DELETE',
        })
    }

    async getAllOrden() {

        let resOrdenCarrito;

        const responseProducto = fetch('http://localhost:10000/orden/all', {
            headers: { 'Cache-Control': 'no-cache' },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));

        console.log('ResALLOrden', resOrdenCarrito);

        return resOrdenCarrito;
    }
}    
    
