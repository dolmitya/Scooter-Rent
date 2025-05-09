package dolmitya.service;

import com.github.dolmitya.dto.scooter.CreateScooterRequest;
import com.github.dolmitya.dto.scooter.ModelPrice;
import com.github.dolmitya.dto.scooter.ScootersEntityForArend;
import com.github.dolmitya.entities.ScooterEntity;
import com.github.dolmitya.enums.ScooterStatus;
import dolmitya.repositories.ScooterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScooterService {
    private final ScooterRepository scooterRepository;

    public ScooterEntity createScooter(CreateScooterRequest createScooterRequest) {
        ScooterEntity scooter = new ScooterEntity();
        scooter.setModel(createScooterRequest.getModel());
        scooter.setLatitude(createScooterRequest.getLatitude());
        scooter.setLongitude(createScooterRequest.getLongitude());
        scooter.setPricePerMinute(createScooterRequest.getPricePerMinute());
        scooter.setStatus(ScooterStatus.FREE);
        return scooterRepository.save(scooter);
    }

    public List<ScootersEntityForArend> getAllFreeScooters() {
        return scooterRepository.findAllByStatus(ScooterStatus.FREE)
                .stream()
                .map(scooter ->
                        new ScootersEntityForArend(scooter.getId(), scooter.getModel(),
                                scooter.getLatitude(), scooter.getLongitude(), scooter.getPricePerMinute()))
                .toList();
    }

    public int updatePriceByModel(String model, Double newPrice) {
        List<ScooterEntity> scooters = scooterRepository.findAllByModel(model);
        if (scooters.isEmpty()) {
            throw new IllegalArgumentException("No scooters found with model: " + model);
        }
        for (ScooterEntity scooter : scooters) {
            scooter.setPricePerMinute(newPrice);
        }
        scooterRepository.saveAll(scooters);
        return scooters.size();
    }

    public List<ModelPrice> getAllModels() {
        return scooterRepository.findAllDistinctModelsAndPrices();
    }
}
