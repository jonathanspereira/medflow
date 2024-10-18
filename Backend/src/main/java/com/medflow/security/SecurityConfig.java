package com.medflow.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/convenios/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a convenios
                        .requestMatchers("/api/usuarios/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a usuarios
                        .requestMatchers("/api/profissionais/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a profissionais
                        .requestMatchers("/api/pacientes/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a pacientes
                        .requestMatchers("/api/solicitacoes/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a solicitacao
                        .anyRequest().authenticated()  // Exigir autenticação para outros endpoints
                )
                .httpBasic(customizer -> {});  // Autenticação básica

        return http.build();
    }
}
