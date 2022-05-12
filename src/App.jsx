import { React, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import UserContext from "./contexts/UserContext.js";

import Login from "./routecomponents/Login.jsx";
import Register from "./routecomponents/Register.jsx";
import UserHome from "./routecomponents/UserHome.jsx";

import NotFound from "./routecomponents/NotFound.jsx";

import "./css/reset.css";
import "./css/style.css";

export default function App() {
  const [userData, setUserData] = useState({}); // aqui é { name, token } ?
  const [products, setProducts] = useState([]); // Aqui fica a lista de produtos

  function getProducts() {
    // Função que resgata lista de produtos e a armazena
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

  const [shoppingCart, setShoppingCart] = useState([]); // Aqui fica a lista do carrinho de compras

  function getShoppingCart() {
    // Função que resgata lista do carrinho de compras e a armazena
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
