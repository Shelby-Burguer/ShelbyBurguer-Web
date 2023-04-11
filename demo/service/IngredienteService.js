import getConfig from 'next/config';
import { useState } from 'react';

export class IngredienteService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async getIngredientes() {
        let resProduct = {
            id: null,
            nombre: '',
            unidad: '',
            objectURL: '',
            nombreImagen: '',
            datosImagen: null,
            proteina: ''
        };

        const responseBody = fetch(`http://${this.ipAddress}:10000/ingrediente/all`, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}`}, 
            method: 'GET'
        }).then((res) => res.json());

        await responseBody.then((dat) => (resProduct = { ...dat }));
        console.log('vamo a ver', resProduct);
        let testresProduct = [];
        let claves = Object.keys(resProduct);
        for (const element of claves) {
            let clave = element;

            const blobtest = new Blob([resProduct[clave].datosImagen], { type: 'image/png' });

            let test = new File([blobtest], resProduct[clave].nombreImagen, { type: blobtest.type });

            const blobURL = window.URL.createObjectURL(blobtest);

            test.objectURL = blobURL;

            delete resProduct[clave].nombreImagen;
            delete resProduct[clave].datosImagen;
            resProduct[clave].fileImage = test;
            resProduct[clave].nombreImage = test.name;
            resProduct[clave].urlImage = test.objectURL;
            resProduct[clave].cantidad = '';

            window.URL.revokeObjectURL(blobURL);

            testresProduct.push(resProduct[clave]);
        }

        return testresProduct;
    }

    DeleteIngredientes(id) {
        return fetch(`http://${this.ipAddress}:10000/ingrediente/delete/` + id, {
            headers: { 'Authorization': `Bearer ${this.token}`}, 
            method: 'DELETE'
        });
    }

    updateIngredientes(data) {
        return fetch(`http://${this.ipAddress}:10000/ingrediente/update/` + data.id, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}`},
            method: 'PATCH',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad,
                proteina: data.proteina
            }),
            responseType: 'json'
        });
    }

    async postIngredientes(data, file) {
        let resProduct = {
            id: null,
            nombre: '',
            unidad: '',
            nombreImage: '',
            urlImage: '',
            fileImage: '',
            proteina: ''
        };

        let resImg = {
            nombreImagen: '',
            datosImagen: null
        };

        const responseBody = fetch(`http://${this.ipAddress}:10000/ingrediente/create`, {
            headers: { 'content-type': 'application/json' , 'Authorization': `Bearer ${this.token}`},
            method: 'POST',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad,
                proteina: data.proteina,
                objectURL: file.objectURL
            })
        });

        await responseBody.then((dat) =>
            dat.json().then((res) => {
                (resProduct.id = res.id), (resProduct.nombre = res.nombre), (resProduct.unidad = res.unidad), (resProduct.urlImage = res.objectURL), (resProduct.proteina = res.proteina);
            })
        );

        console.log('Respuesta  ', resProduct);
        console.log('Es el File', file.objectURL);
        const fileReq = new FormData();
        fileReq.append('file', file);

        const responseFile = fetch(`http://${this.ipAddress}:10000/ingrediente/create/upload/` + resProduct.id, {
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}`}, 
            method: 'PUT',
            body: fileReq
        });

        await responseFile.then((file) => file.json().then((img) => (resImg = { ...img })));

        const blobtest = new Blob([resImg.datosImagen.data], { type: 'image/png' });

        const test = new File([blobtest], resImg.nombreImagen, { type: blobtest.type });

        const blobURL = URL.createObjectURL(blobtest);

        test.objectURL = blobURL;
        console.log('Soy la respuesta file', test);
        resProduct.fileImage = test;
        resProduct.nombreImage = test.name;
        test.objectURL;

        console.log('Respuesta final', resProduct);

        return resProduct;
    }
}
