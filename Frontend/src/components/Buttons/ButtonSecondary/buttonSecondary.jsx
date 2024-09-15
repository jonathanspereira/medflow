import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import styles from './buttonSecondary.module.css';

export default function ButtonSecondary({ to, children }) {

    return (
        

        <Link to={to} className={styles.btn}>
            {children}
        </Link>       
        
    );
}