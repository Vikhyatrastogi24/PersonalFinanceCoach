package com.TITAN.THRONE.Personal_Finance_Coach.service;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.TransactionDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.CustomException;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.ResourceNotFoundException;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Transaction;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.repo.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUser(user);
    }

    public Transaction updateTransaction(Long id, TransactionDTO transactionDTO, User user) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!existingTransaction.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized to update this transaction");
        }

        existingTransaction.setDescription(transactionDTO.getDescription());
        existingTransaction.setCategory(transactionDTO.getCategory());
        existingTransaction.setAmount(transactionDTO.getAmount());
        existingTransaction.setDate(transactionDTO.getDate());

        return transactionRepository.save(existingTransaction);
    }

    public void deleteTransaction(Long id, User user) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!existingTransaction.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized to delete this transaction");
        }

        transactionRepository.delete(existingTransaction);
    }
}

