# Linear Programming with lp_solve - Complete Guide

## Table of Contents
- [Introduction to Linear Programming](#introduction)
- [Mathematical Foundations](#mathematical-foundations)
- [lp_solve Framework Setup](#lpsolve-setup)
- [Basic Examples](#basic-examples)
- [Advanced Applications](#advanced-applications)
- [Real-World Problems](#real-world-problems)

---

## Introduction to Linear Programming

### What is Linear Programming?

Linear Programming (LP) is a mathematical optimization technique used to find the best outcome (maximum or minimum) in a mathematical model with linear relationships.

**Key Components:**
1. **Decision Variables**: Variables we control (x₁, x₂, ..., xₙ)
2. **Objective Function**: Function to maximize or minimize
3. **Constraints**: Linear inequalities/equalities that restrict solutions
4. **Non-negativity**: Variables typically ≥ 0

### Standard Form

**Maximize (or Minimize):**
```
Z = c₁x₁ + c₂x₂ + ... + cₙxₙ
```

**Subject to:**
```
a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ ≤ b₁
a₂₁x₁ + a₂₂x₂ + ... + a₂ₙxₙ ≤ b₂
...
aₘ₁x₁ + aₘ₂x₂ + ... + aₘₙxₙ ≤ bₘ

x₁, x₂, ..., xₙ ≥ 0
```

### Applications

- **Manufacturing**: Production planning, resource allocation
- **Transportation**: Route optimization, logistics
- **Finance**: Portfolio optimization, investment planning
- **Agriculture**: Crop planning, fertilizer optimization
- **Energy**: Power generation scheduling
- **Telecommunications**: Network flow optimization

---

## Mathematical Foundations

### Simplex Method

The Simplex algorithm is the most common method for solving LP problems.

**Steps:**
1. Convert to standard form
2. Find initial basic feasible solution
3. Check optimality conditions
4. Pivot to improve solution
5. Repeat until optimal

### Duality Theory

Every LP problem (primal) has an associated dual problem.

**Primal:**
```
Maximize: Z = cᵀx
Subject to: Ax ≤ b, x ≥ 0
```

**Dual:**
```
Minimize: W = bᵀy
Subject to: Aᵀy ≥ c, y ≥ 0
```

**Strong Duality Theorem**: If primal has optimal solution, dual has optimal solution with same objective value.

### Sensitivity Analysis

Examines how changes in parameters affect the optimal solution:
- **Shadow Prices**: Value of relaxing constraints
- **Reduced Costs**: Cost of forcing non-basic variables into solution
- **Range Analysis**: Parameter ranges maintaining optimality

---

## lp_solve Framework Setup

### Maven Dependency

```xml
<dependency>
    <groupId>com.datumbox</groupId>
    <artifactId>lpsolve</artifactId>
    <version>5.5.2.0</version>
</dependency>
```

### Gradle Dependency

```gradle
implementation 'com.datumbox:lpsolve:5.5.2.0'
```

### Basic Setup

```java
import lpsolve.*;

public class LPSolveExample {
    public static void main(String[] args) {
        try {
            // Create LP problem with 2 variables
            LpSolve solver = LpSolve.makeLp(0, 2);
            
            // Set objective function
            solver.setObjFn(new double[]{0, 3, 2});
            
            // Add constraints
            solver.addConstraint(new double[]{0, 2, 1}, LpSolve.LE, 100);
            
            // Solve
            solver.solve();
            
            // Get results
            double[] vars = solver.getPtrVariables();
            System.out.println("x1 = " + vars[0]);
            System.out.println("x2 = " + vars[1]);
            System.out.println("Objective = " + solver.getObjective());
            
            solver.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

---

## Basic Examples

### Example 1: Simple Maximization

**Problem:**
```
Maximize: Z = 3x₁ + 2x₂
Subject to:
  2x₁ + x₂ ≤ 100
  x₁ + x₂ ≤ 80
  x₁ ≤ 40
  x₁, x₂ ≥ 0
```

**Java Solution:**
```java
import lpsolve.*;

public class SimpleMaximization {
    public static void main(String[] args) {
        try {
            LpSolve lp = LpSolve.makeLp(0, 2);
            
            // Maximize (default is minimize)
            lp.setMaxim();
            
            // Objective: 3x1 + 2x2
            lp.setObjFn(new double[]{0, 3, 2});
            
            // Constraint 1: 2x1 + x2 <= 100
            lp.addConstraint(new double[]{0, 2, 1}, LpSolve.LE, 100);
            
            // Constraint 2: x1 + x2 <= 80
            lp.addConstraint(new double[]{0, 1, 1}, LpSolve.LE, 80);
            
            // Constraint 3: x1 <= 40
            lp.addConstraint(new double[]{0, 1, 0}, LpSolve.LE, 40);
            
            // Solve
            int result = lp.solve();
            
            if (result == LpSolve.OPTIMAL) {
                double[] vars = lp.getPtrVariables();
                System.out.println("Optimal Solution:");
                System.out.println("x1 = " + vars[0]);
                System.out.println("x2 = " + vars[1]);
                System.out.println("Maximum Z = " + lp.getObjective());
            }
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

**Output:**
```
Optimal Solution:
x1 = 20.0
x2 = 60.0
Maximum Z = 180.0
```

### Example 2: Production Planning

**Problem:**
A factory produces two products A and B.
- Product A: profit $40, requires 2 hours machine time, 1 hour labor
- Product B: profit $30, requires 1 hour machine time, 2 hours labor
- Available: 100 hours machine time, 80 hours labor

**Formulation:**
```
Maximize: Z = 40x₁ + 30x₂
Subject to:
  2x₁ + x₂ ≤ 100  (machine time)
  x₁ + 2x₂ ≤ 80   (labor time)
  x₁, x₂ ≥ 0
```

**Java Solution:**
```java
public class ProductionPlanning {
    public static void main(String[] args) {
        try {
            LpSolve lp = LpSolve.makeLp(0, 2);
            lp.setMaxim();
            
            // Objective: 40x1 + 30x2
            lp.setObjFn(new double[]{0, 40, 30});
            
            // Machine time: 2x1 + x2 <= 100
            lp.addConstraint(new double[]{0, 2, 1}, LpSolve.LE, 100);
            
            // Labor time: x1 + 2x2 <= 80
            lp.addConstraint(new double[]{0, 1, 2}, LpSolve.LE, 80);
            
            // Variable names for clarity
            lp.setColName(1, "Product_A");
            lp.setColName(2, "Product_B");
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("Produce " + vars[0] + " units of A");
            System.out.println("Produce " + vars[1] + " units of B");
            System.out.println("Maximum Profit: $" + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Example 3: Diet Problem

**Problem:**
Minimize cost of diet meeting nutritional requirements.

**Foods:**
- Bread: $2/unit, 4g protein, 15g carbs
- Milk: $3/unit, 8g protein, 12g carbs

**Requirements:**
- At least 64g protein
- At least 960g carbs

**Formulation:**
```
Minimize: Z = 2x₁ + 3x₂
Subject to:
  4x₁ + 8x₂ ≥ 64   (protein)
  15x₁ + 12x₂ ≥ 960 (carbs)
  x₁, x₂ ≥ 0
```

**Java Solution:**
```java
public class DietProblem {
    public static void main(String[] args) {
        try {
            LpSolve lp = LpSolve.makeLp(0, 2);
            
            // Minimize cost
            lp.setMinim();
            
            // Objective: 2x1 + 3x2
            lp.setObjFn(new double[]{0, 2, 3});
            
            // Protein: 4x1 + 8x2 >= 64
            lp.addConstraint(new double[]{0, 4, 8}, LpSolve.GE, 64);
            
            // Carbs: 15x1 + 12x2 >= 960
            lp.addConstraint(new double[]{0, 15, 12}, LpSolve.GE, 960);
            
            lp.setColName(1, "Bread");
            lp.setColName(2, "Milk");
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("Buy " + vars[0] + " units of Bread");
            System.out.println("Buy " + vars[1] + " units of Milk");
            System.out.println("Minimum Cost: $" + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Example 4: Transportation Problem

**Problem:**
Ship goods from 2 warehouses to 3 stores minimizing cost.

**Supply:** W1=100, W2=150
**Demand:** S1=80, S2=90, S3=80
**Costs:**
```
     S1  S2  S3
W1   2   3   4
W2   3   2   1
```

**Java Solution:**
```java
public class TransportationProblem {
    public static void main(String[] args) {
        try {
            // 6 variables: x11, x12, x13, x21, x22, x23
            LpSolve lp = LpSolve.makeLp(0, 6);
            lp.setMinim();
            
            // Objective: minimize total cost
            lp.setObjFn(new double[]{0, 2, 3, 4, 3, 2, 1});
            
            // Supply constraints
            // W1: x11 + x12 + x13 <= 100
            lp.addConstraint(new double[]{0, 1, 1, 1, 0, 0, 0}, LpSolve.LE, 100);
            
            // W2: x21 + x22 + x23 <= 150
            lp.addConstraint(new double[]{0, 0, 0, 0, 1, 1, 1}, LpSolve.LE, 150);
            
            // Demand constraints
            // S1: x11 + x21 >= 80
            lp.addConstraint(new double[]{0, 1, 0, 0, 1, 0, 0}, LpSolve.GE, 80);
            
            // S2: x12 + x22 >= 90
            lp.addConstraint(new double[]{0, 0, 1, 0, 0, 1, 0}, LpSolve.GE, 90);
            
            // S3: x13 + x23 >= 80
            lp.addConstraint(new double[]{0, 0, 0, 1, 0, 0, 1}, LpSolve.GE, 80);
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("Shipment Plan:");
            System.out.println("W1->S1: " + vars[0]);
            System.out.println("W1->S2: " + vars[1]);
            System.out.println("W1->S3: " + vars[2]);
            System.out.println("W2->S1: " + vars[3]);
            System.out.println("W2->S2: " + vars[4]);
            System.out.println("W2->S3: " + vars[5]);
            System.out.println("Minimum Cost: $" + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

---

## Advanced Applications

### Integer Programming

**Problem:** Variables must be integers (e.g., number of machines).

```java
public class IntegerProgramming {
    public static void main(String[] args) {
        try {
            LpSolve lp = LpSolve.makeLp(0, 2);
            lp.setMaxim();
            
            lp.setObjFn(new double[]{0, 5, 4});
            lp.addConstraint(new double[]{0, 1, 1}, LpSolve.LE, 5);
            lp.addConstraint(new double[]{0, 10, 6}, LpSolve.LE, 45);
            
            // Set variables as integers
            lp.setInt(1, true);
            lp.setInt(2, true);
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("x1 = " + (int)vars[0]);
            System.out.println("x2 = " + (int)vars[1]);
            System.out.println("Objective = " + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Binary Programming (0-1 Variables)

**Problem:** Project selection with budget constraint.

```java
public class ProjectSelection {
    public static void main(String[] args) {
        try {
            // 4 projects
            LpSolve lp = LpSolve.makeLp(0, 4);
            lp.setMaxim();
            
            // Profits: 100, 150, 120, 90
            lp.setObjFn(new double[]{0, 100, 150, 120, 90});
            
            // Budget: costs 50, 70, 60, 40, budget 150
            lp.addConstraint(new double[]{0, 50, 70, 60, 40}, LpSolve.LE, 150);
            
            // Binary variables
            for (int i = 1; i <= 4; i++) {
                lp.setBinary(i, true);
            }
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("Selected Projects:");
            for (int i = 0; i < 4; i++) {
                if (vars[i] == 1) {
                    System.out.println("Project " + (i+1));
                }
            }
            System.out.println("Total Profit: $" + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Multi-Period Planning

**Problem:** Production planning over multiple periods with inventory.

```java
public class MultiPeriodPlanning {
    public static void main(String[] args) {
        try {
            int periods = 3;
            // Variables: production and inventory for each period
            LpSolve lp = LpSolve.makeLp(0, periods * 2);
            lp.setMinim();
            
            // Costs: production $10/unit, inventory $2/unit/period
            double[] costs = new double[periods * 2 + 1];
            costs[0] = 0;
            for (int i = 1; i <= periods; i++) {
                costs[i] = 10;  // production cost
                costs[periods + i] = 2;  // inventory cost
            }
            lp.setObjFn(costs);
            
            // Demand: 100, 150, 120
            int[] demand = {100, 150, 120};
            
            // Capacity: 200 per period
            for (int i = 1; i <= periods; i++) {
                double[] constraint = new double[periods * 2 + 1];
                constraint[i] = 1;
                lp.addConstraint(constraint, LpSolve.LE, 200);
            }
            
            // Balance equations: production + prev_inventory = demand + curr_inventory
            for (int i = 1; i <= periods; i++) {
                double[] balance = new double[periods * 2 + 1];
                balance[i] = 1;  // production
                if (i > 1) balance[periods + i - 1] = 1;  // prev inventory
                balance[periods + i] = -1;  // curr inventory
                lp.addConstraint(balance, LpSolve.EQ, demand[i-1]);
            }
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            for (int i = 0; i < periods; i++) {
                System.out.println("Period " + (i+1) + ":");
                System.out.println("  Production: " + vars[i]);
                System.out.println("  Inventory: " + vars[periods + i]);
            }
            System.out.println("Total Cost: $" + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

---

## Real-World Problems

### Portfolio Optimization

```java
public class PortfolioOptimization {
    public static void main(String[] args) {
        try {
            // 5 assets
            int n = 5;
            LpSolve lp = LpSolve.makeLp(0, n);
            lp.setMaxim();
            
            // Expected returns
            double[] returns = {0, 0.12, 0.10, 0.08, 0.15, 0.09};
            lp.setObjFn(returns);
            
            // Budget constraint: sum of investments = 1
            double[] budget = new double[n + 1];
            for (int i = 1; i <= n; i++) budget[i] = 1;
            lp.addConstraint(budget, LpSolve.EQ, 1);
            
            // Diversification: no asset > 40%
            for (int i = 1; i <= n; i++) {
                double[] limit = new double[n + 1];
                limit[i] = 1;
                lp.addConstraint(limit, LpSolve.LE, 0.4);
            }
            
            // Minimum investment in safe assets (1,2,3): >= 50%
            double[] safe = {0, 1, 1, 1, 0, 0};
            lp.addConstraint(safe, LpSolve.GE, 0.5);
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("Optimal Portfolio:");
            String[] assets = {"Stock A", "Stock B", "Bond C", "Stock D", "Bond E"};
            for (int i = 0; i < n; i++) {
                System.out.printf("%s: %.2f%%\n", assets[i], vars[i] * 100);
            }
            System.out.printf("Expected Return: %.2f%%\n", lp.getObjective() * 100);
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Workforce Scheduling

```java
public class WorkforceScheduling {
    public static void main(String[] args) {
        try {
            // 7 days, workers start on different days
            int days = 7;
            LpSolve lp = LpSolve.makeLp(0, days);
            lp.setMinim();
            
            // Minimize total workers
            double[] obj = new double[days + 1];
            for (int i = 1; i <= days; i++) obj[i] = 1;
            lp.setObjFn(obj);
            
            // Daily requirements
            int[] required = {20, 16, 13, 16, 19, 14, 12};
            
            // Each worker works 5 consecutive days
            for (int day = 0; day < days; day++) {
                double[] constraint = new double[days + 1];
                for (int start = 0; start < days; start++) {
                    // Check if worker starting on 'start' works on 'day'
                    int workDay = (day - start + days) % days;
                    if (workDay < 5) {
                        constraint[start + 1] = 1;
                    }
                }
                lp.addConstraint(constraint, LpSolve.GE, required[day]);
            }
            
            // Integer variables
            for (int i = 1; i <= days; i++) {
                lp.setInt(i, true);
            }
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            String[] dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
            System.out.println("Workers starting each day:");
            for (int i = 0; i < days; i++) {
                System.out.println(dayNames[i] + ": " + (int)vars[i]);
            }
            System.out.println("Total Workers: " + (int)lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Blending Problem

```java
public class BlendingProblem {
    public static void main(String[] args) {
        try {
            // Blend 3 crude oils to make gasoline
            LpSolve lp = LpSolve.makeLp(0, 3);
            lp.setMinim();
            
            // Costs per barrel
            lp.setObjFn(new double[]{0, 45, 35, 25});
            
            // Produce 100 barrels
            lp.addConstraint(new double[]{0, 1, 1, 1}, LpSolve.EQ, 100);
            
            // Octane rating >= 90
            // Crude 1: 95, Crude 2: 85, Crude 3: 75
            lp.addConstraint(new double[]{0, 95, 85, 75}, LpSolve.GE, 9000);
            
            // Sulfur content <= 2%
            // Crude 1: 1%, Crude 2: 2%, Crude 3: 3%
            lp.addConstraint(new double[]{0, 1, 2, 3}, LpSolve.LE, 200);
            
            lp.solve();
            
            double[] vars = lp.getPtrVariables();
            System.out.println("Optimal Blend:");
            System.out.println("Crude 1: " + vars[0] + " barrels");
            System.out.println("Crude 2: " + vars[1] + " barrels");
            System.out.println("Crude 3: " + vars[2] + " barrels");
            System.out.println("Total Cost: $" + lp.getObjective());
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

---

## Best Practices

### Error Handling

```java
public class RobustLPSolver {
    public static void solveSafely() {
        LpSolve lp = null;
        try {
            lp = LpSolve.makeLp(0, 2);
            lp.setMaxim();
            lp.setObjFn(new double[]{0, 3, 2});
            lp.addConstraint(new double[]{0, 2, 1}, LpSolve.LE, 100);
            
            int result = lp.solve();
            
            switch (result) {
                case LpSolve.OPTIMAL:
                    System.out.println("Optimal solution found");
                    break;
                case LpSolve.INFEASIBLE:
                    System.out.println("Problem is infeasible");
                    break;
                case LpSolve.UNBOUNDED:
                    System.out.println("Problem is unbounded");
                    break;
                default:
                    System.out.println("Solver error: " + result);
            }
        } catch (LpSolveException e) {
            System.err.println("LP Solve Exception: " + e.getMessage());
        } finally {
            if (lp != null) {
                lp.deleteLp();
            }
        }
    }
}
```

### Performance Optimization

```java
public class OptimizedSolver {
    public static void optimizeLargeProblem() {
        try {
            LpSolve lp = LpSolve.makeLp(0, 1000);
            
            // Use sparse matrix for large problems
            lp.setAddRowmode(true);
            
            // Add constraints efficiently
            for (int i = 0; i < 500; i++) {
                double[] row = new double[1001];
                // Fill row...
                lp.addConstraint(row, LpSolve.LE, 100);
            }
            
            lp.setAddRowmode(false);
            
            // Set solver options
            lp.setScaling(LpSolve.SCALE_GEOMETRIC);
            lp.setPresolve(LpSolve.PRESOLVE_ROWS | LpSolve.PRESOLVE_COLS, 
                          lp.getPresolveloops());
            
            lp.solve();
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

### Sensitivity Analysis

```java
public class SensitivityAnalysis {
    public static void analyzeSolution() {
        try {
            LpSolve lp = LpSolve.makeLp(0, 2);
            lp.setMaxim();
            lp.setObjFn(new double[]{0, 3, 2});
            lp.addConstraint(new double[]{0, 2, 1}, LpSolve.LE, 100);
            lp.addConstraint(new double[]{0, 1, 1}, LpSolve.LE, 80);
            
            lp.solve();
            
            // Get dual values (shadow prices)
            double[] duals = lp.getPtrDualSolution();
            System.out.println("Shadow Prices:");
            for (int i = 1; i < duals.length; i++) {
                System.out.println("Constraint " + i + ": " + duals[i]);
            }
            
            // Get reduced costs
            double[] reduced = lp.getPtrSensitivityObjex();
            System.out.println("\nReduced Costs:");
            for (int i = 0; i < reduced.length; i++) {
                System.out.println("Variable " + (i+1) + ": " + reduced[i]);
            }
            
            lp.deleteLp();
        } catch (LpSolveException e) {
            e.printStackTrace();
        }
    }
}
```

---

## Summary

### Key Concepts
- Linear Programming optimizes linear objectives with linear constraints
- lp_solve provides efficient Java implementation
- Applications span manufacturing, finance, logistics, scheduling
- Integer and binary programming extend LP capabilities
- Sensitivity analysis provides insights into solution robustness

### Common Pitfalls
- Forgetting index 0 in arrays (lp_solve uses 1-based indexing)
- Not calling `deleteLp()` (memory leaks)
- Infeasible problems (conflicting constraints)
- Unbounded problems (missing constraints)
- Numerical instability (scaling issues)

### Resources
- lp_solve Documentation: http://lpsolve.sourceforge.net/
- Linear Programming Theory: "Introduction to Linear Optimization" by Bertsimas
- Java API: http://lpsolve.sourceforge.net/5.5/Java/README.html

---

**Master Linear Programming to solve complex optimization problems efficiently!**
