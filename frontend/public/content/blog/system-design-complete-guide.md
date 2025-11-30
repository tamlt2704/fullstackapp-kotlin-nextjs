---
title: "System Design Complete Guide for Interviews"
date: "2024-12-07"
category: "System Design"
tags: ["System Design", "Architecture", "Scalability", "Interview", "Distributed Systems"]
---

# System Design Complete Guide for Interviews

*Published on December 7, 2024*

## 1. System Design Fundamentals

### What is System Design?
System design is the process of defining architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. It involves making trade-offs between various factors like performance, scalability, reliability, and cost.

### Key Principles
- **Scalability**: Handle increased load gracefully
- **Reliability**: System continues to work correctly
- **Availability**: System remains operational over time
- **Consistency**: All nodes see the same data simultaneously
- **Partition Tolerance**: System continues despite network failures
- **Performance**: Low latency and high throughput

### CAP Theorem
You can only guarantee 2 out of 3:
- **Consistency**: All nodes see the same data
- **Availability**: System remains operational
- **Partition Tolerance**: System works despite network failures

### Q&A: System Design Fundamentals

**Q1: What's the difference between horizontal and vertical scaling?**
A: Vertical scaling adds more power to existing machines (CPU, RAM). Horizontal scaling adds more machines to the pool of resources.

**Q2: What is the CAP theorem and give examples?**
A: CAP theorem states you can only have 2 of 3: Consistency, Availability, Partition tolerance. Examples: CP (MongoDB), AP (Cassandra), CA (traditional RDBMS in single location).

**Q3: What's the difference between latency and throughput?**
A: Latency is response time for a single request. Throughput is the number of requests processed per unit time.

**Q4: What is eventual consistency?**
A: System will become consistent over time, but may be temporarily inconsistent. Used in distributed systems for better availability.

**Q5: What are the main challenges in distributed systems?**
A: Network failures, partial failures, clock synchronization, consensus, data consistency, and fault tolerance.

## 2. Load Balancing and Caching

### Load Balancing Strategies

#### Round Robin
```
Request 1 → Server A
Request 2 → Server B  
Request 3 → Server C
Request 4 → Server A (cycle repeats)
```

#### Weighted Round Robin
```
Server A (weight: 3): Gets 3 requests
Server B (weight: 2): Gets 2 requests
Server C (weight: 1): Gets 1 request
```

#### Least Connections
```
Route to server with fewest active connections
Good for long-lived connections
```

#### IP Hash
```
hash(client_ip) % server_count = server_index
Ensures same client always goes to same server
```

### Load Balancer Types

#### Layer 4 (Transport Layer)
```
- Routes based on IP and port
- Faster, less CPU intensive
- Cannot inspect application data
- Examples: AWS NLB, HAProxy
```

#### Layer 7 (Application Layer)
```
- Routes based on application data (HTTP headers, URLs)
- More intelligent routing decisions
- SSL termination, content-based routing
- Examples: AWS ALB, Nginx
```

### Caching Strategies

#### Cache-Aside (Lazy Loading)
```python
def get_user(user_id):
    # Check cache first
    user = cache.get(f"user:{user_id}")
    if user is None:
        # Cache miss - fetch from database
        user = database.get_user(user_id)
        # Store in cache
        cache.set(f"user:{user_id}", user, ttl=3600)
    return user

def update_user(user_id, data):
    # Update database
    database.update_user(user_id, data)
    # Invalidate cache
    cache.delete(f"user:{user_id}")
```

#### Write-Through
```python
def update_user(user_id, data):
    # Update database first
    database.update_user(user_id, data)
    # Update cache
    cache.set(f"user:{user_id}", data, ttl=3600)
```

#### Write-Behind (Write-Back)
```python
def update_user(user_id, data):
    # Update cache immediately
    cache.set(f"user:{user_id}", data, ttl=3600)
    # Queue database update for later
    queue.enqueue('update_user_db', user_id, data)
```

### Cache Levels
```
1. Browser Cache (client-side)
2. CDN (Content Delivery Network)
3. Reverse Proxy Cache (Nginx, Varnish)
4. Application Cache (Redis, Memcached)
5. Database Cache (query result cache)
```

