import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../contexts/UserContext.js";
import logoutButton from "./../assets/icon_logout.png";
import cartIcon from "./../assets/icon_cart.png";

export default function UserHome() {
  const {
    userData,
    products,
    getProducts,
    shoppingCart,
    setShoppingCart,
    getShoppingCart,
  } = useContext(UserContext);

  useEffect(() => {
    getProducts();
    getShoppingCart();
  }, []);

  // Abaixo, soma preço total no carrinho (para usar em bonus)
  // const sumall = shoppingCart.map(product => parseFloat(product.value)).reduce((prev, curr) => prev + curr, 0);

  const navigate = useNavigate();

  //  Abaixo função de LogOut (para bônus)

  function signOut() {
      const url = "https://projeto14-driveneletro.herokuapp.com/signout";
      const config = {
          headers: {
              Authorization: `Bearer ${userData.token}`
          }
      };
      const promise = axios.delete(url, config);
      promise.then((response) => {
          const { data } = response;
          localStorage.clear();
          navigate("/");
      })
      promise.catch((err) => {
          const { response } = err;
          const { data } = response;
          alert(data);
      })
  }

  function postShoppingCart(
    productId,
    product,
    image,
    description,
    value,
    type
  ) {
    let quantity = parseInt(
      prompt(`Digite quantas unidades de ${product} você deseja comprar:`)
    );
    while (quantity <= 0 || typeof quantity !== "number" || quantity % 1 !== 0)
      quantity = parseInt(prompt("Insira um valor válido:"));

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

    console.log("indexProductToEdit", indexProductToEdit);
    console.log("metaProduct", metaProduct);
    console.log("metaShoppingCart", metaShoppingCart);
    console.log("shoppingCart", shoppingCart);

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

  return (
    <Screen>
      <header>
        <h1>Olá, {userData.name}</h1>
        <img src={logoutButton} onClick={signOut} alt="logoutButton" />
      </header>
      <article>
        {products.map((actualProduct, index) => {
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
    h1 {
      font-weight: 700;
      font-size: 26px;
      color: #ffffff;
    }
    img {
      height: 24px;
    }
  }
  article {
    margin-top: 25px;
    margin-bottom: 13px;
    background-color: #e5e5e5;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 170px);
    border-radius: 5px;
    overflow-y: scroll;
    position: relative;
    padding: 23px 12px 10px 12px;
    menu {
      display: flex;
      /* justify-content: space-between; */
      margin-bottom: 20px;
      padding: 10px;
      position: relative;
      background-color: #478ea5;
      border-radius: 5px;
      section {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 160px;
        margin-right: 30px;
        /* min-height: 90px; */
        /* max-width: 160px; */
        h1 {
          /* margin-right: 10px; */
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
  /* margin-bottom: 36px; */
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
`;

const EnabledShoppingCartButton = styled.button`
  width: calc(100vw - 50px);
  height: 46px;
  background: #478ea5;
  border-radius: 5px;
  border: none;
  /* margin-bottom: 36px; */
  font-weight: 700;
  font-size: 20px;
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
