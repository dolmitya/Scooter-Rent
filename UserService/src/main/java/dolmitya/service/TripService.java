package dolmitya.service;

import com.github.dolmitya.dto.trip.ActiveTripEntity;
import com.github.dolmitya.dto.trip.TripHistoryEntity;
import com.github.dolmitya.entities.ScooterEntity;
import com.github.dolmitya.entities.TripEntity;
import com.github.dolmitya.entities.UserEntity;
import com.github.dolmitya.enums.ScooterStatus;
import dolmitya.repositories.ScooterRepository;
import dolmitya.repositories.TripRepository;
import dolmitya.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final ScooterRepository scooterRepository;
    private final UserRepository userRepository;

    public TripEntity createTrip(Long scooterId, String username,
                                 LocalDateTime startTime) {

        ScooterEntity scooter = scooterRepository.findById(scooterId)
                .orElseThrow(() -> new IllegalArgumentException("Scooter not found with id: " + scooterId));

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with userName: " + username));


        if (scooter.getStatus() != ScooterStatus.FREE) {
            throw new IllegalStateException("Scooter is not available");
        }

        if (user.getBalance() < scooter.getPricePerMinute() * 10) {
            throw new IllegalStateException("Low balance(нищета)");
        }

        scooter.setStatus(ScooterStatus.BUSY);
        scooterRepository.save(scooter);

        TripEntity trip = new TripEntity();
        trip.setScooter(scooter);
        trip.setUser(user);
        trip.setStartTime(startTime);
        trip.setStartLatitude(scooter.getLatitude());
        trip.setStartLongitude(scooter.getLongitude());
        trip.setPricePerMinute(scooter.getPricePerMinute());
        return tripRepository.save(trip);
    }

    public TripEntity finishTrip(String username, Long tripId, LocalDateTime endTime, Double endLatitude, Double endLongitude) {
        TripEntity trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with id: " + tripId));

        if (!trip.getUser().getUsername().equals(username)) {
            throw new SecurityException("Exception secured, this trip was started another user!");
        }

        if (trip.getEndTime() != null) {
            throw new IllegalStateException("Trip is already finished");
        }

        UserEntity user = trip.getUser();
        user.setBalance(user.getBalance()
                - calculatePrice(trip.getStartTime(), endTime, trip.getPricePerMinute()));

        trip.setEndTime(endTime);
        trip.setEndLatitude(endLatitude);
        trip.setEndLongitude(endLongitude);

        ScooterEntity scooter = trip.getScooter();
        scooter.setLatitude(endLatitude);
        scooter.setLongitude(endLongitude);
        scooter.setStatus(ScooterStatus.FREE);
        scooterRepository.save(scooter);

        return tripRepository.save(trip);
    }

    public List<ActiveTripEntity> allActiveTrips(String username, LocalDateTime now) {
        return tripRepository.findActiveTripByUserId(userRepository.findByUsername(username)
                        .orElseThrow(() -> new IllegalArgumentException("Trip not found with username: " + username))
                        .getId())
                .stream()
                .map(trip -> new ActiveTripEntity(trip.getId(), trip.getScooter().getId(),
                        trip.getScooter().getModel(), trip.getStartTime(),
                        trip.getStartLatitude(), trip.getStartLongitude(),
                        trip.getPricePerMinute(),
                        calculatePrice(
                                trip.getStartTime(),
                                trip.getEndTime() != null ? trip.getEndTime() : now,
                                trip.getPricePerMinute()
                        )))
                .toList();
    }

    public List<TripHistoryEntity> tripHistory(String username, LocalDateTime now) {
        return tripRepository.findAllByUserId(userRepository.findByUsername(username)
                        .orElseThrow(() -> new IllegalArgumentException("Trip not found with username: " + username))
                        .getId())
                .stream()
                .map(trip -> new TripHistoryEntity(trip.getId(), trip.getStartTime(), trip.getEndTime(),
                        calculateDistance(
                                trip.getStartLatitude(),
                                trip.getStartLongitude(),
                                (trip.getEndLatitude() != null) ? trip.getEndLatitude() : trip.getStartLatitude(),
                                (trip.getEndLongitude() != null) ? trip.getEndLongitude() : trip.getStartLongitude()
                        ),
                        trip.getPricePerMinute(), trip.getScooter().getModel(), trip.getScooter().getId(),
                        calculatePrice(
                                trip.getStartTime(),
                                trip.getEndTime() != null ? trip.getEndTime() : now,
                                trip.getPricePerMinute()
                        )))
                .toList();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    public double calculatePrice(LocalDateTime t1, LocalDateTime t2, double pricePerMinute) {
        long minutes = java.time.Duration.between(t1, t2).toMinutes();
        if (minutes == 0) {
            minutes = 1; // минимальная оплата за 1 минуту
        }

        return minutes * pricePerMinute;
    }
}
