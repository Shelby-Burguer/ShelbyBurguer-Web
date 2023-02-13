import getConfig from 'next/config';
import {useState} from 'react';

export class IngredienteService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }
    
    
    getIngredientes() {
        return fetch('http://localhost:10000/ingrediente/all', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }

    DeleteIngredientes(id) {
        return fetch('http://localhost:10000/ingrediente/delete/'+ id, {
            method: 'DELETE',
        })
    }

    updateIngredientes(data) {

        return fetch('http://localhost:10000/ingrediente/update/'+ data.id, {
            headers: { 'content-type': 'application/json'},
            method: 'PATCH',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad
            }),
            responseType: 'json'
            
        })
    }
        
    async postIngredientes(data, file) {
        let resProduct = {
            id: null,
            nombre: '',
            unidad: '',
            image: null,
        };

        let resImg;
        
        const responseBody = fetch('http://localhost:10000/ingrediente/create', {
            headers: { 'content-type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad,
            }),
          
        })

        await responseBody.then((dat) => dat.json().then((res) =>  {resProduct.id = res.id, resProduct.nombre = res.nombre, resProduct.unidad = res.unidad }));

        const fileReq = new FormData();
        fileReq.append('file', file);
   
        const responseFile = fetch('http://localhost:10000/ingrediente/create/upload/'+ resProduct.id, {
            method: 'PUT',
            body: fileReq
 
        })

         await responseFile.then((file) => file.json().then((img) => resImg = { ...img }));
        
        let blobtest = new Blob([resImg.datosImagen.data], {type: 'image/png'});

        const blobURL = URL.createObjectURL(blobtest);

        let test = new File([blobtest], resImg.nombreImagen, {type: blobtest.type})

        test.objectURL = blobURL;
        console.log('Soy la respuesta file', test);
        resProduct.image = test
        
        return resProduct;
    }
}
