package com.upx.controller;

import com.upx.model.entity.Corrida;
import com.upx.service.CorridaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/corridas")
@CrossOrigin
public class CorridaController {

    @Autowired
    private CorridaService service;

    // Criar corrida
    @PostMapping
    public Corrida criar(@RequestBody Corrida corrida) {
        return service.criar(corrida);
    }

    // Listar corridas disponíveis
    @GetMapping
    public List<Corrida> listar() {
        return service.listarDisponiveis();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public Corrida buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // Cancelar corrida
    @PutMapping("/{id}/cancelar")
    public Corrida cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }

    // Finalizar corrida
    @PutMapping("/{id}/finalizar")
    public Corrida finalizar(@PathVariable Long id) {
        return service.finalizar(id);
    }

    // Entrar em corrida
    @PostMapping("/{corridaId}/entrar/{usuarioId}")
    public Corrida entrarNaCorrida(
            @PathVariable Long corridaId,
            @PathVariable Long usuarioId
    ) {
        return service.entrarNaCorrida(corridaId, usuarioId);
    }
    // Retorna todas as corridas que um usuario esta. vai ser usado no calendario
     @GetMapping("/passageiro/{usuarioId}")
    public List<Corrida> listarPorPassageiro(@PathVariable Long usuarioId) {
        return service.listarPorPassageiro(usuarioId);
    }

    // Busca corrida existente de um motorista em uma data específica
    // retorna 200 com a corrida se existir, 404 se não existir, com isso da para fazer um aviso melhor
    // usado pelo frontend para evitar criar corridas duplicadas
    @GetMapping("/motorista/{motoristaId}/data/{data}")
    public ResponseEntity<Corrida> buscarPorMotoristaEData(
            @PathVariable Long motoristaId,
            @PathVariable String data
    ) {
        LocalDate localDate = LocalDate.parse(data); // espera "YYYY-MM-DD"
        Corrida corrida = service.buscarPorMotoristaEData(motoristaId, localDate);
        return corrida != null
            ? ResponseEntity.ok(corrida)
            : ResponseEntity.notFound().build();
    }
}