package com.medflow.controller;


import com.medflow.model.Solicitante;
import com.medflow.service.SolicitanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profissionais")
public class SolicitanteController {

    @Autowired
    private SolicitanteService solicitanteService;

    // Criar um novo solicitante
    @PostMapping
    public Solicitante criarSolicitante(@RequestBody Solicitante solicitante) {
        return solicitanteService.salvarSolicitante(solicitante);
    }

    // Buscar um solicitante por ID
    @GetMapping("/{id}")
    public ResponseEntity<Solicitante> buscarSolicitantePorId(@PathVariable Long id) {
        return solicitanteService.buscarPorId(id)
                .map(solicitante -> ResponseEntity.ok().body(solicitante))
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar todos os solicitantes
    @GetMapping
    public List<Solicitante> listarTodosOsSolicitantes() {
        return solicitanteService.listarTodos();
    }

    // Atualizar um solicitante
    @PutMapping("/{id}")
    public ResponseEntity<Solicitante> atualizarSolicitante(@PathVariable Long id, @RequestBody Solicitante solicitanteAtualizado) {
        return solicitanteService.buscarPorId(id).map(solicitanteExistente -> {
            solicitanteExistente.setNome(solicitanteAtualizado.getNome());
            solicitanteExistente.setCrm(solicitanteAtualizado.getCrm());
            solicitanteExistente.setUf(solicitanteAtualizado.getUf());
            solicitanteExistente.setEspecialidade(solicitanteAtualizado.getEspecialidade());
            Solicitante solicitanteSalvo = solicitanteService.salvarSolicitante(solicitanteExistente);
            return ResponseEntity.ok().body(solicitanteSalvo);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Deletar um solicitante
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarSolicitante(@PathVariable Long id) {
        return solicitanteService.buscarPorId(id).map(solicitante -> {
            solicitanteService.deletarSolicitante(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
