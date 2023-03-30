export const addToCart = (item, carrito, setCarrito) => {
    setCarrito((prevCarrito) => [...prevCarrito, item]);
};
