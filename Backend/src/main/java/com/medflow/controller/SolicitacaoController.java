package com.medflow.controller;

import com.medflow.model.Solicitacao;
import com.medflow.service.SolicitacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    // Listar todas as solicitações
    @GetMapping
    public List<Solicitacao> listarSolicitacoes() {
        return solicitacaoService.listarTodas();
    }

    // Buscar solicitação por ID
    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id) {
        Optional<Solicitacao> solicitacao = solicitacaoService.buscarPorId(id);
        return solicitacao.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar uma nova solicitação
    @PostMapping
    public ResponseEntity<Solicitacao> criarSolicitacao(@RequestBody Solicitacao solicitacao) {

        if (solicitacao.getStatus() == null) {
            solicitacao.setStatus("Analise"); // Garantir um status padrão
        }

        Solicitacao novaSolicitacao = solicitacaoService.salvarSolicitacao(solicitacao);
        return ResponseEntity.ok(novaSolicitacao);
    }

    // Atualizar uma solicitação
    @PutMapping("/{id}")
    public ResponseEntity<Solicitacao> atualizarSolicitacao(@PathVariable Long id, @RequestBody Solicitacao solicitacaoAtualizada) {
        Solicitacao solicitacao = solicitacaoService.atualizarSolicitacao(id, solicitacaoAtualizada);
        return solicitacao != null ? ResponseEntity.ok(solicitacao) : ResponseEntity.notFound().build();
    }

    // Deletar uma solicitação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarSolicitacao(@PathVariable Long id) {
        solicitacaoService.deletarSolicitacao(id);
        return ResponseEntity.noContent().build();
    }
}
