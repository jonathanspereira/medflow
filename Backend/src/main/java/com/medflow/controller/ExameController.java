package com.medflow.controller;

import com.medflow.model.Exame;
import com.medflow.service.ExameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exames")
public class ExameController {

    @Autowired
    private ExameService exameService;

    // Criar um novo exame
    @PostMapping
    public Exame criarExame(@RequestBody Exame exame) {
        return exameService.salvarExame(exame);
    }

    // Buscar um exame por ID
    @GetMapping("/{id}")
    public ResponseEntity<Exame> buscarExamePorId(@PathVariable Long id) {
        return exameService.buscarPorId(id)
                .map(exame -> ResponseEntity.ok().body(exame))
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar todos os exames
    @GetMapping
    public List<Exame> listarTodosOsExames() {
        return exameService.listarTodos();
    }

    // Atualizar um exame
    @PutMapping("/{id}")
    public ResponseEntity<Exame> atualizarExame(@PathVariable Long id, @RequestBody Exame exameAtualizado) {
        return exameService.buscarPorId(id).map(exameExistente -> {
            exameExistente.setTipoExame(exameAtualizado.getTipoExame());
            exameExistente.setDescricao(exameAtualizado.getDescricao());
            exameExistente.setCodigo(exameAtualizado.getCodigo());
            Exame exameSalvo = exameService.salvarExame(exameExistente);
            return ResponseEntity.ok().body(exameSalvo);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Deletar um exame
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarExame(@PathVariable Long id) {
        return exameService.buscarPorId(id).map(exame -> {
            exameService.deletarExame(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
