package com.expensetracker.dto;

import com.expensetracker.expenditure.Expenditure;
import lombok.Data;

import java.time.YearMonth;
import java.util.List;

@Data
public class MonthlySummaryResponse {
    private YearMonth month;
    private double limitAmount;
    private double totalSpent;
    private List<Expenditure> expenses;
}
