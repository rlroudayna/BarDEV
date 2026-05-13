package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.ChangePasswordRequest;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final CustomUserDetailsService userDetailsService;
    private final CustomUserDetailsService customUserDetailsService;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, CustomUserDetailsService userDetailsService, CustomUserDetailsService customUserDetailsService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.customUserDetailsService = customUserDetailsService;
        this.emailService = emailService;
    }

    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Récupérer un utilisateur par id
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Mettre à jour un utilisateur
    public User updateUser(Long id, User updatedUser) {
        // checkAdmin();
        return userRepository.findById(id).map(user -> {
            user.setNom(updatedUser.getNom());
            user.setPrenom(updatedUser.getPrenom());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            user.setClient(updatedUser.getClient());
            // Encoder le mot de passe si il est modifié
            if(updatedUser.getMotDePasse() != null && !updatedUser.getMotDePasse().isEmpty()){
                user.setMotDePasse(passwordEncoder.encode(updatedUser.getMotDePasse()));
            }
            user.setNumeroTelephone(updatedUser.getNumeroTelephone());
            user.setImage(updatedUser.getImage());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec id : " + id));
    }

    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        //checkAdmin();
        userRepository.deleteById(id);
    }

    public User updateProfileImage(Long id, MultipartFile file) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            String uploadDir = "uploads/users/";

            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            Files.write(filePath, file.getBytes());

            String imageUrl = "/uploads/users/" + fileName;

            user.setImage(imageUrl);

            return userRepository.save(user);

        } catch (Exception e) {
            throw new RuntimeException("Erreur upload image", e);
        }
    }
    public User updatePhone(Long id, String phone) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setNumeroTelephone(phone);

        return userRepository.save(user);
    }
    public void changePassword(ChangePasswordRequest request) {

        User user = customUserDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new RuntimeException("Le nouveau mot de passe doit contenir au moins 8 caractères");
        }

        user.setMotDePasse(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    public List<User> getTechnicienEssaiByCurrentUserClient() {

        User currentUser = customUserDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        return userRepository.findByRoleAndClient(
                Role.TECHNICIEN_ESSAI,
                currentUser.getClient()
        );
    }
    public void forgotPassword(String email) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setTokenExpiration(LocalDateTime.now().plusMinutes(30));

            userRepository.save(user);

            String link = "http://192.168.1.107:5173/reset-password?token=" + token;

            emailService.sendResetEmail(user.getEmail(), link);
        }

        // IMPORTANT: toujours "OK" même si email n'existe pas
    }

    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (user.getTokenExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expiré");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Mot de passe trop court");
        }

        user.setMotDePasse(passwordEncoder.encode(newPassword));

        user.setResetToken(null);
        user.setTokenExpiration(null);

        userRepository.save(user);
    }

}
