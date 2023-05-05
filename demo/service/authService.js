import getConfig from 'next/config';


export class authService {
    
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
        this.ipAddress = window.location.host.split(':')[0];
        this.token = localStorage.getItem('token');
    }

    async postCreateUser(name, apellido, cedula, telefono, direccion, fecha_inicio, email, password, role, pregunta_secreta, respuesta_secreta) {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/autenticacion/registro`, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                nombre_user: name,
                apellido_users: apellido,
                cedula_users: cedula,
                telefono_users: telefono,
                direccion_users: direccion,
                fecha_inicio_users: fecha_inicio,
                correo_user: email, 
                contraseña_user: password,
                rol_user: role,
                preguntaSecreta_users: pregunta_secreta,
                respuestaPregunta_users: respuesta_secreta
            })
        });
       
        await responseProducto.then((dat) => dat.json().then((res) => (resOrdenCarrito = res)));

        console.log('Test Res', resOrdenCarrito);
        //localStorage.setItem('token', resOrdenCarrito.token.token);
        //localStorage.setItem('nombre_user', resOrdenCarrito.token.nombre_user);
        //localStorage.setItem('nombre_role', resOrdenCarrito.token.nombre_role);
        return resOrdenCarrito;
    }

async postCorreoUserVerify(email) {
    try {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/autenticacion/recuperarPasswordE`, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                correo_user: email
            })
        });

        await responseProducto.then((dat) => {
            if (!dat.ok) {
                throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
            }
            return dat.json().then((res) => (resOrdenCarrito = res));
        });

        console.log('Test Res', resOrdenCarrito);
        return resOrdenCarrito;
    } catch (error) {
        console.error(error);
        return null
    }
}

async postResponseQuestionUserVerify(email, respuesta) {
    try {
        let resOrdenCarrito;

        const responseProducto = fetch(`http://${this.ipAddress}:10000/autenticacion/recuperarPasswordQ`, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                correo_user: email, 
                respuestaPregunta_users: respuesta
            })
        });

        await responseProducto.then((dat) => {
            if (!dat.ok) {
                throw new Error('No se pudo procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
            }
            return dat.json().then((res) => (resOrdenCarrito = res));
        });

        console.log('Test Res', resOrdenCarrito);
        return resOrdenCarrito;
    } catch (error) {
        console.error(error);
        return null
    }
}

async postAuthSesion(email, password) {
  let resOrdenCarrito;

  try {
    const responseProducto = fetch(`http://${this.ipAddress}:10000/autenticacion/login`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        email_user: email,
        password_user: password
      })
    });
  
    await responseProducto.then((dat) => dat.json().then((res) => (resOrdenCarrito = res)));
    console.log(resOrdenCarrito)
    localStorage.setItem('token', resOrdenCarrito.token.token);
    localStorage.setItem('nombre_user', resOrdenCarrito.token.nombre_user);
    localStorage.setItem('nombre_role', resOrdenCarrito.token.nombre_role);
    return resOrdenCarrito;
  } catch (error) {
    console.error(error);
    return null
    // Aquí puedes decidir qué hacer en caso de que haya un error
    // por ejemplo, lanzar una alerta o regresar un valor vacío
  }
}

}
