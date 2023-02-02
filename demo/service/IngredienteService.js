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
            
        })
    }
    
    postIngredientes(data) {
        return fetch('http://localhost:10000/ingrediente/create', {
            headers: { 'content-type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                nombre: data.nombre,
                unidad: data.unidad
            }),
        
        })

    }
}
