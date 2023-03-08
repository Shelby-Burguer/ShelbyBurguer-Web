import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import React, { useRef, useState } from 'react';

const Crud = () => {
    const emptyElements = {
        product: {
            id: null,
            name: '',
            image: '',
            description: '',
            category: '',
            price: null,
            quantity: null,
            rating: null,
            inventoryStatus: 'INSTOCK'
        },
        user: {
            id: null,
            name: '',
            email: '',
            password: ''
        }
        // Agrega más elementos vacíos según las necesidades de tus componentes
    };

    const [elements, setElements] = useState(null);
    const [elementDialog, setElementDialog] = useState(false);
    const [deleteElementDialog, setDeleteElementDialog] = useState(false);
    const [deleteElementsDialog, setDeleteElementsDialog] = useState(false);
    const [element, setElement] = useState(null);
    const [selectedElements, setSelectedElements] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = (type) => {
        setElement(emptyElements[type]);
        setSubmitted(false);
        setElementDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setElementDialog(false);
    };

    const hideDeleteElementDialog = () => {
        setDeleteElementDialog(false);
    };

    const hideDeleteElementsDialog = () => {
        setDeleteElementsDialog(false);
    };

    const saveElement = (type) => {
        setSubmitted(true);

        if (element.name.trim()) {
            let _elements = [...elements];
            let _element = { ...element };
            if (element.id) {
                const index = findIndexById(element.id);

                _elements[index] = _element;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Element Updated', life: 3000 });
            } else {
                _element.id = createId();
                _element.code = createId();
                _element.image = type + '-placeholder.svg';
                _elements.push(_element);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Element Created', life: 3000 });
            }

            setElements(_elements);
            setElementDialog(false);
            setElement(emptyElements[type]);
        }
    };

    const editElement = (element) => {
        setElement({ ...element });
        setElementDialog(true);
    };

    const confirmDeleteElement = (element) => {
        setElement(element);
        setDeleteElementDialog(true);
    };

    const deleteElement = (type) => {
        let _elements = elements.filter((val) => val.id !== element.id);
        setElements(_elements);
        setDeleteElementDialog(false);
        setElement(emptyElements[type]);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Element Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === id) {
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
        setDeleteElementsDialog(true);
    };

    const deleteSelectedElements = () => {
        let _elements = elements.filter((val) => !selectedElements.includes(val));
        setElements(_elements);
        setDeleteElementsDialog(false);
        setSelectedElements(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Elements Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _element = { ...element };
        _element['category'] = e.value;
        setElement(_element);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _element = { ...element };
        _element[`${name}`] = val;

        setElement(_element);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _element = { ...element };
        _element[`${name}`] = val;

        setElement(_element);
    };

    const leftToolbarTemplate = (type) => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => openNew(type)} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedElements || !selectedElements.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

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

    const imageBodyTemplate = (rowData, folder) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`${contextPath}/demo/images/${folder}/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editElement(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteElement(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Elements</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const elementDialogFooter = (type) => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => saveElement(type)} />
            </React.Fragment>
        );
    };

    const deleteElementDialogFooter = (type) => (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteElementDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => deleteElement(type)} />
        </>
    );
    const deleteElementsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteElementsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedElements} />
        </>
    );

    return {
        emptyElements,
        elements,
        elementDialog,
        deleteElementDialog,
        deleteElementsDialog,
        element,
        selectedElements,
        submitted,
        globalFilter,
        setElements,
        setElementDialog,
        setDeleteElementDialog,
        setDeleteElementsDialog,
        setElement,
        setSelectedElements,
        setSubmitted,
        setGlobalFilter,
        toast,
        dt,
        contextPath,
        formatCurrency: formatCurrency,
        openNew: openNew,
        hideDialog: hideDialog,
        hideDeleteElementDialog: hideDeleteElementDialog,
        hideDeleteElementsDialog: hideDeleteElementsDialog,
        saveElement: saveElement,
        editElement: editElement,
        confirmDeleteElement: confirmDeleteElement,
        deleteElement: deleteElement,
        findIndexById: findIndexById,
        createId: createId,
        exportCSV: exportCSV,
        confirmDeleteSelected: confirmDeleteSelected,
        deleteSelectedElements: deleteSelectedElements,
        onCategoryChange: onCategoryChange,
        onInputChange: onInputChange,
        onInputNumberChange: onInputNumberChange,
        leftToolbarTemplate: leftToolbarTemplate,
        rightToolbarTemplate: rightToolbarTemplate,
        codeBodyTemplate: codeBodyTemplate,
        nameBodyTemplate: nameBodyTemplate,
        imageBodyTemplate: imageBodyTemplate,
        priceBodyTemplate: priceBodyTemplate,
        categoryBodyTemplate: categoryBodyTemplate,
        ratingBodyTemplate: ratingBodyTemplate,
        statusBodyTemplate: statusBodyTemplate,
        actionBodyTemplate: actionBodyTemplate,
        header: header,
        elementDialogFooter: elementDialogFooter,
        deleteElementDialogFooter: deleteElementDialogFooter,
        deleteElementsDialogFooter: deleteElementsDialogFooter
    };
};

export default Crud;
