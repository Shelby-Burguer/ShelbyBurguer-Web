import getConfig from 'next/config';

export class NewComboService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async getCombos() {
        let resProduct;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/combo/all`, {
            headers: { 'Cache-Control': 'no-cache' , 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resProduct = data));

        return resProduct;
    }

    async getProductos() {
        let resProduct;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/productos/all`, {
            headers: { 'Cache-Control': 'no-cache' },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => (resProduct = data));

        let arrFinalProduct = [];

        for (let i = 0; i < resProduct.length; i++) {
            let producto = resProduct[i];

            let baseProducto;
            let resIngredientes;
            let arrIngredientes = [];
            let arrProteinas = [];
            baseProducto = { ...producto };

            const responseIngredientes = fetch(`http://${this.ipAddress}:10000/ingredienteProducto/all/` + producto.id, {
                headers: { 'Cache-Control': 'no-cache' },
                method: 'GET'
            }).then((res) => res.json());

            await responseIngredientes.then((data) => (resIngredientes = data));

            for (let j = 0; j < resIngredientes.length; j++) {
                let ingrediente = resIngredientes[j];

                let newIngrediente = {
                    id: null,
                    nombre: '',
                    cantidad: '',
                    imagen: '',
                    proteina: ''
                };

                newIngrediente.id = ingrediente.ingrediente.id;
                newIngrediente.nombre = ingrediente.ingrediente.nombre;
                newIngrediente.cantidad = ingrediente.cantidad;
                newIngrediente.imagen = ingrediente.ingrediente.imagen;
                newIngrediente.proteina = ingrediente.ingrediente.proteina;

                if (ingrediente.ingrediente.proteina == 'Si') {
                    arrProteinas.push(newIngrediente);
                } else {
                    arrIngredientes.push(newIngrediente);
                }
            }

            let NewProduct = {
                id: null,
                nombre: '',
                cantidad: '',
                imagen: '',
                proteina: null,
                proteina: arrProteinas,
                ingrediente: arrIngredientes
            };

            NewProduct = { ...baseProducto };
            NewProduct.proteina = arrProteinas;
            NewProduct.ingrediente = arrIngredientes;

            arrFinalProduct.push(NewProduct);
        }

        return arrFinalProduct;
    }

    async postCombo(combo, productos) {
        let resCombo;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/combo/create`, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                nombre: combo.nombre,
                precio_unitario: combo.precio_unitario,
                tiempo_aprox: combo.tiempo_aprox,
                producto: productos
            })
        });

        await responseProducto.then((dat) => dat.json().then((res) => (resCombo = { ...res })));

        return resCombo;
    }

    DeleteCombo(id) {
        console.log('idCombo', id);
        return fetch(`http://${this.ipAddress}:10000/combo/delete/` + id, {
            method: 'DELETE'
        });
    }
}
