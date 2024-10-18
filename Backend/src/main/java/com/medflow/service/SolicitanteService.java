package com.medflow.service;

import com.medflow.model.Solicitante;
import com.medflow.repository.SolicitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitanteService{

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    public Solicitante salvarSolicitante(Solicitante solicitante){
        return solicitanteRepository.save(solicitante);
    }

    public Optional<Solicitante> buscarPorId(Long id){
        return solicitanteRepository.findById(id);
    }

    public List<Solicitante> listarTodos(){
        return solicitanteRepository.findAll();
    }

    public void deletarSolicitante(Long id){
        solicitanteRepository.deleteById(id);
    }


}
