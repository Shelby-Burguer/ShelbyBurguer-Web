import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import Crud from '../../../../shelby/utils/CrudFunctions';

const LugarPage = () => {
    const crudObject = Crud();

    let defaultProduct = crudObject.emptyElements.product;

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => crudObject.setElements(data));
        crudObject.setElement(defaultProduct);
    }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={crudObject.toast} />
                    <Toolbar className="mb-4" left={crudObject.leftToolbarTemplate} right={crudObject.rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={crudObject.dt}
                        value={crudObject.elements}
                        selection={crudObject.selectedElements}
                        onSelectionChange={(e) => crudObject.setSelectedElements(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={crudObject.globalFilter}
                        emptyMessage="No products found."
                        header={crudObject.header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Code" sortable body={crudObject.codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Name" sortable body={crudObject.nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={(rowData) => crudObject.imageBodyTemplate(rowData, 'product')}></Column>
                        <Column field="price" header="Price" body={crudObject.priceBodyTemplate} sortable></Column>
                        <Column field="category" header="Category" sortable body={crudObject.categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="Reviews" body={crudObject.ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={crudObject.statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={crudObject.actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={crudObject.elementDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={crudObject.elementDialogFooter} onHide={crudObject.hideDialog}>
                        {crudObject.element?.image && <img src={`${crudObject.contextPath}/demo/images/product/${crudObject.element?.image}`} alt={crudObject.element?.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={crudObject.element?.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': crudObject.submitted && !crudObject.element?.name })} />
                            {crudObject.submitted && !crudObject.element?.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={crudObject.element?.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={crudObject.onCategoryChange} checked={crudObject.element?.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={crudObject.onCategoryChange} checked={crudObject.element?.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics" onChange={crudObject.onCategoryChange} checked={crudObject.element?.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={crudObject.onCategoryChange} checked={crudObject.element?.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={crudObject.element?.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={crudObject.element?.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={crudObject.deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={crudObject.deleteProductDialogFooter} onHide={crudObject.hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {crudObject.element && (
                                <span>
                                    Are you sure you want to delete <b>{crudObject.element?.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={crudObject.deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={crudObject.deleteProductsDialogFooter} onHide={crudObject.hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {crudObject.element && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default LugarPage;
