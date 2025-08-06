package com.expensetracker.limits;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "monthly_limits")
public class MonthlyLimit {
    @Id
    private String id;
    private String username;
    private String month;
    private double limitAmount;
}
