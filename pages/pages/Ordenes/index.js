import React, { useEffect, useState, useRef } from 'react';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect } from 'primereact/treeselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { CountryService } from '../../../demo/service/CountryService';
import { NodeService } from '../../../demo/service/NodeService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OrdenService } from '../../../demo/service/OrdenService';
import { ClienteService } from '../../../shelby/service/ClienteService';
import Crud from '../../../shelby/utils/CrudFunctions';
import { Toast } from 'primereact/toast';
import { LugarService } from '../../../shelby/service/LugarService';
import { useRouter } from 'next/router';
import { OverlayPanel } from 'primereact/overlaypanel';

export const InputDemo = () => {
    let emptyClient = {
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: ''
    };

    const prefixOptions = [
        { label: 'V', value: 'V' },
        { label: 'E', value: 'E' },
        { label: 'J', value: 'J' }
    ];

    const crudObject = Crud();
    const router = useRouter();
    let defaultCliente = crudObject.emptyElements.cliente;
    let defaultDropdown = 'V';
    let defaultLugar = crudObject.emptyElements.lugar;

    let cliente = crudObject.element;
    let clientes = crudObject.elements;
    let lugar = crudObject.element;
    let lugares = crudObject.elements;

    let _visibleCliente = crudObject.clienteDialogVisible;
    let _visibleLugar = crudObject.lugarDialogVisible;
    let _setVisibleLugar = crudObject.setLugarDialogVisible;
    let _setvisibleCliente = crudObject.setClienteDialogVisible;
    let _setElement = crudObject.setElement;
    let _setElements = crudObject.setElements;
    let _submitted = crudObject.submitted;
    let _setSubmitted = crudObject.setSubmitted;
    let _selectedElements = crudObject.selectedElements;
    let _toast = crudObject.toast;
    let _stringBody = crudObject.stringBodyTemplate;

    const [products, setProducts] = useState([
        { id: 1, nombre: 'Producto 1', precio: 10.5, cantidad: 2 },
        { id: 2, nombre: 'Producto 2', precio: 15.0, cantidad: 1 },
        { id: 3, nombre: 'Producto 3', precio: 20.0, cantidad: 3 }
    ]);

    const [floatValue, setFloatValue] = useState('');
    const [autoValue, setAutoValue] = useState('');
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [calendarValue, setCalendarValue] = useState(null);
    const [inputNumberValue, setInputNumberValue] = useState(null);
    const [chipsValue, setChipsValue] = useState([]);
    const [sliderValue, setSliderValue] = useState('');
    const [ratingValue, setRatingValue] = useState(null);
    const [colorValue, setColorValue] = useState('1976D2');
    const [knobValue, setKnobValue] = useState(20);
    const [radioValue, setRadioValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [listboxValue, setListboxValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectButtonValue1, setSelectButtonValue1] = useState(null);
    const [selectButtonValue2, setSelectButtonValue2] = useState(null);
    const [inputGroupValue, setInputGroupValue] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeSelectNodes, setTreeSelectNodes] = useState(null);
    const [client, setClient] = useState(emptyClient);
    const [submitted, setSubmitted] = useState(false);
    const [opciones, setOpciones] = useState('');
    const [mostradorOptions, setMostradorOptions] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [discount, setdiscount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [paymentType, setPaymentType] = useState('card');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [currency, setCurrency] = useState('VES');
    const [serialNumber, setSerialNumber] = useState('');
    const [denomination, setDenomination] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [cardExpirationDate, setCardExpirationDate] = useState('');
    const [cardSecurityCode, setCardSecurityCode] = useState('');
    const [zelleEmail, setZelleEmail] = useState('');
    const [electronicPaymentMethod, setElectronicPaymentMethod] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [total, setTotal] = useState('0');
    const [totalBs, setTotalBs] = useState('0');
    const [idOrden, setidOrden] = useState('');
    const [_clientes, setClientes] = useState(null);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [autoCompletePlaceholder, setAutoCompletePlaceholder] = useState('Cedula');
    const [dropdownValues, setdropdownValues] = useState([]);
    const [tipoOrden, setTipoOrden] = useState('');
    const [writeValue, setWriteValue] = useState(null);
    const [clienteId, setClienteID] = useState(null);
    const [tempDireccion, setTempDireccion] = useState('');
    const [zonaDropdown, setZonaDropdown] = useState(null);
    const [zonalugares, setZonalugares] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const op4 = useRef(null);
    const [ingredientesClient, setIngredientesClient] = useState(null);
    const toast = useRef(null);
    
    const currencyOptions = [
        { label: 'Bolívares', value: 'Bs.' },
        { label: 'Dólares', value: 'USD' },
        { label: 'Euros', value: 'EUR' }
    ];

    const electronicPaymentMethodOptions = [
        { label: 'Transferencia', value: 'transferencia' },
        { label: 'Pago Móvil', value: 'pago_movil' },
        { label: 'Tarjeta', value: 'tarjeta' }
    ];

    const paymentOptions = [
        { label: 'Pago Electrónico', value: 'electronico' },
        { label: 'Pago en Efectivo', value: 'efectivo' },
        { label: 'Zelle', value: 'zelle' }
    ];

    const electronicPaymentOptions = [
        { label: 'Transferencia', value: 'transferencia' },
        { label: 'Pago Móvil', value: 'pago-movil' },
        { label: 'Tarjeta', value: 'tarjeta' }
    ];

    const paymentMethods = [
        { value: 'electronico', label: 'Pago Electrónico' },
        { value: 'efectivo', label: 'Pago en Efectivo' },
        { value: 'zelle', label: 'Zelle' }
    ];

    useEffect(async () => {
    
        calculateTotal();
        _setElement(defaultLugar);

        const ordenService = new OrdenService();
        const countryService = new CountryService();
        const nodeService = new NodeService();
        const clienteService = new ClienteService();

        const myStoredObject = JSON.parse(localStorage.getItem('myKey'));
        const idbumber = myStoredObject ? myStoredObject.orden_id : null;
        setOrderId(idbumber);
        console.log('Este es el id de orden', idbumber);

        await clienteService.getClientes().then((data) => setClientes(data));
        const cambioDia = await ordenService.getMontoDia();
       


        await ordenService.getProductoOrden(idbumber).then((data) => {
        if(data){
            console.log('Calculo registro producto', data)
            const updatedProductos = data.map((producto) => ({ ...producto, cantidad: 1 }));
            setDataViewValue(updatedProductos);
            let total = 0;
            data.forEach((producto) => {
                total = parseFloat(producto.costoTotal);
            });      
            if(cambioDia){
                setTotal(total);
                setTotalBs(total*parseFloat(cambioDia[0].monto))
            
            } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Ingrese la tasa cambio del dia.' });
            }
        } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Por favor, Inicie sesion o ingrese la orden' });
        }
        });

        const lugarService = new LugarService();
        let data = await lugarService.getLugaresByTipo('zona');
        data = crudObject.isArray(data, 'cliente');
        if(data){
        setZonalugares(data);
        // Convertir los datos al formato esperado por el Dropdown
        const dropdownData = data.map((item) => ({
            id: item.id_lugar,
            name: item.nombre_lugar
        
        }));
        _setElements(data);
        setdropdownValues(dropdownData);
        } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Por favor, Inicie sesion.' });

        }

        const orden = await ordenService.getOrden(idbumber);
        if(orden){
        countryService.getCountries().then((data) => setAutoValue(data), console.log('Info autoValue', data));
        nodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
        setidOrden(orden.numero_orden);
        } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Por favor, ingrese la orden.' });
        }
    }, []);

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const searchCliente = (event) => {
        let filteredClientes = [];
        if (_clientes) {
            filteredClientes = _clientes.filter((cliente) => {
                return cliente.cedula_cliente.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        console.log('Filtered', filteredClientes);
        setFilteredClientes(filteredClientes);
    };

    const onClientSelect = (e) => {
        setClient(e.value);
        setSelectedClient(e.value);
        setAutoValue(e.value?.cedula_cliente || '');
        setSubmitted(false); // reiniciar el estado de submitted

        // Establecer los valores del cliente seleccionado en el estado
        setClient({
            cedula: e.value.cedula_cliente,
            telefono: e.value.telefono_cliente,
            nombre: e.value.nombre_cliente,
            apellido: e.value.apellido_cliente
        });
    };

    const onInputChange = (e) => {
        setWriteValue(e.target.value);
    };

    const calculateTotal = () => {
        const subtotal = products.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
        const discountAmount = (subtotal * discount) / 100;
        const totalAmount = subtotal - discountAmount;
        setTotal(totalAmount);
    };

    const onCheckboxChange = (e) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
    };

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px', height: '12px' }} />
                <span>{option.name}</span>
            </div>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Producto</span>
                {rowData.nombre_producto}
            </>
        );
    };

    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.cantidad}
            </>
        );
    };

    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {(parseFloat(rowData.costo_producto)+parseFloat(rowData.costoIngredientes)).toString()}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Imagen</span>
                <img src={`${contextPath}/demo/images/product/${rowData.nombre_imagen}`} alt={rowData.nombre_imagen} className="shadow-2" width="40" />
            </>
        );
    };
    const showproductosDetails = (event, producto) => {
        op4.current.toggle(event);
        setIngredientesClient(producto);
    };

    const ingredienteProductoTemplate = (producto) => {
        
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {producto}
            </>
        );
    };

