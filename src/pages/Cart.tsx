import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect } from "react";
import { doc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import type { Product } from "../types/productsType";
import { clearCart, setCart, deleteCart } from "../redux/slices/productsSlice";

export const Cart = () => {
  const cartSlice = useSelector((state: RootState) => state.productsSlice.cart);
  const userID = useSelector((state: RootState) => state.auth.userID);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCart = async () => {
      dispatch(clearCart());

      const querySnapshot = await getDocs(
        collection(db, "users", userID, "cart")
      );
      // querySnapshot.forEach((doc) => {
      //   dispatch(setCart(doc.data() as Product));
      // });
      querySnapshot.forEach((docSnap) => {
        // Aquí el id es el del documento de firestore
        dispatch(setCart({ ...docSnap.data(), id: docSnap.id } as Product));
      });
    };

    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteProduct = async (product: Product) => {
    console.log(product.id); 
    try {
      const productRef = doc(db, "users", userID, "cart", product.id);
      await deleteDoc(productRef);
      dispatch(deleteCart(product.id));
      console.log("Producto eliminado de Firestore");
    } catch (error) {
      console.error("Error eliminando el producto de Firestore:", error);
    }
  };

  return (
    <>
      <h1>Tu carrito de compras</h1>
      {cartSlice.map((product, index) => (
        <div key={product.id + index}>
          <h3>{product.name}</h3>
          <h3>{product.price}</h3>
          <button onClick={() => handleDeleteProduct(product)}>
            Eliminar del carrito
          </button>
        </div>
      ))}
    </>
  );
};
