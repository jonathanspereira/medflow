package com.medflow.service;

import com.medflow.model.Exame;
import com.medflow.repository.ExameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExameService {

    @Autowired
    private ExameRepository exameRepository;

    // Criar ou atualizar um exame
    public Exame salvarExame(Exame exame) {
        return exameRepository.save(exame);
    }

    // Buscar um exame por ID
    public Optional<Exame> buscarPorId(Long id) {
        return exameRepository.findById(id);
    }

    // Buscar todos os exames
    public List<Exame> listarTodos() {
        return exameRepository.findAll();
    }

    // Deletar um exame por ID
    public void deletarExame(Long id) {
        exameRepository.deleteById(id);
    }
}
