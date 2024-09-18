import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Header from '../../components/header';
import SideBar from '../../components/sidebar';
import Table from '../../components/table';

import styles from './examsRequest.module.css';

export default function ExamsRequest() {

  return (

    <section className={styles.containerMain}>

      <SideBar />

      <div className={styles.container}>
        <Header title={"Solicitações de Exames"} />
        

        <Table  />
      </div>

      


     
    </section>
  );
}