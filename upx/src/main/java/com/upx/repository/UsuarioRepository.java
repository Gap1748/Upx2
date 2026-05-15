package com.upx.repository;

import com.upx.model.entity.Usuario; 
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Uso para não dar problema caso tente uma validação sem um valor

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    

}