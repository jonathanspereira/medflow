import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import styles from './buttonPrimary.module.css';

export default function ButtonPrimary({ to, children }) {

    return (
        

        <Link to={to} className={styles.btn}>
            {children}
        </Link>       
        
    );
}