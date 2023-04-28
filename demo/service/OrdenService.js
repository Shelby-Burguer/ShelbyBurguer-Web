import getConfig from 'next/config';

export class OrdenService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async getProductoOrden(id) {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/all/` + id, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));
      
        console.log('ResCarrito', resOrdenCarrito);

        return resOrdenCarrito;
    }

    async getOrden(id) {
        let resOrden;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/one/` + id, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrden = data));

        console.log('ResCarrito', resOrden);

        return resOrden;
    }

    async getUpdateOrden(id, descuento, tipo_orden, clienteId, numMesa, lugarId, direccion, total) {
        let resOrden;
        console.log(total)
        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/update/` + id, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'PUT',
            body: JSON.stringify({
                descuento: descuento,
                tipo_orden: tipo_orden,
                cliente_id: clienteId,
                numero_mesa: numMesa,
                lugar_id: lugarId,
                direccion: direccion,
                total_orden: total
            })
        });

        await responseProducto.then((data) => (resOrden = data));

        console.log('ResCarrito', resOrden);

        return resOrden;
    }

    DeleteOrden(id) {
        return fetch(`http://${this.ipAddress}:10000/orden/delete/` + id, {
            headers: { 'Authorization': `Bearer ${this.token}` },
            method: 'DELETE'
        });
    }

    async getAllOrden() {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/all`, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));

        console.log('ResALLOrden', resOrdenCarrito);

        return resOrdenCarrito;
    }

    async getAllEstados() {

        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/estados/All`, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resOrdenCarrito = data));

        console.log('ResALLOrden', resOrdenCarrito);

        return resOrdenCarrito;
    }

        async postEstadoOrden(idEstado, idOrden) {

        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/ordenEstado/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify({
            orden_id: idOrden,
            estado_id: idEstado
            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );
      
        return resOrdenCarrito;
    }

    async postOrdenPago(id, pago, tipo_pago, monto, tipo_pago_efectivo) {
        console.log(id, pago, tipo_pago, monto)
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/ordenPago/create/`+ id, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify({
            tipo_pago: tipo_pago,
            monto: monto,
            tipo_pago_efectivo: tipo_pago_efectivo,
            pagoElectronico: pago,
            pagoEfectivo: pago ,
            zelle: pago,
            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );
      
        return resOrdenCarrito;
    }

async getAllPagosOrden(id) {
  let resOrdenCarrito;

  const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/pagos/All/` + id, {
    headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
    method: 'GET'
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });

  await responseProducto.then((data) => {
    if (data !== null) {
      resOrdenCarrito = data;
      console.log(data);
    }
  }).catch((error) => {
    console.error('Error:', error);
  });

  console.log('ResALLOrden', resOrdenCarrito);

  return resOrdenCarrito;
}

    async postMontoCambio(monto) {

        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/montoBsDolares/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify({
            monto: monto,
            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );
      
        return resOrdenCarrito;
    }


async getMontoDia() {
  let resOrdenCarrito; 
  const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/montoBsDolares/All/`, {
    headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
    method: 'GET'
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });

  await responseProducto.then((data) => {
    if (data !== null) {
      resOrdenCarrito = data;
      console.log(data);
    }
  }).catch((error) => {
    console.error('Error:', error);
  });

  console.log('ResALLOrden', resOrdenCarrito);

  return resOrdenCarrito;
}

    async postAccionUser(nombreAccion, nombreUser, roleUser, ordenId) {

        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/accionUsuario/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify({
            nombre_accion: nombreAccion,
            nombre_user:nombreUser,
            role_user: roleUser,
            orden_id: ordenId
            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => resOrdenCarrito = res
            )
        );
      
        return resOrdenCarrito;
    }

async getAccionUser(id) {
  let resOrdenCarrito;

  const responseProducto = fetch(`http://${this.ipAddress}:10000/orden/accionUsuario/All/`+ id, {
    headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
    method: 'GET'
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });

  await responseProducto.then((data) => {
    if (data !== null) {
      resOrdenCarrito = data;
      console.log(data);
    }
  }).catch((error) => {
    console.error('Error:', error);
  });

  console.log('ResALLOrden', resOrdenCarrito);

  return resOrdenCarrito;
}

}