### Q&A: Load Balancing and Caching

**Q1: When would you use Layer 4 vs Layer 7 load balancing?**
A: Layer 4 for high performance, simple routing. Layer 7 for content-based routing, SSL termination, and application-aware decisions.

**Q2: What are the pros and cons of different caching strategies?**
A: Cache-aside: Simple, cache misses penalty. Write-through: Consistent, write penalty. Write-behind: Fast writes, risk of data loss.

**Q3: How do you handle cache invalidation?**
A: TTL expiration, manual invalidation on updates, cache tags, or event-driven invalidation.

**Q4: What's the difference between Redis and Memcached?**
A: Redis supports data structures, persistence, clustering. Memcached is simpler, faster for basic key-value operations.

**Q5: How do you prevent cache stampede?**
A: Use locks, staggered TTL, cache warming, or probabilistic early expiration.

## 3. Database Design and Scaling

### Database Scaling Strategies

#### Read Replicas
```
Master Database (Write)
    ├── Read Replica 1
    ├── Read Replica 2
    └── Read Replica 3

Benefits:
- Distribute read load
- Improve read performance
- Geographic distribution

Challenges:
- Replication lag
- Eventual consistency
- Failover complexity
```

#### Database Sharding
```python
# Horizontal partitioning by user_id
def get_shard(user_id):
    return user_id % num_shards

# Range-based sharding
def get_shard_by_range(user_id):
    if user_id < 1000000:
        return 'shard_1'
    elif user_id < 2000000:
        return 'shard_2'
    else:
        return 'shard_3'

# Directory-based sharding
shard_map = {
    'users_1_1000000': 'shard_1',
    'users_1000001_2000000': 'shard_2'
}
```

#### Database Partitioning Types
```sql
-- Horizontal Partitioning (Sharding)
CREATE TABLE orders_2024_q1 PARTITION OF orders
FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

-- Vertical Partitioning
-- Split table by columns
CREATE TABLE user_basic (id, name, email);
CREATE TABLE user_profile (id, bio, preferences, settings);

-- Functional Partitioning
-- Split by feature/service
-- User Service DB: users, profiles
-- Order Service DB: orders, payments
-- Product Service DB: products, inventory
```

### NoSQL Database Types

#### Document Stores (MongoDB, CouchDB)
```javascript
// Flexible schema
{
  "_id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "addresses": [
    {
      "type": "home",
      "street": "123 Main St",
      "city": "New York"
    }
  ],
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}

// Use cases: Content management, catalogs, user profiles
```

#### Key-Value Stores (Redis, DynamoDB)
```python
# Simple key-value operations
cache.set("user:123", user_data)
cache.get("user:123")

# Use cases: Caching, session storage, real-time recommendations
```

#### Column-Family (Cassandra, HBase)
```
Row Key: user123
Column Family: profile
  - name: "John Doe"
  - email: "john@example.com"
  - created: "2024-01-01"

Column Family: activity
  - login_2024_01_01: "09:30"
  - login_2024_01_02: "10:15"

# Use cases: Time-series data, IoT data, analytics
```

#### Graph Databases (Neo4j, Amazon Neptune)
```cypher
// Create nodes and relationships
CREATE (u:User {name: "John"})
CREATE (p:Product {name: "Laptop"})
CREATE (u)-[:PURCHASED]->(p)

// Query relationships
MATCH (u:User)-[:FRIEND]->(friend)-[:PURCHASED]->(p:Product)
WHERE u.name = "John"
RETURN p.name

// Use cases: Social networks, recommendation engines, fraud detection
```

### Q&A: Database Design and Scaling

**Q1: When should you use SQL vs NoSQL databases?**
A: SQL for ACID transactions, complex queries, structured data. NoSQL for scalability, flexible schema, specific data models (document, graph).

**Q2: What are the challenges of database sharding?**
A: Cross-shard queries, rebalancing, hotspots, increased complexity, and maintaining referential integrity.

**Q3: How do you handle database failover?**
A: Master-slave replication with automatic failover, multi-master replication, or database clustering with consensus algorithms.

**Q4: What's the difference between ACID and BASE?**
A: ACID (Atomicity, Consistency, Isolation, Durability) for strong consistency. BASE (Basically Available, Soft state, Eventual consistency) for scalability.

