package com.ifba.clinic.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;
    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                    // recursos públicos / docs
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    
                    // endpoints de autenticação públicos
                    .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register").permitAll()
                    
                    // qualquer usuário autenticado pode alterar sua própria senha
                    .requestMatchers(HttpMethod.PATCH, "/user/change-password").authenticated()
                    
                    // PERMISSÕES GERAIS
                    .requestMatchers(HttpMethod.GET, "/appointment/all").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN", "MASTER")
                    .requestMatchers(HttpMethod.GET, "/appointment/{id}").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN", "MASTER")
                    .requestMatchers(HttpMethod.POST, "/appointment/schedule").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN", "MASTER")
                    .requestMatchers(HttpMethod.PATCH, "/appointment/cancel").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN", "MASTER")
                    .requestMatchers(HttpMethod.GET, "/doctor/all").hasAnyAuthority("PATIENT", "DOCTOR", "ADMIN", "MASTER")

                    // PERMISSÕES ADICIONAIS PARA MÉDICOS E ADMINs
                    .requestMatchers(HttpMethod.PATCH, "/appointment/conclude").hasAnyAuthority("DOCTOR", "ADMIN", "MASTER")
                    .requestMatchers(HttpMethod.GET, "/patient/all").hasAnyAuthority( "DOCTOR", "ADMIN", "MASTER")

                    // PERMISSÕES PARA ADMIN/MASTER
                    .requestMatchers("/user/**").hasAnyAuthority("ADMIN", "MASTER")
                    .requestMatchers("/patient/**").hasAnyAuthority("ADMIN", "MASTER")
                    .requestMatchers("/doctor/**").hasAnyAuthority("ADMIN", "MASTER")
                    .requestMatchers("/monitoring/**").hasAnyAuthority("ADMIN", "MASTER")

                    // qualquer outro request exige autenticação
                    .anyRequest().authenticated()
            )
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); 
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Pra usar Cookies no futuro
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
