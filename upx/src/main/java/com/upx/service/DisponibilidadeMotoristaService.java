package com.upx.service;

import com.upx.model.entity.DisponibilidadeMotorista;
import com.upx.model.entity.Usuario;
import com.upx.repository.DisponibilidadeMotoristaRepository;
import com.upx.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisponibilidadeMotoristaService {

    @Autowired
    private DisponibilidadeMotoristaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Salva a disponibilidade de um motorista
    // Antes de salvar, desativa qualquer disponibilidade anterior dele
    // para não acumular registros duplicados
    public DisponibilidadeMotorista salvar(DisponibilidadeMotorista disponibilidade) {

        Long motoristaId = disponibilidade.getMotorista().getId();

        // Verifica se o motorista existe
        Usuario motorista = usuarioRepository.findById(motoristaId)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado"));

        disponibilidade.setMotorista(motorista);

        // Desativa disponibilidades anteriores do mesmo motorista
        // assim ele só tem uma disponibilidade ativa por vez (faz sentido no MVP)
        List<DisponibilidadeMotorista> anteriores =
                repository.findByMotoristaId(motoristaId);

        for (DisponibilidadeMotorista anterior : anteriores) {
            if (anterior.isAtiva()) {
                anterior.setAtiva(false);
                repository.save(anterior);
            }
        }

        return repository.save(disponibilidade);
    }

    // Lista todas as disponibilidades ativas — usado no painel passageiro
    public List<DisponibilidadeMotorista> listarAtivas() {
        return repository.findByAtivaTrue();
    }

    // Busca as disponibilidades de um motorista específico — usado no painel motorista
    public List<DisponibilidadeMotorista> listarPorMotorista(Long motoristaId) {
        return repository.findByMotoristaId(motoristaId);
    }

    // Desativa uma disponibilidade (motorista pausou a oferta)
    public DisponibilidadeMotorista desativar(Long id) {
        DisponibilidadeMotorista disp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disponibilidade não encontrada"));
        disp.setAtiva(false);
        return repository.save(disp);

        
    }
}