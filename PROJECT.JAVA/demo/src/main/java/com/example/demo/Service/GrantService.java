package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Application;
import com.example.demo.Model.Expenditure;
import com.example.demo.Model.Faculty;
import com.example.demo.Model.Stage;
import com.example.demo.Repository.ApplicationRepository;
import com.example.demo.Repository.ExpenditureRepository;
import com.example.demo.Repository.FacultyRepository;
import com.example.demo.Repository.StageRepository;

@Service
public class GrantService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private ExpenditureRepository expenditureRepository;


    // =========================================================
    // APPLICATION
    // =========================================================

    // CREATE APPLICATION
    public Application createApplication(Application application) {

        if (application.getTitle() == null ||
                application.getTitle().trim().isEmpty()) {

            throw new RuntimeException(
                    "Application title is required"
            );
        }

        if (application.getRequestedAmount() == null ||
                application.getRequestedAmount() <= 0) {

            throw new RuntimeException(
                    "Requested amount must be greater than zero"
            );
        }

        return applicationRepository.save(application);
    }


    // GET ALL APPLICATIONS
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }


    // GET APPLICATION BY ID
    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with ID: " + id
                        )
                );
    }


    // UPDATE APPLICATION
    public Application updateApplication(
            Long id,
            Application updatedApplication) {

        Application existing =
                getApplicationById(id);

        existing.setTitle(
                updatedApplication.getTitle()
        );

        existing.setRequestedAmount(
                updatedApplication.getRequestedAmount()
        );

        existing.setAbstractText(
                updatedApplication.getAbstractText()
        );

        existing.setFaculty(
                updatedApplication.getFaculty()
        );

        existing.setStage(
                updatedApplication.getStage()
        );

        return applicationRepository.save(existing);
    }


    // DELETE APPLICATION
    public void deleteApplication(Long id) {

        Application application =
                getApplicationById(id);

        applicationRepository.delete(application);
    }


    // =========================================================
    // APPROVE APPLICATION
    // =========================================================

    public Application approveApplication(Long id) {

        Application application =
                getApplicationById(id);


        Stage approvedStage =
                stageRepository.findAll()
                        .stream()
                        .filter(stage ->
                                stage.getName() != null &&
                                stage.getName()
                                        .equalsIgnoreCase("Approved")
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Approved stage not found. " +
                                        "Please create the Approved stage first."
                                )
                        );


        application.setStage(approvedStage);


        return applicationRepository.save(application);
    }


    // =========================================================
    // REJECT APPLICATION
    // =========================================================

    public Application rejectApplication(Long id) {

        Application application =
                getApplicationById(id);


        Stage rejectedStage =
                stageRepository.findAll()
                        .stream()
                        .filter(stage ->
                                stage.getName() != null &&
                                stage.getName()
                                        .equalsIgnoreCase("Rejected")
                        )
                        .findFirst()
                        .orElseGet(() -> {

                            Stage newStage =
                                    new Stage();

                            newStage.setName(
                                    "Rejected"
                            );

                            newStage.setDescription(
                                    "Application has been rejected"
                            );

                            return stageRepository.save(
                                    newStage
                            );
                        });


        application.setStage(
                rejectedStage
        );


        return applicationRepository.save(
                application
        );
    }


    // =========================================================
    // FACULTY
    // =========================================================

    // CREATE FACULTY
    public Faculty createFaculty(Faculty faculty) {

        if (faculty.getName() == null ||
                faculty.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Faculty name is required"
            );
        }

        return facultyRepository.save(faculty);
    }


    // GET ALL FACULTY
    public List<Faculty> getAllFaculty() {

        return facultyRepository.findAll();
    }


    // GET FACULTY BY ID
    public Faculty getFacultyById(Long id) {

        return facultyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found with ID: " + id
                        )
                );
    }


    // UPDATE FACULTY
    public Faculty updateFaculty(
            Long id,
            Faculty updatedFaculty) {

        Faculty existing =
                getFacultyById(id);

        existing.setName(
                updatedFaculty.getName()
        );

        existing.setDepartment(
                updatedFaculty.getDepartment()
        );

        existing.setEmail(
                updatedFaculty.getEmail()
        );

        return facultyRepository.save(existing);
    }


    // DELETE FACULTY
    public void deleteFaculty(Long id) {

        Faculty faculty =
                getFacultyById(id);

        facultyRepository.delete(faculty);
    }


    // =========================================================
    // STAGE
    // =========================================================

    // CREATE STAGE
    public Stage createStage(Stage stage) {

        if (stage.getName() == null ||
                stage.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Stage name is required"
            );
        }

        return stageRepository.save(stage);
    }


    // GET ALL STAGES
    public List<Stage> getAllStages() {

        return stageRepository.findAll();
    }


    // GET STAGE BY ID
    public Stage getStageById(Long id) {

        return stageRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Stage not found with ID: " + id
                        )
                );
    }


    // UPDATE STAGE
    public Stage updateStage(
            Long id,
            Stage updatedStage) {

        Stage existing =
                getStageById(id);

        existing.setName(
                updatedStage.getName()
        );

        existing.setDescription(
                updatedStage.getDescription()
        );

        return stageRepository.save(existing);
    }


    // DELETE STAGE
    public void deleteStage(Long id) {

        Stage stage =
                getStageById(id);

        stageRepository.delete(stage);
    }


    // =========================================================
    // EXPENDITURE
    // =========================================================

    // CREATE EXPENDITURE
    public Expenditure createExpenditure(
            Long applicationId,
            Expenditure expenditure) {

        Application application =
                getApplicationById(applicationId);


        // Only APPROVED applications can have expenditure
        if (application.getStage() == null ||
                application.getStage().getName() == null ||
                !application.getStage()
                        .getName()
                        .equalsIgnoreCase("Approved")) {

            throw new RuntimeException(
                    "Expenditure can only be logged for " +
                    "applications in the APPROVED stage."
            );
        }


        // Validate amount
        if (expenditure.getAmount() == null ||
                expenditure.getAmount() <= 0) {

            throw new RuntimeException(
                    "Expenditure amount must be greater than zero."
            );
        }


        // Calculate existing expenditure
        double existingTotal =
                expenditureRepository
                        .findAll()
                        .stream()
                        .filter(e ->
                                e.getApplication() != null &&
                                e.getApplication()
                                        .getId()
                                        .equals(applicationId)
                        )
                        .mapToDouble(
                                Expenditure::getAmount
                        )
                        .sum();


        double newTotal =
                existingTotal +
                expenditure.getAmount();


        // Do not exceed requested/approved amount
        if (newTotal >
                application.getRequestedAmount()) {

            throw new RuntimeException(
                    "Total expenditure cannot exceed " +
                    "the approved amount of ₹" +
                    application.getRequestedAmount()
            );
        }


        expenditure.setApplication(
                application
        );


        return expenditureRepository.save(
                expenditure
        );
    }


    // GET ALL EXPENDITURES
    public List<Expenditure> getAllExpenditures() {

        return expenditureRepository.findAll();
    }


    // GET EXPENDITURE BY ID
    public Expenditure getExpenditureById(Long id) {

        return expenditureRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Expenditure not found with ID: " +
                                id
                        )
                );
    }


    // GET EXPENDITURES BY APPLICATION
    public List<Expenditure>
    getExpendituresByApplication(
            Long applicationId) {

        return expenditureRepository
                .findAll()
                .stream()
                .filter(e ->
                        e.getApplication() != null &&
                        e.getApplication()
                                .getId()
                                .equals(applicationId)
                )
                .toList();
    }


    // DELETE EXPENDITURE
    public void deleteExpenditure(Long id) {

        Expenditure expenditure =
                getExpenditureById(id);

        expenditureRepository.delete(
                expenditure
        );
    }

}