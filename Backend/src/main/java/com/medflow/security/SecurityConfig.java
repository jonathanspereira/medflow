package com.medflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Desabilitar CSRF temporariamente para facilitar os testes com POST
                .authorizeHttpRequests()
                .requestMatchers("/api/agreements/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a convenios
                .requestMatchers("/api/users/**").permitAll()  // Permitir acesso público a todos os endpoints relacionados a usuarios
                .anyRequest().authenticated()  // Exigir autenticação para outros endpoints
                .and()
                .httpBasic();  // Autenticação básica

        return http.build();
    }
}
