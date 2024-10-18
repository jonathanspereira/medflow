package com.medflow.controller;


import com.medflow.model.Paciente;
import com.medflow.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // Criar um novo paciente
    @PostMapping
    public Paciente criarPaciente(@RequestBody Paciente paciente) {
        return pacienteService.salvarPaciente(paciente);
    }

    // Buscar um paciente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPacientePorId(@PathVariable Long id) {
        return pacienteService.buscarPorId(id)
                .map(paciente -> ResponseEntity.ok().body(paciente))
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar um paciente por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Paciente> buscarPacientePorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok().body(pacienteService.buscarPorCpf(cpf));
    }

    // Listar todos os pacientes
    @GetMapping
    public List<Paciente> listarTodosOsPacientes() {
        return pacienteService.listarTodos();
    }

    // Atualizar um paciente
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizarPaciente(@PathVariable Long id, @RequestBody Paciente pacienteAtualizado) {
        return pacienteService.buscarPorId(id).map(pacienteExistente -> {
            pacienteExistente.setNome(pacienteAtualizado.getNome());
            pacienteExistente.setCpf(pacienteAtualizado.getCpf());
            pacienteExistente.setTelefone(pacienteAtualizado.getTelefone());
            pacienteExistente.setEmail(pacienteAtualizado.getEmail());
            Paciente pacienteSalvo = pacienteService.salvarPaciente(pacienteExistente);
            return ResponseEntity.ok().body(pacienteSalvo);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Deletar um paciente
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarPaciente(@PathVariable Long id) {
        return pacienteService.buscarPorId(id).map(paciente -> {
            pacienteService.deletarPaciente(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
