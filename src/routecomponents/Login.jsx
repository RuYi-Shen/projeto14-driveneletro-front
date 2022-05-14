import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from "../contexts/UserContext";

import styled from 'styled-components';
import Form from '../components/Form';
import axios from 'axios';

import logo from '../assets/de_logo.png';


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
            <section>
                <img src={logo} alt="logo" />
                <h1><span>Driven</span>Eletro</h1>
                <Form type="login" setUserInfo={setUserInfo} disabled={disabled} />
                <Link to="/register">Primeira vez? <u>Cadastre-se!</u></Link>
            </section>
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
    padding: 48px 5%;
    background-color: var(--purple-base);

    section {
        width: 100%;
        max-width: 530px;
        height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        background-color: var(--white-base);
        border-radius: 18px;

        h1 {
            //font-family: 'Saira Stencil One';
            font-weight: 700;
            font-size: 32px;
            margin-top: 10px;

            color: var(--blue-base);
            span {
                color: var(--blue-button);
            }
        }

        form {
            max-width: 430px;
            margin: 32px 24px;
        }

        a {
            font-weight: 700;
            font-size: 15px;

            color: var(--blue-base);
        }
    }
`