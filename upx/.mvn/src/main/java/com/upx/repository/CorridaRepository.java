package com.upx.repository;

import com.upx.model.entity.Corrida;
import com.upx.model.enums.StatusCorrida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface CorridaRepository extends JpaRepository<Corrida, Long> {

    // Buscar corridas por status (ex: AGENDADA)
    List<Corrida> findByStatus(StatusCorrida status);
}
