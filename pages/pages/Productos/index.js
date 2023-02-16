import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { PickList } from 'primereact/picklist';
import { OrderList } from 'primereact/orderlist';
import { ProductService } from '../../../demo/service/ProductosServiceShelbyBurguer';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import getConfig from 'next/config';


const ListDemo = () => {
    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' }
    ];
    const [products, setProducts] = useState(null);
    const [product, setProduct] = useState(null);
    const [picklistSourceValue, setPicklistSourceValue] = useState(listValue);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [orderlistValue, setOrderlistValue] = useState(listValue);
    const [dataViewValue, setDataViewValue] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setDataViewValue(data));
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

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };


    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
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

/*Este es el que muestra como recuadros*/
    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-borders">
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <img src={`${contextPath}/demo/images/product/${data.image}`} alt={data.name} className="w-9 shadow-2 my-3 mx-0" />
                        <div className="text-2xl font-bold">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                        <div className="mb-3">{data.description}</div>
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

    return (
        <div className="grid list-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Productos</h5>
                    <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                </div>
            </div>

            <div className="col-12 xl:col-8">
                <div className="card">
                    <h5>PickList</h5>
                    <PickList
                        source={picklistSourceValue}
                        target={picklistTargetValue}
                        sourceHeader="From"
                        targetHeader="To"
                        itemTemplate={(item) => <div>{item.name}</div>}
                        onChange={(e) => {
                            setPicklistSourceValue(e.source);
                            setPicklistTargetValue(e.target);
                        }}
                        sourceStyle={{ height: '200px' }}
                        targetStyle={{ height: '200px' }}
                    ></PickList>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card">
                    <h5>OrderList</h5>
                    <OrderList
                        value={orderlistValue}
                        listStyle={{ height: '200px' }}
                        className="p-orderlist-responsive"
                        rows={10}
                        header="Cities"
                        itemTemplate={(item) => <div>{item.name}</div>}
                        onChange={(e) => setOrderlistValue(e.value)}
                    ></OrderList>
                </div>
            </div>
                <Dialog visible={productDialog} style={{ width: '550px' }} header="Detalle de Ingredientes" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    {product.fileImage && <img src={`${contextPath}/demo/images/product/${product.fileImage}`} alt={product.fileImage} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <h6 htmlFor="nombre">Nombre</h6>
                        <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                        {submitted && !product.nombre && <small className="p-invalid">Name is required.</small>}
                    </div>
                    <div className="field">
                        <h6 htmlFor="unidad">Unidad</h6>
                        <InputText id="unidad" value={product.unidad} onChange={(e) => onInputChange(e, 'unidad')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.unidad })} />
                        {submitted && !product.unidad && <small className="p-invalid">Name is required.</small>}
                    </div>
                    <div>
                        <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                        <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                        <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
                        <div className="card">
                            <h6>Agregar imagen</h6>
                            <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*" maxFileeSize={1000000}
                                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear} onTemplateRemove= {onTemplateRemove}
                                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate} footer={productDialogFooter}
                                chooseOptions={chooseOptions} cancelOptions={cancelOptions}/>f
                        </div>
                    </div>
                </Dialog>
        </div>

        
    );
};

export default ListDemo;
