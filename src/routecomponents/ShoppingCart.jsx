import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import UserContext from "../contexts/UserContext.js";

import goBackIcon from "./../assets/icon_back.png";
import editIcon from "./../assets/icon_edit.png";

export default function ShoppingCart() {
  const { userData, shoppingCart, setShoppingCart, getShoppingCart } =
    useContext(UserContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!userData.token) navigate("/");
  }, []);

  function editProductQuantity(productId, product) {
    let input = prompt(
      `Digite quantas unidades de ${product} você deseja ter no carrinho:`
    );
    if (input === null) return;

    let newQuantity = parseInt(input);

    while (
      typeof newQuantity !== "number" ||
      newQuantity < 0 ||
      newQuantity % 1 !== 0
    ) {
      if (input === null) return;

      input = prompt("Insira um valor válido:");
      newQuantity = parseInt(input);
    }

    let metaShoppingCart = [...shoppingCart];

    const indexProductToEdit = shoppingCart.findIndex((product) => {
      return product.productId === productId;
    });

    let metaProduct = { ...metaShoppingCart[indexProductToEdit] };

    metaProduct.quantity = newQuantity;

    if (metaProduct.quantity > 0) {
      metaShoppingCart.splice(indexProductToEdit, 1, metaProduct);
    } else {
      metaShoppingCart.splice(indexProductToEdit, 1);
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

  function emptyCart() {
    if (!window.confirm("Deseja esvaziar o carrinho?")) return;
    setShoppingCart([]);

    const url = "https://projeto14-driveneletro.herokuapp.com/shoppingcart";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const promise = axios.post(url, [], config);
    promise.then((response) => {
      getShoppingCart();
    });
    promise.catch((err) => {
      const { response } = err;
      const { data } = response;
      alert(data);
    });
  }

  function buyProducts() {
    if (!window.confirm("Deseja finalizar a compra?")) return;
    const url = "https://projeto14-driveneletro.herokuapp.com/sale";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .post(url, { date: new Date(), boughtProducts: shoppingCart }, config)
      .then((response) => {
        const { data } = response;
        alert(data);
        emptyCart();
        navigate("/userhome");
      })
      .catch((err) => {
        const { response } = err;
        const { data } = response;
        alert(data);
      });
  }

  return (
    <Screen>
      <header>
        <h1>Carrinho de compras</h1>
        <img
          src={goBackIcon}
          alt="logoutButton"
          onClick={() => navigate("/userhome")}
        />
      </header>
      <article>
        {shoppingCart.map((actualProduct, index) => {
          const { productId, product, image, description, value, quantity } =
            actualProduct;
          return (
            <menu
              key={index}
              onClick={() => editProductQuantity(productId, product)}
            >
              <ProductImage src={image} alt={product} />
              <section>
                <h1>{product}</h1>
                <h2>{description}</h2>
                <h1>R$ {parseFloat(value).toFixed(2).replace(".", ",")}</h1>
              </section>
              <Quantity>Qtd: {quantity}</Quantity>
              <ShoppingCartLogo src={editIcon} alt="editIcon" />
            </menu>
          );
        })}
      </article>
      <ButtonContainer>
        <ShoppingCartButton className="confirm" onClick={buyProducts}>
          Confirmar compras
        </ShoppingCartButton>
        <ShoppingCartButton className="cancel" onClick={emptyCart}>
          Limpar o carrinho
        </ShoppingCartButton>
      </ButtonContainer>
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
    margin-bottom: 25px;
    background-color: #e5e5e5;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 172px);
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShoppingCartButton = styled.button`
  width: 48%;
  height: 46px;
  border-radius: 5px;
  border: none;
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;

  &.confirm {
    background: #3bcb3be0;
  }

  &.cancel {
    background: #ff0000da;
  }
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

const Quantity = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;

  bottom: 10px;
  right: 40px;
  position: absolute;
`;
