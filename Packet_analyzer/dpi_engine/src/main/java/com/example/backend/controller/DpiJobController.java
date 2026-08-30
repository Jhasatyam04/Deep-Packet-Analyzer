package com.example.backend.controller;
import com.example.backend.model.DpiJob;
import com.example.backend.repository.DpiJobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/captures")
@CrossOrigin(origins = "*") 
public class DpiJobController {
    private final DpiJobRepository repository;
    public DpiJobController(DpiJobRepository repository) {
        this.repository = repository;
    }
    @GetMapping
    public List<DpiJob> getAllCaptures() {
        return repository.findAllByOrderByProcessedAtDesc();
    }
    @GetMapping("/{id}")
    public ResponseEntity<DpiJob> getCapture(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}