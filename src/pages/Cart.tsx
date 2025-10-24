import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import type { Product } from "../types/productsType";
import { clearCart, setCart } from "../redux/slices/productsSlice";

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
      querySnapshot.forEach((doc) => {
        dispatch(setCart(doc.data() as Product));
      });
    };

    getCart();
  }, []);

  return (
    <>
      <h1>Tu carrito de compras</h1>
      {cartSlice.map((product, index) => (
        <div key={product.id + index}>
          <h3>{product.name}</h3>
          <h3>{product.price}</h3>
          <button>Eliminar del carrito</button>
        </div>
      ))}
    </>
  );
};
