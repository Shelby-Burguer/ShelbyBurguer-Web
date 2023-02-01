import getConfig from 'next/config';

export class IngredienteService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getIngredientes() {
        return fetch('http://localhost:10000/ingrediente/all', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }

    DeleteIngredientes(id) {
        console.log(id);
        return fetch('http://localhost:10000/ingrediente/delete/${id}', {
            method: 'DELETE',
        })
    }

    updateIngredientes(id, data) {
        console.log(id);
        console.log(data)
        return fetch('http://localhost:10000/ingrediente/update/{id}', {
            headers: { 'content-type': 'application/json'},
            method: 'PUT',
            Body: JSON.stringify(data),
            
        })
    }
    
    postIngredientes(data) {
        console.log(data)
        return fetch('http://localhost:10000/ingrediente/create', {
            headers: { 'content-type': 'application/json'},
            method: 'POST',
            Body: JSON.stringify(data),
            
        })
    }
}
