import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import BtnSecondary from '../Buttons/ButtonSecondary/buttonSecondary';
import styles from './form.module.css'

export default function Form(){
    return (
        <section className={styles.formContainer}>
            <div action="">
                <img width="70" height="70" src="https://img.icons8.com/ios-filled/100/FFFFFF/phone.png" alt="phone" />

                <h1>Faça parte da MedFlow e ganhe produtividade.</h1>

                <BtnSecondary to="/" styles={{ width: "30rem" }}>Fale com especialista</BtnSecondary>
            </div>
        </section>
    );
}