package com.upx.service;

import com.upx.model.entity.Usuario; 
import com.upx.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    //usa o email e a senha no construtor, vai usar o email como um id para localizar as 
    //informações e validar se o usuario esta cadastrado e se as senha coincide com a senha salva
    public Usuario validarLogin(String email, String senha) {
        Optional<Usuario> usuarioOpt = repository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Compara a senha enviada com a senha do banco
            if (usuario.getSenha().equals(senha)) {
                return usuario; // GG
            }
        }
        return null; // Falhou (usuário não existe ou a senha ta errada)
    }
}