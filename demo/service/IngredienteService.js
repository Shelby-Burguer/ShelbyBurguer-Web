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
        
    async postIngredientes(data) {
        let resProduct = {
            id: null,
            nombre: '',
            unidad: '',
        };
        const response = fetch('http://localhost:10000/ingrediente/create', {
            headers: { 'content-type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad
            }),
        })
        await response.then((dat) => dat.json().then((res) => {resProduct.id = res.id, resProduct.nombre = res.nombre, resProduct.unidad = res.unidad}));
        return resProduct;
    }
}
