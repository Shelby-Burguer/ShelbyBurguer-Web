import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect } from 'react';
import Crud from '../../../../shelby/utils/CrudFunctions';
import { ClienteService } from '../../../../shelby/service/ClienteService';

const ClientePage = () => {
    const crudObject = Crud();

    const prefixOptions = [
        { label: 'V', value: 'V' },
        { label: 'E', value: 'E' },
        { label: 'J', value: 'J' }
    ];

    let defaultCliente = crudObject.emptyElements.cliente;
    let defaultDropdown = 'V';

    let cliente = crudObject.element;
    let clientes = crudObject.elements;

    let _setElement = crudObject.setElement;
    let _setElements = crudObject.setElements;
    let _submitted = crudObject.submitted;
    let _setSubmitted = crudObject.setSubmitted;
    let _selectedElements = crudObject.selectedElements;
    let _toast = crudObject.toast;
    let _stringBody = crudObject.stringBodyTemplate;

    const elementName = 'cliente';

    const saveCliente = async () => {
        _setSubmitted(true);
        const updatedCedula = crudObject.selectedPrefix + cliente.cedula;
        const clienteService = new ClienteService();
        _setElement((prevElement) => ({ ...prevElement, cedula: updatedCedula }));
        let _elements = [...clientes];
        let _element = { ...cliente, cedula: updatedCedula };
        let data = crudObject.addAppendix(_element, elementName);
        if (cliente.nombre.trim()) {
            if (cliente.id) {
                const index = crudObject.findIndexById(cliente.id);
                const res = await clienteService.actualizarCliente(data[0]);
                if (res.status >= 200 && res.status < 300) {
                    _elements[index] = _element;
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
                } else {
                    _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente', life: 3000 });
                }
            } else {
                const res = await clienteService.crearCliente(data[0]);
                if (res.status >= 200 && res.status < 300) {
                    _elements.push(_element);
                    _toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
                } else {
                    _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el cliente', life: 3000 });
                }
            }
            _setElements(_elements);
            crudObject.setElementDialog(false);
            _setElement(elementName);
        }
    };

    const deleteCliente = async () => {
        const clienteService = new ClienteService();
        let _elements = clientes.filter((val) => val.id !== cliente.id);
        const res = await clienteService.borrarCliente(cliente.id);
        const nombre = cliente.nombre;
        if (res.status >= 200 && res.status < 300) {
            _setElements(_elements);
            _setElement(defaultCliente);
            _toast.current.show({ severity: 'success', summary: 'Successful', detail: nombre + ' eliminado', life: 3000 });
        } else {
            _toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar ' + nombre, life: 3000 });
        }
        crudObject.setDeleteElementDialog(false);
    };

    const deleteClientesSeleccionados = async () => {
        const clienteService = new ClienteService();

        // Itera sobre los elementos seleccionados y llama la función `deleteCliente()` para cada uno
        await Promise.all(
            _selectedElements.map(async (element) => {
                const res = await clienteService.borrarCliente(element.id);
                const nombre = element.nombre;
                if (res.status >= 200 && res.status < 300) {
                    const _elements = clientes.filter((val) => val.id !== element.id);
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
        _setElement(defaultCliente);
        crudObject.setSelectedPrefix(defaultDropdown);
        const fetchData = async () => {
            const clienteService = new ClienteService();
            let data = await clienteService.getClientes();
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
                        value={clientes}
                        selection={_selectedElements}
                        onSelectionChange={(e) => crudObject.setSelectedElements(e.value)}
                        dataKey="id"
                        sortField="cedula"
                        sortOrder={1}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
                        globalFilter={crudObject.globalFilter}
                        emptyMessage="No se encontraron clientes."
                        header={crudObject.header('Clientes')}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="cedula" header="Cedula" sortable body={(rd) => _stringBody(rd, 'cedula', 'Cedula')} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={(rd) => _stringBody(rd, 'nombre', 'Nombre')} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="apellido" header="Apellido" sortable body={(rd) => _stringBody(rd, 'apellido', 'Apellido')} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="telefono" header="Telefono" sortable body={(rd) => _stringBody(rd, 'telefono', 'Telefono')} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={crudObject.actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={crudObject.elementDialog} style={{ width: '450px' }} header="Detalle de Cliente" modal className="p-fluid" footer={() => crudObject.elementDialogFooter(saveCliente)} onHide={crudObject.hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cedula">Cédula</label>
                                <div className="p-inputgroup">
                                    <Dropdown value={crudObject.selectedPrefix} options={prefixOptions} onChange={crudObject.handleDropdownSelect} optionLabel="label" />
                                    <InputText
                                        style={{ width: '30%' }}
                                        id="cedula"
                                        value={cliente?.cedula}
                                        onChange={(e) => crudObject.onInputChange(e, 'cedula')}
                                        required
                                        autoFocus
                                        className={classNames({ 'p-invalid': _submitted && !cliente?.cedula })}
                                    />
                                    {_submitted && !cliente?.cedula && <small className="p-invalid">La cedula es requerida.</small>}
                                </div>
                            </div>
                            <div className="field col">
                                <label htmlFor="nombre">Nombre</label>
                                <InputText id="nombre" value={cliente?.nombre} onChange={(e) => crudObject.onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': _submitted && !cliente?.nombre })} />
                                {_submitted && !cliente?.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="apellido">Apellido</label>
                                <InputText id="apellido" value={cliente?.apellido} onChange={(e) => crudObject.onInputChange(e, 'apellido')} />
                            </div>
                            <div className="field col">
                                <label htmlFor="telefono">Telefono</label>
                                <InputText id="telefono" value={cliente?.telefono} onChange={(e) => crudObject.onInputChange(e, 'telefono')} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={crudObject.deleteElementDialog} style={{ width: '450px' }} header="Confirm" modal footer={crudObject.deleteElementDialogFooter(deleteCliente)} onHide={crudObject.hideDeleteElementDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cliente && (
                                <span>
                                    ¿Estás seguro que quieres borrar <b>{cliente?.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={crudObject.deleteElementsDialog} style={{ width: '450px' }} header="Confirm" modal footer={crudObject.deleteElementsDialogFooter(deleteClientesSeleccionados)} onHide={crudObject.hideDeleteElementsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cliente && <span>¿Estás seguro de que quieres borrar los clientes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ClientePage;
