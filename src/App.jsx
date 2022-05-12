import { React, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import UserContext from "./contexts/UserContext.js";

import Login from "./routecomponents/Login.jsx";
import Register from "./routecomponents/Register.jsx";
import ShoppingList from "./routecomponents/shoppingList.jsx";

import NotFound from "./routecomponents/NotFound.jsx";

import "./css/reset.css";
import "./css/style.css";

export default function App() {
  const [userData, setUserData] = useState({}); // aqui é { name, token } ?
  const [products, setProducts] = useState([
    {
      _id: "627bd8744aa8a992f4a7d230",
      product: "Notebook Gamer",
      image: "https://publicdomainvectors.org/photos/laptop-2.png",
      description: "Notebook gamer baratinho, confia!",
      value: 3000,
      type: "PC",
    },
    {
      _id: "627bd8d74aa8a992f4a7d231",
      product: "PC Gamer",
      image:
        "https://a-static.mlcdn.com.br/618x463/computador-completo-pc-cpu-monitor-19-5-intel-core-i5-memoria-8gb-com-ssd-240gb-saida-hdmi-full-hd-quantum-plus-desktop/3greentechnology/43542/06a70b0c0f759b6a8f092cd93c5639b6.jpg",
      description: "PC gamer baratinho, roda LoL!",
      value: 1500,
      type: "PC",
    },
    {
      _id: "627bd9594aa8a992f4a7d232",
      product: "Celular Top",
      image:
        "https://d1r6yjixh9u0er.cloudfront.net/Custom/Content/Products/26/97/2697_smartphone-xiaomi-mi-11-5g-tela-681-8gb256gb-c00318_z9_637551146435378534.png",
      description: "Muito melhor que IPhone!",
      value: 2000,
      type: "Celular",
    },
    {
      _id: "627bd9b84aa8a992f4a7d233",
      product: "Mouse Gamer",
      image: "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX425_.jpg",
      description: "Parece até um Transformer!",
      value: 200,
      type: "Periférico",
    },
    {
      _id: "627bd9ed4aa8a992f4a7d234",
      product: "Teclado Gamer",
      image: "https://m.media-amazon.com/images/I/718-DlUkzWL._AC_SX522_.jpg",
      description: "Faz muito barulho, mas é bom!",
      value: 200,
      type: "Periférico",
    },
    {
      _id: "627bda5e4aa8a992f4a7d235",
      product: "Xbox Series X",
      image:
        "https://static.nagem.com.br/util/artefatos/produtos/n/n/812031600888847/525324.jpg",
      description: "Video game de última geração da MS!",
      value: 4000,
      type: "Video_Game",
    },
    {
      _id: "627bdab84aa8a992f4a7d236",
      product: "PlayStation 5",
      image:
        "https://images.kabum.com.br/produtos/fotos/sync_mirakl/181395/Console-Playstation-5-825GB-PS5-_1643893529_gg.jpg",
      description: "Video game de última geração da Sony!",
      value: 4000,
      type: "Video_Game",
    },
  ]); // Aqui fica a lista de produtos

  function getProducts() {
    // Função que resgata lista de produtos e a armazena
    const url = "https://projeto14-driveneletro.herokuapp.com/products";
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
          <Route path="/shoppinglist" element={<ShoppingList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
