import { useState, useEffect } from "react";
import localStorageSlim from "localstorage-slim";
import '../src/App.css'

function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorageSlim.get("productos") || [];
    setProductos(datosGuardados);
  }, []);

  // Guardar cada vez que cambien los productos
  useEffect(() => {
    localStorageSlim.set("productos", productos);
  }, [productos]);

  const agregarProducto = () => {
    if (!nombre || !precio) return alert("Completa todos los campos");

    if (editIndex !== null) {
      // Editar
      const nuevos = [...productos];
      nuevos[editIndex] = { nombre, precio };
      setProductos(nuevos);
      setEditIndex(null);
    } else {
      // Agregar
      setProductos([...productos, { nombre, precio }]);
    }

    setNombre("");
    setPrecio("");
  };

  const eliminarProducto = (index) => {
    const nuevos = productos.filter((_, i) => i !== index);
    setProductos(nuevos);
  };

  const editarProducto = (index) => {
    setNombre(productos[index].nombre);
    setPrecio(productos[index].precio);
    setEditIndex(index);
  };

  return (
    <div>
      <h1>CRUD de Productos 🛒</h1>

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
          {editIndex !== null ? "Actualizar" : "Agregar"}
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                  <button onClick={() => editarProducto(index)}>✏️ Editar</button>
                  <button onClick={() => eliminarProducto(index)}>🗑️ Eliminar</button>
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