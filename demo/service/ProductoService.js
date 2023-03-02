import getConfig from 'next/config';

export class NewProductoService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async getProductos() {
        let resProduct;

        const responseProducto = fetch('http://localhost:10000/productos/all', {
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

            const responseIngredientes = fetch('http://localhost:10000/ingredienteProducto/all/' + producto.id, {
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

    async postProducto(producto, ingredientes) {
        let resProduct = {
            id: null,
            nombre: '',
            tipo: '',
            costo: '',
            imagen: ''
        };

        let resProductoIngrediente;

        let resImg = {
            nombreImagen: '',
            datosImagen: null
        };

        const responseProducto = fetch('http://localhost:10000/productos/create', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                nombre: producto.nombre,
                tipo: producto.tipo_producto,
                costo: producto.costo
            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => {
                (resProduct.id = res.id), (resProduct.nombre = res.nombre), (resProduct.tipo = res.tipo), (resProduct.costo = res.costo), (resProduct.imagen = res.imagen);
            })
        );

        const ingredienteProducto = [];

        for (const ingrediente of ingredientes) {
            ingredienteProducto.push({
                cantidad: ingrediente.cantidad,
                ingrediente_id: ingrediente.id,
                producto_id: resProduct.id
            });
        }

        fetch('http://localhost:10000/ingredienteProducto/create', {
                headers: { 'content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(ingredienteProducto)
            });   

        return resProduct;
    }

    DeleteProductos(id) {
        return fetch('http://localhost:10000/productos/delete/' + id, {
            method: 'DELETE'
        });
    }
}
