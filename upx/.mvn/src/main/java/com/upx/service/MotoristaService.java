package com.upx.service;

import com.upx.dto.MotoristaDTO;
import com.upx.model.entity.Motorista;
import com.upx.model.entity.Usuario;
import com.upx.repository.MotoristaRepository;
import com.upx.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MotoristaService {

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Motorista cadastrar(MotoristaDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Motorista motorista = new Motorista();
        motorista.setCnh(dto.getCnh());
        motorista.setPlaca(dto.getPlaca());
        motorista.setUsuario(usuario);

        return motoristaRepository.save(motorista);
    }
}