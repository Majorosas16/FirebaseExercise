import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setCart } from "../redux/slices/productsSlice";
import type { Product } from "../types/productsType";
import type { RootState } from "../redux/store";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productsSlice = useSelector(
    (state: RootState) => state.productsSlice.products
  );
  const userID = useSelector((state: RootState) => state.auth.userID);

  const handleCloseSession = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User signed out successfully.");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
      });
  };

  //Traer los productos de la base de datos al cargar el componente
  useEffect(() => {
    const getProducts = async () => {
      //Obtener de la base de datos los productos
      const querySnapshot = await getDocs(collection(db, "products"));
      //Un arreglo inicial para los productos
      const products: Product[] = [];
      //Mapear lo de la base de datos para transformalo a un objeto conocido
      querySnapshot.forEach((doc) => {
        const product: Product = {
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price,
        };
        //Guardamos en el arreglo inicial los productos mapeados
        products.push(product);
      });
      //Guardamos el arreglo inicial en el redux
      dispatch(setProducts(products));
    };

    getProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProduct = async (product: Product) => {
    //Guardar a nivel del redux
    dispatch(setCart(product));
    //Guardar a nivel de la database
    await setDoc(doc(db, "users", userID, "cart", uuidv4()), product);
  };

  return (
    <>
      <button onClick={handleCloseSession}>Cerrar sesión</button>
      <button onClick={() => navigate("/cart")}>Ir al carrito</button>
      <h1>Bienvenido</h1>
      {productsSlice.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <h3>{product.price}</h3>
          <button onClick={() => handleAddProduct(product)}>
            Agregar al carrito
          </button>
        </div>
      ))}
    </>
  );
};
