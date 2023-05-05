import getConfig from 'next/config';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { authService } from '../demo/service/authService';
import { Calendar } from 'primereact/calendar';


const AppTopbar = forwardRef((props, ref) => {
   
    let emptyClient = {
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
    };

    const dropdownValues = [
        { name: 'Cajero', code: 'NY' },
        { name: 'Admin', code: 'RM' }
    ];

    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const [userRole, setUserRole] = useState({ user: null, role: null });
    const [userDialogVisible, setUserDialogVisible] = useState(false);
    const [cliente, setCliente] = useState(emptyClient);
    const [submitted, setSubmitted] = useState(false);
    const [element, setElement] = useState(null);
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [cedula, setCedula] = useState('');
    const [direccion, setDireccion] = useState('');
    const [fecha_inicio, setFecha_inicio] = useState('');
    const [pregunta_secreta, setPreguntaSecreta] = useState('');
    const [respuesta_secreta, setRespuestaSecreta] = useState('');
    const [dropdownValue, setDropdownValue] = useState(null);

    useEffect(() => {
    setUserRole({user: localStorage.getItem('nombre_user'), role: localStorage.getItem('nombre_role')});
    }, [setUserRole]);


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const   exitUser = () => {
    setUserRole({ user: null, role: null });
    localStorage.removeItem('nombre_user');
    localStorage.removeItem('nombre_role');
    localStorage.removeItem('token');
    };

    const   authShow = () => {
    const ipAddress = window.location.host.split(':')[0];
    router.push(`http://${ipAddress}:3000/auth/login/`);
    };

    const   registroUser = () => {
    setUserDialogVisible(true)
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _element = { ...element };
        _element[`${name}`] = val;

        setCliente(_element);
    };

    const hideDialog = () => {
        setDropdownValue(null);
        setPassword('');
        setNombre('');
        setCorreo('');
        setApellido('');
        setTelefono('');
        setCedula('');
        setDireccion('');
        setFecha_inicio('');
        setPreguntaSecreta('')
        setRespuestaSecreta('')
        setUserDialogVisible(false)
    };

    const onSave = async() => {
    const autenticacionService = new authService();
    const respuesta = await autenticacionService.postCreateUser(nombre, apellido, cedula, telefono, direccion, fecha_inicio,correo, password, dropdownValue.name, pregunta_secreta, respuesta_secreta)
    setDropdownValue(null);
    setPassword('');
    setNombre('');
    setCorreo('');
    setApellido('');
    setTelefono('');
    setCedula('');
    setDireccion('');
    setFecha_inicio('');
    setPreguntaSecreta('')
    setRespuestaSecreta('')
    setUserDialogVisible(false);
    };

    const elementDialogFooter = () => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => onSave()} />
            </React.Fragment>
        );
    };

    return (
        <div className="layout-topbar">
            <Link href="/">
                <a className="layout-topbar-logo">
                    <>
                        <img src={`${contextPath}/layout/images/SHELBY LOGO -ai.svg`} width="120px" height={'45px'} widt={'true'} alt="logo" />
                    </>
                </a>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
            {userRole.user && userRole.role ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '10px' }}>
                    <span className="p-m-2" style={{ fontWeight: 'bold', fontSize: '18px' }}>{userRole.user}</span>
                    <span className="p-m-0">{userRole.role}</span>
                </div>
                {userRole.role === 'Admin' && (
                    <Button label="Registrar Usuario" icon="pi pi-user-plus" className="p-button-text p-button-rounded p-button-help mr-2" onClick={registroUser} />
                )}
                <Button label="Salir" icon="pi pi-sign-out" className="p-button-text p-button-rounded p-button-success" onClick={exitUser} />
                </div>
            ) : (
                <div>
                <Button label="Iniciar Sesión" icon="pi pi-sign-in" className="p-button-text p-button-rounded p-button-success mr-2" onClick={authShow} />
                </div>
            )}
            </div>

            <Dialog visible={userDialogVisible} style={{ width: '450px' }} header="Detalle de Cliente" modal className="p-fluid" footer={() => elementDialogFooter()} onHide={hideDialog}>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="cedula">Nombre</label>
                        <div className="p-inputgroup">
                        <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !nombre })} />
                        {submitted && !cliente?.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                    </div>
                    <div className="field col">
                        <label htmlFor="apellido">Apellido</label>
                        <InputText id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !apellido })} />
                        {submitted && !apellido && <small className="p-invalid">El apellido es requerido.</small>}
                    </div>
                    <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="cedula">Cedula</label>
                        <InputText id="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !cedula })} />
                        {submitted && !cedula && <small className="p-invalid">El cedula es requerido.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="telefono">Telefono</label>
                        <InputText id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !telefono })} />
                        {submitted && !telefono && <small className="p-invalid">El Telefono es requerido.</small>}
                    </div>
                    </div>
                    <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="direccion">Direccion</label>
                        <InputText id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !direccion })} />
                        {submitted && !direccion && <small className="p-invalid">El direcci es requerido.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="fecha_inicio">Fecha Inicio</label>
                        <Calendar showIcon showButtonBar value={fecha_inicio} onChange={(e) => setFecha_inicio(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !fecha_inicio })}></Calendar>
                        {submitted && !fecha_inicio && <small className="p-invalid">El fecha de inicio es requerido.</small>}
                    </div>
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="apellido">Contraseña</label>
                        <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" toggleMask ></Password>
                    </div>
                    <div className="field col">
                        <label htmlFor="telefono">Rol de usuario</label>
                        <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                    </div>
                </div>
                <div className="formgrid grid">
                <div className="field col">
                        <label htmlFor="pregunta_secreta">Pregunta Secreta</label>
                        <InputText id="pregunta_secreta" value={pregunta_secreta} onChange={(e) => setPreguntaSecreta(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !pregunta_secreta })} />
                        {submitted && !pregunta_secreta && <small className="p-invalid">El pregunta_secreta es requerido.</small>}
                </div>
                <div className="field col">
                        <label htmlFor="respuesta_secreta">Respuesta de pregunta</label>
                        <InputText id="respuesta_secreta" value={respuesta_secreta} onChange={(e) => setRespuestaSecreta(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !respuesta_secreta })} />
                        {submitted && !respuesta_secreta && <small className="p-invalid">El respuesta_secreta es requerido.</small>}
                </div>
                </div>
                <div className="formgrid grid">
                      <div className="field col">
                        <label htmlFor="correo">Correo</label>
                        <InputText id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !correo })} />
                        {submitted && !correo && <small className="p-invalid">El correo es requerido.</small>}
                        </div>
                </div>
                
            </Dialog>
        </div>
    );
});

export default AppTopbar;
