import React, { useState } from 'react';
import styles from './login.module.css';
import { Link } from 'react-router-dom';


export default function Login() {
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <section className={styles.homepagesection}>
            <div className={styles.container}>
                <h1>Bem vindo ao <span>MedFlow</span></h1>

                <p>Preencha os dados do login para acessar</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <div className={styles.label}>
                            <label htmlFor="usuario">Usuário:</label>
                        </div>
                        
                        <div>
                            <input
                                type="text"
                                id="usuario"   
                                placeholder='Digite seu usuário'                         
                            />
                        </div>
                    </div>

                    <div>
                        <div className={styles.label}>
                            <label htmlFor="password">Senha:</label>
                        </div>

                        <div>
                            <input
                                type="password"
                                id="password"
                                placeholder='Digite sua senha'
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        
                    </div>
                    
                    <Link to="/requests" ><button type="submit">Login</button></Link>
                </form>
            </div>

            <div className={styles.forma1}></div>
            <div className={styles.forma2}></div>
            <div className={styles.forma3}>
                <h1>Faça o login na <br /> <span>MedFlow</span></h1>
            </div>
        </section>
    );
}