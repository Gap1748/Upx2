package com.upx.repository;

import com.upx.model.entity.DisponibilidadeMotorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// O professor mencionou que o Spring cria as queries automaticamente
// pelo nome do método — é isso mesmo, se chama "Derived Queries"
@Repository
public interface DisponibilidadeMotoristaRepository
        extends JpaRepository<DisponibilidadeMotorista, Long> {

    // Busca todas as disponibilidades ativas (para o painel passageiro)
    List<DisponibilidadeMotorista> findByAtivaTrue();

    // Busca as disponibilidades de um motorista específico
    List<DisponibilidadeMotorista> findByMotoristaId(Long motoristaId);
}