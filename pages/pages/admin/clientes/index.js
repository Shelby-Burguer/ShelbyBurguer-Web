import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ClientService } from '../../../../shelby/service/ClientService';
import { OrderService } from '../../../../shelby/service/OrderService';

const Crud = () => {
    let emptyClient = {
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: ''
    };

    const [clients, setClients] = useState(null);
    const [clientDialog, setClientDialog] = useState(false);
    const [deleteClientDialog, setDeleteClientDialog] = useState(false);
    const [deleteClientsDialog, setDeleteClientsDialog] = useState(false);
    const [client, setClient] = useState(emptyClient);
    const [selectedClients, setSelectedClients] = useState(null);
    const [orders, setOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const op_orders = useRef(null);

    useEffect(() => {
        const clientService = new ClientService();
        const orderService = new OrderService();
        clientService.getClients().then((data) => setClients(data));
        orderService.getOrdersByClient().then((data) => setOrders(transformDate(data)));
    }, []);

    const transformDate = (data) => {
        return [...(data || [])].map((d) => {
            d.fecha_orden = new Date(d.fecha_orden);
            return d;
        });
    };

    const openNew = () => {
        setClient(emptyClient);
        setSubmitted(false);
        setClientDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClientDialog(false);
    };

    const hideDeleteClientDialog = () => {
        setDeleteClientDialog(false);
    };

    const hideDeleteClientsDialog = () => {
        setDeleteClientsDialog(false);
    };

    const onOrderSelect = (event) => {
        op_orders.current.hide();
        toast.current.show({ severity: 'info', summary: 'Order Selected', detail: event.data.name, life: 3000 });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('en-GB');
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.fecha_orden);
    };

    const priceBodyTemplate = (data) => formatCurrency(data.total_orden);

    const toggleDataTable = (event) => {
        op_orders.current.toggle(event);
    };

    const saveClient = () => {
        setSubmitted(true);

        if (client.cedula && client.nombre && client.telefono) {
            let _clients = [...clients];
            let _client = { ...client };
            if (client.id) {
                const index = findIndexById(client.id);
                _clients[index] = _client;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
            } else {
                _client.id = createId();
                _clients.push(_client);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
            }

            setClients(_clients);
            setClientDialog(false);
            setClient(emptyClient);
        }
    };

    const editClient = (client) => {
        setClient({ ...client });
        setClientDialog(true);
    };

    const confirmDeleteClient = (client) => {
        setClient(client);
        setDeleteClientDialog(true);
    };

    const deleteClient = () => {
        let _clients = clients.filter((val) => val.id !== client.id);
        setClients(_clients);
        setDeleteClientDialog(false);
        setClient(emptyClient);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === id) {
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
        setDeleteClientsDialog(true);
    };

    const deleteSelectedClients = () => {
        let _clients = clients.filter((val) => !selectedClients.includes(val));
        setClients(_clients);
        setDeleteClientsDialog(false);
        setSelectedClients(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _client = { ...client };
        _client[`${name}`] = val;

        setClient(_client);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedClients || !selectedClients.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const cedulaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cédula</span>
                {rowData.cedula}
            </>
        );
    };

    const stringBodyTemplate = (rowData, value, header) => {
        return (
            <>
                <span className="p-column-title">{header}</span>
                {rowData[value]}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-book" className="p-button-rounded p-button-info mr-2" onClick={toggleDataTable} />
                <OverlayPanel ref={op_orders} appendTo={typeof window !== 'undefined' ? document.body : null} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                    <DataTable value={orders} selection={selectedOrder} onSelectionChange={(e) => setSelectedOrder(e.value)} selectionMode="single" responsiveLayout="scroll" paginator rows={5} onRowSelect={onOrderSelect}>
                        <Column field="fecha_orden" header="Fecha" body={dateBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }} />
                        <Column field="numero_orden" header="# Orden" headerStyle={{ minWidth: '8rem' }} />
                        <Column field="total_orden" header="Total" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }} />
                    </DataTable>
                </OverlayPanel>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editClient(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteClient(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Clients</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const clientDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClient} />
        </>
    );
    const deleteClientDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteClient} />
        </>
    );
    const deleteClientsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedClients} />
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
                        value={clients}
                        selection={selectedClients}
                        onSelectionChange={(e) => setSelectedClients(e.value)}
                        dataKey="cedula"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron clientes."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="cedula" header="Cédula" sortable body={cedulaBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={(rowData) => stringBodyTemplate(rowData, 'nombre', 'Nombre')} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="apellido" header="Apellido" sortable body={(rowData) => stringBodyTemplate(rowData, 'apellido', 'Apellido')} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="telefono" header="Teléfono" sortable body={(rowData) => stringBodyTemplate(rowData, 'telefono', 'Teléfono')} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="direccion" header="Dirección" sortable body={(rowData) => stringBodyTemplate(rowData, 'direccion', 'Dirección')} headerStyle={{ minWidth: '18rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={clientDialog} style={{ width: '450px' }} header="Detalles del Cliente" modal className="p-fluid" footer={clientDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cedula">Cédula</label>
                                <InputText id="cedula" value={client.cedula} onChange={(e) => onInputChange(e, 'cedula')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.cedula })} />
                                {submitted && !client.cedula && <small className="p-invalid">La cédula es obligatoria.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="telefono">Teléfono</label>
                                <InputText id="telefono" value={client.telefono} onChange={(e) => onInputChange(e, 'telefono')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.telefono })} />
                                {submitted && !client.telefono && <small className="p-invalid">El teléfono es obligatorio.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="nombre">Nombre</label>
                                <InputText id="nombre" value={client.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.nombre })} />
                                {submitted && !client.nombre && <small className="p-invalid">El nombre es obligatorio.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="apellido">Apellido</label>
                                <InputText id="apellido" value={client.apellido} onChange={(e) => onInputChange(e, 'apellido')} />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="direccion">Dirección</label>
                            <InputTextarea id="direccion" value={client.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientDialogFooter} onHide={hideDeleteClientDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && (
                                <span>
                                    ¿Estás seguro que quieres borrar al cliente{' '}
                                    <b>
                                        {client.nombre} {client.apellido}
                                    </b>
                                    ?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteClientsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientsDialogFooter} onHide={hideDeleteClientsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {client && <span>¿Estás seguro que quieres borrar los clientes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
