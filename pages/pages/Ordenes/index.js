import React, { useEffect, useState } from 'react';
import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { Slider } from 'primereact/slider';
import { Knob } from 'primereact/knob';
import { Rating } from 'primereact/rating';
import { ColorPicker } from 'primereact/colorpicker';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect } from 'primereact/treeselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { CountryService } from '../../../demo/service/CountryService';
import { NodeService } from '../../../demo/service/NodeService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OrdenService } from '../../../demo/service/OrdenService';


export const InputDemo = () => {

    let emptyClient = {
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: ''
    };

    const [products, setProducts] = useState([
        { id: 1, nombre: 'Producto 1', precio: 10.5, cantidad: 2 },
        { id: 2, nombre: 'Producto 2', precio: 15.0, cantidad: 1 },
        { id: 3, nombre: 'Producto 3', precio: 20.0, cantidad: 3 },
    ]);

    const [floatValue, setFloatValue] = useState('');
    const [autoValue, setAutoValue] = useState(null);
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
    const [email, setEmail] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
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
    const [idOrden, setidOrden] = useState('');

    const currencyOptions = [
        { label: 'Bolívares', value: 'Bs.' },
        { label: 'Dólares', value: 'USD' },
        { label: 'Euros', value: 'EUR' }
    ];
    const listboxValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
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

    const dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    const paymentMethods = [
        { value: 'electronico', label: 'Pago Electrónico' },
        { value: 'efectivo', label: 'Pago en Efectivo' },
        { value: 'zelle', label: 'Zelle' }
    ];

    const multiselectValues = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const selectButtonValues1 = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    const selectButtonValues2 = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    useEffect(async () => {
        calculateTotal();
        const ordenService = new OrdenService();
        const countryService = new CountryService();
        const nodeService = new NodeService();

        const myStoredObject = JSON.parse(localStorage.getItem("myKey"));
        const idbumber = myStoredObject ? myStoredObject.orden_id : null;
        setOrderId(idbumber)
        console.log('Este es el id de orden', idbumber);

        await ordenService.getProductoOrden(idbumber).then((data) => {
            const updatedProductos = data.map(producto => ({ ...producto, cantidad: 1 }));
            setDataViewValue(updatedProductos);
            let total = 0;
            data.forEach((producto) => {
                total += parseFloat(producto.costo_producto);
            });
            setTotal(total);
        });
        
        const orden = await ordenService.getOrden(idbumber)
        countryService.getCountries().then((data) => setAutoValue(data));
        nodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
        setidOrden(orden.numero_orden)

    }, []);

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const searchCountry = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    })
                );
            }
        }, 250);
    };




    const calculateTotal = () => {
        const subtotal = products.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
        const discountAmount = subtotal * discount / 100;
        const totalAmount = subtotal - discountAmount;
        setTotal(totalAmount);
    };

    const onCheckboxChange = (e) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
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
                {rowData.costo_producto}
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

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-book" className="p-button-rounded p-button-success" onClick={() => deleteProductoCarrito(rowData)} />
            </>
        );
    };

    const procesarOrden = async () => {
    
    console.log('test',discount)
    const ordenService = new OrdenService();
    await ordenService.getUpdateOrden(orderId, discount);
    setidOrden('');
    setTotal('0');
    setOrderId('');
    setDataViewValue([]);
    setdiscount('');
    };

    const deleteOrder = async () => {
    console.log('test',discount)
    const ordenService = new OrdenService();
    await ordenService.DeleteOrden(orderId);
    setidOrden('');
    setTotal('0');
    setOrderId('');
    setDataViewValue([]);
    setdiscount('');
    };

    const handleOpcionesChange = (event) => {
        setOpciones(event.target.value);
        setMostradorOptions('');
        setDireccion('');
        setTelefono('');
    };

    const handleMostradorOptionsChange = (event) => {
        setMostradorOptions(event.target.value);
    };

    const handleNumeroMesaChange = (event) => {
        setMostradorOptions(event.target.value);
    };

    const handleDireccionChange = (event) => {
        setDireccion(event.target.value);
    };

    const handleTelefonoChange = (event) => {
        setTelefono(event.target.value);
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

    const handlePayment = () => {
        // Aquí iría la lógica para procesar el pago según el método seleccionado
        switch (paymentMethod) {
            case "electronico":
                console.log("Pago electrónico procesado con número de referencia:", referenceNumber);
                break;
            case "efectivo":
                console.log("Pago en efectivo procesado con los siguientes datos:", serialNumber, denomination, currency);
                break;
            case "zelle":
                console.log("Pago Zelle procesado con el siguiente correo electrónico:", email);
                break;
            default:
                console.log("Por favor, selecciona un método de pago.");
        }
    };

    const fechaActual = new Date().toLocaleDateString();

    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-6">
                <div className="card">
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
                                        <RadioButton
                                            inputId="mostrador"
                                            name="opciones"
                                            value="mostrador"
                                            onChange={handleOpcionesChange}
                                            checked={opciones === 'mostrador'}
                                            className="radio-spacer"
                                        />
                                        <label htmlFor="mostrador">Mostrador</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field col">
                                <div className="p-col-6">
                                    <div className="p-field-radiobutton">
                                        <RadioButton
                                            inputId="delivery"
                                            name="opciones"
                                            value="delivery"
                                            onChange={handleOpcionesChange}
                                            checked={opciones === 'delivery'}
                                            className="radio-spacer"
                                        />
                                        <label htmlFor="delivery">Delivery</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {opciones === 'mostrador' && (
                        <div>
                            <div className="grid formgrid">
                                <div className="field col">
                                    <div className="p-field-radiobutton">
                                        <label htmlFor="comer-aqui">Comer aquí</label>
                                        <RadioButton
                                            inputId="comer-aqui"
                                            name="mostradorOptions"
                                            value="comer-aqui"
                                            onChange={handleMostradorOptionsChange}
                                            checked={mostradorOptions === 'comer-aqui'}
                                        />

                                    </div>
                                </div>

                                <div className="field col">
                                    <div className="p-field-radiobutton">
                                        <RadioButton
                                            inputId="para-llevar"
                                            name="mostradorOptions"
                                            value="para-llevar"
                                            onChange={handleMostradorOptionsChange}
                                            checked={mostradorOptions === 'para-llevar'}
                                        />
                                        <label htmlFor="para-llevar">Para llevar</label>
                                    </div>
                                </div>
                            </div>
                            {mostradorOptions === 'comer-aqui' && (
                                <div className="p-field">
                                    <div className="field col">
                                        <label htmlFor="numero-mesa">Número de mesa:</label>
                                        <InputText id="numero-mesa" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {opciones === 'delivery' && (
                        <div>
                            <div className="p-field">
                                <label htmlFor="direccion">Dirección:</label>
                                <InputText id="direccion" value={direccion} onChange={handleDireccionChange} />
                            </div>
                            <div className="p-field">
                                <label htmlFor="telefono">Zona</label>
                                <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card">
                    <div>
                        <h5>Detalle de orden</h5>
                        <div className="my-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>Orden: <span>{idOrden}</span></div>
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
                            <Column body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>
                    <div>
                        <div className="my-2">
                            <label htmlFor="descuento">Descuento:</label>
                            <InputText id="descuento" value={discount} onChange={(e) => setdiscount(e.target.value)} />
                        </div>
                        <div className="carrito-total text-right total-text my-3">
                            Total: {total}$
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-between my-3">
                        <Button label="Cancelar" className="p-button-danger" onClick={() => deleteOrder()} />
                        <Button label="Procesar" onClick={() => procesarOrden()}/>
                    </div>
                </div>
            </div>
            {/*<div className="col-12 md:col-6">
                <div className="card">
                    <div>
                        <h5>Métodos de pago:</h5>
                        <div className="field">
                        <Dropdown value={paymentMethod} options={paymentOptions} onChange={(e) => setPaymentMethod(e.value)} placeholder="Seleccione" />
                        </div>
                        {paymentMethod === "electronico" && (

                            <label>
                            <div className="formgrid grid"></div>
                                <div className="field col">
                                    <label htmlFor="tipo_de_pago_electrónico"> Tipo de pago electrónico</label>
                                    <Dropdown value={electronicPaymentMethod} options={electronicPaymentOptions} onChange={(e) => setElectronicPaymentMethod(e.value)} placeholder="Seleccione" />
                                </div>
                                <div className="field col">
                                    <label htmlFor="numero_de_referencia">Número de referencia</label>
                                    <InputText type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
                                </div>
                            </label>

                        )}
                        {paymentMethod === "efectivo" && (
                        <>
                    
                            <div className="formgrid grid"></div>
                            <div className="field col">
                            <label htmlFor="moneda">Moneda</label>
                            <Dropdown value={currency} options={currencyOptions} onChange={(e) => setCurrency(e.value)} placeholder="Seleccione" />
                            </div>
                            
                            <div className="field col">
                            <label htmlFor="numero_de_serie">Número de serie (opcional)</label>
                            <InputText type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
                            </div>
                        
                            <div className="field col">
                            <label htmlFor="numero_de_serie">Denominación</label>
                            <InputText type="text" value={denomination} onChange={(e) => setDenomination(e.target.value)} />
                            </div>                

                        </>
                        )}
                        {paymentMethod === "zelle" && (
                            <div className="field col">
                            <label htmlFor="correo_electrónico">Correo electrónico</label>
                            <InputText type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                      
                        )}
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default InputDemo;
