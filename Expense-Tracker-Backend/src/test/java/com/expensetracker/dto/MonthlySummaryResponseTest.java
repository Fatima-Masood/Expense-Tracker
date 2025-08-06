package com.expensetracker.dto;

import com.expensetracker.expenditure.Expenditure;
import org.junit.jupiter.api.Test;

import java.time.YearMonth;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MonthlySummaryResponseTest {

    @Test
    void testEquals_SameValues() {
        YearMonth month = YearMonth.of(2023, 8);
        List<Expenditure> expenses = Collections.emptyList();

        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        r1.setMonth(month);
        r1.setLimitAmount(1000.0);
        r1.setTotalSpent(800.0);
        r1.setExpenses(expenses);

        MonthlySummaryResponse r2 = new MonthlySummaryResponse();
        r2.setMonth(month);
        r2.setLimitAmount(1000.0);
        r2.setTotalSpent(800.0);
        r2.setExpenses(expenses);

        assertEquals(r1, r2);
        assertEquals(r1.hashCode(), r2.hashCode());
    }

    @Test
    void testEquals_NullFields() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        MonthlySummaryResponse r2 = new MonthlySummaryResponse();

        assertEquals(r1, r2);
        assertEquals(r1.hashCode(), r2.hashCode());
    }

    @Test
    void testEquals_SameReference() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        assertEquals(r1, r1);
        assertEquals(r1.hashCode(), r1.hashCode());
    }

    @Test
    void testEquals_DifferentMonth() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        r1.setMonth(YearMonth.of(2023, 8));

        MonthlySummaryResponse r2 = new MonthlySummaryResponse();
        r2.setMonth(YearMonth.of(2024, 8));

        assertNotEquals(r1, r2);
        assertNotEquals(r1.hashCode(), r2.hashCode());
    }

    @Test
    void testEquals_DifferentYear() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        r1.setMonth(YearMonth.of(2023, 8));

        MonthlySummaryResponse r2 = new MonthlySummaryResponse();
        r2.setMonth(YearMonth.of(2024, 8));

        assertNotEquals(r1, r2);
        assertNotEquals(r1.hashCode(), r2.hashCode());
    }

    @Test
    void testNotEquals_Null() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        assertNotEquals(null, r1);
        assertNotEquals((Integer) null, r1.hashCode());
    }

    @Test
    void testNotEquals_DifferentType() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        assertNotEquals("Not a MonthlySummaryResponse", r1);
    }

    @Test
    void testEquals_AllFieldsDifferent() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        r1.setMonth(YearMonth.of(2023, 8));
        r1.setLimitAmount(1000.0);
        r1.setTotalSpent(800.0);
        r1.setExpenses(Collections.emptyList());

        MonthlySummaryResponse r2 = new MonthlySummaryResponse();
        r2.setMonth(YearMonth.of(2024, 9));
        r2.setLimitAmount(500.0);
        r2.setTotalSpent(400.0);
        r2.setExpenses(List.of(new Expenditure()));

        assertNotEquals(r1, r2);
        assertNotEquals(r1.hashCode(), r2.hashCode());
    }

    @Test
    void testNotEquals_DifferentLimitAmount() {
        MonthlySummaryResponse r1 = new MonthlySummaryResponse();
        r1.setLimitAmount(1000.0);

        MonthlySummaryResponse r2 = new MonthlySummaryResponse();
        r2.setLimitAmount(999.0);

        assertNotEquals(r1, r2);
    }

}
