package com.example.backend.repository;
import com.example.backend.model.DpiJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface DpiJobRepository extends JpaRepository<DpiJob, Long> {
    List<DpiJob> findAllByOrderByProcessedAtDesc();
}