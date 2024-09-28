package com.medflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "convenio")
public class Convenio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descricao", nullable = false)
    private String descricao;


    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    // Construtores

    public Convenio(Long id, String descricao, LocalDateTime dataCriacao) {
        this.id = id;
        this.descricao = descricao;
        this.dataCriacao = dataCriacao;
    }

    public Convenio() {

    }

    // Getters e Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    // toString


    @Override
    public String toString() {
        return "Convenio{" +
                "id=" + id +
                ", descricao='" + descricao + '\'' +
                '}';
    }
}
