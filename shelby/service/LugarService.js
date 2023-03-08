import getConfig from 'next/config';

export class LugarService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async getLugares() {
        return await fetch('http://localhost:10000/lugares', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
