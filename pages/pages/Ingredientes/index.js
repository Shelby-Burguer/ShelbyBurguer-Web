import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { IngredienteService } from '../../../demo/service/IngredienteService';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';

const Crud = () => {
    let emptyProduct = {
        id: null,
        nombre: '',
        unidad: '',
        nombreImage: '',
        objectURL: '',
        urlImage: '',
        fileImage: '',
        proteina: '',
        extra: ''

    };

    const dropdownValues = [
        { name: 'Unidad', code: 'u' },
        { name: 'Gramos', code: 'gr' },
        { name: 'No Aplica', code: 'na' }
    ];

    const proteinaValues = [
        { name: 'Si', code: 's' },
        { name: 'No', code: 'n' }
    ];

    const extrasValues = [
        { name: 'Si', code: 's' },
        { name: 'No', code: 'n' }
    ];

    const [products, setProducts] = useState(null);
    const [file, setfile] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [proteinaDropValue, setProteinaDropValue] = useState(null);
    const [extraDropValue, setExtraDropValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    useEffect(async () => {
        const ingredienteService = new IngredienteService();
        const result = await ingredienteService.getIngredientes();
        if(result){
        setProducts(result);
        } else {
         toast.current.show({ severity: 'error', summary: 'Error', detail: '¡Hubo un error! Por favor, Inicie sesion.'});
        }
        
        
    }, []);

    /* const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };*/

    const openNew = () => {
        setProduct(emptyProduct);
        setDropdownValue(null);
        setProteinaDropValue({ name: 'No', code: 'n' });
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setExtraDropValue(null); 
        setProteinaDropValue(null);
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setExtraDropValue(null); 
        setProteinaDropValue(null);
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setExtraDropValue(null); 
        setProteinaDropValue(null);
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        if (product.nombre.trim()) {
            if (product.unidad.trim()) {
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
                setProteinaDropValue(null)
                setExtraDropValue(null)
                setProductDialog(false);
                setProduct(emptyProduct);
            }
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
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
        let _products = products.filter((val) => !selectedProducts.includes(val));
        const ingredienteService = new IngredienteService();
        ingredienteService.DeleteIngredientes(selectedProducts[0].id);
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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

    const onDropdownChange = (event) => {
        const selectedValue = event.target.value;
        setDropdownValue(selectedValue);
        setProduct((prevState) => ({ ...prevState, unidad: selectedValue.name }));
    };

    const onProteinaDropChange = (event) => {
        const selectedValue = event.target.value;
        setProteinaDropValue(selectedValue);
        setProduct((prevState) => ({ ...prevState, proteina: selectedValue.name }));
    };

    const onExtrasDropChange = (event) => {
        const selectedValue = event.target.value;
        setExtraDropValue(selectedValue);
        setProduct((prevState) => ({ ...prevState, extra: selectedValue.name }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
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
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const unidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unidad</span>
                {rowData.unidad}
            </>
        );
    };

    const proteinaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proteina</span>
                {rowData.proteina}
            </>
        );
    };

    const extraBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proteina</span>
                {rowData.extra}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`${contextPath}/demo/images/ingredientes/${rowData.nombreImage}`} alt={rowData.nombreImage} className="shadow-2" width="100" />
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manejo de ingredientes</h5>
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
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="unidad" header="Unidad" sortable body={unidadBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="proteina" header="Proteina" sortable body={proteinaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="proteina" header="Extra" sortable body={extraBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '550px' }} header="Detalle de Ingredientes" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <h6 htmlFor="nombre">Nombre</h6>
                            <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                            {submitted && !product.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <h6 htmlFor="unidad">Unidad</h6>
                            <Dropdown value={dropdownValue} onChange={onDropdownChange} options={dropdownValues} optionLabel="name" placeholder="Selecciona" required className={classNames({ 'p-invalid': submitted && !product.unidad })} />
                            {submitted && !product.unidad && <small className="p-invalid">La Unidad es requerida.</small>}
                        </div>
                        <div className="field">
                            <h6 htmlFor="proteina">Proteina</h6>
                            <Dropdown value={proteinaDropValue} onChange={onProteinaDropChange} options={proteinaValues} optionLabel="name" placeholder="Selecciona" required className={classNames({ 'p-invalid': submitted && !product.proteina })} />
                            {submitted && !product.proteina && <small className="p-invalid">La Proteina es requerida.</small>}
                        </div>
                        <div className="field">
                            <h6 htmlFor="proteina">Ingrediente extra</h6>
                            <Dropdown value={extraDropValue} onChange={onExtrasDropChange} options={extrasValues} optionLabel="name" placeholder="Selecciona" required className={classNames({ 'p-invalid': submitted && !product.extra })} />
                            {submitted && !product.extra && <small className="p-invalid">El ingrediente extra es requerida.</small>}
                        </div>
                        <div>
                            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                            <div className="card">
                                <h6>Agregar imagen</h6>
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="demo[]"
                                    url="https://primefaces.org/primereact/showcase/upload.php"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onUpload={onTemplateUpload}
                                    onSelect={onTemplateSelect}
                                    onError={onTemplateClear}
                                    onClear={onTemplateClear}
                                    onTemplateRemove={onTemplateRemove}
                                    headerTemplate={headerTemplate}
                                    itemTemplate={itemTemplate}
                                    emptyTemplate={emptyTemplate}
                                    footer={productDialogFooter}
                                    chooseOptions={chooseOptions}
                                    cancelOptions={cancelOptions}
                                />
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
