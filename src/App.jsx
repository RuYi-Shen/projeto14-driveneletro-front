import { React, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import UserContext from "./contexts/UserContext.js";

import Login from "./routecomponents/Login.jsx";
import Register from "./routecomponents/Register.jsx";
import UserHome from "./routecomponents/UserHome.jsx";
import ShoppingCart from "./routecomponents/ShoppingCart.jsx";
import NotFound from "./routecomponents/NotFound.jsx";

import "./css/reset.css";
import "./css/style.css";

export default function App() {
  const [userData, setUserData] = useState({});
  const [products, setProducts] = useState([]);

  function getProducts() {
    const url = "https://projeto14-driveneletro.herokuapp.com/products";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const promise = axios.get(url, config);
    promise.then((response) => {
      const { data } = response;
      setProducts(data);
    });
    promise.catch((err) => {
      const { response } = err;
      const { data } = response;
      alert(data);
    });
  }

  const [shoppingCart, setShoppingCart] = useState([]);

  function getShoppingCart() {
    const url = "https://projeto14-driveneletro.herokuapp.com/shoppingcart";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const promise = axios.get(url, config);
    promise.then((response) => {
      const { data } = response;
      setShoppingCart(data);
    });
    promise.catch((err) => {
      const { response } = err;
      const { data } = response;
      alert(data);
    });
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        products,
        setProducts,
        getProducts,
        shoppingCart,
        setShoppingCart,
        getShoppingCart,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/shoppingcart" element={<ShoppingCart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}