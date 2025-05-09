package dolmitya.repositories;

import com.github.dolmitya.dto.scooter.ModelPrice;
import com.github.dolmitya.entities.ScooterEntity;
import com.github.dolmitya.enums.ScooterStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ScooterRepository extends CrudRepository<ScooterEntity, Long> {
    List<ScooterEntity> findAllByStatus(ScooterStatus status);

    List<ScooterEntity> findAllByModel(String model);

    @Query("SELECT DISTINCT new com.github.dolmitya.dto.scooter.ModelPrice(s.model, s.pricePerMinute) FROM ScooterEntity s")
    List<ModelPrice> findAllDistinctModelsAndPrices();
}
