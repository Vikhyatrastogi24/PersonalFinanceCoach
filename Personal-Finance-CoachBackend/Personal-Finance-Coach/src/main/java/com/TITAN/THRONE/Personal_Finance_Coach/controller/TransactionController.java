package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.TransactionDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Transaction;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.TransactionService;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setDescription(transaction.getDescription());
        dto.setCategory(transaction.getCategory());
        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());
        return dto;
    }

    private Transaction convertToEntity(TransactionDTO dto, User user) {
        Transaction transaction = new Transaction();
        transaction.setId(dto.getId());
        transaction.setDescription(dto.getDescription());
        transaction.setCategory(dto.getCategory());
        transaction.setAmount(dto.getAmount());
        transaction.setDate(dto.getDate());
        transaction.setUser(user);
        return transaction;
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestHeader("Authorization") String token,
                                                            @RequestBody TransactionDTO transactionDTO) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        Transaction transaction = convertToEntity(transactionDTO, user);
        Transaction savedTransaction = transactionService.createTransaction(transaction);

        return ResponseEntity.ok(convertToDTO(savedTransaction));
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getTransactions(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        List<TransactionDTO> dtos = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(@RequestHeader("Authorization") String token,
                                                            @PathVariable Long id,
                                                            @RequestBody TransactionDTO transactionDTO) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        Transaction updatedTransaction = transactionService.updateTransaction(id, transactionDTO, user);
        return ResponseEntity.ok(convertToDTO(updatedTransaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@RequestHeader("Authorization") String token,
                                                  @PathVariable Long id) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        transactionService.deleteTransaction(id, user);
        return ResponseEntity.noContent().build();
    }
}
