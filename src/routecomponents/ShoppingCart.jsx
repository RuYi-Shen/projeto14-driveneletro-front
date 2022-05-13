import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../contexts/UserContext.js";
import logoutButton from "./../assets/icon_logout.png";
import editIcon from "./../assets/icon_edit.png";

export default function ShoppingCart() {
  const { userData, shoppingCart, setShoppingCart, getShoppingCart } =
    useContext(UserContext);
  // Abaixo, soma preço total no carrinho (para usar em bonus)
  // const sumall = shoppingCart.map(product => parseFloat(product.value)).reduce((prev, curr) => prev + curr, 0);

  const navigate = useNavigate();

  function editProductQuantity(productId, product) {
    let newQuantity = parseInt(
      prompt(
        `Digite quantas unidades de ${product} você deseja ter no carrinho:`
      )
    );
    while (
      newQuantity < 0 ||
      typeof newQuantity !== "number" ||
      newQuantity % 1 !== 0
    )
      newQuantity = parseInt(prompt("Insira um valor válido:"));

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

  function emptyCart(productId, product) {
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

  //  AQUI VC FAZ A FUNÇÃO DE ENVIAR A COMPRA FEITA
  function buyProducts() {
    // Função que faz o checkout do carrinho de compras
    const url = "https://projeto14-driveneletro.herokuapp.com/sale";
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    console.log(shoppingCart);
    axios
      .post(url, {boughtProducts: shoppingCart}, config)
      .then((response) => {
        const { data } = response;
        alert(data);

        // Limpa o carrinho de compras
        setShoppingCart([]);
        getShoppingCart();
        navigate("/userhome");
      })
      .catch((err) => {
        const { response } = err;
        const { data } = response;
        console.log(data);
        alert(data);
      });
  };

  return (
    <Screen>
      <header>
        <h1>Carrinho de compras</h1>
        <img
          src={logoutButton}
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
        <ShoppingCartButton onClick={buyProducts}>
          Confirmar compras
        </ShoppingCartButton>
        <ShoppingCartButton onClick={emptyCart}>
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
      /* align-items: center; */
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShoppingCartButton = styled.button`
  width: 160px;
  height: 66px;
  background: #478ea5;
  border-radius: 5px;
  border: none;
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

const Quantity = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;

  bottom: 10px;
  right: 40px;
  position: absolute;
`;
