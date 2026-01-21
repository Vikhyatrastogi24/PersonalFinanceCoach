package com.TITAN.THRONE.Personal_Finance_Coach.repo;

import com.TITAN.THRONE.Personal_Finance_Coach.model.Notification;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository  extends JpaRepository<Notification , Long>
{
    List<Notification> findByUserOrderByTimestampDesc(User user);
}
