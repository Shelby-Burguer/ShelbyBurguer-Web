import getConfig from 'next/config';

export class NewProductoService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async getProductos() {
    try {
        let resProduct;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/productos/all`, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
            method: 'GET'
        }).then((res) => res.json());

        await responseProducto.then((data) => { 
        
        if (data.status == 401) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
        }
        (resProduct = data)
        });

   
        console.log('Que pasa pa', resProduct);
        let arrFinalProduct = [];

        for (const element of resProduct) {
            let producto = element;

            let baseProducto;
            let resIngredientes;
            let arrIngredientes = [];
            let arrProteinas = [];
            baseProducto = { ...producto };

            const responseIngredientes = fetch(`http://${this.ipAddress}:10000/ingredienteProducto/all/` + producto.id, {
                headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` },
                method: 'GET'
            }).then((res) => res.json());

            await responseIngredientes.then((data) => { 
            
            if (data.status == 401) {
                throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
            }
            (resIngredientes = data)
            });
           
            for (const element of resIngredientes) {
                let ingrediente = element;

                let newIngrediente = {
                    id: null,
                    nombre: '',
                    cantidad: '',
                    imagen: '',
                    proteina: '',
                    precio: '',
                    extra:'',
                };

                newIngrediente.id = ingrediente.ingrediente.id;
                newIngrediente.nombre = ingrediente.ingrediente.nombre;
                newIngrediente.cantidad = ingrediente.cantidad;
                newIngrediente.imagen = ingrediente.ingrediente.imagen;
                newIngrediente.proteina = ingrediente.ingrediente.proteina;
                newIngrediente.precio = ingrediente.precio;
                newIngrediente.extra = ingrediente.ingrediente.extra

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
                tamaño_producto: '',
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
    } catch (error) {
    console.error(error);
    return null;
    }
}

    async postProducto(producto, ingredientes, ingredienteExta) {
        let resProduct = {
            id: null,
            nombre: '',
            tipo: '',
            costo: '',
            imagen: ''
        };

        let resProductoIngrediente;

        let resImg = {
            nombreImagen: 'depositphotos_387255148-stock-photo-summer-bbq-food-table.jpg',
            datosImagen: null
        };
        if(producto.tipo_producto === "Bebida"){
            resImg = {
            nombreImagen: 'A_kell_le_gusta_la_soda_de_naranja.jpg',
            datosImagen: null
        };
        } else if (producto.tipo_producto === "Papas") {
            resImg = {
            nombreImagen: 'Papas_fritas_perfectas.jpg',
            datosImagen: null
            };
        }
        console.log('Service producto', producto);
        const responseProducto = fetch(`http://${this.ipAddress}:10000/productos/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify({
                nombre: producto.nombre,
                tipo: producto.tipo_producto,
                costo: producto.costo,
                imagen: resImg.nombreImagen,
                tamano_producto: producto.tamano_producto
            })
        });

        await responseProducto.then((dat) =>
            dat.json().then((res) => {
                (resProduct.id = res.id), (resProduct.nombre = res.nombre), (resProduct.tipo = res.tipo), (resProduct.costo = res.costo), (resProduct.imagen = res.imagen, (resProduct.tamano_producto = res.tamano_producto));
            })
        );

        const ingredientesUnidos = ingredientes.concat(ingredienteExta);
        const ingredienteProducto = [];
        console.log('Este es el nuevo Ingrediente array', ingredientesUnidos)
        for (const ingrediente of ingredientesUnidos) {
            ingredienteProducto.push({
                precio: ingrediente.precio,
                cantidad: ingrediente.cantidad,
                ingrediente_id: ingrediente.id,
                producto_id: resProduct.id
            });
        }

        console.log('Este es el nuevo Ingrediente array de ingredienteProducto', ingredienteProducto);

        fetch(`http://${this.ipAddress}:10000/ingredienteProducto/create`, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'POST',
            body: JSON.stringify(ingredienteProducto)
        });

        return resProduct;
    }

    DeleteProductos(id) {
        return fetch(`http://${this.ipAddress}:10000/productos/delete/` + id, {
            headers: { 'Authorization': `Bearer ${this.token}` },
            method: 'DELETE'
        });
    }

    async updateProducto(productoid, producto, ingredientes, arrayExtra) {
        let resProduct = {
            id: null,
            nombre: '',
            tipo: '',
            costo: '',
            imagen: ''
        };

        
        let resProductoIngrediente;

        let resImg = {
            nombreImagen: '16891a7a-52f8-4bc6-8176-00a5ae0b1c0a.jpg',
            datosImagen: null
        };
        const ingredientesFinal = ingredientes.concat(arrayExtra);
        const responseProducto = fetch(`http://${this.ipAddress}:10000/ingredienteProducto/update/` + productoid, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}` },
            method: 'PUT',
            body: JSON.stringify({
                producto: producto,
                updateIgdtPdt: ingredientesFinal
            })
        });

        await responseProducto;
    }

    DeleteProductos(id) {
        return fetch(`http://${this.ipAddress}:10000/productos/delete/` + id, {
            headers: { 'Authorization': `Bearer ${this.token}` },
            method: 'DELETE'
        });
    }
}
