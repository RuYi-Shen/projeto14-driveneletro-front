import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import Form from '../components/Form';
import axios from 'axios';

export default function Register() {
    const URL = "https://projeto14-driveneletro.herokuapp.com/signup";

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        localStorage.clear();
        if (Object.keys(userInfo).length !== 0) {
            setDisabled(true);
            axios.post(URL, userInfo)
                .then((response) => {
                    alert(response.data);
                    navigate("/");
                })
                .catch(error => {
                    console.log(error);
                    alert(error.response.data);
                    setDisabled(false);
                });
        }
    }, [userInfo, navigate]);

    return (
        <Main>
            <h1>DrivenEletro</h1>
            <Form type="register" setUserInfo={setUserInfo} disabled={disabled} />
            <Link to="/">Já tem uma conta? Entre agora!</Link>
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