**Q5: How do you choose the right database for your use case?**
A: Consider data structure, query patterns, consistency requirements, scalability needs, and team expertise.

## 4. Microservices Architecture

### Microservices Principles
- **Single Responsibility**: Each service has one business capability
- **Decentralized**: Independent deployment and scaling
- **Fault Isolation**: Failure in one service doesn't affect others
- **Technology Diversity**: Different services can use different technologies

### Service Communication Patterns

#### Synchronous Communication
```python
# HTTP/REST API calls
import requests

def get_user_orders(user_id):
    user_response = requests.get(f"http://user-service/users/{user_id}")
    orders_response = requests.get(f"http://order-service/orders?user_id={user_id}")
    
    return {
        "user": user_response.json(),
        "orders": orders_response.json()
    }

# gRPC
import grpc
from user_service_pb2_grpc import UserServiceStub

def get_user_grpc(user_id):
    channel = grpc.insecure_channel('user-service:50051')
    stub = UserServiceStub(channel)
    return stub.GetUser(GetUserRequest(id=user_id))
```

#### Asynchronous Communication
```python
# Message Queue (RabbitMQ, Apache Kafka)
import pika

# Publisher
def publish_order_created(order_data):
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    
    channel.queue_declare(queue='order_events')
    channel.basic_publish(
        exchange='',
        routing_key='order_events',
        body=json.dumps({
            'event_type': 'order_created',
            'data': order_data
        })
    )

# Consumer
def process_order_events():
    def callback(ch, method, properties, body):
        event = json.loads(body)
        if event['event_type'] == 'order_created':
            # Update inventory, send notification, etc.
            handle_order_created(event['data'])
    
    channel.basic_consume(queue='order_events', on_message_callback=callback)
    channel.start_consuming()
```

### Service Discovery
```python
# Service Registry (Consul, Eureka)
class ServiceRegistry:
    def __init__(self):
        self.services = {}
    
    def register(self, service_name, host, port):
        if service_name not in self.services:
            self.services[service_name] = []
        self.services[service_name].append(f"{host}:{port}")
    
    def discover(self, service_name):
        return self.services.get(service_name, [])

# Client-side load balancing
def call_service(service_name, endpoint):
    instances = service_registry.discover(service_name)
    if not instances:
        raise ServiceUnavailableError(f"No instances of {service_name}")
    
    # Round-robin selection
    instance = instances[random.randint(0, len(instances) - 1)]
    return requests.get(f"http://{instance}{endpoint}")
```

### Circuit Breaker Pattern
```python
import time
from enum import Enum

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise CircuitOpenError("Circuit breaker is open")
        
        try:
            result = func(*args, **kwargs)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise e
    
    def on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
```

### Q&A: Microservices Architecture

**Q1: What are the advantages and disadvantages of microservices?**
A: Advantages: Independent scaling, technology diversity, fault isolation. Disadvantages: Complexity, network latency, data consistency challenges.

**Q2: How do you handle distributed transactions in microservices?**
A: Use Saga pattern (choreography or orchestration), eventual consistency, or avoid distributed transactions when possible.

**Q3: What's the difference between API Gateway and Service Mesh?**
A: API Gateway handles external traffic (authentication, rate limiting). Service Mesh handles internal service-to-service communication.

**Q4: How do you monitor microservices?**
A: Distributed tracing, centralized logging, metrics collection, health checks, and service dependency mapping.

**Q5: When should you use microservices vs monolith?**
A: Microservices for large teams, complex domains, independent scaling needs. Monolith for small teams, simple domains, rapid development.

## 5. System Design Interview Process

### Step-by-Step Approach

#### 1. Clarify Requirements (5-10 minutes)
```
Functional Requirements:
- What features does the system need to support?
- What are the core use cases?
- Who are the users?

Non-Functional Requirements:
- How many users?
- What's the expected traffic?
- What's the data size?
- What are the performance requirements?
- What's the availability requirement?
```

#### 2. Estimate Scale (5 minutes)
```
Users: 100M daily active users
Requests: 1000 requests/second average, 5000 peak
Data: 1TB of data, 100GB daily growth
Storage: 10TB total with 3x replication = 30TB
Bandwidth: 1Gbps average, 5Gbps peak
```

