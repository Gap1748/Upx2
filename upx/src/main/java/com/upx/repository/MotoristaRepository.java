package com.upx.repository;

import com.upx.model.entity.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MotoristaRepository extends JpaRepository<Motorista, Long> {


    Optional<Motorista> findByUsuarioId(Long usuarioId);
}