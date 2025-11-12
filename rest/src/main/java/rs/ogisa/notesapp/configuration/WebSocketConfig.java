package rs.ogisa.notesapp.configuration;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Use the built-in message broker for subscriptions and broadcasting and
        // route messages whose destination header begins with /topic or /queue to the broker
        registry.enableSimpleBroker("/topic", "/queue");

        // STOMP messages whose destination header begins with /app are routed to
        // @MessageMapping methods in @Controller classes
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /portfolio is the HTTP URL for the endpoint to which a WebSocket (or SockJS)
        // client needs to connect for the WebSocket handshake
        registry.addEndpoint("/noteMessage").setAllowedOriginPatterns("*");
        registry.addEndpoint("/noteMessage").setAllowedOriginPatterns("*").withSockJS();
    }

//    const stompClient = new StompJs.Client({
//        brokerURL: 'ws://domain.com/noteMessage',
//                onConnect: () => {
//                // ...
//        }
//    });
}
