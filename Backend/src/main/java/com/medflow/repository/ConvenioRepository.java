package com.medflow.repository;

import com.medflow.model.Convenio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConvenioRepository extends JpaRepository<Convenio, Long> {
    // Encontrar convention pelo Id (consulta customizada)
    Optional<Convenio> findByid(Long id);
}
