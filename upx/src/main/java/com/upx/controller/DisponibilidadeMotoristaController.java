package com.upx.controller;

import com.upx.model.entity.DisponibilidadeMotorista;
import com.upx.service.DisponibilidadeMotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disponibilidades")
@CrossOrigin
public class DisponibilidadeMotoristaController {

    @Autowired
    private DisponibilidadeMotoristaService service;

    // Salva a disponibilidade do motorista
    // POST /disponibilidades
    // Body: { "motorista": { "id": 1 }, "diasSemana": "SEG,TER,QUA,QUI,SEX",
    //         "pontoPartida": "Centro", "horarioIda": "19:00",
    //         "horarioVolta": "23:00", "vagasDisponiveis": 2 }
    @PostMapping
    public DisponibilidadeMotorista salvar(@RequestBody DisponibilidadeMotorista disponibilidade) {
        return service.salvar(disponibilidade);
    }

    // Lista todas as disponibilidades ativas — painel passageiro
    // GET /disponibilidades
    @GetMapping
    public List<DisponibilidadeMotorista> listarAtivas() {
        return service.listarAtivas();
    }

    // Lista disponibilidades de um motorista específico — painel motorista
    // GET /disponibilidades/motorista/1
    @GetMapping("/motorista/{motoristaId}")
    public List<DisponibilidadeMotorista> listarPorMotorista(@PathVariable Long motoristaId) {
        return service.listarPorMotorista(motoristaId);
    }

    // Desativa uma disponibilidade
    // PUT /disponibilidades/1/desativar
    @PutMapping("/{id}/desativar")
    public DisponibilidadeMotorista desativar(@PathVariable Long id) {
        return service.desativar(id);
    }
}