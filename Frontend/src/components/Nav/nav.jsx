import React from 'react';
import { Link } from 'react-router-dom';
import BtnPrimary from '../Buttons/ButtonPrimary/buttonPrimary';
import styles from './nav.module.css';

export default function Nav() {
    return (
        <header className={styles.container}>
            <nav className={styles.nav} aria-label="Main Navigation">
                <div className={styles.logo}>
                    <h1>MedFlow</h1>
                </div>

                <div className={styles.links}>
                    <Link to="/" className={styles.navlinks}>Início</Link>
                    <Link to="/solucoes" className={styles.navlinks}>Soluções</Link>
                    <Link to="/sobre" className={styles.navlinks}>Sobre</Link>
                    <Link to="/suporte" className={styles.navlinks}>Suporte</Link>
                </div>

                <BtnPrimary to="/login">Login</BtnPrimary>
                
            </nav>
        </header>
    );
}
