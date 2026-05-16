package com.upx.service;

import com.upx.model.entity.Corrida;
import com.upx.model.entity.Usuario;
import com.upx.model.enums.StatusCorrida;
import com.upx.repository.CorridaRepository;
import com.upx.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CorridaService {

    @Autowired
    private CorridaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Corrida criar(Corrida corrida) {
        return repository.save(corrida);
    }

    public List<Corrida> listarDisponiveis() {
        return repository.findByStatus(StatusCorrida.AGENDADA);
    }

    public Corrida buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Corrida não encontrada"));
    }

    public Corrida cancelar(Long id) {
        Corrida corrida = buscarPorId(id);
        corrida.setStatus(StatusCorrida.CANCELADA);
        return repository.save(corrida);
    }

    public Corrida finalizar(Long id) {
        Corrida corrida = buscarPorId(id);
        corrida.setStatus(StatusCorrida.CONCLUIDA);
        return repository.save(corrida);
    }

    // Busca uma corrida existente do motorista na data, ou retorna null
    // Usado pelo frontend para evitar criar corridas duplicadas
    public Corrida buscarPorMotoristaEData(Long motoristaId, LocalDate data) {
        return repository.findByMotoristaIdAndData(motoristaId, data).orElse(null);
    }

    public Corrida entrarNaCorrida(Long corridaId, Long usuarioId) {
        Corrida corrida = buscarPorId(corridaId);

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (corrida.getStatus() != StatusCorrida.AGENDADA) {
            throw new RuntimeException("Corrida não está disponível");
        }

        if (corrida.getMotorista().getId().equals(usuario.getId())) {
            throw new RuntimeException("Motorista não pode entrar na própria corrida");
        }

        if (corrida.getPassageiros().contains(usuario)) {
            throw new RuntimeException("Usuário já está nesta corrida");
        }

        if (corrida.getPassageiros().size() >= corrida.getVagasDisponiveis()) {
            throw new RuntimeException("Corrida lotada");
        }

        // Verifica se o passageiro já tem outra corrida neste mesmo dia
        if (corrida.getDataHora() != null) {
            LocalDate dataCorrida = corrida.getDataHora().toLocalDate();
            List<Corrida> corridasDoUsuario = repository.findByPassageirosId(usuarioId);

            boolean conflitoNoDia = corridasDoUsuario.stream()
                .filter(c -> c.getStatus() == StatusCorrida.AGENDADA)
                .filter(c -> c.getDataHora() != null)
                .anyMatch(c -> c.getDataHora().toLocalDate().equals(dataCorrida));

            if (conflitoNoDia) {
                throw new RuntimeException("Você já tem uma corrida agendada neste dia");
            }
        }

        corrida.getPassageiros().add(usuario);
        return repository.save(corrida);
    }

    public List<Corrida> listarPorPassageiro(Long usuarioId) {
        return repository.findByPassageirosId(usuarioId);
    }
}