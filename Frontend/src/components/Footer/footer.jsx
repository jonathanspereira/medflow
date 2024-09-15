import React, { useState } from 'react';
import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            
                <div className={styles.container}>
                   <div><h1>MedFlow</h1></div>

                </div>

                <section className={styles.containerLinks}>
                <   div>
                            <ul>
                                <li>Home</li>
                                <li>Produtos</li>
                                <li>Contato</li>
                            </ul>
                    </div>

                    <div>
                            <ul>
                                <li>MedFlow</li>
                                <li>MedFlow Plus</li>
                                <li>MedFlow Pro</li>
                            </ul>
                    </div>

                </section>
                

                <div className={styles.copywrite}>
                    <p> &copy; 2024 MedFlow - Todos os direitos reservados</p>
                </div>
                
        </footer>

        
    );
}