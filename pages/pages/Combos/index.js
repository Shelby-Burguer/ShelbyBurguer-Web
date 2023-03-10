import React, { useState, useEffect, useRef } from 'react';
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
import { NewComboService } from '../../../demo/service/ComboService';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { NewProductoService } from '../../../demo/service/ProductoService';
import getConfig from 'next/config';


const ListDemo = () => {
    const listValue = [
        { name: 'Tomate', code: 'SF' },
        { name: 'Cebolla', code: 'LDN' },
        { name: 'Lechuga', code: 'PRS' },
        { name: 'Huevo', code: 'IST' },
        { name: 'Tomate', code: 'BRL' },
        { name: 'Queso', code: 'BRC' },
        { name: 'Jamon', code: 'RM' }
    ];

    let emptyProduct = {
        id: null,
        nombre: '',
        tiempo_aprox: 0,
        precio_unitario: '',
    };

    let emptyResproduct = {
        combo_id: null,
        nombre_combo: '',
        precio_unitario_combo: 0,
        productos: [],
        tiempo_aprox_preparacion_combo: '',
    };

    const [products, setProducts] = useState(null);
    const [product, setProduct] = useState(emptyProduct);
    const [resProduct, setResproduct] = useState(emptyResproduct);
    const [picklistSourceValue, setPicklistSourceValue] = useState(null);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [tableDialog, settableDialog] = useState(false);
    const [carritoDialog, setcarritoDialog] = useState(false);
    const [orderlistValue, setOrderlistValue] = useState(listValue);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [globalFilter, setGlobalFilter] = useState(null);
    const [filteredValue, setFilteredValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const fileUploadRef = useRef(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    //const [source, setSource] = useState([]);
   // const [target, setTarget] = useState([]);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    const dropdownValues = [
        { name: 'Hambuerguesa', code: 'NY' },
        { name: 'Perro', code: 'RM' },
        { name: 'Pepito', code: 'LDN' },
        { name: 'Bebida', code: 'IST' },
    ];

    useEffect(() => {
        const productService = new ProductService();
        const comboService = new NewComboService();
        comboService.getCombos().then((data) => setDataViewValue(data));
        //productService.getProducts().then((data) => setDataViewValue(data));
        productService.getProducts().then((data) => setProducts(data));
        //productService.getProducts().then((data) => setSource(data));
        setGlobalFilterValue('');
    }, []);

    const onFilter = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        }
        else {
            const filtered = dataViewValue.filter((product) => {
                return product.name.toLowerCase().includes(value);
            });
            setFilteredValue(filtered);
        }
    };

        const saveProduct = async() => {
        console.log('Que pasa con producto', product);
        console.log('Que pasa con la lista', picklistTargetValue);
        setSubmitted(true);
        if (product.nombre.trim()) {
            let _products = [...dataViewValue];
            let _product = { ...product };

            if (_product.id) {
                const index = findIndexById(dataViewValue.id);
                _products[index] = _product;
                /*const ingredienteService = new IngredienteService();
                ingredienteService.updateIngredientes(_product);*/
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                
                const comboService = new NewComboService();
                const response  = await comboService.postCombo(product, picklistTargetValue);
                _products.push(response);
            }
            setDataViewValue(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
            setPicklistTargetValue([]);
        }
    };

    const deleteProduct = () => {
        let _dataViewValue = dataViewValue.filter((val) => val.combo_id !== resProduct.combo_id);
        setDataViewValue(_dataViewValue);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        const comboService = new NewComboService();   
        comboService.DeleteCombo(resProduct.combo_id);
        /*toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });*/
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-1">
                 <span className="block mt-1 md:mt-2 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Name" />
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

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Productos del combo</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
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

    const confirmDeleteProduct = (product) => {
        console.log(product)
        setResproduct(product);
        setDeleteProductDialog(true);
    };


        const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        Object.keys(e.files).forEach(file => {
            _totalSize += file.size;
        });

        setTotalSize(_totalSize);
    }

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach(file => {
            _totalSize += (file.size || 0);
        });

        setTotalSize(_totalSize);
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    
    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const proteinaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proteina a elegir</span>
                {rowData.Proteina}
            </>
        );
    };

    const ingredientesBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ingredientes</span>
                {rowData.Ingrediente}
            </>
        );
    };
    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`${contextPath}/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </>
        );
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        settableDialog(true);
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-1 p-5" style={{'fontSize': '4em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-4">Arrastre y suelte la imagen aqui</span>
            </div>
        )
    }

    const onTemplateClear = () => {
        setTotalSize(0);
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    }

     const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}       
                {cancelButton}
            </div>
        );
    }

    const hideDialog = () => {
        const productoServicenew = new NewProductoService();
        productoServicenew.getProductos().then((data) => setPicklistSourceValue(data));
        setPicklistTargetValue([]);
        setSubmitted(false);
        setProductDialog(false);
    };


    const openNew = () => {
        const productoServicenew = new NewProductoService();
        productoServicenew.getProductos().then((data) => setPicklistSourceValue(data));
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };


    const tablehideDialog = () => {
        setSubmitted(false);
        settableDialog(false);
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

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputChangeNumber = (e, name, type = 'text') => {
    const value = type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setProduct(prevState => ({ ...prevState, [name]: value }));
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
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

    const onChange = (event) => {
        setPicklistSourceValue(event.source);
        setPicklistTargetValue(event.target);
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
        } else {
        setPicklistTargetValue((prevState) => {
            const newState = [...prevState];
            const itemIndex = newState.findIndex((item) => item.id === itemId);
            newState[itemIndex] = { ...newState[itemIndex], [propertyName]: value };
            return newState;
        });
        }
    };

    const onInputChangePickListNew = (e, propertyName, itemId) => {
  const value = e.target.value;

  if (picklistSourceValue.some((item) => item.id === itemId)) {
    setPicklistSourceValue((prevState) => {
      const newState = [...prevState];
      const itemIndex = newState.findIndex((item) => item.id === itemId);
      newState[itemIndex] = { ...newState[itemIndex], [propertyName]: value };
      return newState;
    });
  } else {
    setPicklistTargetValue((prevState) => {
      const newState = [...prevState];
      const itemIndex = newState.findIndex((item) => item.id === itemId);
      newState[itemIndex] = {
        ...newState[itemIndex],
        [propertyName]: value,
        cantidad: Number(value), // Agrega la propiedad cantidad y convierte el valor en número
      };
      return newState;
    });
  }
};

const itemTemplatePickList1 = (item) => {
    const [cantidad, setCantidad] = useState(1);

    const handleCantidadChange = (event) => {
        setCantidad(event.target.value);
    };

    return (
        <div className="flex flex-wrap p-2 align-items-center gap-3">
            <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`${contextPath}/demo/images/product/${item.imagen}`} alt={item.nombre}/>
            <div className="flex-1 flex flex-column gap-2">
                <span className="font-bold">{item.nombre}</span>
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-tag text-sm"></i>
                    <span>{item.tipo}</span>
                </div>
            </div>
            <div className="flex flex-column gap-2">
                <label htmlFor={`cantidad-${item.id}`}>Cantidad:</label>
            <input
            id="cantidad"
            value={item.cantidad}
            onChange={(e) => onInputChangePickList(e, 'cantidad', item.id)}
            required
            autoFocus
            className="input-cantidad"
          />
            </div>
            { /*<span className="font-bold text-900">${item.price}</span> */}
        </div>
    );
};


    const itemTemplatePickList2 = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`${contextPath}/demo/images/product/${item.image}`} alt={item.name}/>
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.category}</span>
                    </div>
                </div>
                <span className="font-bold text-900">${item.price}</span>
            </div>
        );
    };

    const dataViewHeader = (
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
    );

    const chooseOptions = {
        label: 'Archivo', 
        icon: 'pi pi-fw pi-plus'
    };

    const cancelOptions = {
        label: 'Cancelar', 
        icon: 'pi pi-times', 
        className: 'p-button-danger'
    };

/*Este es el que muestra como recuadros*/
    const dataviewGridItem = (data) => {


    const productosConCantidad = data.productos.map(producto => `${producto.cantidad_pdt_cb} ${producto.producto.nombre_producto}`);
    const productosFormateados = productosConCantidad.join('<br />');

        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-borders">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img src={`${contextPath}/demo/images/product/Hamburguesas con papas fritas.jpg`} className="w-9 shadow-2 my-3 mx-0" />
                        <div className="text-2xl font-bold">{data.nombre_combo}</div>
                        <div label="Text" className="mb-3"></div>
                        <h7>Contiene:</h7>
                        <div className="mb-3" dangerouslySetInnerHTML={{ __html: productosFormateados }} />
                        <span className="text-2xl font-semibold">${data.precio_unitario_combo}</span>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(data)} />
                        <Button icon="pi pi-pencil" className="p-button-success" onClick={openNew} />
                        <Button label="Agregar"  icon="pi pi-shopping-cart" onClick={carritOpenNew} />
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

    return (
        <div className="grid list-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Combos</h5>
                    <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                </div>
            </div>
                <Dialog visible={productDialog} style={{ width: '950px' }} header="Ingrese Combo" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <h6 htmlFor="nombre">Nombre</h6>
                        <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                        {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                    </div>
                    <div className="formgrid grid">
                        <div className="field col"> 
                        <h6 htmlFor="tiempo_aprox_preparacion">Tiempo de preparacion (Min)</h6>
                        <InputText type="number" min="0" max="120" step="5" id="tiempo_aprox_preparacion" value={product.tiempo_aprox} onChange={(e) => onInputChangeNumber(e, 'tiempo_aprox', 'number')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.tiempo_aprox })} />
                        {submitted && !product.tiempo_aprox && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field col">
                            <h6 htmlFor="precio_unitario">Precio unitario</h6>
                            <InputText id="precio_unitario" value={product.precio_unitario} onChange={(e) => onInputChange(e, 'precio_unitario')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.precio_unitario })} />
                            {submitted && !product.precio_unitario && <small className="p-invalid">Name is required.</small>}
                        </div>
                    </div>
                    <div className="card">
                        <h6>Agregar imagen</h6>
                        <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*" maxFileeSize={1000000}
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear} onTemplateRemove= {onTemplateRemove}
                            headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate} footer={productDialogFooter}
                            chooseOptions={chooseOptions} cancelOptions={cancelOptions}/>
                    </div>

                    <div className="col-12 xl:col-13">
                        <div className="card">
                            <h6>Seleccione el Producto</h6>
                            <PickList source={picklistSourceValue} target={picklistTargetValue} onChange={onChange} itemTemplate={itemTemplatePickList1} breakpoint="1400px"
                            sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '30rem' }} targetStyle={{ height: '30rem' }} filter filterBy="name" />
                        </div>
                    </div>      
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

                <Dialog visible={carritoDialog} style={{ width: '750px' }} header="Combo" modal className="p-fluid" footer={productDialogFooter} onHide={carritoHideDialog}>
                        {product.image && <img src={`${contextPath}/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <h6 htmlFor="nombre">Nombre</h6>
                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                            {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                        </div>
                    <div className="formgrid grid">
                        <div className="field col"> 
                        <h6>Tipo de producto</h6>
                        <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                        </div>
                        <div className="field col">
                            <h6 htmlFor="nombre">Costo</h6>
                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                            {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                        </div>
                    </div>  
                    <div className="grid crud-demo">
                        <div className="col-12">
                            <div className="card">
                                <Toast ref={toast} />
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
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                    globalFilter={globalFilter}
                                    emptyMessage="No products found."
                                    header={header}
                                    responsiveLayout="scroll"
                                >
                                    <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                    <Column header="Imagen" body={imageBodyTemplate}></Column>
                                    <Column field="name" header="Proteina a elegir" sortable body={proteinaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                    <Column field="name" header="Ingrediente" sortable body={ingredientesBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                </DataTable>

                                <Dialog visible={tableDialog} style={{ width: '750px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={tablehideDialog}>
                                    {product.image && <img src={`${contextPath}/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                                        <div className="field">
                                            <h6 htmlFor="nombre">Nombre</h6>
                                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                                            {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                                        </div>
                               
                                        <div className="field"> 
                                        <h6>Tipo de producto</h6>
                                        <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                                        </div>
                  
                                    <div className="col-12 xl:col-13">
                                        <div className="card">
                                            <h6>Seleccione los Ingredientes</h6>
                                            <PickList
                                                source={picklistSourceValue}
                                                target={picklistTargetValue}
                                                sourceHeader="Ingredientes"
                                                targetHeader="Ingrediente Seleccionado"
                                                itemTemplate={itemTemplatePickList2}
                                                onChange={(e) => {
                                                    setPicklistSourceValue(e.source);
                                                    setPicklistTargetValue(e.target);
                                                }}
                                                sourceStyle={{ height: '200px' }}
                                                targetStyle={{ height: '200px' }}
                                                filter filterBy="name"
                                            ></PickList>
                                        </div>
                                    </div>  
                                </Dialog>
                            </div>
                        </div>
                    </div>   
                </Dialog>
        </div>

        
    );
};

export default ListDemo;
