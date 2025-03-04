import getConfig from 'next/config';
import PrimeReact from 'primereact/api';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Sidebar } from 'primereact/sidebar';
import { Card } from 'primereact/card';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Rating } from 'primereact/rating';
import { CarritoService } from '../demo/service/CarritoService';
import { addToCart } from './addToCar';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';

const AppConfig = (props) => {
    const [scales] = useState([12, 13, 14, 15, 16]);
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const toast = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    const onConfigButtonClick = async () => {
        setLayoutState((prevState) => ({ ...prevState, configSidebarVisible: true }));
        const carritoService = new CarritoService();
        const resProductos = await carritoService.getCarrito();
        if(resProductos){
        const resIngredientes = await carritoService.getCarritoIngrediente();

        const updatedProductos = resProductos.map((producto) => ({ ...producto, cantidad: 1 }));
        setDataViewValue(updatedProductos);
        setIngredienteViewValue(resIngredientes);
        let total = 0;
        resProductos.forEach((producto) => {
            total += parseFloat(producto.costo_producto);
        });
        setTotal(total);
        } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Por favor, Inicie sesion.' });
        }
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState) => ({ ...prevState, configSidebarVisible: false }));
    };

    const changeInputStyle = (e) => {
        setLayoutConfig((prevState) => ({ ...prevState, inputStyle: e.value }));
    };

    const changeRipple = (e) => {
        PrimeReact.ripple = e.value;
        setLayoutConfig((prevState) => ({ ...prevState, ripple: e.value }));
    };

    const changeMenuMode = (e) => {
        setLayoutConfig((prevState) => ({ ...prevState, menuMode: e.value }));
    };

    const changeTheme = (theme, colorScheme) => {
        const themeLink = document.getElementById('theme-css');
        const themeHref = themeLink ? themeLink.getAttribute('href') : null;
        const newHref = themeHref ? themeHref.replace(layoutConfig.theme, theme) : null;

        replaceLink(themeLink, newHref, () => {
            setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
        });
    };

    const replaceLink = (linkElement, href, onComplete) => {
        if (!linkElement || !href) {
            return;
        }

        const id = linkElement.getAttribute('id');
        const cloneLinkElement = linkElement.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            linkElement.remove();

            const element = document.getElementById(id); // re-check
            element && element.remove();

            cloneLinkElement.setAttribute('id', id);
            onComplete && onComplete();
        });
    };

    const decrementScale = () => {
        setLayoutConfig((prevState) => ({ ...prevState, scale: prevState.scale - 1 }));
    };

    const incrementScale = () => {
        setLayoutConfig((prevState) => ({ ...prevState, scale: prevState.scale + 1 }));
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    const products = [
        { id: 1, name: 'Producto 1', image: 'url-de-imagen-1', quantity: 10 },
        { id: 2, name: 'Producto 2', image: 'url-de-imagen-2', quantity: 20 },
        { id: 3, name: 'Producto 3', image: 'url-de-imagen-3', quantity: 30 }
        // ...agrega tantos productos como necesites
    ];

    const ProductList = () => {
        return (
            <div>
                {products.map((product) => (
                    <Card key={product.id} title={product.name}>
                        <img src={product.image} alt={product.name} />
                        <p>Cantidad: {product.quantity}</p>
                    </Card>
                ))}
            </div>
        );
    };
    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' }
    ];

    const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [orderlistValue, setOrderlistValue] = useState(listValue);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [ingredienteViewValue, setIngredienteViewValue] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [orden, setOrden] = useState('');
    const [numOrden, setnumOrden] = useState('');
    const [total, setTotal] = useState('0');
    const [contador, setContador] = useState(1);
    const [orderCount, setOrderCount] = useState(1);
    const [ordenCreada, setOrdenCreada] = useState(false);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        setGlobalFilterValue('');
    }, []);

    const onFilter = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue.filter((product) => {
                return product.name.toLowerCase().includes(value);
            });
            setFilteredValue(filtered);
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

    const handleAddToCart = (item) => {
        addToCart(item, carrito, setCarrito);
    };

    const continuarCarrito = async () => {

        const ProductoOrden = dataViewValue.map((item) => ({
            idProducto: item.producto_id,
            idOrden: orden
        }));

        const carritoService = new CarritoService();
        const ipAddress = window.location.host.split(':')[0];
        await carritoService.postProductosOrden(ProductoOrden, ingredienteViewValue);
        setOrderCount(orderCount + 1);
        setOrdenCreada(false);
        setOrden(null);
        setDataViewValue([]);
        await carritoService.DeleteCarrito();
        setOrderCount(orderCount + 1);
        setOrdenCreada(false);
        setOrden(null);
        setDataViewValue([]);
        router.push(`http://${ipAddress}:3000/pages/Ordenes/`);
    };

    const addCarrito = async () => {
        setOrdenCreada(true);
        const IdOrdenService = new CarritoService();
        const idOrden = await IdOrdenService.postOrdenCarrito();
        setOrden(idOrden.orden_id);
        setnumOrden(idOrden.numero_orden.toString());
        localStorage.setItem('myKey', JSON.stringify(idOrden));

    };

    const addProductToCarrito = (product) => {
        const newCarrito = [...carrito, product];
        setCarrito(newCarrito);

        let newTotal = 0;
        newCarrito.forEach((product) => {
            newTotal += product.precio * product.cantidad;
        });
        setTotal(newTotal);
    };

    const deleteCarrito = async () => {
        const carritoService = new CarritoService();
        await carritoService.DeleteCarrito();
        setDataViewValue([]);
        setTotal(0);
    };

    const deleteProductoCarrito = async (producto) => {
        let _dataViewValue = dataViewValue.filter((val) => val.producto_id !== producto.producto_id);
        setDataViewValue(_dataViewValue);
        const carritoService = new CarritoService();
        await carritoService.DeleteProductoCarrito(producto.producto_id);

        let total = 0;
        _dataViewValue.forEach((producto) => {
            total += parseFloat(producto.costo_producto);
        });
        setTotal(total);
    };

    const dataviewListItem = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-2 w-full">
                    <img src={`${contextPath}/demo/images/product/${data.image}`} alt={data.name} className="my-2 md:my-0 w-9 md:w-3rem shadow-2 mr-2" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-1xl">{data.name}</div>
                        <div className="mb-2">{data.description}</div>

                        <div className="flex align-items-center">
                            <span className="font-semibold">{data.category}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-1xl font-semibold mb-2 align-self-center md:align-self-end">${data.price}</span>
                    </div>
                </div>
            </div>
        );
    };

    /*
const dataviewListItem = (data) => {
  return (
    <div className="col-12">
      <div className="flex flex-row align-items-center p-2 w-full cart-item">
        <img src={`${contextPath}/demo/images/product/${data.image}`} alt={data.name} className="my-2 md:my-0 w-9 md:w-4rem shadow-2 mr2"  />
        <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
          <div className="font-bold text-1xl">{data.name}</div>
          <div className="mb-2">{data.description}</div>
          <div className="flex align-items-center">
            <i className="pi pi-tag mr-2"></i>
            <span className="font-semibold">{data.category}</span>
          </div>
        </div>
        <div className="flex flex-row justify-content-between w-full md:w-auto align-items-center md:align-items-end">
          <span className="text-1xl font-semibold">${data.price}</span>
          <button className="p-button-outlined p-button-danger p-button-sm" onClick={() => onDelete(data)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};*/

    const onDelete = (index) => {
        const newData = [...(filteredValue || dataViewValue)];
        newData.splice(index, 1);
        setDataViewValue(newData);
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteProductoCarrito(rowData)} />
            </>
        );
    };

    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 lg:col-3">
            
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold">{data.category}</span>
                        </div>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img src={`${contextPath}/demo/images/product/${data.image}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                        <div className="text-2xl font-bold">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false} />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'} />
                    </div>
                </div>
            </div>
        );
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

    useEffect(() => {
        applyScale();
        handleAddToCart();
    }, [layoutConfig.scale]);

    const fechaActual = new Date().toLocaleDateString();

    return (
        <>
            <button className="layout-config-button p-link" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-shopping-cart"></i>
            </button>
             <Toast ref={toast} />
            <Sidebar visible={layoutState.configSidebarVisible} onHide={onConfigSidebarHide} position="right" style={{ width: '38rem' }}>
                <div className="grid list-demo">
                    <div className="col-12">
                        <div className="card">
                            <h5>Carrito</h5>
                            <div className="my-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    Orden: <span>{ordenCreada ? `${numOrden}` : ''}</span>
                                </div>
                                <div>{fechaActual}</div>
                            </div>
                            <DataTable
                                value={dataViewValue}
                                selection={selectedProducts}
                                onSelectionChange={(e) => setSelectedProducts(e.value)}
                                dataKey="id"
                                rows={10}
                                style={{ height: '340px', overflowY: 'scroll' }}
                                className="datatable-responsive"
                                globalFilter={globalFilter}
                                emptyMessage="No products found."
                            >
                                <Column header="Imagen" body={imageBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                                <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                                <Column field="cantidad" header="Cantidad" body={cantidadBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                                <Column field="precio" header="Precio" body={precioBodyTemplate} headerStyle={{ minWidth: '0rem' }}></Column>
                                <Column body={actionBodyTemplate}></Column>
                            </DataTable>

                            {/*<DataView value={filteredValue || dataViewValue} layout={layout} rows={3} sortOrder={sortOrder} sortField={sortField} itemTemplate={dataviewListItem} style={{ height: '450px', overflowY: 'scroll' }} />*/}

                            <div className="carrito-total text-right total-text  my-3">Total:{total}$</div>

                            <div className="flex align-items-center justify-content-between my-3">
                                <Button label="Limpiar" className="p-button-danger" onClick={() => deleteCarrito()} />
                                <Button label="Continuar" onClick={() => continuarCarrito()} />
                            </div>
                            <div className="p-d-flex p-jc-center p-ai-center">
                                <Button label="Crear orden" onClick={() => addCarrito()} disabled={orden} />
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default AppConfig;
