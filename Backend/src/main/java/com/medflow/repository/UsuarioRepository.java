package com.medflow.repository;

import com.medflow.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Encontrar usuário pelo Id (consulta customizada)
    Usuario findByid(Long id);

    // Encontrar usuário pelo email (consulta customizada)
    Usuario findByEmail(String email);

}
