package com.upx.service;

import com.upx.model.entity.Corrida;
import com.upx.model.enums.StatusCorrida;
import com.upx.repository.CorridaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CorridaService {

    @Autowired
    private CorridaRepository repository;

    //Cria uma corrida
    public Corrida criar(Corrida corrida) {
        return repository.save(corrida);
    }

    //Lista as corridas disponíveis
    public List<Corrida> listarDisponiveis() {
        return repository.findByStatus(StatusCorrida.AGENDADA);
    }

    //Busca uma corrida por ID
    public Corrida buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Corrida não encontrada"));
    }

    //Cancela uma corrida
    public Corrida cancelar(Long id) {
        Corrida corrida = buscarPorId(id);
        corrida.setStatus(StatusCorrida.CANCELADA);
        return repository.save(corrida);
    }

    //Finaliza uma corrida
    public Corrida finalizar(Long id) {
        Corrida corrida = buscarPorId(id);
        corrida.setStatus(StatusCorrida.CONCLUIDA);
        return repository.save(corrida);
    }
}