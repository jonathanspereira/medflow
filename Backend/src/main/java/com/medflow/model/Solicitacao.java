package com.medflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "exame_id", nullable = false)
    private Exame exame;

    @ManyToOne
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Solicitante solicitante;

    @ManyToOne
    @JoinColumn(name = "convenio_id", nullable = false)
    private Convenio convenio;

    @Column(nullable = false)
    private String status;

    @Column
    private String motivo; // Apenas preenchido se status for Negado ou Pendente

    @Column(name = "data_solicitacao", nullable = false, updatable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = "Analise"; // Status padrão se nenhum for informado
        }
        dataSolicitacao = LocalDateTime.now(); // Data de solicitação atual
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }

    // Construtores
    public Solicitacao() {
    }

    public Solicitacao(Long id, Paciente paciente, Exame exame, Solicitante solicitante, Convenio convenio, String status, String motivo, LocalDateTime dataSolicitacao, LocalDateTime dataAtualizacao, Usuario usuario) {
        this.id = id;
        this.paciente = paciente;
        this.exame = exame;
        this.solicitante = solicitante;
        this.convenio = convenio;
        this.status = status;
        this.motivo = motivo;
        this.dataSolicitacao = dataSolicitacao;
        this.dataAtualizacao = dataAtualizacao;
        this.usuario = usuario;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Exame getExame() {
        return exame;
    }

    public void setExame(Exame exame) {
        this.exame = exame;
    }

    public Solicitante getSolicitante() {
        return solicitante;
    }

    public void setSolicitante(Solicitante solicitante) {
        this.solicitante = solicitante;
    }

    public Convenio getConvenio() {
        return convenio;
    }

    public void setConvenio(Convenio convenio) {
        this.convenio = convenio;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDateTime dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
