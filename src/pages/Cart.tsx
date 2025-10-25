import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect } from "react";
import { doc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import type { Product, ProductWithDocId } from "../types/productsType";
import { clearCart, setCart, deleteCart } from "../redux/slices/productsSlice";

export const Cart = () => {
  const cartSlice = useSelector(
    (state: RootState) => state.productsSlice.cart as ProductWithDocId[]
  ); // asegurarse que el slice guardas ProductWithDocId
  console.log(cartSlice);

  const userID = useSelector((state: RootState) => state.auth.userID);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCart = async () => {
      dispatch(clearCart());

      const querySnapshot = await getDocs(
        collection(db, "users", userID, "cart")
      );

      querySnapshot.forEach((docSnap) => {
        const productData = docSnap.data() as Product;
        // Inserta producto con docId para identificar documento Firestore (id cart y id producto son diferentes)
        dispatch(
          setCart({
            ...productData,
            docId: docSnap.id,
          } as ProductWithDocId)
        );
      });
    };

    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteProduct = async (product: ProductWithDocId) => {
    try {
      const productRef = doc(db, "users", userID, "cart", product.docId);
      await deleteDoc(productRef);
      dispatch(deleteCart(product.docId));
      console.log("Producto eliminado de Firestore");
    } catch (error) {
      console.error("Error eliminando el producto de Firestore:", error);
    }
  };

  const groupedProducts = cartSlice.reduce((acc, product) => {
    const existing = acc.find((p) => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...product, quantity: 1 });
    }
    return acc;
  }, [] as (ProductWithDocId & { quantity: number })[]);

  return (
    <>
      <h1>Tu carrito de compras</h1>
      {groupedProducts.map((product) => (
        <div key={product.docId + product.id}>
          <h3>
            {product.name} {product.quantity > 1 && `x${product.quantity}`}
          </h3>
          <h3>{product.price}</h3>
          <button onClick={() => handleDeleteProduct(product)}>
            Eliminar del carrito
          </button>
        </div>
      ))}
    </>
  );
};
