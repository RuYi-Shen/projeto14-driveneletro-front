import { Link } from 'react-router-dom';
import styled from "styled-components";

export default function Login() {
    return (
        <Div>
            <h1>Página de Login</h1>
            <Link to="/">Go Home</Link>
        </Div>
    )
}


/**************************** css ****************************/

const Div = styled.div`

    width: 100vw;
    height: 100vh;
    
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: var(--white-base);
    font-size: 30px;

    a {
        text-decoration: underline;
    }
`;