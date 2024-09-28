package com.medflow.service;

import com.medflow.model.Convenio;
import com.medflow.repository.ConvenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConvenioService {

    @Autowired
    private ConvenioRepository convenioRepository;

    // Método para listar todos os convênios
    public List<Convenio> listarTodosConvenios() {
        return convenioRepository.findAll();
    }

    // Método para salvar ou atualizar um convênio
    public Convenio salvarConvenio(Convenio convenio) {
        return convenioRepository.save(convenio);
    }

    // Método para deletar um convênio pelo ID
    public void deletarConvenio(Long id) {
        convenioRepository.deleteById(id);
    }

    // Método para buscar um convênio pelo ID
    public Optional<Convenio> buscarPorId(Long id) {
        return convenioRepository.findById(id);
    }
}
