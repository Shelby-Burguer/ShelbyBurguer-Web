import getConfig from 'next/config';

export class IngredienteService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getIngredientes() {
        return fetch('http://localhost:10000/ingrediente/all', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
