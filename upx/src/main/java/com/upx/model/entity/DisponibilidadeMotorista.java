package com.upx.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Guarda a disponibilidade recorrente do motorista para funcionar com a ideia do frontend
// Ex: "Toda Seg a Sex, saindo às 19h do Centro, com 2 vagas"
// É diferente de Corrida — Corrida é uma viagem que vai acontecer/aconteceu
// Disponibilidade é o "estou disponível para oferecer carona nesse padrão"
// Foi necessario adicionar pois o frontend seguiu por um caminho diferente do inicial. por enquanto Corrida esta inutil.
@Entity
@Table(name = "disponibilidades_motorista")
public class DisponibilidadeMotorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Motorista que está oferecendo a carona
    @ManyToOne
    @JoinColumn(name = "motorista_id", nullable = false)
    private Usuario motorista;

    // Dias da semana separados por vírgula
    // Ex: "SEG,TER,QUA,QUI,SEX"
    @Column(name = "dias_semana", nullable = false)
    private String diasSemana;

    // Ponto de partida (origem)
    @Column(name = "ponto_partida", nullable = false)
    private String pontoPartida;

    // Horário de saída para a instituição
    // Guardado como String "HH:mm" para simplicidade no MVP
    @Column(name = "horario_ida", nullable = false)
    private String horarioIda;

    // Horário de saída da instituição (volta)
    @Column(name = "horario_volta")
    private String horarioVolta;

    // Quantas vagas o motorista oferece
    @Column(name = "vagas_disponiveis", nullable = false)
    private int vagasDisponiveis;

    // Se a disponibilidade ainda está ativa
    // false = motorista pausou / desativou
    @Column(nullable = false)
    private boolean ativa = true;

    // Preenchido automaticamente ao criar
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

    public boolean isAtiva() { return ativa; }
    public void setAtiva(boolean ativa) { this.ativa = ativa; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
}