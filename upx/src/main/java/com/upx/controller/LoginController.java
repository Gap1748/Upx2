package com.upx.controller;

import com.upx.dto.LoginDTO;
import com.upx.model.entity.Usuario;
import com.upx.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class LoginController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/login")
    public Usuario login(@RequestBody LoginDTO dto) {
        return service.validarLogin(dto.getEmail(), dto.getSenha());
    }
}