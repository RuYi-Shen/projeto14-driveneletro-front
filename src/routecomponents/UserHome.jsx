import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import UserContext from "../contexts/UserContext.js";

import logoutButton from "./../assets/icon_logout.png";
import cartIcon from "./../assets/icon_cart.png";
import logo from "./../assets/de_logo.png";

export default function UserHome() {
  const {
    userData,
    products,
    setProducts,
    getProducts,
    shoppingCart,
    setShoppingCart,
    getShoppingCart,
  } = useContext(UserContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!userData.token) {
      navigate("/");
      return;
    } else {
      getProducts();
      getShoppingCart();
    }
  }, []);

  function signOut() {
    if (!window.confirm("Deseja realmente sair?")) return;
    const url = "https://projeto14-driveneletro.herokuapp.com/signout";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const promise = axios.delete(url, config);
    promise.then((response) => {
      const { data } = response;

      localStorage.clear();

      navigate("/");
    });
    promise.catch((err) => {
      const { response } = err;
      const { data } = response;
      alert(data);
    });
  }

  function postShoppingCart(
    productId,
    product,
    image,
    description,
    value,
    type
  ) {
    let input = parseInt(
      prompt(`Digite quantas unidades de ${product} você deseja comprar:`)
    );
    while (typeof input !== "number" || input <= 0 || input % 1 !== 0) {
      if (input === null) return;
      input = prompt("Insira um valor válido:");
    }
    let quantity = input;

    let metaShoppingCart = [...shoppingCart];

    const indexProductToEdit = shoppingCart.findIndex((product) => {
      return product.productId === productId;
    });

    let metaProduct;
    if (indexProductToEdit !== -1) {
      metaProduct = { ...metaShoppingCart[indexProductToEdit] };
      metaProduct.quantity = quantity;
    } else {
      metaProduct = {
        productId,
        product,
        image,
        description,
        value,
        type,
        quantity,
      };
    }

    if (indexProductToEdit === -1) {
      metaShoppingCart.push(metaProduct);
    } else {
      metaShoppingCart.splice(indexProductToEdit, 1, metaProduct);
    }

    setShoppingCart(metaShoppingCart);

    const url = "https://projeto14-driveneletro.herokuapp.com/shoppingcart";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const promise = axios.post(url, metaShoppingCart, config);
    promise.then((response) => {
      getShoppingCart();
    });
    promise.catch((err) => {
      const { response } = err;
      const { data } = response;
      alert(data);
    });
  }

  const [type, setType] = useState("Todos");
  const [displayProducts, setDisplayProducts] = useState([]);

  function handleChange(event) {
    setType(event.target.value);
  }

  useEffect(() => {
    switch (type) {
      case "Todos":
        setDisplayProducts([...products]);
        return;
      default:
        setDisplayProducts(
          [...products].filter((product) => product.type === type)
        );
        return;
    }
  }, [type, products]);

  return (
    <Screen>
      <header>
        <img src={logo} alt="logo" />
        <h1>Olá, {userData.name}</h1>
        <div>
          <select value={type} onChange={handleChange}>
            <option value="Todos">Todas Categorias</option>
            <option value="PC">Computadores</option>
            <option value="Celular">Celulares</option>
            <option value="Periférico">Periféricos</option>
            <option value="Video_Game">Vídeo Games</option>
          </select>
        </div>
        <img src={logoutButton} onClick={signOut} alt="logoutButton" />
      </header>
      <article>
        {displayProducts.map((actualProduct, index) => {
          const {
            _id: productId,
            product,
            image,
            description,
            value,
            type,
          } = actualProduct;
          return (
            <menu
              key={index}
              onClick={() =>
                postShoppingCart(
                  productId,
                  product,
                  image,
                  description,
                  value,
                  type
                )
              }
            >
              <ProductImage src={image} alt={product} />
              <section>
                <h1>{product}</h1>
                <h2>{description}</h2>
                <h1>R$ {parseFloat(value).toFixed(2).replace(".", ",")}</h1>
              </section>
              <ShoppingCartLogo src={cartIcon} alt="cartIcon" />{" "}
            </menu>
          );
        })}
      </article>
      <>
        {shoppingCart.length > 0 ? (
          <Link to="/shoppingcart">
            <EnabledShoppingCartButton>
              Conferir o carrinho de compras
            </EnabledShoppingCartButton>
          </Link>
        ) : (
          <DisabledShoppingCartButton disabled>
            Carrinho de compras vazio
          </DisabledShoppingCartButton>
        )}
      </>
    </Screen>
  );
}

const Screen = styled.section`
  margin: 25px;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 25px;
    h1 {
      font-weight: 700;
      font-size: 26px;
      color: #ffffff;
    }
    img {
      height: 24px;
    }
    div {
      position: absolute;
      left: 0;
      top: 65px;
      width: 100%;
      background-color: var(--blue-button);
      padding: 0 25px;

      select {
        max-width: 200px;
        height: 25px;
        background-color: var(--blue-button);
        color: var(--white-base);

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  article {
    margin-top: 25px;
    margin-bottom: 25px;
    background-color: #e5e5e5;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 197px);
    border-radius: 5px;
    overflow-y: scroll;
    position: relative;
    padding: 23px 12px 10px 12px;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.9);
    menu {
      display: flex;
      margin-bottom: 20px;
      padding: 10px;
      position: relative;
      background-color: #478ea5;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      section {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 160px;
        margin-right: 30px;
        h1 {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }
        h2 {
          font-size: 14px;
          color: #ffffff;
        }
      }
    }
  }
`;

const DisabledShoppingCartButton = styled.button`
  width: calc(100vw - 50px);
  height: 46px;
  background: #696969;
  border-radius: 5px;
  border: none;
  font-weight: 700;
  font-size: 19px;
  color: #ffffff;
`;

const EnabledShoppingCartButton = styled.button`
  width: calc(100vw - 50px);
  height: 46px;
  background: #478ea5;
  border-radius: 5px;
  border: none;
  font-weight: 700;
  font-size: 19px;
  color: #ffffff;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 76px;
  margin-right: 10px;
  border-radius: 5px;
`;

const ShoppingCartLogo = styled.img`
  bottom: 10px;
  right: 10px;
  position: absolute;
  height: 24px;
`;
