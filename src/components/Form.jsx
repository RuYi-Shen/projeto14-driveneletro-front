import { useState } from 'react';

import styled from 'styled-components';

export default function Form({ type, setUserInfo, disabled }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const regEx = {
        email: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
        password: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$",
        name: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$",
    };

    function handleSubmit(e) {
        e.preventDefault();
        type === "register" ? setUserInfo({ name, email, password, passwordConfirmation }) : setUserInfo({ email, password });
    }

    return (
        <Forms onSubmit={handleSubmit} disabled={disabled}>
            <fieldset disabled={disabled}>
                {type === "register" ?
                    <input type="text" id="name" pattern={regEx.name} placeholder="Nome" required value={name} onChange={e => setName(e.target.value)} />
                    : null}
                <input type="email" id="email" pattern={regEx.email} placeholder="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" id="password" pattern={regEx.password} placeholder="Senha" required value={password} onChange={e => setPassword(e.target.value)} />
                {type === "register" ?
                    <input type="password" id="passwordConfirmation" pattern={regEx.password} placeholder="Confirme a senha" required value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
                    : null}
                <button type="submit">{disabled ? "Aguarde..." : (type === "register" ? "Cadastrar" : "Entrar")}</button>
            </fieldset>
        </Forms>
    )
}


/**************************** css ****************************/

const Forms = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    fieldset {

        input {
            width: 100%;
            height: 58px;
            box-sizing: border-box;
            border-radius: 5px;
            border: none;
            padding: 0 15px;
            margin-bottom: 13px;
            background-color: ${(props => props.disabled ? 'var(--white-base)' : 'var(--white-base)')};
            color: ${(props => props.disabled ? 'var(--black-base)' : 'var(--black-base)')};
            
            font-size: 20px;
            line-height: 23px;
        }

        button {
            width: 100%;
            height: 46px;
            border: none;
            background-color: var(--blue-button);
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            font-size: 20px;
            line-height: 23px;

            color: var(--white-base);

            &:hover {
                cursor: pointer;
            }
        }
    }

`
