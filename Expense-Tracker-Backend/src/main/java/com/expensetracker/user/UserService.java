package com.expensetracker.user;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    public User authenticate(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.emptyList())
                .build();
    }

    public User OAuthSignUp(String username) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(username));
        user.setRole("USER");

        if (!userRepository.existsByUsername(username)) {
            user = userRepository.save(user);
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, username));
        SecurityContextHolder.getContext().setAuthentication(auth);
        return user;
    }

    public String register(String username, String password,
                           HttpServletResponse response,
                           JwtEncoder jwtEncoder) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        if (!userRepository.existsByUsername(username)) {
            userRepository.save(user);
        }
        user.setPassword(password);
        return loginUser(username, password, response, jwtEncoder);
    }

    public String loginUser(String username, String password,
                            HttpServletResponse response,
                            JwtEncoder jwtEncoder){
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(auth);

        Jwt jwt = setJwt(username, jwtEncoder);
        String json = setJwtAndResponse(response, jwt);
        return json;
    }

    public String setJwtAndResponse(HttpServletResponse response, Jwt jwt) {
        int expirySeconds = 3600;

        Cookie cookie = new Cookie("access_token", jwt.getTokenValue());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setDomain("localhost");
        cookie.setMaxAge(expirySeconds);
        response.addCookie(cookie);

        return String.format("{\"access_token\":\"%s\", \"expires_in\":%d}", jwt.getTokenValue(), expirySeconds);
    }

    public Jwt setJwt(String username, JwtEncoder jwtEncoder) {
        int expirySeconds = 3600;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(username)
                .expiresAt(Instant.now().plusSeconds(expirySeconds))
                .build();

        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims));
    }
    public void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setDomain("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

}
