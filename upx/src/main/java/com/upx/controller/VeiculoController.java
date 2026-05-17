package com.upx.controller;

import com.upx.model.entity.Motorista;
import com.upx.model.entity.Veiculo;
import com.upx.repository.MotoristaRepository;
import com.upx.repository.VeiculoRepository;
import com.upx.dto.VeiculoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin
public class VeiculoController {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private MotoristaRepository motoristaRepository;

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody VeiculoDTO dto) {

        Optional<Motorista> motoristaOptional =
                motoristaRepository.findById(dto.getMotoristaId());

        if (motoristaOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Motorista não encontrado");
        }

        Veiculo veiculo = new Veiculo();

        veiculo.setPlaca(dto.getPlaca());
        veiculo.setMarca(dto.getMarca());
        veiculo.setModelo(dto.getModelo());
        veiculo.setCor(dto.getCor());
        veiculo.setAno(dto.getAno());

        veiculo.setMotorista(motoristaOptional.get());

        Veiculo salvo = veiculoRepository.save(veiculo);

        return ResponseEntity.ok(salvo);
    }
}