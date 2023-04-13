import getConfig from 'next/config';

export class OrderService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.token = localStorage.getItem('token');
    }

    getOrdersByClient() {
        return fetch(this.contextPath + '/shelby/data/orders-v26731723.json', { headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${this.token}` } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
