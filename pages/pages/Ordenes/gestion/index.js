import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { IngredienteService } from '../../../../demo/service/IngredienteService';
import { OrdenService } from '../../../../demo/service/OrdenService';
import Router from 'next/router';
import { Tooltip } from 'primereact/tooltip';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';

const Crud = () => {
    let emptyProduct = {
        id: null,
        nombre: '',
        unidad: '',
        nombreImage: '',
        objectURL: '',
        urlImage: '',
        fileImage: ''
    };

    const [products, setProducts] = useState(null);
    const [file, setfile] = useState(null); 
    const [EstadoDialog, setEstadoDialog] = useState(false);
    const [pagoDialog, setPagoDialog] = useState(false);
    const [montoDialog, setMontoDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [idOrden, setIdorden] = useState(null);
    const [total, setTotal] = useState(null);
    const [totalPagado, setTotalPagado] = useState('0');
    const [totalPagadoBs, setTotalPagadoBs] = useState('0');
    const [totalBs, setTotalBs] = useState(null);
    const [montoDia, setMontoDia] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const dtEstado = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const op2 = useRef(null);
    const op3 = useRef(null);
    const op4 = useRef(null);
    const op5 = useRef(null);
    const op6 = useRef(null);
    const op7 = useRef(null);
    const op8 = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [detallePago, setDetallePago] = useState(null);
    const [selectedLugar, setSelectedLugar] = useState(null);
    const [productoClient, setProductoClient] = useState(null);
    const [ingredienteClient, setIngredienteClient] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [infoEstado, setInfoEstado] = useState(null);
    const [tipoProducto, setTipoProducto] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [electronicPaymentMethod, setElectronicPaymentMethod] = useState('');
    const [currency, setCurrency] = useState('VES');
    const [serialNumber, setSerialNumber] = useState('');
    const [denomination, setDenomination] = useState(0);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [montoBs, setmMontoBs] = useState('');
    const [monto, setMonto] = useState('');
    const [email, setEmail] = useState('');
    const [pagos, setPagos] = useState([]);

    useEffect(async () => {
        const ingredienteService = new IngredienteService();
        const result = await ingredienteService.getIngredientes();
        console.log('test', result);

        const ordenService = new OrdenService();
        await ordenService.getAllOrden().then((data) => {
            const updatedProductos = data.map((producto) => ({
                ...producto,
                productos: producto.productos.map((p) => ({ ...p, cantidad: 1 }))
            }));
            setProducts(updatedProductos);
        });

        ordenService.getAllEstados().then((data) => {
         const dropdownData = data.map((item) => ({
            name: item.nombre_estado
        }));
        setInfoEstado(data);
        setTipoProducto(dropdownData);
        });

   
        


    }, []);

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

    const currencyOptions = [
        { label: 'Bolívares', value: 'Bs.' },
        { label: 'Dólares', value: 'USD' },
        { label: 'Euros', value: 'EUR' }
    ];

   /* const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };*/

    const onProductSelect = (event) => {
        op2.current.hide();
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 });
    };

    const openNew = async() => {
    
    const ordenService = new OrdenService();
    const cambioDia = await ordenService.getMontoDia();
    setMontoDia(cambioDia);
    setMontoDialog(true);
        
    };


    const addPago = async() => {
   
        if(paymentMethod === "electronico"){
        
        let pago = {
        numero_referencia: referenceNumber,
        tipo_pago: electronicPaymentMethod
        };

        const ordenService = new OrdenService();
        await ordenService.postOrdenPago(idOrden.orden_id, pago, paymentMethod, monto);
  
        } else if (paymentMethod ===  "efectivo"){

        let pago = {
        numero_serie: serialNumber,
        denominacion: denomination,
        tipo_pago:currency
        };

        const ordenService = new OrdenService();
        await ordenService.postOrdenPago(idOrden.orden_id, pago, paymentMethod, monto);
       
        } else {
        let pago = {
        correo_electronico: email
        }
        const ordenService = new OrdenService();
        await ordenService.postOrdenPago(idOrden.orden_id, pago,  paymentMethod, monto);
        }
        const ordenService = new OrdenService();
               
        const pagos = await ordenService.getAllPagosOrden(idOrden.orden_id)
        
        const cambioDia = await ordenService.getMontoDia();
        const totalDolares = parseFloat(idOrden.total_orden)*parseFloat(cambioDia[0].monto);

        if(pagos){
        const newPagos = await pagos.map((pago) => {
        if (pago.tipo_pago === 'electrónico' || (pago.tipo_pago === 'efectivo' && pago.tipo_efectivo === 'Bs.')) {
            pago.montoDolares = (parseFloat(pago.monto) / parseFloat(pago.monto_bs)).toFixed(2);
        } else {
            pago.montoDolares = (parseFloat(pago.monto)).toFixed(2);
        }

        return pago;
        });
        const montoCalculoBs = pagos[0].monto_bs
        const totalMonto = newPagos.reduce((acc, pago) => acc + parseFloat(pago.montoDolares), 0).toFixed(2);
        const totalPagadoBs =  (totalMonto * montoCalculoBs).toFixed(2);
        const cambioDia = await ordenService.getMontoDia();
        console.log('Estos son los pagos', cambioDia);
     
      
        
        setTotalPagadoBs(totalPagadoBs)
        setTotalPagado(totalMonto)
        setTotalBs(totalDolares);
        setPagos(newPagos);
        setTotal(idOrden.total_orden);
        setMonto('')
        setPaymentMethod('');
        setReferenceNumber('');
        setElectronicPaymentMethod('');
        setSerialNumber('');
        setDenomination(0);
        setCurrency('VES');
        setEmail('');
        setPagoDialog(true);
        }else {

        setTotalBs(totalDolares);
        setTotal(idOrden.total_orden);
        setPagoDialog(true);
        setMonto('')
        setPaymentMethod('');
        setReferenceNumber('');
        setElectronicPaymentMethod('');
        setSerialNumber('');
        setDenomination(0);
        setCurrency('VES');
        setEmail('');
        }
        setMonto('')
        setPaymentMethod('');
        setReferenceNumber('');
        setElectronicPaymentMethod('');
        setSerialNumber('');
        setDenomination(0);
        setCurrency('VES');
        setEmail('');

    };

    const hideDialog = () => {
        setSubmitted(false);
        setEstadoDialog(false);
        setPagoDialog(false);
        setMontoDialog(false);
        
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        if (product.nombre.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);
                _products[index] = _product;
                const ingredienteService = new IngredienteService();
                ingredienteService.updateIngredientes(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                const ingredienteService = new IngredienteService();
                const response = await ingredienteService.postIngredientes(_product, file);
                _product = { ...response };
                console.log('Imagen file', _product.fileImage);
                console.log('ImagenURL', _product.urlImage);
                console.log('ImagenName', _product.nombreImage);
                //console.log('test',_product.image.objectURL)
                /*const test  = new FileReader();
                 test.readAsDataURL(response.image);
                 test.addEventListener('load', () => {
                    const res = test.result;
                    _product.image = res.toString();
                    console.log('resultado',_product.image);
                 })
                 */
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
            setProducts(_products);
            setEstadoDialog(false);
            setProduct(emptyProduct);
        }
    };

    const showEstado = (orden) => {
        console.log('Test orden', orden)
        setIdorden(orden);
         setEstadoDialog(true);
    };

    const pagoOrden = async(orden) => {
        const ordenService = new OrdenService();
        console.log('Estos son los pagos', orden)
        const pagos = await ordenService.getAllPagosOrden(orden.orden_id)
        
        const cambioDia = await ordenService.getMontoDia();
        const totalDolares = parseFloat(orden.total_orden)*parseFloat(cambioDia[0].monto);

        if(pagos){
        const newPagos = await pagos.map((pago) => {
        if (pago.tipo_pago === 'electrónico' || (pago.tipo_pago === 'efectivo' && pago.tipo_efectivo === 'Bs.')) {
            pago.montoDolares = (parseFloat(pago.monto) / parseFloat(pago.monto_bs)).toFixed(2);
        } else {
            pago.montoDolares = (parseFloat(pago.monto)).toFixed(2);
        }

        return pago;
        });
        const montoCalculoBs = pagos[0].monto_bs
        const totalMonto = newPagos.reduce((acc, pago) => acc + parseFloat(pago.montoDolares), 0).toFixed(2);
        const totalPagadoBs =  (totalMonto * montoCalculoBs).toFixed(2);
        const cambioDia = await ordenService.getMontoDia();
        console.log('Estos son los pagos', cambioDia);
     
      
        
        setTotalPagadoBs(totalPagadoBs)
        setTotalPagado(totalMonto)
        setTotalBs(totalDolares);
        setPagos(newPagos);
        setTotal(orden.total_orden);
        setIdorden(orden);
        setPagoDialog(true);
        }else {

        setTotalBs(totalDolares);
        setTotal(orden.total_orden);
        setIdorden(orden);
        setPagoDialog(true);
        }
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    /*Para eliminar solo el que tiene el boton*/
    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        const ingredienteService = new IngredienteService();
        ingredienteService.DeleteIngredientes(product.id);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    /*Para eliminar todos los seleccionados en checkbox*/
    const deleteSelectedProducts = () => {
        console.log('Delete Select Product', selectedProducts);
        let _products = products.filter((val) => !selectedProducts.includes(val));
        const ingredienteService = new IngredienteService();
        ingredienteService.DeleteIngredientes(selectedProducts[0].id);
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const cambioDia = async() => {

        const ordenService = new OrdenService();
        await ordenService.postMontoCambio(montoBs);

        const cambioDia = await ordenService.getMontoDia();
        
        
        setMontoDia(cambioDia);
        setmMontoBs('');
    };

        const changeEstado = async() => {

        const estadoEnProceso = infoEstado.find((estado) => estado.nombre_estado === dropdownValue.name);
        const ordenService = new OrdenService();
        await ordenService.postEstadoOrden(estadoEnProceso.estado_id, idOrden.orden_id);

        await ordenService.getAllOrden().then((data) => {
        const updatedProductos = data.map((producto) => ({
            ...producto,
            productos: producto.productos.map((p) => ({ ...p, cantidad: 1 })),
        }));
        const registroEncontrado = updatedProductos.find(orden => orden.orden_id === idOrden.orden_id);
        setIdorden(registroEncontrado);
        setProducts(updatedProductos);
        });

        ordenService.getAllEstados().then((data) => {
         const dropdownData = data.map((item) => ({
            name: item.nombre_estado
        }));
        setInfoEstado(data);
        setTipoProducto(dropdownData);
        });

    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        Object.keys(e.files).forEach((file) => {
            _totalSize += file.size;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };

    /*var saveBlob = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, fileName) {
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    }());*/

    function saveBlob(blob, fileName) {
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';

        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const itemTemplate = (file, props) => {
        console.log('Original File', file);

        setfile(file);
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2 ml-auto" />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-1 p-5" style={{ fontSize: '4em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-4">
                    Arrastre y suelte la imagen aqui
                </span>
            </div>
        );
    };

    const chooseOptions = {
        label: 'Archivo',
        icon: 'pi pi-fw pi-plus'
    };

    const cancelOptions = {
        label: 'Cancelar',
        icon: 'pi pi-times',
        className: 'p-button-danger'
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <span className="block mt-2 md:mt-0 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                    </span>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Cambio del dia" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const numeroBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.numero_orden}
            </>
        );
    };

    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.fecha_orden}
            </>
        );
    };

    const horaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.hora_orden}
            </>
        );
    };

    const tipoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.tipo_orden}
            </>
        );
    };

    const estadoBodyTemplate = (rowData) => {

    const ultimaActualizacion = rowData.estado.reduce((ultima, actual) => {
    const fechaActual = moment(actual.fecha_historial, 'D/M/YYYY H:m:s');
    if (!ultima || fechaActual.isAfter(ultima.fecha)) {
        return { fecha: fechaActual, registro: actual };
    } else {
        return ultima;
    }
    }, null);

    const nombreEstado = ultimaActualizacion.registro.estado.nombre_estado;
        return (
            <>
                <span className="p-column-title">Unidad</span>
              <span className={`product-badge status-${nombreEstado.toLowerCase()}`}>{nombreEstado}</span>
            </>
        );
    };

    const confirmacionPagoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.unidad}
            </>
        );
    };

    const descuentoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.descuento}
            </>
        );
    };

    const TotalBodyTemplate = (rowData) => {
    return (
    <>
      <span className="p-column-title">
        <span >Unidad</span>
      </span>
      <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>{rowData.total_orden}$</span>
    </>
    );
    };

    const numeroMesaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.numero_mesa}
            </>
        );
    };

    const toggleDataTable = (event) => {
        op2.current.toggle(event);
    };

    const nombreProductoTemplate = (producto) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {producto.producto_nombre}
            </>
        );
    };

    const cantidadProductoTemplate = (producto) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {producto.cantidad}
            </>
        );
    };

    const fechaPagoTemplate = (pago) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {pago.fecha_historial}
            </>
        );
    };

    const montoPagoTemplate = (pago) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {pago.montoDolares}$
            </>
        );
    };

    const nombrePagoTemplate = (pago) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {pago.tipo_pago}
            </>
        );
    };

    const nombreClienteTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.nombre_cliente}
            </>
        );
    };

    const correoBodyTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.correo_electronico}
            </>
        );
    };

    const montoBsCambioBodyTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.monto_bs}
            </>
        );
    };

    const fechamontoBsCambioBodyTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.fecha_historial_monto_bs}
            </>
        );
    };

    const numeroReferenciaBodyTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.numero_referencia}
            </>
        );
    };

    
    const tipoElectronicoBodyTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.tipo_electronico}
            </>
        );
    };

    const tipoEfectivoBodyTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {cliente.tipo_efectivo}
            </>
        );
    };

    const montoPagoClienteTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                Bs.{cliente.monto}
            </>
        );
    };

    const denominacionPagoClienteTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {cliente.denominacion}
            </>
        );
    };

    const numeroRefPagoClienteTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {cliente.numero_serie}
            </>
        );
    };

    const cedulaClienteTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {cliente.cedula_cliente}
            </>
        );
    };

    const telefonoClienteTemplate = (cliente) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {cliente.telefono_cliente}
            </>
        );
    };

    const nombreDireccionlugarTemplate = (lugar) => {
        return (
            <>
                <span className="p-column-title">Direccion</span>
                {lugar[0].lugar.nombre}
            </>
        );
    };

    const nombreZonalugarTemplate = (lugar) => {
        return (
            <>
                <span className="p-column-title">Direccion</span>
                {lugar[0].lugar.lugarPadre.nombre}
            </>
        );
    };

    const precioZonalugarTemplate = (lugar) => {
        return (
            <>
                <span className="p-column-title">Direccion</span>
                {lugar[0].precio_historico}$
            </>
        );
    };

    const showClientDetails = (event, client) => {
        op2.current.toggle(event);
        setSelectedClient(client);
    };

    const showPagosDetails = (event, pago) => {
        if (pago.tipo_pago === "electrónico"){
        op6.current.toggle(event);
        } else if (pago.tipo_pago === "efectivo"){
        op7.current.toggle(event);
        } else { 
        op8.current.toggle(event);
        }
        setDetallePago(pago);
        console.log("Datos",detallePago )
        
    };

    const showLugarDetails = (event, lugar) => {
        op3.current.toggle(event);
        setSelectedLugar(lugar);
    };

    const showproductosDetails = (event, producto) => {
        op4.current.toggle(event);
        setProductoClient(producto);
    };

    const showIngredientesDetails = (event, ingredientes) => {
        op5.current.toggle(event);
        setIngredienteClient(ingredientes);
    };

  const IngredientesBodyTemplate = (rowData) => {
     
  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showIngredientesDetails(e, rowData.productos)}
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success mr-2"
      />
      <OverlayPanel
        ref={op5}
        appendTo={typeof window !== "undefined" ? document.body : null}
        showCloseIcon
        id="overlay_panel_ingredientes"
        style={{ width: "250px" }}
      >
        <DataTable value={ingredienteClient} responsiveLayout="scroll">
          <Column header="Ingredientes" body={cantidadProductoTemplate} sortable headerStyle={{ minWidth: "10rem" }} />
        </DataTable>
      </OverlayPanel>
    </>
  );
};

  const productosBodyTemplate = (rowData) => {
     
  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showproductosDetails(e, rowData.productos)}
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
        <DataTable value={productoClient} responsiveLayout="scroll">
          <Column header="Cantidad" body={cantidadProductoTemplate} sortable headerStyle={{ minWidth: "10rem" }} />
          <Column header="Nombre" body={nombreProductoTemplate} headerStyle={{ minWidth: "8rem" }} />
          <Column header="Ingredientes" body={IngredientesBodyTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
        </DataTable>
      </OverlayPanel>
    </>
  );
};

