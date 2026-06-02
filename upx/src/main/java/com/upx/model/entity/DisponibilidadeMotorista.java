package com.upx.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "disponibilidades_motorista")
public class DisponibilidadeMotorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "motorista_id", nullable = false)
    private Usuario motorista;


    @Column(name = "dias_semana")
    private String diasSemana;

    @Column(name = "ponto_partida", nullable = false)
    private String pontoPartida;

    @Column(name = "horario_ida", nullable = false)
    private String horarioIda;

    @Column(name = "horario_volta")
    private String horarioVolta;

    @Column(name = "vagas_disponiveis", nullable = false)
    private int vagasDisponiveis;


    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(nullable = false)
    private boolean ativa = true;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.ativa = true;
    }

    // Getters e Setters

    public Long getId() { return id; }

    public Usuario getMotorista() { return motorista; }
    public void setMotorista(Usuario motorista) { this.motorista = motorista; }

    public String getDiasSemana() { return diasSemana; }
    public void setDiasSemana(String diasSemana) { this.diasSemana = diasSemana; }

    public String getPontoPartida() { return pontoPartida; }
    public void setPontoPartida(String pontoPartida) { this.pontoPartida = pontoPartida; }

    public String getHorarioIda() { return horarioIda; }
    public void setHorarioIda(String horarioIda) { this.horarioIda = horarioIda; }

    public String getHorarioVolta() { return horarioVolta; }
    public void setHorarioVolta(String horarioVolta) { this.horarioVolta = horarioVolta; }

    public int getVagasDisponiveis() { return vagasDisponiveis; }
    public void setVagasDisponiveis(int vagasDisponiveis) { this.vagasDisponiveis = vagasDisponiveis; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public boolean isAtiva() { return ativa; }
    public void setAtiva(boolean ativa) { this.ativa = ativa; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
}