import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FormRegister } from "./pages/FormRegister";
import { FormLogin } from "./pages/FormLogin";
import { Home } from "./pages/Home";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { auth } from "./services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./redux/slices/authSlice";
import { useEffect } from "react";
import { Cart } from "./pages/Cart";
import { db } from "./services/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

function App() {
  const dispatch = useDispatch();

  // Hace el dispatch de la acción setUser cuando el usuario inicia sesión
  useEffect(() => {
    // Validar si hay un usuario conectado o no
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user.uid));
        await setDoc(doc(db, "users", user.uid), {
          createdAt: String(new Date()),
        });
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          // Default route to Register
          <Route path="/" element={<FormRegister />} />
          <Route path="/login" element={<FormLogin />} />
          <Route
            path="/home"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoutes>
                <Cart />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
