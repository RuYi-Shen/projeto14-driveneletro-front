import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from "../contexts/UserContext";

import styled from 'styled-components';
import Form from '../components/Form';
import axios from 'axios';


export default function Login() {
    
    const URL = "https://projeto14-driveneletro.herokuapp.com/signin";

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [disabled, setDisabled] = useState(false);
    const { setUserData } = useContext(UserContext);

    useEffect(() => {
        if (localStorage.getItem('userData') !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')));
            navigate("/userhome");
        } 
        if (Object.keys(userInfo).length !== 0) {
            setDisabled(true);
            axios.post(URL, userInfo)
                .then((response) => {
                    localStorage.setItem('userData', JSON.stringify(response.data));
                    setUserData(response.data);
                    navigate("/userhome");
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data);
                    setDisabled(false);
                });
        }
    }, [userInfo, setUserData, navigate]);

    return (
        <Main>
            <h1>MyWallet</h1>
            <Form type="login" setUserInfo={setUserInfo} disabled={disabled} />
            <Link to="/register">Primeira vez? Cadastre-se!</Link>
        </Main>
    )
}


/**************************** css ****************************/

const Main = styled.main`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    background-color: var(--purple-base);

    h1 {
        //font-family: 'Saira Stencil One';
        font-weight: 700;
        font-size: 32px;

        color: var(--white-base);
    }

    form {
        max-width: 430px;
        margin: 32px 24px;
    }

    a {
        font-weight: 700;
        font-size: 15px;

        color: var(--white-base);
    }
`