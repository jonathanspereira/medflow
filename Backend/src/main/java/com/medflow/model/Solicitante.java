package com.medflow.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitante")
public class Solicitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String especialidade;
    private String crm;
    private String uf;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    public Solicitante() {
        this.dataCriacao = LocalDateTime.now(); // Define data de criação automaticamente
    }

    public Solicitante(Long id, String nome, String especialidade, String crm, String uf, LocalDateTime dataCriacao) {
        this.id = id;
        this.nome = nome;
        this.especialidade = especialidade;
        this.crm = crm;
        this.uf = uf;
        this.dataCriacao = dataCriacao;
    }


    // Getters e Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
