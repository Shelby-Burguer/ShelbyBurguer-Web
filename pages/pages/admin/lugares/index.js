import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect } from 'react';
import Crud from '../../../../shelby/utils/CrudFunctions';
import { LugarService } from '../../../../shelby/service/LugarService';

const LugarPage = () => {
    const crudObject = Crud();
    let defaultLugar = crudObject.emptyElements.lugar;

    let lugar = crudObject.element;
    let lugares = crudObject.elements;

    let _visibleLugar = crudObject.lugarDialogVisible;
    let _setVisibleLugar = crudObject.setLugarDialogVisible;
    let _setElement = crudObject.setElement;
    let _setElements = crudObject.setElements;
    let _submitted = crudObject.submitted;
    let _setSubmitted = crudObject.setSubmitted;
    let _selectedElements = crudObject.selectedElements;
    let _toast = crudObject.toast;

    const elementName = 'lugar';

    const saveLugar = async () => {
        _setSubmitted(true);
        const lugarService = new LugarService();
        let _elements = [...lugares];
        let _element = { ...lugar };
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
            _setVisibleLugar(false)
            _setElement(elementName);
        }
    };

    const deleteLugar = async () => {
        const lugarService = new LugarService();
        let _elements = lugares.filter((val) => val.id !== lugar.id);
        const res = await lugarService.borrarLugar(lugar.id);
        const nombre = lugar.nombre;
        if (res.status >= 200 && res.status < 300) {
            _setElements(_elements);
            _setElement(defaultLugar);
            _toast.current.show({ severity: 'success', summary: 'Successful', detail: nombre + ' eliminado', life: 3000 });
        } else {
            _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar ' + nombre, life: 3000 });
        }
        crudObject.setDeleteElementDialog(false);
    };

    const deleteLugaresSeleccionados = async () => {
        const lugarService = new LugarService();

        // Itera sobre los elementos seleccionados y llama la función `deleteLugar()` para cada uno
        await Promise.all(
            _selectedElements.map(async (element) => {
                const res = await lugarService.borrarLugar(element.id);
                const nombre = element.nombre;
                if (res.status >= 200 && res.status < 300) {
                    const _elements = lugares.filter((val) => val.id !== element.id);
                    _setElements(_elements);
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: nombre + ' eliminado', life: 3000 });
                } else {
                    _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar ' + nombre, life: 3000 });
                }
            })
        );

        // Reinicia la selección de elementos
        crudObject.setSelectedElements([]);
        crudObject.setDeleteElementsDialog(false);
    };

    useEffect(() => {
        _setElement(defaultLugar);
        const fetchData = async () => {
            const lugarService = new LugarService();
            let data = await lugarService.getLugaresByTipo('zona');
            data = crudObject.isArray(data, elementName);
            _setElements(data);
        };
        fetchData();
    }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={_toast} />
                    <Toolbar className="mb-4" left={() => crudObject.leftToolbarTemplate(elementName)} right={crudObject.rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={crudObject.dt}
                        value={lugares}
                        selection={_selectedElements}
                        onSelectionChange={(e) => crudObject.setSelectedElements(e.value)}
                        dataKey="id"
                        sortField="nombre"
                        sortOrder={1}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} lugares"
                        globalFilter={crudObject.globalFilter}
                        emptyMessage="No se encontraron lugares."
                        header={crudObject.header('Zonas')}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={crudObject.nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="precio" header="Precio" body={crudObject.priceBodyTemplate} sortable></Column>
                        <Column body={crudObject.actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

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

                    <Dialog visible={crudObject.deleteElementDialog} style={{ width: '450px' }} header="Confirm" modal footer={crudObject.deleteElementDialogFooter(deleteLugar)} onHide={crudObject.hideDeleteElementDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {lugar && (
                                <span>
                                    ¿Estás seguro que quieres borrar <b>{lugar?.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={crudObject.deleteElementsDialog} style={{ width: '450px' }} header="Confirm" modal footer={crudObject.deleteElementsDialogFooter(deleteLugaresSeleccionados)} onHide={crudObject.hideDeleteElementsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {lugar && <span>¿Estás seguro de que quieres borrar los lugares seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default LugarPage;