const productosBodyTemplate = (rowData) => {
     
  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showproductosDetails(e, rowData.ingredientes)}
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success mr-2"
      />
      <OverlayPanel
        ref={op4}
        appendTo={typeof window !== "undefined" ? document.body : null}
        showCloseIcon
        id="overlay_panel_productos"
        style={{ width: "550px" }}
      >
        <DataTable value={ingredientesClient} responsiveLayout="scroll">
          <Column header="Ingredientes" body={ingredienteProductoTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
        </DataTable>
      </OverlayPanel>
    </>
  );
};

const handleDropdownChange = async(e) => {
  const selectedValue = e.value;
  const selectedZona = zonalugares.find((zona) => zona.id_lugar === selectedValue.id);

  const oldSelectedZone = selectedZone;
  setSelectedZone(selectedZona); // Actualiza la zona seleccionada

  let TotalZone = parseFloat(total);
    console.log('TotalZone',TotalZone )
  if (oldSelectedZone !== null) { // Si ya había una zona seleccionada previamente
    TotalZone -= oldSelectedZone.precio_lugar; // Resta su precio del total
  }
  TotalZone += selectedZona.precio_lugar; // Agrega el precio de la zona nueva al total

  setTotal(TotalZone.toString()); // Actualiza el total con el nuevo valor
  const ordenService = new OrdenService();
  const cambioDia = await ordenService.getMontoDia();
  setTotalBs(TotalZone*parseFloat(cambioDia[0].monto));
  setDropdownValue(selectedValue);
  setZonaDropdown(selectedValue);
}

    const procesarOrden = async () => {
        let tipo_Orden;
        let NumMesa = null;
        let zonaSelected = null;
        if (opciones === 'delivery') {
            tipo_Orden = opciones;
            if(dropdownValue){
            zonaSelected = dropdownValue.id;
            } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Ingrese la zona de la orden' });
            }

        } else if (mostradorOptions === 'Comer Aqui') {
            NumMesa = tableNumber;
            tipo_Orden = mostradorOptions;
        } else {
            tipo_Orden = mostradorOptions;
        }
        console.log('test', discount);
        console.log('opcionCambio', opciones);
        console.log('Mostrar orden', mostradorOptions);
        console.log('Lugar', dropdownValue);
        const clienteService = new ClienteService();
        const clienteSelect = await clienteService.getOneClientes(client.cedula);
        const ordenService = new OrdenService();
        if(orderId && tipo_Orden ===  'Comer Aqui' && clienteSelect.id_cliente && total){
        ordenService.getUpdateOrden(orderId, discount, tipo_Orden, clienteSelect.id_cliente, NumMesa, zonaSelected, direccion, total);
        const userNameInfo = localStorage.getItem('nombre_user');
        const userRoleInfo = localStorage.getItem('nombre_role');

       
        await ordenService.postAccionUser('Creacion de orden', userNameInfo, userRoleInfo, orderId);
        setWriteValue(null);
        setidOrden('');
        setTotal('0');
        setOrderId('');
        setDataViewValue([]);
        setDataViewValue(null);
        setDireccion('');
        setdiscount('');
        setClient(emptyClient);
        setMostradorOptions('');
        setOpciones('');
        const ipAddress = window.location.host.split(':')[0];
        localStorage.setItem('myKey', JSON.stringify(null));
        router.push(`http://${ipAddress}:3000/pages/Ordenes/gestion/`);
        } else if(orderId && tipo_Orden && clienteSelect.id_cliente && total && zonaSelected && direccion){
             ordenService.getUpdateOrden(orderId, discount, tipo_Orden, clienteSelect.id_cliente, NumMesa, zonaSelected, direccion, total);
            const userNameInfo = localStorage.getItem('nombre_user');
            const userRoleInfo = localStorage.getItem('nombre_role');

        
            await ordenService.postAccionUser('Creacion de orden', userNameInfo, userRoleInfo, orderId);
            setWriteValue(null);
            setidOrden('');
            setTotal('0');
            setOrderId('');
            setDataViewValue([]);
            setDataViewValue(null);
            setDireccion('');
            setdiscount('');
            setClient(emptyClient);
            setMostradorOptions('');
            setOpciones('');
            const ipAddress = window.location.host.split(':')[0];
            localStorage.setItem('myKey', JSON.stringify(null));
            router.push(`http://${ipAddress}:3000/pages/Ordenes/gestion/`);
        } else {
         toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Revise la informacion del cliente o tipo de orden' });
        }

    };

    const deleteOrder = async () => {
        console.log('test', discount);
        const ordenService = new OrdenService();
        await ordenService.DeleteOrden(orderId);
        setidOrden('');
        setTotal('0');
        setOrderId('');
        setDataViewValue([]);
        setdiscount('');
    };

    const saveCliente = async () => {
        const elementName = 'cliente';
        _setSubmitted(true);
        console.log('Clientes', clientes);
        console.log('Cliente', cliente);
        console.log('Esta entrando en cliente?');
        const updatedCedula = crudObject.selectedPrefix + cliente.cedula;
        const clienteService = new ClienteService();
        _setElement((prevElement) => ({ ...prevElement, cedula: updatedCedula }));
        let _elements = [...dataViewValue];
        let _element = { ...cliente, cedula: updatedCedula };
        let data = crudObject.addAppendix(_element, elementName);
        if (cliente.nombre.trim()) {
            if (cliente.id) {
                const index = crudObject.findIndexById(cliente.id);
                const res = await clienteService.actualizarCliente(data[0]);
                if (res.status >= 200 && res.status < 300) {
                    _elements[index] = _element;
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
                } else {
                    _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente', life: 3000 });
                }
            } else {
                const res = await clienteService.crearCliente(data[0]);

                if (res.status >= 200 && res.status < 300) {
                    _elements.push(_element);
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
                } else {
                    console.log('Resultado de toast', _toast.current);
                    if (_toast.current) {
                        _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente', life: 3000 });
                    }
                }
            }
            _setElements(_elements);
            crudObject.setElementDialog(false);
            _setvisibleCliente(false);
            _setElement(elementName);
            await clienteService.getClientes().then((data) => setClientes(data));
        }
    };

    const saveLugar = async () => {
        const elementName = 'lugar';
        _setSubmitted(true);
        console.log('Esta entrando en cliente?');
        const lugarService = new LugarService();
        let _elements = [...lugares];
        let _element = { ...lugar };
        console.log('Lugar array', _elements);
        console.log('Lugar individual', _element);
        console.log('Lugar individual', elementName);
        let data = crudObject.addAppendix(_element, elementName);
        if (lugar.nombre.trim()) {
            if (lugar.id) {
                const index = crudObject.findIndexById(lugar.id);
                const res = await lugarService.actualizarLugar(data[0]);
                if (res.status >= 200 && res.status < 300) {
                    _elements[index] = _element;
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Lugar Creado', life: 3000 });
                } else {
                    _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el lugar', life: 3000 });
                }
            } else {
                console.log('Llegamos hata aqui', data[0]);
                const res = await lugarService.crearLugar(data[0]);
                if (res.status >= 200 && res.status < 300) {
                    _elements.push(_element);
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Lugar Creado', life: 3000 });
                } else {
                    _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el lugar', life: 3000 });
                }
            }
            _setElements(_elements);
            crudObject.setElementDialog(false);
            _setElement(elementName);
            let newdata = await lugarService.getLugaresByTipo('zona');
            newdata = crudObject.isArray(newdata, 'cliente');
            const dropdownData = newdata.map((item) => ({
                id: item.id_lugar,
                name: item.nombre_lugar
            }));
            setZonalugares(newdata);
            _setElements(newdata);
            setdropdownValues(dropdownData);
            crudObject.hideDialog;
            _setVisibleLugar(false);
        }
    };

    const handleNumeroMesaChange = (event) => {
        setMostradorOptions(event.target.value);
    };

    const handleTelefonoChange = (event) => {
        setTelefono(event.target.value);
    };

    const handleTempDireccionChange = (value) => {
        setTempDireccion(value);
    };

    const handleDireccionBlur = () => {
        setDireccion(tempDireccion);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            opciones,
            mostradorOptions,
            direccion,
            telefono
        });
    };

    // Componente de "Mostrador"
    const MostradorOptions = ({ mostradorOptions, handleMostradorOptionsChange, tableNumber, setTableNumber }) => {
        return (
            <div>
                <div className="grid formgrid">
                    <div className="field col">
                        <div className="p-field-radiobutton">
                            <label htmlFor="Comer Aqui">Comer aquí</label>
                            <RadioButton inputId="Comer Aqui" name="mostradorOptions" value="Comer Aqui" onChange={handleMostradorOptionsChange} checked={mostradorOptions === 'Comer Aqui'} />
                        </div>
                    </div>

                    <div className="field col">
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="Para llevar" name="mostradorOptions" value="Para llevar" onChange={handleMostradorOptionsChange} checked={mostradorOptions === 'Para llevar'} />
                            <label htmlFor="Para llevar">Para llevar</label>
                        </div>
                    </div>
                </div>
                {mostradorOptions === 'Comer Aqui' && (
                    <div className="p-field">
                        <div className="field col">
                            <label htmlFor="numero-mesa">Número de mesa:</label>
                            <InputText id="numero-mesa" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        );
    };


    const handleOpcionesChange = async(event) => {
        const ordenService = new OrdenService();
        const cambioDia = await ordenService.getMontoDia();
        await ordenService.getProductoOrden(orderId).then((data) => {
            const updatedProductos = data.map((producto) => ({ ...producto, cantidad: 1 }));
            setDataViewValue(updatedProductos);
            let total = 0;
            data.forEach((producto) => {
                total = parseFloat(producto.costoTotal);
            });
            setTotal(total);
            setTotalBs(total*parseFloat(cambioDia[0].monto))
            
        });
        setSelectedZone(null);
        setOpciones(event.target.value);
        setMostradorOptions('');
        setTableNumber('');
        setDireccion('');
        setTelefono('');
        setDropdownValue(null);
    };

    const handleMostradorOptionsChange = (event) => {
        setMostradorOptions(event.target.value);
        setTipoOrden(event.target.value);
        setTableNumber('');
    };

    const handlePayment = () => {
        // Aquí iría la lógica para procesar el pago según el método seleccionado
        switch (paymentMethod) {
            case 'electronico':
                console.log('Pago electrónico procesado con número de referencia:', referenceNumber);
                break;
            case 'efectivo':
                console.log('Pago en efectivo procesado con los siguientes datos:', serialNumber, denomination, currency);
                break;
            case 'zelle':
                console.log('Pago Zelle procesado con el siguiente correo electrónico:', email);
                break;
            default:
                console.log('Por favor, selecciona un método de pago.');
        }
    };

    const fechaActual = new Date().toLocaleDateString();



    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <Toast ref={_toast} />
                    <Toast ref={toast} />
                    <h5>Cliente</h5>
                    <AutoComplete
                        placeholder="Cedula"
                        id="dd"
                        dropdown
                        value={writeValue}
                        onChange={onInputChange}
                        suggestions={filteredClientes}
                        completeMethod={searchCliente}
                        field="cedula_cliente"
                        onSelect={onClientSelect}
                        emptyMessage="Cedula"
                    />
                    <div className="flex align-items-center justify-content-between my-3">
                        <Button label="Nuevo Cliente" onClick={() => crudObject.openNew('cliente')} />
                    </div>
                    <h5>Informacion del cliente</h5>
                    <div className="grid formgrid">
                        <div className="field col">
                            <label htmlFor="cedula">Cédula</label>
                            <InputText id="cedula" value={client.cedula} onChange={(e) => onInputChange(e, 'cedula')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cedula })} />
                            {submitted && !client.cedula && <small className="p-invalid">La cédula es obligatoria.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="telefono">Teléfono</label>
                            <InputText id="telefono" value={client.telefono} onChange={(e) => onInputChange(e, 'telefono')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.telefono })} />
                            {submitted && !client.telefono && <small className="p-invalid">El teléfono es obligatorio.</small>}
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={client.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.nombre })} />
                            {submitted && !client.nombre && <small className="p-invalid">El nombre es obligatorio.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText id="apellido" value={client.apellido} onChange={(e) => onInputChange(e, 'apellido')} />
                        </div>
                    </div>
                    <h5>Tipo de orden</h5>
                    <div className="p-grid">
                        <div className="grid formgrid">
                            <div className="p-col-6">
                                <div className="field col">
                                    <div className="p-field-radiobutton">
                                        <RadioButton inputId="mostrador" name="opciones" value="mostrador" onChange={handleOpcionesChange} checked={opciones === 'mostrador'} className="radio-spacer" />
                                        <label htmlFor="mostrador">Mostrador</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field col">
                                <div className="p-col-6">
                                    <div className="p-field-radiobutton">
                                        <RadioButton inputId="delivery" name="opciones" value="delivery" onChange={handleOpcionesChange} checked={opciones === 'delivery'} className="radio-spacer" />
                                        <label htmlFor="delivery">Delivery</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {opciones === 'mostrador' && <MostradorOptions mostradorOptions={mostradorOptions} handleMostradorOptionsChange={handleMostradorOptionsChange} tableNumber={tableNumber} setTableNumber={setTableNumber} />}
                    {opciones === 'delivery' && 
                    <div>
                    <div className="p-field">
                        <label htmlFor="direccion">Dirección:</label>
                    <InputText id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="zonal">Zona</label>
                        <Dropdown value={dropdownValue} onChange={handleDropdownChange} options={dropdownValues} optionLabel="name" placeholder="Select" />
                    </div>
                    <div className="flex align-items-center justify-content-between my-3">
                        <Button label="Nueva Zona" onClick={() => crudObject.openNew('lugar')} />
                    </div>
                    </div>}
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card">
                    <div>
                        <h5>Detalle de orden</h5>
                        <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                Orden: <span>{idOrden}</span>
                            </div>
                            <div>Fecha de orden: {fechaActual}</div>
                        </div>
                        <DataTable
                            value={dataViewValue}
                            selection={selectedProducts}
                            onSelectionChange={(e) => setSelectedProducts(e.value)}
                            dataKey="id"
                            rows={10}
                            style={{ height: '285px', overflowY: 'scroll' }}
                            className="datatable-responsive"
                            globalFilter={globalFilter}
                            emptyMessage="No existen productos."
                        >
                            <Column header="Imagen" body={imageBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                            <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                            <Column field="cantidad" header="Cantidad" body={cantidadBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                            <Column field="precio" header="Precio" body={precioBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                            <Column body={productosBodyTemplate}></Column>
                        </DataTable>
                    </div>
                    <div>
                        <div className="carrito-total text-right total-text my-3">Total: {total}$</div>
                        <div className="carrito-total text-right total-text">Bs. {totalBs}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between my-3">
                        <Button label="Cancelar" className="p-button-danger" onClick={() => deleteOrder()} />
                        <Button label="Procesar" onClick={() => procesarOrden()} />
                    </div>
                </div>
            </div>
            <Dialog visible={_visibleCliente} style={{ width: '450px' }} header="Detalle de Cliente" modal className="p-fluid" footer={() => crudObject.elementDialogFooter(saveCliente)} onHide={crudObject.hideDialog}>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="cedula">Cédula</label>
                        <div className="p-inputgroup">
                            <Dropdown value={crudObject.selectedPrefix} options={prefixOptions} onChange={crudObject.handleDropdownSelect} optionLabel="label" />
                            <InputText style={{ width: '30%' }} id="cedula" value={cliente?.cedula} onChange={(e) => crudObject.onInputChange(e, 'cedula')} required autoFocus className={classNames({ 'p-invalid': _submitted && !cliente?.cedula })} />
                            {_submitted && !cliente?.cedula && <small className="p-invalid">La cedula es requerida.</small>}
                        </div>
                    </div>
                    <div className="field col">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={cliente?.nombre} onChange={(e) => crudObject.onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': _submitted && !cliente?.nombre })} />
                        {_submitted && !cliente?.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="apellido">Apellido</label>
                        <InputText id="apellido" value={cliente?.apellido} onChange={(e) => crudObject.onInputChange(e, 'apellido')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="telefono">Telefono</label>
                        <InputText id="telefono" value={cliente?.telefono} onChange={(e) => crudObject.onInputChange(e, 'telefono')} />
                    </div>
                </div>
            </Dialog>
            <Dialog visible={_visibleLugar} style={{ width: '450px' }} header="Detalle de Lugar" modal className="p-fluid" footer={() => crudObject.elementDialogFooter(saveLugar)} onHide={crudObject.hideDialog}>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={lugar?.nombre} onChange={(e) => crudObject.onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': _submitted && !lugar?.nombre })} />
                        {_submitted && !lugar?.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                        {_submitted && !lugar?.precio && <small className="p-invalid">El precio es requerido.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="precio">Precio</label>
                        <InputNumber id="precio" value={lugar?.precio} onValueChange={(e) => crudObject.onInputNumberChange(e, 'precio')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default InputDemo;
