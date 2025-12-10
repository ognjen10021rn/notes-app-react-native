package rs.ogisa.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import rs.ogisa.jwt.JwtFilter;
import rs.ogisa.services.CustomDetailsService;
import rs.ogisa.services.UserService;

@CrossOrigin("*")
@EnableWebSecurity
@EnableAsync
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserService userService;
    private final JwtFilter jwtFilter;
    private final AuthenticationSuccessHandlerController successHandler;


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        CustomDetailsService customDetailsService = new CustomDetailsService(userService);
        auth.userDetailsService(customDetailsService);
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {

        httpSecurity
                .cors()
                .and()
                .csrf()
                .disable()
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(successHandler)
                )
                .authorizeRequests()
                .antMatchers("/api/v1/user/auth/**").permitAll()
                .antMatchers("/api/v1/user/login/**").permitAll()
                .antMatchers("/swagger-ui/**").permitAll()
                .antMatchers("/ws/**").permitAll()
                .antMatchers("/noteMessage/**").permitAll()
                .antMatchers("/login/oauth2/code/github/**").permitAll()
                .antMatchers("/login/**").permitAll()
                .antMatchers("/update-note/**").permitAll()
                .antMatchers("/app/**").permitAll()
                .antMatchers("/").permitAll()
                .antMatchers("/login/**").permitAll()
                .antMatchers("/oauth2/**").permitAll()
                .antMatchers("/error").permitAll()
                .anyRequest().authenticated()
                .and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().headers()
                .frameOptions().disable();

        httpSecurity.addFilterBefore(this.jwtFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManager();
    }
}
