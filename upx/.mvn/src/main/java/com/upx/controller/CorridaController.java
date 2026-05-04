package com.upx.controller;

import com.upx.model.entity.Corrida;
import com.upx.service.CorridaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/corridas")
@CrossOrigin
public class CorridaController {

    @Autowired
    private CorridaService service;

    //Criar corrida
    @PostMapping
    public Corrida criar(@RequestBody Corrida corrida) {
        return service.criar(corrida);
    }

    //Listar corridas disponíveis
    @GetMapping
    public List<Corrida> listar() {
        return service.listarDisponiveis();
    }

    //Buscar por ID
    @GetMapping("/{id}")
    public Corrida buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    //Cancelar corrida
    @PutMapping("/{id}/cancelar")
    public Corrida cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }

    //Finalizar corrida
    @PutMapping("/{id}/finalizar")
    public Corrida finalizar(@PathVariable Long id) {
        return service.finalizar(id);
    }
}