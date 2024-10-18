package com.medflow.repository;


import com.medflow.model.Solicitante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitanteRepository extends JpaRepository<Solicitante, Long> {
    // Encontrar solicitante pelo Id (consulta customizada)
    Solicitante findByid(Long id);

    // Encontrar solicitante pelo crm (consulta customizada)
    Solicitante findByCrm(String crm);
}
