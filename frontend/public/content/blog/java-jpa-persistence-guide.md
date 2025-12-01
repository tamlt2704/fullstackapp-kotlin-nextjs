---
title: "Java Persistence with JPA - Complete Guide"
date: "2024-12-13"
category: "Programming"
tags: ["Java", "JPA", "Hibernate", "Database", "ORM", "Spring Data"]
---

# Java Persistence with JPA - Complete Guide

## What is JPA?

**Java Persistence API (JPA)** is a specification for object-relational mapping (ORM) in Java. It provides a standard way to map Java objects to database tables.

**Key Concepts**:
- Entity - Java class mapped to database table
- EntityManager - Interface for database operations
- Persistence Context - Set of managed entity instances
- JPQL - Java Persistence Query Language

---

## Basic Entity Mapping

### Simple Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

### Primary Key Strategies
```java
// Auto-increment
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// Sequence
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
@SequenceGenerator(name = "user_seq", sequenceName = "user_sequence")
private Long id;

// UUID
@Id
@GeneratedValue(generator = "UUID")
@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
private String id;

// Custom
@Id
private String customId;
```

---

## Relationships

### One-to-One
```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;
}

@Entity
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String bio;
    
    @OneToOne(mappedBy = "profile")
    private User user;
}
```

### One-to-Many / Many-to-One
```java
@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
```

### Many-to-Many
```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

---

## EntityManager Operations

### Basic CRUD
```java
@PersistenceContext
private EntityManager entityManager;

// Create
public User createUser(User user) {
    entityManager.persist(user);
    return user;
}

// Read
public User findUser(Long id) {
    return entityManager.find(User.class, id);
}

// Update
public User updateUser(User user) {
    return entityManager.merge(user);
}

// Delete
public void deleteUser(Long id) {
    User user = entityManager.find(User.class, id);
    if (user != null) {
        entityManager.remove(user);
    }
}
```

### Detached vs Managed
```java
// Managed entity
User user = entityManager.find(User.class, 1L);
user.setEmail("new@email.com"); // Auto-updated in DB

// Detached entity
entityManager.detach(user);
user.setEmail("another@email.com"); // NOT updated

// Reattach
user = entityManager.merge(user); // Now updated
```

---

## JPQL Queries

### Basic Queries
```java
// Select all
List<User> users = entityManager
    .createQuery("SELECT u FROM User u", User.class)
    .getResultList();

// With condition
List<User> activeUsers = entityManager
    .createQuery("SELECT u FROM User u WHERE u.active = true", User.class)
    .getResultList();

// Single result
User user = entityManager
    .createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
    .setParameter("email", "test@example.com")
    .getSingleResult();
```

### Named Queries
```java
@Entity
@NamedQuery(
    name = "User.findByEmail",
    query = "SELECT u FROM User u WHERE u.email = :email"
)
public class User {
    // ...
}

// Usage
User user = entityManager
    .createNamedQuery("User.findByEmail", User.class)
    .setParameter("email", "test@example.com")
    .getSingleResult();
```

### Joins
```java
// Inner join
List<Employee> employees = entityManager
    .createQuery(
        "SELECT e FROM Employee e JOIN e.department d WHERE d.name = :deptName",
        Employee.class
    )
    .setParameter("deptName", "IT")
    .getResultList();

// Left join
List<Employee> allEmployees = entityManager
    .createQuery(
        "SELECT e FROM Employee e LEFT JOIN e.department d",
        Employee.class
    )
    .getResultList();
```

### Aggregations
```java
// Count
Long count = entityManager
    .createQuery("SELECT COUNT(u) FROM User u", Long.class)
    .getSingleResult();

// Average
Double avgSalary = entityManager
    .createQuery("SELECT AVG(e.salary) FROM Employee e", Double.class)
    .getSingleResult();

// Group by
List<Object[]> results = entityManager
    .createQuery(
        "SELECT d.name, COUNT(e) FROM Employee e JOIN e.department d GROUP BY d.name"
    )
    .getResultList();
```

---

## Criteria API

### Type-Safe Queries
```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<User> cq = cb.createQuery(User.class);
Root<User> user = cq.from(User.class);

// Simple query
cq.select(user).where(cb.equal(user.get("email"), "test@example.com"));
List<User> users = entityManager.createQuery(cq).getResultList();

// Multiple conditions
Predicate emailPredicate = cb.equal(user.get("email"), "test@example.com");
Predicate activePredicate = cb.isTrue(user.get("active"));
cq.select(user).where(cb.and(emailPredicate, activePredicate));

// Dynamic queries
List<Predicate> predicates = new ArrayList<>();
if (email != null) {
    predicates.add(cb.equal(user.get("email"), email));
}
if (active != null) {
    predicates.add(cb.equal(user.get("active"), active));
}
cq.select(user).where(predicates.toArray(new Predicate[0]));
```

---

## Spring Data JPA

### Repository Interface
```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Derived query methods
    List<User> findByEmail(String email);
    List<User> findByActiveTrue();
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    // Custom query
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
    List<User> findByEmailDomain(@Param("domain") String domain);
    
    // Native query
    @Query(value = "SELECT * FROM users WHERE active = 1", nativeQuery = true)
    List<User> findActiveUsersNative();
    
    // Modifying query
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);
}
```

### Service Layer
```java
@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

---

## Advanced Features

