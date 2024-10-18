package com.medflow.service;

import com.medflow.model.Solicitacao;
import com.medflow.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll();
    }


    public Optional<Solicitacao> buscarPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    public Solicitacao salvarSolicitacao(Solicitacao solicitacao) {
        if (solicitacao.getStatus() == null) {
            solicitacao.setStatus("Analise"); // Ou qualquer status inicial desejado
        }
        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao atualizarSolicitacao(Long id, Solicitacao solicitacaoAtualizada) {
        return solicitacaoRepository.findById(id).map(solicitacao -> {
            solicitacao.setStatus(solicitacaoAtualizada.getStatus());
            solicitacao.setMotivo(solicitacaoAtualizada.getMotivo());
            solicitacao.setPaciente(solicitacaoAtualizada.getPaciente());
            solicitacao.setExame(solicitacaoAtualizada.getExame());
            solicitacao.setSolicitante(solicitacaoAtualizada.getSolicitante());
            solicitacao.setConvenio(solicitacaoAtualizada.getConvenio());
            solicitacao.setUsuario(solicitacaoAtualizada.getUsuario());
            return solicitacaoRepository.save(solicitacao);
        }).orElse(null);
    }

    public void deletarSolicitacao(Long id) {
        solicitacaoRepository.deleteById(id);
    }
}
