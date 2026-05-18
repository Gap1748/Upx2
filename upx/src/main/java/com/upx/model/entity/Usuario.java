package com.upx.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


//basicamente uma table do banco de dados só que em java e com os getter e setter aqui
//obs: segundo o pfsor Edson , só de existir esse cód ja cria a table , não entendi direito, testar depois
//testado, n fiz mais nenhuma table escrita no sql
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo")
    
    private String nomeCompleto;

    private String cpf;
    private String ra;
    private String email;
    private String telefone;
    private String endereco;
    private String senha;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    // getters e setters

    public Long getId() { return id; }

    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getRa() { return ra; }
    public void setRa(String ra) { this.ra = ra; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}