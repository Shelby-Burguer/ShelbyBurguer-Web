import getConfig from 'next/config';

export class ClientService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getClients() {
        return fetch(this.contextPath + '/shelby/data/clients.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
