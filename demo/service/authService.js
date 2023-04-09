import getConfig from 'next/config';

export class authService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async postAuthSesion(email, password) {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/autenticacion/login`, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                email_user: email,
                password_user: password
            })
        });
       
        await responseProducto.then((dat) => dat.json().then((res) => (resOrdenCarrito = res)));
        localStorage.setItem('token', resOrdenCarrito.token);
        return resOrdenCarrito;
    }


}
