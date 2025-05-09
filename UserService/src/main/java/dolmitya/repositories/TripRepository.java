package dolmitya.repositories;

import com.github.dolmitya.entities.TripEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends CrudRepository<TripEntity, Long> {
    // Все поездки пользователя по userId
    List<TripEntity> findAllByUserId(Long userId);

    // Все активные поездки пользователя по userId
    @Query("""
                SELECT te
                FROM TripEntity te
                WHERE te.user.id = :userId
                AND  te.endLatitude IS NULL
                AND  te.endLongitude IS NULL
                AND  te.endTime IS NULL
            """)
    List<TripEntity> findActiveTripByUserId(@Param("userId") Long userId);
}
