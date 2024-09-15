import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Header from '../../components/header';
import SideBar from '../../components/sidebar';
import BtnPrimary from '../../components/Buttons/ButtonPrimary/buttonPrimary';

import styles from './examsRequest.module.css';

export default function ExamsRequest() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implementar lógica de busca por nome ou protocolo
  };

  return (

    <section className={styles.containerMain}>

      <SideBar />

      <Header title={"Solicitações de Exames"} />
     
    </section>
  );
}