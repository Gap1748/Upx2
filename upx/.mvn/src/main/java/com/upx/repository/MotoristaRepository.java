package com.upx.repository;

import com.upx.model.entity.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
}