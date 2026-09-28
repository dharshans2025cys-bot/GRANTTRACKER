package com.example.demo.Controller;

import com.example.demo.Model.Application;
import com.example.demo.Model.Expenditure;
import com.example.demo.Model.Faculty;
import com.example.demo.Model.Stage;
import com.example.demo.Service.GrantService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class dharshancontroller {

    @Autowired
    private GrantService grantService;


    // =========================================================
    // APPLICATION ENDPOINTS
    // =========================================================

    // CREATE APPLICATION
    @PostMapping("/applications")
    public ResponseEntity<?> createApplication(
            @Valid @RequestBody Application application) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            grantService.createApplication(application)
                    );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // GET ALL APPLICATIONS
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {

        return ResponseEntity.ok(
                grantService.getAllApplications()
        );
    }


    // GET APPLICATION BY ID
    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplicationById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    grantService.getApplicationById(id)
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // UPDATE APPLICATION
    @PutMapping("/applications/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody Application application) {

        try {

            return ResponseEntity.ok(
                    grantService.updateApplication(
                            id,
                            application
                    )
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // DELETE APPLICATION
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable Long id) {

        try {

            grantService.deleteApplication(id);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Application deleted successfully"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // =========================================================
    // APPROVE / REJECT APPLICATION
    // =========================================================

    // APPROVE APPLICATION
    @PutMapping("/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    grantService.approveApplication(id)
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // REJECT APPLICATION
    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    grantService.rejectApplication(id)
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // =========================================================
    // FACULTY ENDPOINTS
    // =========================================================

    // CREATE FACULTY
    @PostMapping("/faculty")
    public ResponseEntity<?> createFaculty(
            @Valid @RequestBody Faculty faculty) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            grantService.createFaculty(faculty)
                    );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // GET ALL FACULTY
    @GetMapping("/faculty")
    public ResponseEntity<List<Faculty>> getAllFaculty() {

        return ResponseEntity.ok(
                grantService.getAllFaculty()
        );
    }


    // GET FACULTY BY ID
    @GetMapping("/faculty/{id}")
    public ResponseEntity<?> getFacultyById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    grantService.getFacultyById(id)
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // UPDATE FACULTY
    @PutMapping("/faculty/{id}")
    public ResponseEntity<?> updateFaculty(
            @PathVariable Long id,
            @Valid @RequestBody Faculty faculty) {

        try {

            return ResponseEntity.ok(
                    grantService.updateFaculty(
                            id,
                            faculty
                    )
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // DELETE FACULTY
    @DeleteMapping("/faculty/{id}")
    public ResponseEntity<?> deleteFaculty(
            @PathVariable Long id) {

        try {

            grantService.deleteFaculty(id);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Faculty deleted successfully"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // =========================================================
    // STAGE ENDPOINTS
    // =========================================================

    // CREATE STAGE
    @PostMapping("/stages")
    public ResponseEntity<?> createStage(
            @Valid @RequestBody Stage stage) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            grantService.createStage(stage)
                    );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // GET ALL STAGES
    @GetMapping("/stages")
    public ResponseEntity<List<Stage>> getAllStages() {

        return ResponseEntity.ok(
                grantService.getAllStages()
        );
    }


    // GET STAGE BY ID
    @GetMapping("/stages/{id}")
    public ResponseEntity<?> getStageById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    grantService.getStageById(id)
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // UPDATE STAGE
    @PutMapping("/stages/{id}")
    public ResponseEntity<?> updateStage(
            @PathVariable Long id,
            @Valid @RequestBody Stage stage) {

        try {

            return ResponseEntity.ok(
                    grantService.updateStage(
                            id,
                            stage
                    )
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // DELETE STAGE
    @DeleteMapping("/stages/{id}")
    public ResponseEntity<?> deleteStage(
            @PathVariable Long id) {

        try {

            grantService.deleteStage(id);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Stage deleted successfully"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // =========================================================
    // EXPENDITURE ENDPOINTS
    // =========================================================

    // CREATE EXPENDITURE
    @PostMapping(
            "/applications/{applicationId}/expenditures"
    )
    public ResponseEntity<?> createExpenditure(
            @PathVariable Long applicationId,
            @Valid @RequestBody Expenditure expenditure) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            grantService.createExpenditure(
                                    applicationId,
                                    expenditure
                            )
                    );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // GET ALL EXPENDITURES
    @GetMapping("/expenditures")
    public ResponseEntity<List<Expenditure>>
    getAllExpenditures() {

        return ResponseEntity.ok(
                grantService.getAllExpenditures()
        );
    }


    // GET EXPENDITURE BY ID
    @GetMapping("/expenditures/{id}")
    public ResponseEntity<?> getExpenditureById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    grantService.getExpenditureById(id)
            );

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // GET EXPENDITURES FOR APPLICATION
    @GetMapping(
            "/applications/{applicationId}/expenditures"
    )
    public ResponseEntity<List<Expenditure>>
    getExpendituresByApplication(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                grantService.getExpendituresByApplication(
                        applicationId
                )
        );
    }


    // DELETE EXPENDITURE
    @DeleteMapping("/expenditures/{id}")
    public ResponseEntity<?> deleteExpenditure(
            @PathVariable Long id) {

        try {

            grantService.deleteExpenditure(id);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Expenditure deleted successfully"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return errorResponse(e.getMessage());

        }
    }


    // =========================================================
    // ERROR HANDLER
    // =========================================================

    private ResponseEntity<Map<String, Object>>
    errorResponse(String message) {

        Map<String, Object> error =
                new HashMap<>();

        error.put(
                "success",
                false
        );

        error.put(
                "error",
                message
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

}