#### 3. High-Level Design (10-15 minutes)
```
Client → Load Balancer → Web Servers → Application Servers → Database
                     ↓
                   Cache
                     ↓
                 Message Queue
```

#### 4. Detailed Design (15-20 minutes)
```
- Database schema
- API design
- Caching strategy
- Service architecture
- Data flow
```

#### 5. Scale and Optimize (10-15 minutes)
```
- Identify bottlenecks
- Scaling strategies
- Performance optimizations
- Monitoring and alerting
```

### Common System Design Questions

#### Design a URL Shortener (like bit.ly)
```
Requirements:
- Shorten long URLs
- Redirect to original URL
- Custom aliases
- Analytics
- 100M URLs per day

High-Level Design:
Client → Load Balancer → Web Servers → Cache → Database
                                    ↓
                              Analytics Service

Database Schema:
urls table:
- id (primary key)
- original_url
- short_code
- created_at
- expires_at
- user_id

API Design:
POST /shorten
{
  "url": "https://example.com/very/long/url",
  "custom_alias": "mylink",
  "expires_in": 86400
}

GET /{short_code}
→ 302 Redirect to original URL

Encoding Algorithm:
Base62 encoding (a-z, A-Z, 0-9)
7 characters = 62^7 = 3.5 trillion URLs
```

#### Design a Chat System
```
Requirements:
- 1-on-1 and group chat
- Online presence
- Message history
- Push notifications
- 100M daily users

Architecture:
Client ↔ WebSocket Gateway ↔ Chat Service ↔ Message Queue
                                    ↓
                            Message Database
                                    ↓
                            Notification Service

Real-time Communication:
- WebSocket connections
- Connection pooling
- Presence service
- Message routing

Database Design:
messages table:
- id, chat_id, user_id, content, timestamp, message_type

chats table:
- id, type (direct/group), created_at, updated_at

chat_participants table:
- chat_id, user_id, joined_at, role
```

#### Design a Social Media Feed
```
Requirements:
- Post creation and viewing
- Follow/unfollow users
- News feed generation
- 1B users, 100M daily active

Architecture:
Client → CDN → Load Balancer → API Gateway
                                    ↓
Post Service ← Message Queue ← Feed Generation Service
     ↓                              ↓
Post Database                  Feed Cache (Redis)
     ↓
User Graph Service → Graph Database

Feed Generation Strategies:
1. Pull Model (Lazy):
   - Generate feed on request
   - Query posts from followed users
   - Good for users with many followers

2. Push Model (Eager):
   - Pre-compute feeds
   - Push new posts to followers' feeds
   - Good for users with few followers

3. Hybrid Model:
   - Push for regular users
   - Pull for celebrities
   - Best of both worlds
```

### Q&A: System Design Interviews

**Q1: How do you approach system design interviews?**
A: Start with requirements, estimate scale, design high-level architecture, dive into details, and discuss trade-offs.

**Q2: What are common mistakes in system design interviews?**
A: Jumping to details too quickly, not asking clarifying questions, ignoring non-functional requirements, and not considering trade-offs.

**Q3: How do you handle disagreement with the interviewer?**
A: Listen to their perspective, explain your reasoning, discuss trade-offs, and be open to alternative approaches.

**Q4: What should you focus on in the detailed design phase?**
A: Database schema, API design, key algorithms, data flow, and critical components that affect scalability.

**Q5: How do you demonstrate senior-level thinking?**
A: Consider multiple solutions, discuss trade-offs, think about operational concerns, and show awareness of real-world constraints.

## 6. Distributed Systems Concepts

### Consistency Models

#### Strong Consistency
```
All nodes see the same data at the same time
Examples: Traditional RDBMS, Zookeeper
Trade-off: Lower availability, higher latency
```

#### Eventual Consistency
```
System will become consistent over time
Examples: DNS, Amazon S3, Cassandra
Trade-off: Higher availability, temporary inconsistency
```

#### Weak Consistency
```
No guarantees about when data will be consistent
Examples: Real-time systems, gaming
Trade-off: Best performance, no consistency guarantees
```

