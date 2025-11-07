import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const DB_NAME = "productosDB";
  const DB_VERSION = 1;
  const STORE_NAME = "productos";

  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null);

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error al abrir la base de datos");
    });
  };

  const getAllProductos = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error al obtener productos");
    });
  };

  const addProducto = async (producto) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add(producto);
    await tx.complete;
  };

  const updateProducto = async (producto) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(producto);
    await tx.complete;
  };

  const deleteProducto = async (id) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    await tx.complete;
  };

  useEffect(() => {
    getAllProductos().then(setProductos);
  }, []);

  const agregarProducto = async () => {
    if (!nombre || !precio) return alert("Completa todos los campos");

    if (editId) {
      const productoEditado = { id: editId, nombre, precio };
      await updateProducto(productoEditado);
    } else {
      await addProducto({ nombre, precio });
    }

    setNombre("");
    setPrecio("");
    setEditId(null);
    getAllProductos().then(setProductos);
  };

  const editarProducto = (producto) => {
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setEditId(producto.id);
  };

  const eliminarProductoHandler = async (id) => {
    await deleteProducto(id);
    getAllProductos().then(setProductos);
  };

  return (
    <div className="container">
      <h1>CRUD de Productos con IndexedDB</h1>

      <div className="formulario">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button onClick={agregarProducto}>
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="4">No hay productos</td>
            </tr>
          ) : (
            productos.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                  <button onClick={() => editarProducto(p)}>✏️ Editar</button>
                  <button onClick={() => eliminarProductoHandler(p.id)}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
