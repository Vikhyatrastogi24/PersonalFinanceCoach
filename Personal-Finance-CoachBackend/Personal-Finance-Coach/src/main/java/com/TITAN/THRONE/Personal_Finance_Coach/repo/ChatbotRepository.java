package com.TITAN.THRONE.Personal_Finance_Coach.repo;

import com.TITAN.THRONE.Personal_Finance_Coach.model.ChatbotMessage;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatbotRepository extends JpaRepository<ChatbotMessage, Long> {
    // Get messages for a user ordered by timestamp ascending
    List<ChatbotMessage> findByUserOrderByTimestampAsc(User user);
}
