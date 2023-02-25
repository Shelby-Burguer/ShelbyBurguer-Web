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
import { NewProductoService } from '../../../demo/service/ProductoService';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
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
        unidad: '',
        nombreImage: '',
        urlImage: '',
        fileImage: '',
    };

    const [products, setProducts] = useState(null);
    const [product, setProduct] = useState(emptyProduct);
    const [tipoProducto, setTipoProducto] = useState(null);
    const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [carritoDialog, setcarritoDialog] = useState(false);
    const [orderlistValue, setOrderlistValue] = useState(listValue);
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
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        const productService = new ProductService();
        const productoServicenew = new NewProductoService();
        productoServicenew.getProductos().then((data) => setDataViewValue(data));
        productService.getTypeProducts().then((data) => setTipoProducto(data));
        productoServicenew.getProductos();
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
        setSubmitted(true);
        if (dataViewValue.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (dataViewValue.id) {
                const index = findIndexById(dataViewValue.id);
                _products[index] = _product;
                /*const ingredienteService = new IngredienteService();
                ingredienteService.updateIngredientes(_product);*/
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                
                /*const ingredienteService = new IngredienteService();
                const response = await ingredienteService.postIngredientes(_product, file);
                 _product = { ...response };
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
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
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
        setProduct(product);
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

    
    const itemTemplatePickList = (item) => {
        return (
            <div className="flex flex-wrap p-1 align-items-center gap-2">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`${contextPath}/demo/images/product/${item.image}`} alt={item.name}/>
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag text-sm"></i>
                        <span>{item.category}</span>
                    </div>
                </div>
                {/*<span className="font-bold text-900">${item.price}</span>*/}
                <div className="flex-1 flex flex-column gap-2">
                   <span className="font-bold"> Cantidad</span>
                    <div className="col-12 mb-0 lg:col-11 lg:mb-0">
                        <InputText type="text" placeholder="#"></InputText>
                    </div>
                </div>
            </div>
        );
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };


    const openNew = () => {
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

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
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

console.log('este baby lo tiene?', dataViewValue);

/*Este es el que muestra como recuadros*/
    const dataviewGridItem = (data) => {

        let arrProteinas = [];
        for(let j=0; j< data.proteina.length; j++){
            let proteina = data.proteina[j];
            arrProteinas.push(proteina.nombre)
        }

        let arrIngredientes = [];
        let arrIngredientes2 = [];
        let arrIngredientes3 = [];
        for(let j=0; j< data.ingrediente.length; j++){
            let ingredientes = data.ingrediente[j];
            if(j < 4){
                arrIngredientes.push(ingredientes.nombre)
            } else if(j >= 4 && j < 8){
                arrIngredientes2.push(ingredientes.nombre)
            } else if(j >= 8){
                arrIngredientes3.push(ingredientes.nombre)
            }

        }
      
      console.log(data.image)

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
                        <h7>Proteinas a elegir:</h7>
                        <div className="mb-3 " >
                            {arrProteinas.toString()}
                        </div>
                        <h7>Ingredientes:</h7>
                        <div label="Text" className="mb-3">
                        {arrIngredientes.toString()}<br></br>
                        {arrIngredientes2.toString()}<br></br>
                        {arrIngredientes3.toString()}
                        </div>
                        
                        <span className="text-2xl font-semibold">${data.costo}</span>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteProduct(data)} />
                        <Button icon="pi pi-pencil" className="p-button-success" onClick={openNew} />
                        <Button label="Agregar"  icon="pi pi-shopping-cart" onClick={carritOpenNew} />
                    </div>
                </div>
                <Dialog visible={productDialog} style={{ width: '800px' }} header="Ingrese producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field"> 
                            {product.fileImage && <img src={`${contextPath}/demo/images/product/${product.fileImage}`} alt={product.fileImage} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        </div>
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
                            <h6 htmlFor="nombre">Costo</h6>
                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                            {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
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
                                filter filterBy="name"
                            ></PickList>
                        </div>
                    </div>      
                </Dialog>
                <Dialog visible={carritoDialog} style={{ width: '800px' }} header="Ingrese producto" modal className="p-fluid" footer={productDialogFooter} onHide={carritoHideDialog}>
                
                        <div> 
                        {data.image && <img src={`${contextPath}/demo/images/product/${data.image}`} alt={data.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        </div>
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
                            <h6 htmlFor="nombre">Costo</h6>
                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                            {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                        </div>
                    </div>
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
                                filter filterBy="name"
                            ></PickList>
                        </div>
                    </div>      
                </Dialog>
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
                    <h5>Productos</h5>
                    <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                </div>
            </div>
           
                <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="  justify-content-center">
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
