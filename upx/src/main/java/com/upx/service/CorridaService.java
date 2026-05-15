package com.upx.service;

import com.upx.model.entity.Corrida;
import com.upx.model.entity.Usuario;
import com.upx.model.enums.StatusCorrida;
import com.upx.repository.CorridaRepository;
import com.upx.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CorridaService {

    @Autowired
    private CorridaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    //agora o dificil...
    public Corrida entrarNaCorrida(Long corridaId, Long usuarioId) {

    Corrida corrida = buscarPorId(corridaId);

    Usuario usuario = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        // acho que ja ultilizei em outras partes do código mas caso quem estiver lendo não saibda o que é o -> é expressão lambda que basicamente 
        //cria uma função em 1 linha que retorna o que esta a direita do ->.

    // não pode entrar se não estiver agendada
    if (corrida.getStatus() != StatusCorrida.AGENDADA) {
        throw new RuntimeException("Corrida não está disponível");
    }

    // motorista não pode entrar como passageiro
    if (corrida.getMotorista().getId().equals(usuario.getId())) {
        throw new RuntimeException("Motorista não pode entrar na própria corrida");
    }

    // evita duplicado
    if (corrida.getPassageiros().contains(usuario)) {
        throw new RuntimeException("Usuário já está na corrida");
    }
    //não deixa entrar em uma corrida lotada
    if (corrida.getPassageiros().size() >= corrida.getVagasDisponiveis()) {
    throw new RuntimeException("Corrida lotada");
    }

    // adiciona um passageiro (finalmente)
    corrida.getPassageiros().add(usuario);

   
    return repository.save(corrida);
}
}

