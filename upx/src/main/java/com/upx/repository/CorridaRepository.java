package com.upx.repository;

import com.upx.model.entity.Corrida;
import com.upx.model.enums.StatusCorrida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;//espero que funcione


@Repository
public interface CorridaRepository extends JpaRepository<Corrida, Long> {

    // lista corridas por status
    List<Corrida> findByStatus(StatusCorrida status);

    // busca corridas onde o usuário está na lista de passageiros
    List<Corrida> findByPassageirosId(Long usuarioId);

    // Busca uma corrida agendada de um motorista em uma data específica
    // usando para evitar criar corridas duplicadas para a mesma disponibilidade como estava acontecendo 
    @Query("SELECT c FROM Corrida c WHERE c.motorista.id = :motoristaId " +
           "AND c.status = 'AGENDADA' " +
           "AND CAST(c.dataHora AS date) = :data")
    Optional<Corrida> findByMotoristaIdAndData(
        @Param("motoristaId") Long motoristaId,
        @Param("data") LocalDate data
    );
}