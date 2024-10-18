package com.medflow.service;

import com.medflow.model.Paciente;
import com.medflow.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente salvarPaciente(Paciente paciente){
        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> buscarPorId(Long id){
        return pacienteRepository.findById(id);
    }

    public List<Paciente> listarTodos(){
        return pacienteRepository.findAll();
    }

    public void deletarPaciente(Long id){
        pacienteRepository.deleteById(id);
    }

    public Paciente buscarPorCpf(String cpf){
        return pacienteRepository.findByCpf(cpf);
    }
}
