package dolmitya.controllers;

import com.github.dolmitya.dto.user.UserResponse;
import dolmitya.service.UserService;
import dolmitya.utils.JwtTokenUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MainController {
    private final JwtTokenUtils jwtTokenUtils;
    private final UserService userService;

    @Operation(summary = "unsecure connect")
    @GetMapping("/unsecured")
    public String unsecuredData() {
        return "unsecured";
    }

    @Operation(summary = "secure connect")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/secured")
    public String securedData() {
        return "secured";
    }

    @Operation(summary = "get info")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/secured/getInfo")
    public UserResponse getInfo(@RequestHeader("Authorization") String authHeader) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);

        return new UserResponse(username, userService.getBalanceByUsername(username), jwtTokenUtils.getRoles(jwtToken));
    }

    @Operation(summary = "get balance")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/secured/getBalance")
    public Double getBalance(@RequestHeader("Authorization") String authHeader) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        return userService.getBalanceByUsername(username);
    }

    @Operation(summary = "get name")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/secured/getName")
    public String getName(@RequestHeader("Authorization") String authHeader) {
        String jwtToken = authHeader.replace("Bearer ", "");
        return  jwtTokenUtils.getUsername(jwtToken);
    }

    @Operation(
            summary = "top up balance",
            security = @SecurityRequirement(name = "JWT"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Request body example",
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            schema = @io.swagger.v3.oas.annotations.media.Schema(
                                    example = "{ \"amount\": 100.0 }"
                            )
                    )
            )
    )
    @SecurityRequirement(name = "JWT")
    @PostMapping("/secured/topUpBalance")
    public ResponseEntity<String> topUpBalance(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, Double> request) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        Double amount = request.get("amount");
        userService.topUpBalance(username, amount);
        return ResponseEntity.ok("Balance topped up successfully");
    }

    @Operation(
            summary = "update user info",
            security = @SecurityRequirement(name = "JWT"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Request body example",
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            schema = @io.swagger.v3.oas.annotations.media.Schema(
                                    example = "{ \"numberPhone\": \"+1234567890\", \"username\": \"newUser\", \"password\": \"newPassword\" }"
                            )
                    )
            )
    )
    @SecurityRequirement(name = "JWT")
    @PutMapping("/secured/updateUserInfo")
    public ResponseEntity<String> updateUserInfo(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> updates) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        userService.updateUserInfo(username, updates);
        return ResponseEntity.ok("User info updated successfully");
    }

    @Operation(summary = "get roles")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/secured/getRoles")
    public String getRoles(@RequestHeader("Authorization") String authHeader) {
        String jwtToken = authHeader.replace("Bearer ", "");
        return jwtTokenUtils.getRoles(jwtToken).toString();
    }
}