### Auditing
```java
@EntityListeners(AuditingEntityListener.class)
@Entity
public class User {
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    private String createdBy;
    
    @LastModifiedBy
    private String updatedBy;
}

// Enable auditing
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.of("system");
    }
}
```

### Soft Delete
```java
@Entity
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class User {
    @Id
    private Long id;
    
    private boolean deleted = false;
}
```

### Optimistic Locking
```java
@Entity
public class Product {
    @Id
    private Long id;
    
    @Version
    private Long version;
    
    private String name;
    private BigDecimal price;
}
```

### Pessimistic Locking
```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT u FROM User u WHERE u.id = :id")
User findByIdWithLock(@Param("id") Long id);
```

### Inheritance Mapping

#### Single Table
```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
public abstract class Vehicle {
    @Id
    private Long id;
    private String brand;
}

@Entity
@DiscriminatorValue("CAR")
public class Car extends Vehicle {
    private int doors;
}

@Entity
@DiscriminatorValue("BIKE")
public class Bike extends Vehicle {
    private boolean hasCarrier;
}
```

#### Joined Table
```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Person {
    @Id
    private Long id;
    private String name;
}

@Entity
public class Employee extends Person {
    private String department;
}
```

---

## Practical Use Cases

### 1. Pagination
```java
public Page<User> findUsers(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    return userRepository.findAll(pageable);
}
```

### 2. Specifications
```java
public class UserSpecifications {
    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> cb.equal(root.get("email"), email);
    }
    
    public static Specification<User> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }
}

// Usage
List<User> users = userRepository.findAll(
    Specification.where(UserSpecifications.hasEmail("test@example.com"))
        .and(UserSpecifications.isActive())
);
```

### 3. Projections
```java
public interface UserSummary {
    String getUsername();
    String getEmail();
}

public interface UserRepository extends JpaRepository<User, Long> {
    List<UserSummary> findAllProjectedBy();
}
```

### 4. Batch Operations
```java
@Transactional
public void batchInsert(List<User> users) {
    int batchSize = 50;
    for (int i = 0; i < users.size(); i++) {
        entityManager.persist(users.get(i));
        if (i % batchSize == 0 && i > 0) {
            entityManager.flush();
            entityManager.clear();
        }
    }
}
```

### 5. Custom Repository
```java
public interface CustomUserRepository {
    List<User> findUsersWithCustomLogic();
}

public class CustomUserRepositoryImpl implements CustomUserRepository {
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<User> findUsersWithCustomLogic() {
        // Custom implementation
        return entityManager.createQuery("...", User.class).getResultList();
    }
}

public interface UserRepository extends JpaRepository<User, Long>, CustomUserRepository {
}
```

---

## Performance Optimization

### 1. Fetch Strategies
```java
// Lazy loading (default for collections)
@OneToMany(fetch = FetchType.LAZY)
private List<Order> orders;

// Eager loading
@ManyToOne(fetch = FetchType.EAGER)
private Department department;

// Entity graph
@EntityGraph(attributePaths = {"orders", "profile"})
List<User> findAll();
```

### 2. N+1 Problem Solution
```java
// Bad - N+1 queries
List<User> users = userRepository.findAll();
users.forEach(u -> System.out.println(u.getDepartment().getName()));

// Good - Join fetch
@Query("SELECT u FROM User u JOIN FETCH u.department")
List<User> findAllWithDepartment();
```

### 3. Caching
```java
@Entity
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {
    @Id
    private Long id;
}

// Query cache
@QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
List<Product> findByCategory(String category);
```

### 4. Batch Fetching
```java
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    @BatchSize(size = 10)
    private List<Order> orders;
}
```

---

## Configuration

### application.properties
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Connection pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# Batch processing
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

---

## Best Practices

✅ **Use lazy loading** for collections to avoid performance issues
✅ **Always use transactions** for write operations
✅ **Implement equals() and hashCode()** for entities
✅ **Use projections** when you don't need full entities
✅ **Enable query logging** during development
✅ **Use connection pooling** (HikariCP)
✅ **Index frequently queried columns**
✅ **Use @Transactional(readOnly = true)** for read operations

❌ **Don't use bidirectional relationships** unless necessary
❌ **Don't fetch all data** without pagination
❌ **Don't ignore N+1 query problems**
❌ **Don't use native queries** unless absolutely needed
❌ **Don't perform business logic** in entity classes

---

## Common Pitfalls

### 1. LazyInitializationException
```java
// Problem
@Transactional
public User getUser(Long id) {
    return userRepository.findById(id).orElse(null);
}
// Outside transaction
user.getOrders().size(); // Exception!

// Solution
@Transactional
public User getUserWithOrders(Long id) {
    User user = userRepository.findById(id).orElse(null);
    user.getOrders().size(); // Initialize within transaction
    return user;
}
```

### 2. Detached Entity
```java
// Problem
User user = new User();
user.setId(1L);
entityManager.merge(user); // May create duplicate

// Solution
User user = entityManager.find(User.class, 1L);
user.setEmail("new@email.com");
// Auto-updated
```

---

## Conclusion

JPA provides a powerful abstraction for database operations in Java. Master these concepts to build efficient, maintainable data access layers.

**Key Takeaways**:
- Understand entity lifecycle and persistence context
- Use appropriate fetch strategies and avoid N+1 problems
- Leverage Spring Data JPA for cleaner code
- Optimize queries with proper indexing and caching
- Always use transactions for data consistency

---

*Happy Persisting!*
