import getConfig from 'next/config';

export class OrderService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    getOrdersByClient() {
        return fetch(this.contextPath + '/shelby/data/orders-v26731723.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
