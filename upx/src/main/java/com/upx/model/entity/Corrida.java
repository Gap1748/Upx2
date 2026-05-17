package com.upx.model.entity;
import com.upx.model.enums.StatusCorrida;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;


//por enquanto essa entidade se tornou inutil, por conta de mudanças e de como o front ficou no final então fez mais sentido
//criar a disponibilidae do motorista ao inves de quebrar a cabeça para usar esse.



@Entity // Indica que essa classe é uma tabela no banco
@Table(name = "corridas") // Nome da tabela (opcional, mas recomendado)
public class Corrida {

    //ID da corrida (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Motorista da corrida
    // Muitos registros de corrida podem ter 1 motorista
    @ManyToOne
    @JoinColumn(name = "motorista_id", nullable = false)
    private Usuario motorista;

    // Passageiros da corrida 
    // Uma corrida pode ter vários passageiros
    @ManyToMany
    @JoinTable(
        name = "corrida_passageiros", // tabela intermediária
        joinColumns = @JoinColumn(name = "corrida_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> passageiros = new ArrayList<>();

    //Origem da corrida
    @Column(nullable = false)
    private String origem;

    //Destino da corrida
    @Column(nullable = false)
    private String destino;

    //Data e hora da corrida
    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    //Número de vagas disponíveis
    @Column(name = "vagas_disponiveis", nullable = false)
    private int vagasDisponiveis;

    // Status da corrida 
    @Enumerated(EnumType.STRING) 

    // Salva o enum como texto no banco
    @Column(nullable = false)
    private StatusCorrida status;

    // Data de criação 
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    // Atualização automática antes de salvar
    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.status = StatusCorrida.AGENDADA; // padrão ao criar
    }

    // getters e setters

    public Long getId() {
        return id;
    }

    public Usuario getMotorista() {
        return motorista;
    }

    public void setMotorista(Usuario motorista) {
        this.motorista = motorista;
    }

    public List<Usuario> getPassageiros() {
        return passageiros;
    }

    public void setPassageiros(List<Usuario> passageiros) {
        this.passageiros = passageiros;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public int getVagasDisponiveis() {
        return vagasDisponiveis;
    }

    public void setVagasDisponiveis(int vagasDisponiveis) {
        this.vagasDisponiveis = vagasDisponiveis;
    }

    public StatusCorrida getStatus() {
        return status;
    }

    public void setStatus(StatusCorrida status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
}