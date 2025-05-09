package dolmitya.controllers;

import com.github.dolmitya.dto.trip.*;
import com.github.dolmitya.entities.TripEntity;
import com.github.dolmitya.exceptions.AppError;
import dolmitya.service.TripService;
import dolmitya.utils.JwtTokenUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TripController {
    private final JwtTokenUtils jwtTokenUtils;
    private final TripService tripService;

    @Operation(summary = "start trip")
    @SecurityRequirement(name = "JWT")
    @PostMapping("/secured/startTrip")
    public ResponseEntity<?> startTrip(@RequestHeader("Authorization") String authHeader, @RequestBody StartTripRequest request) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        try {
            TripEntity trip = tripService.createTrip(
                    request.getScooterId(),
                    username,
                    request.getStartTime()
            );
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "end trip")
    @SecurityRequirement(name = "JWT")
    @PostMapping("/secured/finishTrip")
    public ResponseEntity<?> finishTrip(@RequestHeader("Authorization") String authHeader, @RequestBody FinishTripRequest request) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        try {
            TripEntity trip = tripService.finishTrip(
                    username,
                    request.getTripId(),
                    request.getEndTime(),
                    request.getEndLatitude(),
                    request.getEndLongitude()
            );
            return ResponseEntity.ok(trip);
        } catch (IllegalArgumentException | IllegalStateException | SecurityException e) {
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "get all active trips by user")
    @SecurityRequirement(name = "JWT")
    @PostMapping("/secured/allActiveTrips")
    public ResponseEntity<?> allActiveTrips(@RequestHeader("Authorization") String authHeader, @RequestBody LocalDateTime now) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        try {
            List<ActiveTripEntity> allActiveTrips = tripService.allActiveTrips(username, now);
            return ResponseEntity.ok(allActiveTrips);
        } catch (IllegalArgumentException | IllegalStateException | SecurityException e) {
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "trip history by user")
    @SecurityRequirement(name = "JWT")
    @PostMapping("/secured/tripHistory")
    public ResponseEntity<?> tripHistory(@RequestHeader("Authorization") String authHeader, @RequestBody LocalDateTime now) {
        String jwtToken = authHeader.replace("Bearer ", "");
        String username = jwtTokenUtils.getUsername(jwtToken);
        try {
            List<TripHistoryEntity> trip = tripService.tripHistory(username, now);
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            return new ResponseEntity<>(new AppError(HttpStatus.BAD_REQUEST.value(), e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}