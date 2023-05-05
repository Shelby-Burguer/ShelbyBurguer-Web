import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            ]
        },
        {
            label: 'Productos',
            items: [
                { label: 'Ingredientes', icon: 'pi pi-fw pi-home', to: '/pages/Ingredientes' },
                { label: 'Productos', icon: 'pi pi-fw pi-home', to: '/pages/Productos' },
                { label: 'Combos', icon: 'pi pi-fw pi-home', to: '/pages/Combos' }
            ]
        },
        {
            label: 'Ordenes',
            items: [
                { label: 'Culminacion de orden', icon: 'pi pi-fw pi-home', to: '/pages/Ordenes' },
                { label: 'Ordenes', icon: 'pi pi-fw pi-home', to: '/pages/Ordenes/gestion' },
            ]
        },
        {
            label: 'Administrador',
            items: [
                { label: 'Clientes', icon: 'pi pi-fw pi-user-edit', to: '/pages/admin/clientes' },
                { label: 'Zonas Delivery', icon: 'pi pi-fw pi-map-marker', to: '/pages/admin/lugares' }
            ]
        }
     ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
