import getConfig from 'next/config';

export class LugarService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async getLugaresByTipo(tipo) {  
    try {
        const response = await fetch(`http://${this.ipAddress}:10000/lugares/${tipo}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` }
        }).then((res) => res.json())

        if (response.statusCode == 401) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo 1.');
        }
 
     return response
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async crearLugar(data) {
        console.log('Llega bien la estructura?', data)
        try {
            const response = await fetch(`http://${this.ipAddress}:10000/lugares/`, {
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

    async actualizarLugar(data) {
        try {
            const response = await fetch(`http://${this.ipAddress}:10000/lugares/${data.id_lugar}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                body: JSON.stringify(data)
            });
            console.log('El código HTTP de la respuesta es:', response.status);
            if (response.statusCode == 401) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
        }
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async borrarLugar(id) {
        try {
            const response = await fetch(`http://${this.ipAddress}:10000/lugares/${id}`, {
                headers: { 'Authorization': `Bearer ${this.token}` },
                method: 'DELETE'
            });
            console.log('El código HTTP de la respuesta es:', response.status);
            if (response.statusCode == 401) {
            throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
        }
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
