package com.upx.controller;

import com.upx.dto.MotoristaDTO;
import com.upx.model.entity.Motorista;
import com.upx.service.MotoristaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/motoristas")
@CrossOrigin
public class MotoristaController {

    @Autowired
    private MotoristaService service;

    @PostMapping
    public Motorista cadastrar(@RequestBody MotoristaDTO dto) {
        return service.cadastrar(dto);
    }
}