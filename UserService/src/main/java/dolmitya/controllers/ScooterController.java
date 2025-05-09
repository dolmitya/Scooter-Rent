package dolmitya.controllers;

import com.github.dolmitya.dto.scooter.CreateScooterRequest;
import com.github.dolmitya.dto.scooter.UpdatePriceRequest;
import com.github.dolmitya.exceptions.AppError;
import dolmitya.service.ScooterService;
import dolmitya.utils.JwtTokenUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ScooterController {
    private final JwtTokenUtils jwtTokenUtils;
    private final ScooterService scooterService;

    @Operation(summary = "add scooter")
    @SecurityRequirement(name = "JWT")
    @PostMapping("/admin/addScooter")
    public ResponseEntity<?> startTrip(@RequestHeader("Authorization") String authHeader, @RequestBody CreateScooterRequest request) {
        try {
            return ResponseEntity.ok(scooterService.createScooter(request));
        } catch (Exception e){
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "get all free scooters")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/secured/getFreeScooters")
    public ResponseEntity<?> startTrip(@RequestHeader("Authorization") String authHeader) {
        try {
            return ResponseEntity.ok(scooterService.getAllFreeScooters());
        } catch (Exception e){
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "update price for all scooters of a model")
    @SecurityRequirement(name = "JWT")
    @PostMapping("/admin/updatePrice")
    public ResponseEntity<?> updatePrice(@RequestHeader("Authorization") String authHeader, @RequestBody UpdatePriceRequest request) {
        try {
            int updatedCount = scooterService.updatePriceByModel(request.getModel(), request.getNewPrice());
            return ResponseEntity.ok("Updated " + updatedCount + " scooters with model: " + request.getModel());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(new AppError(HttpStatus.NOT_FOUND.value(), e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "get all available scooter models")
    @SecurityRequirement(name = "JWT")
    @GetMapping("/admin/getAllModels")
    public ResponseEntity<?> getAllModels(@RequestHeader("Authorization") String authHeader) {
        try {
            return ResponseEntity.ok(scooterService.getAllModels());
        } catch (Exception e) {
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
