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
                .authorizeHttpRequests()
                .requestMatchers("/api/convenios").permitAll()  // Permitir acesso público ao endpoint de convênios
                .anyRequest().authenticated()                  // Exigir autenticação para os demais endpoints
                .and()
                .httpBasic(); // Você pode usar outro método de autenticação aqui se necessário.

        return http.build();
    }
}
