import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState, useRef  } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { authService } from '../../../demo/service/authService';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});
    const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
    const [pregunta, setPregunta] = useState('');
    const [resPregunta, setResPregunta] = useState('');
    const [resBackPregunta, setResBackPregunta] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [correo, setCorreo] = useState('');
    
    const toast = useRef(null);

    const postAuthUsuario = async() => {
    const autenticacionService = new authService();
    const respuesta = await autenticacionService.postAuthSesion(email, password)

        if (respuesta){
        const ipAddress = window.location.host.split(':')[0]; 
        setEmail('');
        setPassword('');
        toast.current.show({severity: 'success', summary: 'Éxito', detail: '¡Iniciaste sesión exitosamente!'});
        router.push(`http://${ipAddress}:3000`);

        } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error al iniciar sesión! Por favor, Revise las credenciales e intentelo nuevamente.' });
        }
    };

    const passwordUser = () => {

    setPasswordDialogVisible(true)
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _element = { ...element };
        _element[`${name}`] = val;

        setCliente(_element);
    };

    const hideDialog = () => {
        setPasswordDialogVisible(false)
        setPregunta('');
        setResBackPregunta('');
        setResPregunta('');
        setCorreo('');
    };

    const correoContraseñaUser = async() => {
    const autenticacionService = new authService();
    const respuesta = await autenticacionService.postCorreoUserVerify(correo)
    console.log('Test respuesta Email', respuesta)
    if (respuesta){
    setPregunta(respuesta.preguntasecreta_users)
    toast.current.show({severity: 'success', summary: 'Éxito', detail: '¡Correo Correcto!'});
    } else {
    toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Correo incorrecto! Por favor, Revise la informacion e intentelo nuevamente.' });
    }

    };

    const respuesaPreguntaSecreta = async() => {
    const autenticacionService = new authService();
    const respuesta = await autenticacionService.postResponseQuestionUserVerify(correo, resPregunta)
    if(respuesta){
    toast.current.show({severity: 'success', summary: 'Éxito', detail: '¡Respuesta correcta!'});
    setResBackPregunta(respuesta.respuestapregunta_users)
    } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Respuesta incorrecta! Por favor, Revise la informacion e intentelo nuevamente.' });
    }
    };

    const onSave = async() => {
    const autenticacionService = new authService();
    const respuesta = await autenticacionService.postCreateUser(nombre, apellido, cedula, telefono, direccion, fecha_inicio,correo, password, dropdownValue.name, pregunta_secreta, respuesta_secreta)
    setDropdownValue(null);
    setPassword('');
    setNombre('');
    setCorreo('');
    setPasswordDialogVisible(false);
    };

    const elementDialogFooter = () => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Enviar respuesta" icon="pi pi-check" className="p-button-text" onClick={() => respuesaPreguntaSecreta()} />
            </React.Fragment>
        );
    };

    return (
        <div className={containerClassName}>
        <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`${contextPath}/layout/images/SHELBY LOGO -ai.svg`} alt="Sakai logo" className="mb-3 w-10rem flex-shrink-0"/>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-4 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                    <Button icon="pi pi-arrow-left" label="Pagina principal" className="p-button-text mb-2" onClick={() => router.push('/')}/>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido a Shelby Burguer!</div>
                            <span className="text-600 font-medium">Ingrese la informacion solicitada para entrar</span>
                        </div>
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                            Correo
                            </label>
                            <InputText inputid="email1" type="text" value={email}  onChange={(e) => setEmail(e.target.value)} placeholder="Direccion de correo electronico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                            Contraseña
                            </label>
                            <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <label htmlFor="rememberme1">
                                    </label>
                                </div>
                                <Button label="Olvidaste tu contraseña?" className="p-button-text mb-2" onClick={() => passwordUser()}/>
                            </div>
                            <Button label="Ingresar" className="w-full p-3 text-xl" onClick={postAuthUsuario}></Button>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog visible={passwordDialogVisible} style={{ width: '450px' }} modal className="p-fluid" footer={() => elementDialogFooter()} onHide={hideDialog}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
                        <span className="p-m-2" style={{ fontWeight: 'bold', fontSize: '15px' }}>Ingrese su correo</span>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="correo"></label>
                        <div className="p-inputgroup">
                        <InputText id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !correo })} />
                        {submitted && !correo && <small className="p-invalid">Ingrese el correo de la pregunta.</small>}
                        </div>
                    </div>
                </div>
                <Button label="Enviar correo" className="w-full p-3 text-xl" onClick={correoContraseñaUser}></Button>
                {pregunta && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
                        <span className="p-m-2" style={{ fontWeight: 'bold', fontSize: '15px' }}>{pregunta}</span>
                    </div>
                    </div>
                    <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="resPregunta"></label>
                        <div className="p-inputgroup">
                        <InputText id="resPregunta" value={resPregunta} onChange={(e) => setResPregunta(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !resPregunta })} />
                        {submitted && !resPregunta && <small className="p-invalid">Ingrese la respuesta de la pregunta.</small>}
                        </div>
                    </div>
                    </div>
                </>
                )}
                {resBackPregunta === resPregunta? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
                            <span className="p-m-2" style={{ fontWeight: 'bold', fontSize: '18px' }}>{resBackPregunta}</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
                        <span className="p-m-2" style={{ fontWeight: 'bold', fontSize: '18px' }}>Respuesta o Correo incorrecto intentelo de nuevo</span>
                    </div>
                    </div>
                )}
            </Dialog>
        
        </div>
        

    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
