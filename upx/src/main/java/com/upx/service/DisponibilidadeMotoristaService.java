package com.upx.service;

import com.upx.model.entity.DisponibilidadeMotorista;
import com.upx.model.entity.Usuario;
import com.upx.repository.DisponibilidadeMotoristaRepository;
import com.upx.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DisponibilidadeMotoristaService {

    @Autowired
    private DisponibilidadeMotoristaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public DisponibilidadeMotorista salvar(DisponibilidadeMotorista disponibilidade) {

        Long motoristaId = disponibilidade.getMotorista().getId();

        Usuario motorista = usuarioRepository.findById(motoristaId)
                .orElseThrow(() -> new RuntimeException("Motorista não encontrado"));

        disponibilidade.setMotorista(motorista);

        // Valida as datas
        if (disponibilidade.getDataInicio() == null || disponibilidade.getDataFim() == null) {
            throw new RuntimeException("Data de início e fim são obrigatórias");
        }

        if (disponibilidade.getDataFim().isBefore(disponibilidade.getDataInicio())) {
            throw new RuntimeException("Data de fim não pode ser anterior à data de início");
        }

        if (disponibilidade.getDataInicio().isBefore(LocalDate.now())) {
            throw new RuntimeException("Data de início não pode ser no passado");
        }

        if (disponibilidade.getDiasSemana() != null &&
            disponibilidade.getDiasSemana().isBlank()) {
            disponibilidade.setDiasSemana("DIA_UNICO");
        }

       
        List<DisponibilidadeMotorista> anteriores = repository.findByMotoristaId(motoristaId);
        for (DisponibilidadeMotorista anterior : anteriores) {
            if (anterior.isAtiva()) {
                anterior.setAtiva(false);
                repository.save(anterior);
            }
        }

        return repository.save(disponibilidade);
    }

    public List<DisponibilidadeMotorista> listarAtivas() {
        return repository.findAtivasNaoPasadas(LocalDate.now());
    }

    public List<DisponibilidadeMotorista> listarPorMotorista(Long motoristaId) {
        return repository.findByMotoristaId(motoristaId);
    }

    public DisponibilidadeMotorista desativar(Long id) {
        DisponibilidadeMotorista disp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disponibilidade não encontrada"));
        disp.setAtiva(false);
        return repository.save(disp);
    }
}