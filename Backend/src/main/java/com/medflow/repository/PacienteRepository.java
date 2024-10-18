package com.medflow.repository;

import com.medflow.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    // Encontrar paciente pelo Id (consulta customizada)
    Paciente findByid(Long id);

    // Encontrar paciente pelo cpf (consulta customizada)
    Paciente findByCpf(String cpf);
}
