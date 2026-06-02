package com.upx.repository;

import com.upx.model.entity.DisponibilidadeMotorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DisponibilidadeMotoristaRepository
        extends JpaRepository<DisponibilidadeMotorista, Long> {

    @Query("SELECT d FROM DisponibilidadeMotorista d WHERE d.ativa = true AND d.dataFim >= :hoje")
    List<DisponibilidadeMotorista> findAtivasNaoPasadas(@Param("hoje") LocalDate hoje);

    List<DisponibilidadeMotorista> findByMotoristaId(Long motoristaId);
}