const dialogEstadoBodyTemplate = (rowData) => {
     
  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showproductosDetails(e, rowData.productos)}
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
        <DataTable value={productoClient} responsiveLayout="scroll">
          <Column header="Cantidad" body={cantidadProductoTemplate} sortable headerStyle={{ minWidth: "10rem" }} />
          <Column header="Nombre" body={nombreProductoTemplate} headerStyle={{ minWidth: "8rem" }} />
          <Column header="Ingredientes" body={IngredientesBodyTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
        </DataTable>
      </OverlayPanel>
    </>
  );
};


const detalleoldPagosBodyTemplate = (rowData) => {


  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showPagosDetails(e, rowData)}
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info mr-2"
      />
      <OverlayPanel
        ref={op6}
        appendTo={typeof window !== "undefined" ? document.body : null}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "450px" }}
      >
        <DataTable value={[detallePago]} responsiveLayout="scroll">
          <Column header="Numero de referencia" body={numeroReferenciaBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Tipo de pago Electronico" body={tipoElectronicoBodyTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
          <Column header="Monto" body={montoPagoClienteTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
          <Column header="Monto de cambio" body={montoBsCambioBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Fecha cambio del dia" body={fechamontoBsCambioBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        </DataTable>
      </OverlayPanel>
            <OverlayPanel
        ref={op7}
        appendTo={typeof window !== "undefined" ? document.body : null}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "550px" }}
      >
       <DataTable value={[detallePago]} responsiveLayout="scroll">
          <Column header="Tipo modeda" body={tipoEfectivoBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Monto" body={montoPagoClienteTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
          <Column header="Denominacion" body={denominacionPagoClienteTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
          <Column header="Denominacion" body={numeroRefPagoClienteTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
          <Column header="Monto de cambio" body={montoBsCambioBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Fecha cambio del dia" body={fechamontoBsCambioBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        </DataTable>
      </OverlayPanel>
      <OverlayPanel
        ref={op8}
        appendTo={typeof window !== "undefined" ? document.body : null}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "250px" }}
      >
       <DataTable value={[detallePago]} responsiveLayout="scroll">
          <Column header="Correo" body={correoBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Monto de cambio" body={montoBsCambioBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Fecha cambio del dia" body={fechamontoBsCambioBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        </DataTable>
      </OverlayPanel>
    </>
  );
};

const detallePagosBodyTemplate = (rowData) => {
  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showPagosDetails(e, rowData)}
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info mr-2"
      />
      {detallePago && (
        <OverlayPanel
          ref={op6}
          appendTo={typeof window !== "undefined" ? document.body : null}
          showCloseIcon
          id="overlay_panel"
          style={{ width: "450px" }}
          visible
        >
          {detallePago.tipo_pago ? (
            <DataTable value={[detallePago]} responsiveLayout="scroll">
              {detallePago.tipo_pago === "electronico" && (
                <>
                  <Column
                    header="Nombre"
                    body={nombreClienteTemplate}
                    headerStyle={{ minWidth: "10rem" }}
                  />
                  <Column
                    header="Cedula"
                    body={cedulaClienteTemplate}
                    sortable
                    headerStyle={{ minWidth: "8rem" }}
                  />
                  <Column
                    header="Telefono"
                    body={telefonoClienteTemplate}
                    sortable
                    headerStyle={{ minWidth: "8rem" }}
                  />
                </>
              )}
              {detallePago.tipo_pago === "efectivo" && (
                <>
                  <Column header="Banco" field="banco" />
                  <Column header="Numero de referencia" field="num_referencia" />
                </>
              )}
              {detallePago.tipo_pago === "Zelle" && (
                <>
                  <Column
                    header="Nombre"
                    body={correoBodyTemplate}
                    headerStyle={{ minWidth: "10rem" }}
                  />
                  <Column
                    header="Cedula"
                    body={cedulaClienteTemplate}
                    sortable
                    headerStyle={{ minWidth: "8rem" }}
                  />
                  <Column
                    header="Telefono"
                    body={telefonoClienteTemplate}
                    sortable
                    headerStyle={{ minWidth: "8rem" }}
                  />
                </>
              )}
            </DataTable>
          ) : (
            <div>Cargando...</div>
          )}
        </OverlayPanel>
      )}
    </>
  );
};



const clienteBodyTemplate = (rowData) => {


  return (
    <>
      <Button
        type="button"
        label=""
        onClick={(e) => showClientDetails(e, rowData.cliente)}
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info mr-2"
      />
      <OverlayPanel
        ref={op2}
        appendTo={typeof window !== "undefined" ? document.body : null}
        showCloseIcon
        id="overlay_panel"
        style={{ width: "450px" }}
      >
        <DataTable value={[selectedClient]} responsiveLayout="scroll">
          <Column header="Nombre" body={nombreClienteTemplate} headerStyle={{ minWidth: "10rem" }} />
          <Column header="Cedula" body={cedulaClienteTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
          <Column header="Telefono" body={telefonoClienteTemplate} sortable headerStyle={{ minWidth: "8rem" }} />
        </DataTable>
      </OverlayPanel>
    </>
  );
};

    const lugarBodyTemplate = (rowData) => {
        const disabled = rowData.lugar.length === 0;

        return (
            <>
                <Button type="button" label="" onClick={(e) => showLugarDetails(e, rowData.lugar)} icon="pi pi-pencil" className="p-button-rounded p-button-help mr-2" disabled={disabled} />
                <OverlayPanel ref={op3} appendTo={typeof window !== 'undefined' ? document.body : null} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                    <DataTable value={[selectedLugar]} responsiveLayout="scroll">
                        <Column header="Direccion" body={nombreDireccionlugarTemplate} headerStyle={{ minWidth: '10rem' }} />
                        <Column header="Zona" body={nombreZonalugarTemplate} sortable headerStyle={{ minWidth: '8rem' }} />
                        <Column header="Precio" body={precioZonalugarTemplate} sortable headerStyle={{ minWidth: '8rem' }} />
                    </DataTable>
                </OverlayPanel>
            </>
        );
    };

    const pagarBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary mr-2" onClick={() => pagoOrden(rowData)} />           
            
                <Dialog visible={pagoDialog} style={{ width: '550px' }} header="Métodos de pago" modal className="p-fluid" onHide={hideDialog}>
                    <div className="">
                                <div>
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
                                            <div className="field col">
                                                <label htmlFor="monto">Monto</label>
                                                <InputText type="text" value={monto} onChange={(e) => setMonto(e.target.value)} />
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
                                        <div className="field col">
                                                <label htmlFor="monto">Monto</label>
                                                <InputText type="text" value={monto} onChange={(e) => setMonto(e.target.value)} />
                                        </div>          

                                    </>
                                    )}
                                    {paymentMethod === "zelle" && (
                                        <div className="field col">
                                        <label htmlFor="correo_electrónico">Correo electrónico</label>
                                        <InputText type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <div className="field col">
                                        <label htmlFor="monto">Monto</label>
                                         <InputText type="text" value={monto} onChange={(e) => setMonto(e.target.value)} />
                                         </div>
                                        </div>  
                                        
                                    )}
                                </div>
                        <div className="field col flex align-items-center justify-content-between">
                                <Button label="Agregar" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => addPago()} />
                            </div>
                        </div>
                        <div className="carrito-total text-right total-text-pago my-1">Total: {total}$</div>
                        <div className="carrito-total text-right total-text-pago ">Bs. {totalBs}</div>
                        <DataTable
                        ref={dt}
                        value={pagos ? pagos : []}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        className="datatable-responsive"
                        globalFilter={globalFilter}
                        emptyMessage={pagos ? "No products found." : "No payments found."}
                        header={headerPago}
                        responsiveLayout="scroll"
                    >
                        <Column field="nombre" header="Nombre de Pago" sortable body={nombrePagoTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Momento de pago" body={fechaPagoTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Monto" body={montoPagoTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column header="Detalle" body={detalleoldPagosBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                    </DataTable>
                    <div className="carrito-total text-right total-text-pago my-1">Total Pagado: {totalPagado}$</div>
                    <div className="carrito-total text-right total-text-pago my-1"> Bs. {totalPagadoBs}</div>
                    </Dialog>

            </>
        );
    };


        const estadoMultBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                    {rowData.estado.nombre_estado}
            </>
        );
    };

    const MontoBsDiaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                    Bs. {rowData.monto}
            </>
        );
    };

    const fechaMondoDiaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                    {rowData.fecha_historial}
            </>
        );
    };

    const estadoMomentoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                    {rowData.fecha_historial}
            </>
        );
    };

    const estadochangeBodyTemplate = (rowData) => {

        return (
            <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-danger mr-2" onClick={() => showEstado(rowData)} />

            <Dialog visible={EstadoDialog} style={{ width: '550px' }} header="Cambio de estado" modal className="p-fluid" onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <h6>Estado</h6>
                                <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={tipoProducto} optionLabel="name" placeholder="Select" />
                            </div>
                            <div className="field col flex align-items-center justify-content-between" style={{flexDirection: 'column'}}>
                                <h6 htmlFor="costo"></h6>
                                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => changeEstado()} />
                            </div>
                        </div>
                        <DataTable
                        ref={dtEstado}
                        value={idOrden && idOrden.estado ? idOrden.estado : []}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        className="datatable-responsive"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={headerEstado}
                        responsiveLayout="scroll"
                    >
                        <Column field="nombre" header="Nombre de estado" body= {estadoMultBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Momento de cambio" body= {estadoMomentoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                    </Dialog>

            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion Ordenes</h5>
        </div>
    );

    const headerEstado = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Historial de estado</h5>
        </div>
    );

    const headerPago = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Historial de Pago</h5>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrar {first} a {last} de {totalRecords} producto"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="nombre" header="Numero de orden" sortable body={numeroBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Fecha de orden" sortable body={fechaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Hora de orden" sortable body={horaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Tipo de orden" sortable body={tipoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Estado de orden" sortable body={estadoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Confirmacion de pago" sortable body={confirmacionPagoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Descuento" sortable body={descuentoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Numero de mesa" sortable body={numeroMesaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Total" sortable body={TotalBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column header="Productos" body={productosBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column header="Cliente" body={clienteBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column header="Zona" body={lugarBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column header="Pago" body={pagarBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column header="Cambio estado" body={estadochangeBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                    </DataTable>
                    <Dialog visible={montoDialog} style={{ width: '550px' }} header="Cambio del dia" modal className="p-fluid" onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">              
                                <label htmlFor="monto">Monto</label>
                                <InputText type="text" value={montoBs} onChange={(e) => setmMontoBs(e.target.value)} />
                            </div>
                            <div className="field col flex align-items-center justify-content-between" style={{flexDirection: 'column'}}>
                                <h6 htmlFor="costo"></h6>
                                <Button label="Cambiar" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => cambioDia()} />
                            </div>
                        </div>
                        <DataTable
                        ref={dtEstado}
                        value={montoDia? montoDia : []}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        className="datatable-responsive"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={headerEstado}
                        responsiveLayout="scroll"
                    >
                        <Column field="Monto del dia" header="Nombre de estado" body= {MontoBsDiaBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="Momento de cambio" header="Momento de cambio" body= {fechaMondoDiaBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                    </Dialog>
                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
