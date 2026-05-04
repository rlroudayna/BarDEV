package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.Rapport;
import com.FEV.SmartTest.Repository.RapportRepository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;

public class RapprtService {
    private final RapportRepository rapportRepo;

    public RapprtService(RapportRepository rapportRepo) {
        this.rapportRepo = rapportRepo;
    }

    // ---------------------

}
