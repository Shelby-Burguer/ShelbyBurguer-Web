import getConfig from 'next/config';

export class ClienteService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async getClientes() {
    try {
        const response = await fetch(`http://${this.ipAddress}:10000/clientes/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` }
        }).then((res) => res.json())
            
        if (response.statusCode == 401) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
        }
    
 
        
     return response
    } catch (error) {
    console.error(error);
    return null;
    }
    }

    async crearCliente(data) {
        try {
            const response = await fetch(`http://${this.ipAddress}:10000/clientes/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                body: JSON.stringify(data)
            });
            console.log('El código HTTP de la respuesta es:', response.status);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async actualizarCliente(data) {
        try {
            const response = await fetch(`http://${this.ipAddress}:10000/clientes/${data.id_cliente}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                body: JSON.stringify(data)
            });
            console.log('El código HTTP de la respuesta es:', response.status);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async borrarCliente(id) {
        try {
            const response = await fetch(`http://${this.ipAddress}:10000/clientes/${id}`, {
                headers: { 'Authorization': `Bearer ${this.token}` },
                method: 'DELETE'
            });
            console.log('El código HTTP de la respuesta es:', response.status);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getOneClientes(cedula) {
        return await fetch(`http://${this.ipAddress}:10000/clientes/cedula/`+ cedula, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` }
        })
            .then((res) => res.json())
            .catch((error) => console.log(error));
    }
}
