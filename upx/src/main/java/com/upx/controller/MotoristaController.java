package com.upx.controller;

import com.upx.dto.MotoristaDTO;
import com.upx.model.entity.Motorista;
import com.upx.service.MotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/motoristas")
@CrossOrigin(origins = "*")
public class MotoristaController {

    @Autowired
    private MotoristaService service;

    @PostMapping
    public Motorista cadastrar(@RequestBody MotoristaDTO dto) {
        return service.cadastrar(dto);
    }

    // Verifica se um usuário já tem cadastro de motorista
    // GET /motoristas/verificar/1
    // Retorna 200 se tiver, 404 se não tiver
    // O frontend usa isso para decidir se redireciona para o cadastro ou não
    @GetMapping("/verificar/{usuarioId}")
    public ResponseEntity<Motorista> verificar(@PathVariable Long usuarioId) {
        return service.buscarPorUsuarioId(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}