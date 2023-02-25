import getConfig from 'next/config';

export class NewProductoService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }
    

    async getProductos() {

        let resProduct;
        

        const responseProducto = fetch('http://localhost:10000/productos/all', { 
        headers: { 'Cache-Control': 'no-cache' },
        method: 'GET',
        }).then((res) => res.json())

        await responseProducto.then((data) => resProduct = data);
        
        let arrFinalProduct = [];

        for(let i=0; i< resProduct.length; i++){
            let producto = resProduct[i];

            let baseProducto;
            let resIngredientes;
            let arrIngredientes = [];
            let arrProteinas = [];
            baseProducto = {... producto}

            const responseIngredientes = fetch('http://localhost:10000/ingredienteProducto/all/' + producto.id, { 
            headers: { 'Cache-Control': 'no-cache' },
            method: 'GET',
            }).then((res) => res.json())

            await responseIngredientes.then((data) => resIngredientes = data);

            for(let j=0; j< resIngredientes.length; j++){
                let ingrediente = resIngredientes[j];

                let newIngrediente = {
                id: null,
                nombre: '',
                cantidad: '',
                imagen: '',
                proteina: '',
                }
                
                newIngrediente.id = ingrediente.ingrediente.id
                newIngrediente.nombre = ingrediente.ingrediente.nombre
                newIngrediente.cantidad = ingrediente.cantidad
                newIngrediente.imagen = ingrediente.ingrediente.imagen
                newIngrediente.proteina = ingrediente.ingrediente.proteina

                if(ingrediente.ingrediente.proteina == 'Si'){
                    arrProteinas.push(newIngrediente)
                } else {
                    arrIngredientes.push(newIngrediente)
                }          


            }
            console.log('Alto array', resIngredientes)
            
            let NewProduct = {
            id: null,
            nombre: '',
            cantidad: '',
            imagen: '',
            proteina: null,
            proteina:  arrProteinas,
            ingrediente: arrIngredientes, 
            }

            NewProduct = {... baseProducto}
            NewProduct.proteina = arrProteinas;
            NewProduct.ingrediente = arrIngredientes;

            arrFinalProduct.push(NewProduct);

        }

       // resProduct.map((data) => tes  )
  
        console.log('Respuesta producto en grid', arrFinalProduct);
        /*
        await responseBody.then((dat) => resProduct = {...dat});
        console.log('vamo a ver', resProduct)
        let testresProduct = [];
        let claves = Object.keys(resProduct); 
        for(let i=0; i< claves.length; i++){
            let clave = claves[i];
            
            const blobtest = new Blob([resProduct[clave].datosImagen], {type: 'image/png'});

            let test = new File([blobtest], resProduct[clave].nombreImagen, {type: blobtest.type});

            const blobURL = window.URL.createObjectURL(blobtest);

            test.objectURL = blobURL;

            delete resProduct[clave].nombreImagen;
            delete resProduct[clave].datosImagen;
            resProduct[clave].fileImage = test;
            resProduct[clave].nombreImage = test.name;
            resProduct[clave].urlImage= test.objectURL;

            window.URL.revokeObjectURL(blobURL);

            testresProduct.push(resProduct[clave]);

        }
        */
        
        return arrFinalProduct;

    }
}