### Consensus Algorithms

#### Raft Algorithm
```python
class RaftNode:
    def __init__(self, node_id):
        self.node_id = node_id
        self.state = "follower"  # follower, candidate, leader
        self.current_term = 0
        self.voted_for = None
        self.log = []
        self.commit_index = 0
    
    def start_election(self):
        self.state = "candidate"
        self.current_term += 1
        self.voted_for = self.node_id
        
        # Request votes from other nodes
        votes = 1  # Vote for self
        for node in other_nodes:
            if node.request_vote(self.current_term, self.node_id):
                votes += 1
        
        if votes > len(all_nodes) // 2:
            self.become_leader()
    
    def become_leader(self):
        self.state = "leader"
        # Send heartbeats to maintain leadership
        self.send_heartbeats()
```

#### Byzantine Fault Tolerance
```
Handles malicious nodes that may send conflicting information
Requires 3f + 1 nodes to tolerate f Byzantine failures
Examples: Blockchain consensus (PBFT, Tendermint)
```

### Distributed Storage

#### Consistent Hashing
```python
import hashlib

class ConsistentHash:
    def __init__(self, nodes=None, replicas=3):
        self.replicas = replicas
        self.ring = {}
        self.sorted_keys = []
        
        if nodes:
            for node in nodes:
                self.add_node(node)
    
    def _hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)
    
    def add_node(self, node):
        for i in range(self.replicas):
            key = self._hash(f"{node}:{i}")
            self.ring[key] = node
            self.sorted_keys.append(key)
        self.sorted_keys.sort()
    
    def remove_node(self, node):
        for i in range(self.replicas):
            key = self._hash(f"{node}:{i}")
            del self.ring[key]
            self.sorted_keys.remove(key)
    
    def get_node(self, key):
        if not self.ring:
            return None
        
        hash_key = self._hash(key)
        
        # Find the first node clockwise
        for ring_key in self.sorted_keys:
            if hash_key <= ring_key:
                return self.ring[ring_key]
        
        # Wrap around to the first node
        return self.ring[self.sorted_keys[0]]
```

#### Replication Strategies
```python
# Master-Slave Replication
class MasterSlaveReplication:
    def __init__(self):
        self.master = None
        self.slaves = []
    
    def write(self, key, value):
        # Write to master first
        self.master.write(key, value)
        
        # Replicate to slaves
        for slave in self.slaves:
            slave.replicate(key, value)
    
    def read(self, key):
        # Read from any slave for load distribution
        slave = random.choice(self.slaves)
        return slave.read(key)

# Multi-Master Replication
class MultiMasterReplication:
    def __init__(self):
        self.masters = []
    
    def write(self, key, value, timestamp):
        # Write to local master
        local_master = self.get_local_master()
        local_master.write(key, value, timestamp)
        
        # Propagate to other masters
        for master in self.masters:
            if master != local_master:
                master.replicate(key, value, timestamp)
    
    def resolve_conflict(self, key, values):
        # Last-write-wins conflict resolution
        return max(values, key=lambda x: x.timestamp)
```

### Q&A: Distributed Systems

**Q1: What's the difference between CP and AP systems in CAP theorem?**
A: CP systems prioritize consistency and partition tolerance (e.g., MongoDB). AP systems prioritize availability and partition tolerance (e.g., Cassandra).

**Q2: How do you handle split-brain scenarios?**
A: Use quorum-based systems, leader election with majority consensus, or external coordination services like Zookeeper.

**Q3: What's the difference between 2PC and 3PC?**
A: 2PC (Two-Phase Commit) can block on coordinator failure. 3PC (Three-Phase Commit) adds a prepare-to-commit phase to avoid blocking.

**Q4: How does consistent hashing help with scalability?**
A: Minimizes data movement when nodes are added/removed, distributes load evenly, and provides fault tolerance.

**Q5: What are the challenges of distributed consensus?**
A: Network partitions, node failures, message delays, and the impossibility of perfect consensus in asynchronous systems (FLP impossibility).

---

*This comprehensive system design guide covers fundamental concepts to advanced distributed systems topics. Practice with real-world scenarios and stay updated with industry trends and technologies.*