import getConfig from 'next/config';
import { useState } from 'react';

export class IngredienteService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

async getIngredientes() {
  try {
    let resProduct = {
      id: null,
      nombre: '',
      unidad: '',
      objectURL: '',
      nombreImagen: '',
      datosImagen: null,
      proteina: '',
      extra: ''
    };

    const responseBody = fetch(`http://${this.ipAddress}:10000/ingrediente/all`, {
    headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}`}, 
    method: 'GET'
    }).then((res) => res.json());

    await responseBody.then((dat) => { 
    console.log('vamo a ver', dat);
    if (dat.status == 401) {
        throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
    }
    resProduct = { ...dat };
    });

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
  } catch (error) {
    console.error(error);
    return null;
  }
}


   async DeleteIngredientes(id) {
    try {
        const responseBody =  fetch(`http://${this.ipAddress}:10000/ingrediente/delete/` + id, {
            headers: { 'Authorization': `Bearer ${this.token}`}, 
            method: 'DELETE'
        });

    await responseBody.then((dat) => {
        if (!dat.ok) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
        }
        (resProduct = { ...dat })

    });

    return responseBody

    } catch (error) {
    console.error(error);
    return null

    }
    }

    async updateIngredientes(data) {
    try {
        const responseBody = fetch(`http://${this.ipAddress}:10000/ingrediente/update/` + data.id, {
            headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.token}`},
            method: 'PATCH',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad,
                proteina: data.proteina,
                extra: data.extra
            }),
            responseType: 'json'
        });

        await responseBody.then((dat) => {
        if (!dat.ok) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
        }
        (resProduct = { ...dat })

    });

        return resProduct;
    } catch (error) {
    console.error(error);
    return null
    }
    }

    async postIngredientes(data, file) {
    try {
        let resProduct = {
            id: null,
            nombre: '',
            unidad: '',
            nombreImage: '',
            urlImage: '',
            fileImage: '',
            proteina: '',
            extra: ''
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
                objectURL: file.objectURL,
                extra: data.extra
            })
        });

        await responseBody.then((dat) =>
            dat.json().then((res) => {
                (resProduct.id = res.id), (resProduct.nombre = res.nombre), (resProduct.unidad = res.unidad), (resProduct.urlImage = res.objectURL), (resProduct.proteina = res.proteina), (resProduct.extra = res.extra);
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
    } catch (error) {
    console.error(error);
    return null
    }
    }
}
