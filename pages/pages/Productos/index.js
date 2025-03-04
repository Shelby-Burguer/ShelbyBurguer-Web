import React, { useState, useEffect, useRef, Component } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { PickList } from 'primereact/picklist';
import { OrderList } from 'primereact/orderlist';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { FileUpload } from 'primereact/fileupload';
import { ProductService } from '../../../demo/service/ProductosServiceShelbyBurguer';
import { NewProductoService } from '../../../demo/service/ProductoService';
import { IngredienteService } from '../../../demo/service/IngredienteService';
import { CarritoService } from '../../../demo/service/CarritoService';
import { addToCart } from '../../../layout/addToCar';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import getConfig from 'next/config';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const ListDemo = (props) => {
    let emptyProduct = {
        id: null,
        nombre: '',
        tipo_producto: '',
        costo: '',
        nombre_imagen: '',
        cantidad: '',
        precio: '',
        tamano_producto: ''
    };

    let emptyCantidad = {
        id: null,
        costo: ''
    };

    const [product, setProduct] = useState(emptyProduct);
    const [productAux, setProductAux] = useState(emptyProduct);
    const [cantidad, setCantidad] = useState(emptyCantidad);
    const [tipoProducto, setTipoProducto] = useState(null);
    const [proteinasIngredientes, setProteinasIngredientes] = useState(null);
    const [picklistProteinaSourceValue, setPicklistProteinaSourceValue] = useState(null);
    const [picklistProteinaTargetValue, setPicklistProteinaTargetValue] = useState([]);
    const [picklistSourceValue, setPicklistSourceValue] = useState(null);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [carritoDialog, setcarritoDialog] = useState(false);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const fileUploadRef = useRef(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [dropdownValueAux, setDropdownValueAux] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const [file, setfile] = useState(null);
    const toast = useRef(null);
    const [items, setItems] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [orderId, setOrderId] = useState(null);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        const productService = new ProductService();
        const productoServicenew = new NewProductoService();

        productoServicenew.getProductos().then((data) => {
            console.log('Test que es', data);
            if (data) {
                setDataViewValue(data);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Por favor, Inicie sesion.' });
            }
        });

        productService.getTypeProducts().then((data) => setTipoProducto(data));
        setGlobalFilterValue('');
    }, []);

    const onFilter = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue.filter((product) => {
                return product.nombre.toLowerCase().includes(value);
            });
            setFilteredValue(filtered);
        }
    };

    const onFilterByCategory = (category) => {
        const value = category;
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue.filter((product) => {
                return product.tipo.toLowerCase().includes(value);
            });
            setFilteredValue(filtered);
        }
    };

    function buscarId(arr, nombre, tipo, costo) {
        console.log('producto auxiliar', productAux);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].nombre === nombre && arr[i].tipo === tipo && arr[i].costo === costo) {
                return arr[i].id;
            }
        }
        return null;
    }

    const saveProduct = async () => {
        setSubmitted(true);
        console.log('productos', dataViewValue);
        console.log('producto', product);
        console.log('Tipo de producto', dropdownValue);
        console.log('Imagen', file);
        console.log('Izquierda', picklistSourceValue);
        console.log('Derecha', picklistTargetValue);
        console.log('producto auxiliar', productAux);
        console.log('Proteina', picklistProteinaTargetValue);

        setDropdownValueAux(dropdownValue);

        if (product.nombre.trim()) {
            let _products = [...dataViewValue];

            if (product.id) {
                const productoServicenew = new NewProductoService();
                product.tipo_producto = dropdownValue.name;
                const response = await productoServicenew.updateProducto(product.id, product, picklistTargetValue, picklistProteinaTargetValue);
                const index = findIndexById(product.id);

                let arrIngredientes = [];
                let arrProteinas = [];
                for (let j = 0; j < picklistTargetValue.length; j++) {
                    if (picklistTargetValue[j].proteina == 'Si') {
                        arrProteinas.push(picklistTargetValue[j]);
                    } else {
                        arrIngredientes.push(picklistTargetValue[j]);
                    }
                }

                product.ingrediente = arrIngredientes;
                product.proteina = arrProteinas;
                _products[index] = product;
            } else {
                console.log('Entre en Save');
                console.log('Prducto', product);
                console.log('Prducto', picklistTargetValue);
                console.log('Tipo de producto', dropdownValue);
                product.tipo_producto = dropdownValue.name;
                const productoServicenew = new NewProductoService();
                const response = await productoServicenew.postProducto(product, picklistTargetValue, picklistProteinaTargetValue);

                console.log('response', response);

                let arrIngredientes = [];
                let arrProteinas = [];

                for (let j = 0; j < picklistTargetValue.length; j++) {
                    let ingrediente = picklistTargetValue[j];

                    let newIngrediente = {
                        id: null,
                        nombre: '',
                        cantidad: '',
                        imagen: '',
                        proteina: ''
                    };

                    newIngrediente.id = ingrediente.id;
                    newIngrediente.nombre = ingrediente.nombre;
                    newIngrediente.cantidad = ingrediente.cantidad;
                    newIngrediente.imagen = ingrediente.nombreImage;
                    newIngrediente.proteina = ingrediente.proteina;

                    if (ingrediente.proteina == 'Si') {
                        arrProteinas.push(newIngrediente);
                    } else {
                        arrIngredientes.push(newIngrediente);
                    }
                }

                let NewProduct = {
                    id: null,
                    nombre: '',
                    tipo: '',
                    costo: '',
                    imagen: '',
                    proteina: null,
                    tamano_producto: '',
                    proteina: arrProteinas,
                    ingrediente: arrIngredientes
                };

                NewProduct.id = response.id;
                NewProduct.nombre = response.nombre;
                NewProduct.tipo = dropdownValue.name;
                NewProduct.costo = response.costo;
                NewProduct.imagen = response.imagen;
                NewProduct.tamano_producto = response.tamano_producto;
                NewProduct.proteina = arrProteinas;
                NewProduct.ingrediente = arrIngredientes;

                console.log('test new product', NewProduct);
                _products.push(NewProduct);
                //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setDataViewValue(_products);
            setProductDialog(false);
            setDropdownValue(null);
            //setProduct(emptyProduct);
        }

        setPicklistTargetValue([]);
    };

    const handleAddToCart = () => {
        addToCart(product, carrito, setCarrito);
    };

    const saveCarrito = async () => {
        setSubmitted(true);
        console.log('productos', dataViewValue);
        console.log('producto', product);
        console.log('Tipo de producto', dropdownValue);
        console.log('Imagen', file);
        console.log('Izquierda', picklistSourceValue);
        console.log('Derecha', picklistTargetValue);
        console.log('producto auxiliar', productAux);
        console.log('Proteinas', picklistProteinaTargetValue);
        setDropdownValueAux(dropdownValue);
        addToCart(product, carrito, setCarrito);

        const myStoredObject = JSON.parse(localStorage.getItem('myKey'));
        const idnumber = myStoredObject ? myStoredObject.orden_id : null;
        setOrderId(idnumber);
        console.log('Este es el id de orden', idnumber);

        if (product.nombre.trim()) {
            let _products = [...dataViewValue];
            console.log('idOrden Save', orderId);
            const carritoService = new CarritoService();

            const response = await carritoService.postCarrito(product.id, idnumber, picklistTargetValue, picklistProteinaTargetValue);

            setDataViewValue(_products);
            setcarritoDialog(false);
            setDropdownValue(null);
        }

        setPicklistTargetValue([]);
    };

    const deleteProduct = () => {
        let _dataViewValue = dataViewValue.filter((val) => val.id !== product.id);
        console.log('id Producto', product.id);
        setDataViewValue(_dataViewValue);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        const ProductoService = new NewProductoService();
        ProductoService.DeleteProductos(product.id);
        /*toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });*/
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < dataViewValue.length; i++) {
            if (dataViewValue[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-1">
                    <span className="flex mt-2 md:mt-2 p-input-icon-left flex-wrap gap-2">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onFilter} placeholder="Buscar..." />
                        <Button label="Hamburguesas" severity="warning" rounded onClick={() => onFilterByCategory('hamburguesa')} />
                        <Button label="Perros Calientes" severity="warning" rounded onClick={() => onFilterByCategory('perro')} />
                        <Button label="Pepitos" severity="warning" rounded onClick={() => onFilterByCategory('pepito')} />
                        <Button label="Bebidas" severity="warning" rounded onClick={() => onFilterByCategory('bebida')} />
                    </span>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
            </React.Fragment>
        );
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => hideDialog()} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );

    const carritotDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => carritoHideDialog()} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCarrito} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteProductDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
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

    const itemTemplatePickList = (item) => {
        return (
            <div className="flex flex-wrap p-1 align-items-center gap-2">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`${contextPath}/demo/images/combo/Verduras_y_frutas.jpg`} alt={item.nombre} />
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.nombre}</span>
                </div>
                {/*<span className="font-bold text-900">${item.price}</span>*/}
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold"> Cantidad</span>
                    <div className="col-12 mb-0 lg:col-11 lg:mb-0">
                        <InputText id="cantidad" value={item.cantidad} onChange={(e) => onInputChangePickList(e, 'cantidad', item.id)} required autoFocus className={classNames({ 'p-invalid': submitted && !item.cantidad })} />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplateProteinaPickList = (item) => {
        return (
            <div className="flex flex-wrap p-1 align-items-center gap-2">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`${contextPath}/demo/images/combo/Verduras_y_frutas.jpg`} alt={item.nombre} />
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.nombre}</span>
                </div>
                {/*<span className="font-bold text-900">${item.price}</span>*/}
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">Cantidad</span>
                    <div className="col-12 mb-0 lg:col-11 lg:mb-0">
                        <InputText id="cantidad" value={item.cantidad} onChange={(e) => onInputChangePickList(e, 'cantidad', item.id)} required autoFocus className={classNames({ 'p-invalid': submitted && !item.cantidad })} />
                    </div>
                    <span className="font-bold">Precio</span>
                    <div className="col-12 mb-0 lg:col-11 lg:mb-0">
                        <InputText id="precio" value={item.precio} onChange={(e) => onInputChangePickList(e, 'precio', item.id)} required tabIndex="2" className={classNames({ 'p-invalid': submitted && !item.precio })} />
                    </div>
                </div>
            </div>
        );
    };

    const onInputChangePickList = (e, propertyName, itemId) => {
        const value = e.target.value;

        if (picklistSourceValue.some((item) => item.id === itemId)) {
            setPicklistSourceValue((prevState) => {
                const newState = [...prevState];
                const itemIndex = newState.findIndex((item) => item.id === itemId);
                newState[itemIndex] = { ...newState[itemIndex], [propertyName]: value };
                return newState;
            });
        } else if (picklistProteinaSourceValue.some((item) => item.id === itemId)) {
            setPicklistProteinaSourceValue((prevState) => {
                const newState = [...prevState];
                const itemIndex = newState.findIndex((item) => item.id === itemId);
                newState[itemIndex] = { ...newState[itemIndex], [propertyName]: value };
                return newState;
            });
        } else if (picklistProteinaTargetValue.some((item) => item.id === itemId)) {
            setPicklistProteinaTargetValue((prevState) => {
                const newState = [...prevState];
                const itemIndex = newState.findIndex((item) => item.id === itemId);
                newState[itemIndex] = { ...newState[itemIndex], [propertyName]: value };
                return newState;
            });
        } else {
            setPicklistTargetValue((prevState) => {
                const newState = [...prevState];
                const itemIndex = newState.findIndex((item) => item.id === itemId);
                newState[itemIndex] = { ...newState[itemIndex], [propertyName]: value };
                return newState;
            });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const hideDialog = async () => {
        const ingredienteService = new IngredienteService();

        let ingredientes;
        await ingredienteService.getIngredientes().then((data) => (ingredientes = data));
        console.log('Que paso?', ingredientes);
        const opcionesDropdown = ingredientes.filter((ingrediente) => ingrediente.proteina === 'Si').map((ingrediente) => ({ id: ingrediente.id, name: ingrediente.nombre }));

        for (let i = ingredientes.length - 1; i >= 0; i--) {
            if (ingredientes[i].proteina === 'Si') {
                ingredientes.splice(i, 1);
            }
        }
        setPicklistProteinaSourceValue(opcionesDropdown);
        setProteinasIngredientes(opcionesDropdown);
        setPicklistSourceValue(ingredientes);
        setPicklistTargetValue([]);
        setSubmitted(false);
        setProductDialog(false);
        setDropdownValue(null);
    };

    const openNew = async () => {
        const ingredienteService = new IngredienteService();

        let ingredientes;
        await ingredienteService.getIngredientes().then((data) => (ingredientes = data));
        console.log('Que paso?', ingredientes);
        const opcionesDropdown = ingredientes.filter((ingrediente) => ingrediente.proteina === 'Si');

        for (let i = ingredientes.length - 1; i >= 0; i--) {
            if (ingredientes[i].proteina === 'Si') {
                ingredientes.splice(i, 1);
            }
        }

        setPicklistProteinaSourceValue(opcionesDropdown);
        setProteinasIngredientes(opcionesDropdown);
        setPicklistSourceValue(ingredientes);
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const carritoHideDialog = () => {
        setSubmitted(false);
        setcarritoDialog(false);
    };

    const carritOpenNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setcarritoDialog(true);
    };

    const hideDeleteProductDialog = () => {
        console.log('LLega a eliminar');
        setSubmitted(false);
        setProductDialog(false);
        setDeleteProductDialog(false);
        setProduct(emptyProduct); // Restablecer el producto cuando se cierre el diálogo
    };

    const editProduct = async (product) => {
        try {
            const ingredienteServie = new IngredienteService();
            const data = await ingredienteServie.getIngredientes();
            console.log('Ingredientes view', product.ingrediente);

            console.log('Proteinas view', product.proteina);

            const nuevoTipoProducto = tipoProducto.find((producto) => producto.name === product.tipo);

            const picklistTargetValuenew = [...product.ingrediente, ...product.proteina];

            const picklistProteinaTargetValuenew = picklistTargetValuenew.filter((item) => item.proteina === 'Si');

            const indexToRemove = picklistTargetValuenew.findIndex((item) => item.proteina === 'Si');
            if (indexToRemove !== -1) {
                picklistTargetValuenew.splice(indexToRemove, 1);
            }

            const idsSeleccionados = picklistTargetValuenew.map((ingrediente) => ingrediente.id);

            const idsSeleccionadosProteina = picklistProteinaTargetValuenew.map((ingrediente) => ingrediente.id);

            const picklistSourceValuenew = data.filter((ingrediente) => {
                return !idsSeleccionados.includes(ingrediente.id) && ingrediente.proteina === 'No';
            });

            const picklistProteinaSourceValuenew = data.filter((ingrediente) => {
                return !idsSeleccionadosProteina.includes(ingrediente.id) && ingrediente.proteina === 'Si';
            });

            setPicklistProteinaSourceValue(picklistProteinaSourceValuenew);
            setPicklistProteinaTargetValue(picklistProteinaTargetValuenew);
            setPicklistSourceValue(picklistSourceValuenew);
            setPicklistTargetValue(picklistTargetValuenew);
            setDropdownValue(nuevoTipoProducto);
            setDropdownValueAux(nuevoTipoProducto);
            setProduct({ ...product });
            setProductAux({ ...product });
            setProductDialog(true);
        } catch (error) {
            console.log(error);
        }
    };

    const addCarrito = async (product) => {
        try {
            const ingredienteServie = new IngredienteService();
            const data = await ingredienteServie.getIngredientes();
            console.log('Producto view', product);
            console.log('Ingredientes view', product.ingrediente);
            console.log('Proteinas view', product.proteina);

            const nuevoTipoProducto = tipoProducto.find((producto) => producto.name === product.tipo);

            const picklistTargetValuenew = [...product.ingrediente, ...product.proteina];

            const picklistProteinaTargetValuenew = picklistTargetValuenew.filter((item) => item.proteina === 'Si');

            const indexToRemove = picklistTargetValuenew.findIndex((item) => item.proteina === 'Si');
            if (indexToRemove !== -1) {
                picklistTargetValuenew.splice(indexToRemove, 1);
            }

            const idsSeleccionados = picklistTargetValuenew.map((ingrediente) => ingrediente.id);

            const idsSeleccionadosProteina = picklistProteinaTargetValuenew.map((ingrediente) => ingrediente.id);

            const picklistSourceValuenew = data.filter((ingrediente) => {
                return !idsSeleccionados.includes(ingrediente.id) && ingrediente.proteina === 'No';
            });

            const picklistProteinaSourceValuenew = data.filter((ingrediente) => {
                return !idsSeleccionadosProteina.includes(ingrediente.id) && ingrediente.proteina === 'Si';
            });

            setPicklistProteinaSourceValue(picklistProteinaSourceValuenew);
            setPicklistProteinaTargetValue(picklistProteinaTargetValuenew);
            setPicklistSourceValue(picklistSourceValuenew);
            setPicklistTargetValue(picklistTargetValuenew);
            setDropdownValue(nuevoTipoProducto);
            setDropdownValueAux(nuevoTipoProducto);
            setProduct({ ...product });
            setProductAux({ ...product });
            setcarritoDialog(true);
            carritOpenNew;
        } catch (error) {
            console.log(error);
        }
    };

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataViewHeader = <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>;

    const chooseOptions = {
        label: 'Archivo',
        icon: 'pi pi-fw pi-plus'
    };

    const cancelOptions = {
        label: 'Cancelar',
        icon: 'pi pi-times',
        className: 'p-button-danger'
    };

    const dataviewGridItem = (data) => {
        let arrProteinas = [];
        for (let j = 0; j < data.proteina.length; j++) {
            let proteina = data.proteina[j];
            arrProteinas.push(proteina.nombre);
        }

        let arrIngredientes = [];
        let arrIngredientes2 = [];
        let arrIngredientes3 = [];
        for (let j = 0; j < data.ingrediente.length; j++) {
            let ingredientes = data.ingrediente[j];
            if (j < 4) {
                arrIngredientes.push(ingredientes.nombre);
            } else if (j >= 4 && j < 8) {
                arrIngredientes2.push(ingredientes.nombre);
            } else if (j >= 8) {
                arrIngredientes3.push(ingredientes.nombre);
            }
        }

        if (data.tipo === 'Bebida') {
            return (
                <div className="col-12 lg:col-4">
                    <div className="card m-3 border-1 surface-borders">
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                            <div className="flex align-items-center">
                                <i className="pi pi-tag mr-2" />
                                <span className="font-semibold">{data.tipo}</span>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center text-center mb-3">
                            <img src={`${contextPath}/demo/images/product/${data.imagen}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                            <div className="text-2xl font-bold">{data.nombre}</div>
                            <div label="Text" className="mb-3"></div>
                            <h7>Tamaño:</h7>
                            <div label="Text" className="mb-3">
                                {data.tamano_producto}
                            </div>

                            <span className="text-2xl font-semibold">${data.costo}</span>
                        </div>
                        <div className="flex align-items-center justify-content-between">
                            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(data)} />
                            <Button icon="pi pi-pencil" className="p-button-success" onClick={() => editProduct(data)} />
                            <Button label="Agregar" icon="pi pi-shopping-cart" onClick={() => addCarrito(data)} />
                        </div>
                    </div>
                </div>
            );
        } else if (data.tipo === 'Papas') {
            console.log('Test tamaño', data);
            return (
                <div className="col-12 lg:col-4">
                    <div className="card m-3 border-1 surface-borders">
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                            <div className="flex align-items-center">
                                <i className="pi pi-tag mr-2" />
                                <span className="font-semibold">{data.tipo}</span>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center text-center mb-3">
                            <img src={`${contextPath}/demo/images/product/${data.imagen}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                            <div className="text-2xl font-bold">{data.nombre}</div>
                            <div label="Text" className="mb-3"></div>
                            <h7>Tamaño:</h7>
                            <div label="Text" className="mb-3">
                                {data.tamano_producto}
                            </div>

                            <span className="text-2xl font-semibold">${data.costo}</span>
                        </div>
                        <div className="flex align-items-center justify-content-between">
                            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(data)} />
                            <Button icon="pi pi-pencil" className="p-button-success" onClick={() => editProduct(data)} />
                            <Button label="Agregar" icon="pi pi-shopping-cart" onClick={() => addCarrito(data)} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="col-12 lg:col-4">
                    <div className="card m-3 border-1 surface-borders">
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                            <div className="flex align-items-center">
                                <i className="pi pi-tag mr-2" />
                                <span className="font-semibold">{data.tipo}</span>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center text-center mb-3">
                            <img src={`${contextPath}/demo/images/product/${data.imagen}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                            <div className="text-2xl font-bold">{data.nombre}</div>
                            <div label="Text" className="mb-3"></div>
                            {/* <h7>Proteinas a elegir:</h7>
                        <div className="mb-3 ">{arrProteinas.toString()}</div> */}
                            <span>Ingredientes:</span>
                            <div label="Text" className="mb-3">
                                {arrIngredientes.toString()}
                                <br></br>
                                {arrIngredientes2.toString()}
                                <br></br>
                                {arrIngredientes3.toString()}
                            </div>

                            <span className="text-2xl font-semibold">${data.costo}</span>
                        </div>
                        <div className="flex align-items-center justify-content-between">
                            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(data)} />
                            <Button icon="pi pi-pencil" className="p-button-success" onClick={() => editProduct(data)} />
                            <Button label="Agregar" icon="pi pi-shopping-cart" onClick={() => addCarrito(data)} />
                        </div>
                    </div>
                    <Dialog visible={carritoDialog} style={{ width: '800px' }} header="Modificaciones" modal className="p-fluid" footer={carritotDialogFooter} onHide={carritoHideDialog}>
                        {((dropdownValue && dropdownValue.name === 'Hamburguesa') || (dropdownValue && dropdownValue.name === 'Perro') || (dropdownValue && dropdownValue.name === 'Pepito')) && (
                            <img src={`${contextPath}/demo/images/product/depositphotos_387255148-stock-photo-summer-bbq-food-table.jpg`} alt={product.nombre_imagen} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />
                        )}
                        {dropdownValue && dropdownValue.name === 'Papas' && (
                            <img src={`${contextPath}/demo/images/product/16891a7a-52f8-4bc6-8176-00a5ae0b1c0a.jpg`} alt={product.nombre_imagen} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />
                        )}
                        {dropdownValue && dropdownValue.name === 'Bebida' && <img src={`${contextPath}/demo/images/product/Papas_fritas_perfectas.jpg`} alt={product.nombre_imagen} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <h6 htmlFor="nombre">Nombre</h6>
                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                            {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <h6>Tipo de producto</h6>
                                <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={tipoProducto} optionLabel="name" placeholder="Select" />
                            </div>
                            <div className="field col">
                                <h6 htmlFor="Costo">Costo</h6>
                                <InputText id="costo" value={product.costo} onChange={(e) => onInputChange(e, 'costo')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.costo })} />
                                {submitted && !product.costo && <small className="p-invalid">Name is required.</small>}
                            </div>
                        </div>
                        {((dropdownValue && dropdownValue.name === 'Hamburguesa') || (dropdownValue && dropdownValue.name === 'Perro') || (dropdownValue && dropdownValue.name === 'Pepito')) && (
                            <div className="col-12 xl:col-13">
                                <div className="card">
                                    <h6>Cambio de ingrediente</h6>
                                    <PickList
                                        source={picklistSourceValue}
                                        target={picklistTargetValue}
                                        sourceHeader="Ingredientes"
                                        targetHeader="Ingrediente seleccionado"
                                        itemTemplate={itemTemplatePickList}
                                        onChange={(e) => {
                                            setPicklistSourceValue(e.source);
                                            setPicklistTargetValue(e.target);
                                        }}
                                        sourceStyle={{ height: '200px' }}
                                        targetStyle={{ height: '200px' }}
                                        filter
                                        filterBy="name"
                                    ></PickList>
                                </div>
                            </div>
                        )}
                        {((dropdownValue && dropdownValue.name === 'Hamburguesa') || (dropdownValue && dropdownValue.name === 'Perro') || (dropdownValue && dropdownValue.name === 'Pepito') || (dropdownValue && dropdownValue.name === 'Papas')) && (
                            <div className="col-12 xl:col-13">
                                <div className="card">
                                    {/* VENTANA DE AGREGAR A CARRITO */}
                                    <h6>Seleccione la Proteína</h6>
                                    <PickList
                                        source={picklistProteinaSourceValue}
                                        target={picklistProteinaTargetValue}
                                        sourceHeader="Proteina"
                                        targetHeader="Proteina Seleccionada"
                                        itemTemplate={itemTemplateProteinaPickList}
                                        onChange={(e) => {
                                            setPicklistProteinaTargetValue(e.target);
                                            setPicklistProteinaSourceValue(e.source);
                                        }}
                                        sourceStyle={{ height: '200px' }}
                                        targetStyle={{ height: '200px' }}
                                        filter
                                        filterBy="name"
                                    ></PickList>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </div>
            );
        }
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    const itemTemplateFile = (file, props) => {
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

    return (
        <div className="grid list-demo">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>Productos</h5>
                    <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                </div>
            </div>
            <Dialog visible={productDialog} style={{ width: '1200px' }} header="Ingrese producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">{product.fileImage && <img src={`${contextPath}/demo/images/product/${product.fileImage}`} alt={product.fileImage} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}</div>
                <div className="field">
                    <h6 htmlFor="nombre">Nombre</h6>
                    <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                    {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <h6>Tipo de producto</h6>
                        <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={tipoProducto} optionLabel="name" placeholder="Select" />
                    </div>
                    <div className="field col">
                        <h6 htmlFor="costo">Costo</h6>
                        <InputText id="costo" value={product.costo} onChange={(e) => onInputChange(e, 'costo')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.costo })} />
                        {submitted && !product.costo && <small className="p-invalid">Name is required.</small>}
                    </div>
                </div>
                {((dropdownValue && dropdownValue.name === 'Papas') || (dropdownValue && dropdownValue.name === 'Bebida')) && (
                    <div className="formgrid grid">
                        <div className="field col">
                            <h6 htmlFor="costo">Tamaño</h6>
                            <InputText id="costo" value={product.tamano_producto} onChange={(e) => onInputChange(e, 'tamano_producto')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.tamano_producto })} />
                            {submitted && !product.tamano_producto && <small className="p-invalid">Tamaño is required.</small>}
                        </div>
                    </div>
                )}
                <div className="card">
                    <h6>Agregar imagen</h6>
                    <FileUpload
                        ref={fileUploadRef}
                        name="demo[]"
                        url="https://primefaces.org/primereact/showcase/upload.php"
                        accept="image/*"
                        maxFileeSize={1000000}
                        onUpload={onTemplateUpload}
                        onSelect={onTemplateSelect}
                        onError={onTemplateClear}
                        onClear={onTemplateClear}
                        onTemplateRemove={onTemplateRemove}
                        headerTemplate={headerTemplate}
                        itemTemplate={itemTemplateFile}
                        emptyTemplate={emptyTemplate}
                        footer={productDialogFooter}
                        chooseOptions={chooseOptions}
                        cancelOptions={cancelOptions}
                    />
                </div>
                {((dropdownValue && dropdownValue.name === 'Hamburguesa') || (dropdownValue && dropdownValue.name === 'Perro') || (dropdownValue && dropdownValue.name === 'Pepito')) && (
                    <div className="col-12 xl:col-13">
                        <div className="card">
                            <h6>Seleccione el ingrediente</h6>
                            <PickList
                                source={picklistSourceValue}
                                target={picklistTargetValue}
                                sourceHeader="Ingredientes"
                                targetHeader="Ingrediente seleccionado"
                                itemTemplate={itemTemplatePickList}
                                onChange={(e) => {
                                    setPicklistSourceValue(e.source);
                                    setPicklistTargetValue(e.target);
                                }}
                                sourceStyle={{ height: '200px' }}
                                targetStyle={{ height: '200px' }}
                                filter
                                filterBy="nombre"
                            ></PickList>
                        </div>
                    </div>
                )}
                {((dropdownValue && dropdownValue.name === 'Hamburguesa') || (dropdownValue && dropdownValue.name === 'Perro') || (dropdownValue && dropdownValue.name === 'Pepito')) && (
                    <div className="col-12 xl:col-13">
                        <div className="card">
                            {/* VENTANA DE EDITAR PRODUCTO */}
                            <h6>Seleccione la Proteína</h6>
                            <PickList
                                source={picklistProteinaSourceValue}
                                target={picklistProteinaTargetValue}
                                sourceHeader="Proteína"
                                targetHeader="Proteína Seleccionada"
                                itemTemplate={itemTemplateProteinaPickList}
                                onChange={(e) => {
                                    setPicklistProteinaTargetValue(e.target);
                                    setPicklistProteinaSourceValue(e.source);
                                }}
                                sourceStyle={{ height: '200px' }}
                                targetStyle={{ height: '200px' }}
                                filter
                                filterBy="name"
                            ></PickList>
                        </div>
                    </div>
                )}
            </Dialog>
            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default ListDemo;
