---
title: "AWS Cloud Practitioner Practice Exam 15 (Questions 911-975)"
date: "2024-01-26"
category: "AWS Certification"
tags: ["AWS", "Cloud Practitioner", "Certification", "Practice Exam"]
---

# AWS Cloud Practitioner Practice Exam 15
## Final Comprehensive Review - All Domains (Questions 911-975)

### Cloud Concepts (17 questions)

**Q911: A company wants to build a highly available web application. Which AWS services should they use?**
- A) Single EC2 instance in one AZ
- B) Multi-AZ deployment with ELB and Auto Scaling
- C) Single RDS instance
- D) EC2 instances in one AZ with manual failover

**Answer: B) Multi-AZ deployment with ELB and Auto Scaling**
**Explanation:** High availability requires resources across multiple AZs with load balancing and automatic scaling to handle failures and traffic changes.

**Q912: What is the most cost-effective storage option for data that is rarely accessed and can tolerate retrieval times of 12+ hours?**
- A) Amazon S3 Standard
- B) Amazon S3 Glacier Flexible Retrieval
- C) Amazon S3 Glacier Deep Archive
- D) Amazon EBS

**Answer: C) Amazon S3 Glacier Deep Archive**
**Explanation:** Glacier Deep Archive is the lowest-cost storage for long-term archival with retrieval times of 12-48 hours.

**Q913: A startup wants to build a serverless REST API. Which combination of services should they use?**
- A) EC2 + RDS + Route 53
- B) API Gateway + Lambda + DynamoDB
- C) ECS + Aurora + CloudFront
- D) Elastic Beanstalk + RDS

**Answer: B) API Gateway + Lambda + DynamoDB**
**Explanation:** This combination provides a fully serverless architecture: API Gateway for REST endpoints, Lambda for compute, and DynamoDB for NoSQL storage.

**Q914: Which service enables hybrid cloud storage by connecting on-premises applications to AWS storage?**
- A) Amazon S3
- B) AWS Storage Gateway
- C) Amazon EFS
- D) AWS Backup

**Answer: B) AWS Storage Gateway**
**Explanation:** Storage Gateway provides seamless integration between on-premises applications and AWS storage services.

**Q915: A company needs to process streaming data in real-time. Which service should they use?**
- A) Amazon S3
- B) Amazon RDS
- C) Amazon Kinesis Data Streams
- D) AWS Batch

**Answer: C) Amazon Kinesis Data Streams**
**Explanation:** Kinesis Data Streams collects and processes large streams of data records in real-time.

**Q916: What is the benefit of using multiple AWS Regions?**
- A) Lower costs
- B) Geographic redundancy and disaster recovery
- C) Faster development
- D) Simplified management

**Answer: B) Geographic redundancy and disaster recovery**
**Explanation:** Multiple Regions provide geographic redundancy, enabling disaster recovery and serving users from locations closer to them.

**Q917: A company has an RTO of 1 hour and RPO of 15 minutes. Which disaster recovery strategy is most appropriate?**
- A) Backup and Restore
- B) Pilot Light
- C) Warm Standby
- D) Multi-Site Active-Active

**Answer: C) Warm Standby**
**Explanation:** Warm Standby maintains a scaled-down version of the environment running, allowing recovery within 1 hour while minimizing data loss to 15 minutes.

**Q918: Which AWS service provides application performance monitoring and distributed tracing?**
- A) Amazon CloudWatch
- B) AWS X-Ray
- C) AWS CloudTrail
- D) Both A and B

**Answer: D) Both A and B**
**Explanation:** CloudWatch monitors application metrics and logs, while X-Ray provides distributed tracing for analyzing application performance.

**Q919: What is the primary purpose of AWS Global Accelerator?**
- A) Content caching
- B) Improve application availability and performance using AWS global network
- C) DNS routing
- D) Load balancing within a Region

**Answer: B) Improve application availability and performance using AWS global network**
**Explanation:** Global Accelerator uses AWS's global network to route traffic to optimal endpoints, improving performance and availability.

**Q920: A company needs to design a solution that can scale automatically based on demand. Which services support auto scaling?**
- A) Amazon EC2 with Auto Scaling
- B) Amazon ECS and EKS
- C) AWS Lambda
- D) All of the above

**Answer: D) All of the above**
**Explanation:** EC2 Auto Scaling, ECS/EKS service auto scaling, and Lambda's automatic scaling all adjust capacity based on demand.

**Q921: What is the difference between vertical and horizontal scaling?**
- A) Vertical adds more instances, horizontal increases instance size
- B) Vertical increases instance size, horizontal adds more instances
- C) No difference
- D) Vertical is for databases, horizontal is for compute

**Answer: B) Vertical increases instance size, horizontal adds more instances**
**Explanation:** Vertical scaling (scale up) increases the size of existing resources, while horizontal scaling (scale out) adds more resources.

**Q922: Which service provides a managed message queue for decoupling application components?**
- A) Amazon SNS
- B) Amazon SQS
- C) Amazon EventBridge
- D) AWS Step Functions

**Answer: B) Amazon SQS**
**Explanation:** SQS is a fully managed message queuing service that decouples and scales microservices, distributed systems, and serverless applications.

**Q923: A company wants to implement a microservices architecture. Which AWS services are most suitable?**
- A) Amazon ECS/EKS for containers
- B) AWS Lambda for serverless functions
- C) API Gateway for service communication
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Microservices can be implemented using containers (ECS/EKS), serverless functions (Lambda), and API Gateway for inter-service communication.

**Q924: What is the benefit of using Amazon CloudFront?**
- A) Reduced latency by caching content at edge locations
- B) DDoS protection
- C) SSL/TLS encryption
- D) All of the above

**Answer: D) All of the above**
**Explanation:** CloudFront provides content caching at edge locations for low latency, integrates with Shield for DDoS protection, and supports SSL/TLS.

**Q925: Which service helps coordinate multiple AWS services into serverless workflows?**
- A) AWS Lambda
- B) AWS Step Functions
- C) Amazon SQS
- D) Amazon EventBridge

**Answer: B) AWS Step Functions**
**Explanation:** Step Functions coordinates multiple AWS services into serverless workflows using visual workflows and state machines.

**Q926: A company wants to run batch computing jobs. Which service is most cost-effective?**
- A) Amazon EC2 On-Demand
- B) AWS Batch with Spot Instances
- C) AWS Lambda
- D) Amazon ECS

**Answer: B) AWS Batch with Spot Instances**
**Explanation:** AWS Batch automatically provisions compute resources and uses Spot Instances for significant cost savings on batch workloads.

**Q927: What is the purpose of Amazon EventBridge?**
- A) Event bus for building event-driven applications
- B) Connect applications using events from AWS services and SaaS
- C) Route events to targets like Lambda, SNS, SQS
- D) All of the above

**Answer: D) All of the above**
**Explanation:** EventBridge is a serverless event bus that connects applications using events from AWS services, SaaS applications, and custom sources.

### Security & Compliance (16 questions)

**Q928: A company needs to protect their web application from DDoS attacks. Which services should they use?**
- A) AWS Shield Standard (free)
- B) AWS Shield Advanced
- C) AWS WAF
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Shield Standard provides automatic DDoS protection, Shield Advanced adds enhanced protection and 24/7 support, and WAF filters malicious traffic.

**Q929: Which service helps detect unusual API activity and potential security threats?**
- A) AWS CloudTrail
- B) Amazon GuardDuty
- C) AWS Config
- D) Amazon Inspector

**Answer: B) Amazon GuardDuty**
**Explanation:** GuardDuty uses machine learning to detect unusual API calls, unauthorized deployments, and compromised instances.

**Q930: A company needs to encrypt data at rest in S3. What options are available?**
- A) SSE-S3 (S3-managed keys)
- B) SSE-KMS (KMS-managed keys)
- C) SSE-C (customer-provided keys)
- D) All of the above

**Answer: D) All of the above**
**Explanation:** S3 supports three server-side encryption options: S3-managed keys, KMS-managed keys, and customer-provided keys.

**Q931: Which service provides centralized security findings across AWS accounts?**
- A) Amazon GuardDuty
- B) AWS Security Hub
- C) Amazon Inspector
- D) AWS Config

**Answer: B) AWS Security Hub**
**Explanation:** Security Hub aggregates, organizes, and prioritizes security findings from multiple AWS services and partner solutions.

**Q932: A company wants to implement least privilege access. Which IAM best practice should they follow?**
- A) Grant minimum permissions required
- B) Use IAM roles instead of long-term credentials
- C) Enable MFA for privileged users
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Least privilege requires granting minimum permissions, using temporary credentials (roles), and adding MFA for sensitive operations.

**Q933: Which service scans EC2 instances for software vulnerabilities?**
- A) Amazon GuardDuty
- B) Amazon Inspector
- C) AWS Security Hub
- D) AWS Systems Manager

**Answer: B) Amazon Inspector**
**Explanation:** Inspector automatically assesses EC2 instances for software vulnerabilities and deviations from best practices.

**Q934: A company needs to meet PCI DSS compliance. Which AWS service provides compliance documentation?**
- A) AWS Artifact
- B) AWS Config
- C) AWS CloudTrail
- D) AWS Security Hub

**Answer: A) AWS Artifact**
**Explanation:** AWS Artifact provides on-demand access to AWS compliance reports and agreements, including PCI DSS.

**Q935: Which feature of AWS KMS allows automatic key rotation?**
- A) Manual key rotation
- B) Automatic annual key rotation for customer managed keys
- C) Key deletion
- D) Key import

**Answer: B) Automatic annual key rotation for customer managed keys**
**Explanation:** KMS supports automatic annual rotation for customer managed keys, creating new cryptographic material while keeping the same key ID.

**Q936: A company wants to control access to S3 buckets based on source IP address. What should they use?**
- A) IAM policies
- B) S3 bucket policies
- C) Security groups
- D) Network ACLs

**Answer: B) S3 bucket policies**
**Explanation:** S3 bucket policies can include conditions based on source IP address to control access.

**Q937: Which service provides a managed firewall for VPCs?**
- A) Security Groups
- B) Network ACLs
- C) AWS Network Firewall
- D) AWS WAF

**Answer: C) AWS Network Firewall**
**Explanation:** AWS Network Firewall is a managed service that provides network protection for VPCs with stateful inspection and intrusion prevention.

**Q938: A company needs to ensure all S3 buckets are encrypted. Which service can automatically check this?**
- A) AWS Config
- B) AWS CloudTrail
- C) Amazon GuardDuty
- D) AWS Security Hub

**Answer: A) AWS Config**
**Explanation:** AWS Config can evaluate S3 buckets against rules like s3-bucket-server-side-encryption-enabled to ensure compliance.

**Q939: Which service provides secrets management with automatic rotation?**
- A) AWS Systems Manager Parameter Store
- B) AWS Secrets Manager
- C) AWS KMS
- D) Amazon S3

**Answer: B) AWS Secrets Manager**
**Explanation:** Secrets Manager stores, rotates, and manages secrets like database credentials with built-in rotation for supported databases.

**Q940: A company wants to implement network segmentation. Which VPC feature should they use?**
- A) Subnets
- B) Security Groups
- C) Network ACLs
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Network segmentation uses subnets to isolate resources, Security Groups for instance-level firewalls, and NACLs for subnet-level firewalls.

**Q941: Which service provides DDoS cost protection?**
- A) AWS Shield Standard
- B) AWS Shield Advanced
- C) AWS WAF
- D) Amazon CloudFront

**Answer: B) AWS Shield Advanced**
**Explanation:** Shield Advanced includes DDoS cost protection, which provides credits for scaling charges during DDoS attacks.

**Q942: A company needs to audit all changes to security groups. Which service should they use?**
- A) AWS CloudTrail
- B) AWS Config
- C) Amazon CloudWatch
- D) Both A and B

**Answer: D) Both A and B**
**Explanation:** CloudTrail logs API calls that modify security groups, and Config tracks configuration changes over time.

**Q943: Which IAM feature allows temporary access to AWS resources?**
- A) IAM users
- B) IAM roles
- C) IAM groups
- D) IAM policies

**Answer: B) IAM roles**
**Explanation:** IAM roles provide temporary security credentials for accessing AWS resources without long-term access keys.

### Technology (22 questions)

**Q944: A company wants to deploy a web application with minimal operational overhead. Which service should they use?**
- A) Amazon EC2
- B) AWS Elastic Beanstalk
- C) Amazon ECS
- D) AWS Lambda

**Answer: B) AWS Elastic Beanstalk**
**Explanation:** Elastic Beanstalk automatically handles deployment, capacity provisioning, load balancing, and auto scaling with minimal operational overhead.

**Q945: Which database service is best for caching frequently accessed data?**
- A) Amazon RDS
- B) Amazon DynamoDB
- C) Amazon ElastiCache
- D) Amazon Aurora

**Answer: C) Amazon ElastiCache**
**Explanation:** ElastiCache is an in-memory caching service (Redis/Memcached) designed for sub-millisecond latency on frequently accessed data.

**Q946: A company needs a fully managed NoSQL database with single-digit millisecond latency. Which service should they use?**
- A) Amazon RDS
- B) Amazon DynamoDB
- C) Amazon Aurora
- D) Amazon Redshift

**Answer: B) Amazon DynamoDB**
**Explanation:** DynamoDB is a fully managed NoSQL database that provides consistent single-digit millisecond latency at any scale.

**Q947: Which service provides a managed Hadoop framework for big data processing?**
- A) Amazon EMR
- B) AWS Glue
- C) Amazon Athena
- D) Amazon Redshift

**Answer: A) Amazon EMR**
**Explanation:** Amazon EMR (Elastic MapReduce) is a managed cluster platform for running big data frameworks like Hadoop and Spark.

**Q948: A company wants to analyze data in S3 using SQL without loading it into a database. Which service should they use?**
- A) Amazon RDS
- B) Amazon Athena
- C) Amazon Redshift
- D) AWS Glue

**Answer: B) Amazon Athena**
**Explanation:** Athena is a serverless query service that analyzes data directly in S3 using standard SQL.

**Q949: Which service provides a managed ETL (Extract, Transform, Load) service?**
- A) AWS Glue
- B) AWS Data Pipeline
- C) Amazon EMR
- D) AWS Lambda

**Answer: A) AWS Glue**
**Explanation:** AWS Glue is a fully managed ETL service that prepares and transforms data for analytics.

**Q950: A company needs a data warehouse for analytics. Which service should they use?**
- A) Amazon RDS
- B) Amazon DynamoDB
- C) Amazon Redshift
- D) Amazon Aurora

**Answer: C) Amazon Redshift**
**Explanation:** Redshift is a fully managed data warehouse service optimized for analytics and complex queries on large datasets.

**Q951: Which service provides managed streaming for Apache Kafka?**
- A) Amazon Kinesis
- B) Amazon MSK (Managed Streaming for Kafka)
- C) Amazon SQS
- D) Amazon SNS

**Answer: B) Amazon MSK (Managed Streaming for Kafka)**
**Explanation:** Amazon MSK is a fully managed service for Apache Kafka, making it easy to build and run applications that use Kafka.

**Q952: A company wants to build a data lake. Which service is the foundation?**
- A) Amazon RDS
- B) Amazon S3
- C) Amazon DynamoDB
- D) Amazon Redshift

**Answer: B) Amazon S3**
**Explanation:** S3 is the foundation for data lakes, providing scalable, durable, and cost-effective storage for structured and unstructured data.

**Q953: Which service provides managed machine learning model deployment?**
- A) Amazon SageMaker
- B) AWS Lambda
- C) Amazon EC2
- D) AWS Batch

**Answer: A) Amazon SageMaker**
**Explanation:** SageMaker provides a fully managed platform to build, train, and deploy machine learning models at scale.

**Q954: A company needs to transcribe audio files to text. Which service should they use?**
- A) Amazon Polly
- B) Amazon Transcribe
- C) Amazon Translate
- D) Amazon Comprehend

**Answer: B) Amazon Transcribe**
**Explanation:** Amazon Transcribe automatically converts speech to text using automatic speech recognition (ASR).

**Q955: Which service converts text to lifelike speech?**
- A) Amazon Polly
- B) Amazon Transcribe
- C) Amazon Translate
- D) Amazon Lex

**Answer: A) Amazon Polly**
**Explanation:** Amazon Polly converts text into lifelike speech using deep learning, supporting multiple languages and voices.

**Q956: A company wants to add image and video analysis to their application. Which service should they use?**
- A) Amazon Rekognition
- B) Amazon Comprehend
- C) Amazon Textract
- D) Amazon Translate

**Answer: A) Amazon Rekognition**
**Explanation:** Rekognition provides image and video analysis, including object detection, facial analysis, and content moderation.

**Q957: Which service extracts text and data from scanned documents?**
- A) Amazon Rekognition
- B) Amazon Textract
- C) Amazon Comprehend
- D) Amazon Transcribe

**Answer: B) Amazon Textract**
**Explanation:** Textract automatically extracts text, handwriting, and data from scanned documents using machine learning.

**Q958: A company needs to build a chatbot. Which service should they use?**
- A) Amazon Polly
- B) Amazon Lex
- C) Amazon Comprehend
- D) Amazon Transcribe

**Answer: B) Amazon Lex**
**Explanation:** Amazon Lex builds conversational interfaces (chatbots) using the same technology as Amazon Alexa.

**Q959: Which service provides natural language processing (NLP) to extract insights from text?**
- A) Amazon Comprehend
- B) Amazon Translate
- C) Amazon Polly
- D) Amazon Transcribe

**Answer: A) Amazon Comprehend**
**Explanation:** Comprehend uses NLP to extract insights like sentiment, entities, key phrases, and language from text.

**Q960: A company wants to translate text between languages. Which service should they use?**
- A) Amazon Polly
- B) Amazon Translate
- C) Amazon Comprehend
- D) Amazon Transcribe

**Answer: B) Amazon Translate**
**Explanation:** Amazon Translate provides neural machine translation for translating text between languages.

**Q961: Which service provides managed blockchain networks?**
- A) Amazon QLDB
- B) Amazon Managed Blockchain
- C) Amazon DynamoDB
- D) Amazon RDS

**Answer: B) Amazon Managed Blockchain**
**Explanation:** Amazon Managed Blockchain creates and manages scalable blockchain networks using Hyperledger Fabric or Ethereum.

**Q962: A company needs an immutable ledger database. Which service should they use?**
- A) Amazon RDS
- B) Amazon QLDB
- C) Amazon DynamoDB
- D) Amazon Aurora

**Answer: B) Amazon QLDB**
**Explanation:** Amazon QLDB (Quantum Ledger Database) provides a transparent, immutable, and cryptographically verifiable transaction log.

**Q963: Which service provides managed Apache Cassandra?**
- A) Amazon DynamoDB
- B) Amazon Keyspaces
- C) Amazon RDS
- D) Amazon DocumentDB

**Answer: B) Amazon Keyspaces**
**Explanation:** Amazon Keyspaces is a scalable, managed Apache Cassandra-compatible database service.

**Q964: A company wants a MongoDB-compatible database. Which service should they use?**
- A) Amazon DynamoDB
- B) Amazon DocumentDB
- C) Amazon RDS
- D) Amazon Neptune

**Answer: B) Amazon DocumentDB**
**Explanation:** Amazon DocumentDB is a fully managed document database service that is MongoDB-compatible.

**Q965: Which service provides a managed graph database?**
- A) Amazon DynamoDB
- B) Amazon Neptune
- C) Amazon RDS
- D) Amazon Aurora

**Answer: B) Amazon Neptune**
**Explanation:** Amazon Neptune is a fully managed graph database service supporting property graph and RDF models.

### Billing & Pricing (10 questions)

**Q966: A company wants to reduce costs for EC2 instances with predictable usage. Which pricing model should they use?**
- A) On-Demand
- B) Reserved Instances
- C) Spot Instances
- D) Dedicated Hosts

**Answer: B) Reserved Instances**
**Explanation:** Reserved Instances provide up to 75% discount for predictable workloads with 1 or 3-year commitments.

**Q967: Which pricing model offers the highest discount but can be interrupted?**
- A) On-Demand
- B) Reserved Instances
- C) Spot Instances
- D) Savings Plans

**Answer: C) Spot Instances**
**Explanation:** Spot Instances offer up to 90% discount but can be interrupted by AWS with 2-minute notice when capacity is needed.

**Q968: A company wants flexibility to change instance families while getting discounts. Which option should they use?**
- A) Standard Reserved Instances
- B) Convertible Reserved Instances
- C) Spot Instances
- D) On-Demand Instances

**Answer: B) Convertible Reserved Instances**
**Explanation:** Convertible RIs allow changing instance families, OS, and tenancy while providing up to 54% discount.

**Q969: Which service helps identify unused or underutilized resources?**
- A) AWS Cost Explorer
- B) AWS Trusted Advisor
- C) AWS Compute Optimizer
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Cost Explorer analyzes spending patterns, Trusted Advisor identifies idle resources, and Compute Optimizer recommends right-sizing.

**Q970: A company wants to set spending alerts. Which service should they use?**
- A) AWS Budgets
- B) AWS Cost Explorer
- C) AWS Billing Dashboard
- D) Amazon CloudWatch

**Answer: A) AWS Budgets**
**Explanation:** AWS Budgets allows setting custom cost and usage budgets with alerts when thresholds are exceeded.

**Q971: Which data transfer is always free?**
- A) Data transfer into AWS from internet
- B) Data transfer out to internet
- C) Data transfer between Regions
- D) Data transfer between AZs

**Answer: A) Data transfer into AWS from internet**
**Explanation:** Data transfer into AWS (ingress) from the internet is free; egress and inter-region transfers incur charges.

**Q972: A company wants to analyze their AWS spending trends. Which service provides visualizations?**
- A) AWS Cost Explorer
- B) AWS Budgets
- C) AWS Billing Dashboard
- D) AWS Cost and Usage Report

**Answer: A) AWS Cost Explorer**
**Explanation:** Cost Explorer provides interactive visualizations to analyze and understand AWS spending over time.

**Q973: Which service provides the most detailed billing data?**
- A) AWS Billing Dashboard
- B) AWS Cost Explorer
- C) AWS Cost and Usage Report
- D) AWS Budgets

**Answer: C) AWS Cost and Usage Report**
**Explanation:** Cost and Usage Report provides the most comprehensive billing data, including hourly usage and resource tags.

**Q974: A company wants to allocate costs to different departments. What should they use?**
- A) Cost allocation tags
- B) AWS Organizations
- C) Separate AWS accounts
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Cost allocation tags track costs by department, Organizations consolidates billing, and separate accounts provide clear cost separation.

**Q975: Which AWS service is always free?**
- A) Amazon S3
- B) AWS IAM
- C) Amazon EC2
- D) Amazon RDS

**Answer: B) AWS IAM**
**Explanation:** AWS IAM is always free with no additional charges for creating users, groups, roles, and policies.

---

## Exam 15 Complete - 65 Questions
**Final Review Focus:** Comprehensive coverage of all domains including high availability architecture, serverless applications, security best practices, AI/ML services, database options, analytics services, and cost optimization strategies.

**Key Topics:**
- Architecture: Multi-AZ, Auto Scaling, Load Balancing, Disaster Recovery
- Serverless: Lambda, API Gateway, DynamoDB, Step Functions, EventBridge
- Security: Shield, WAF, GuardDuty, Security Hub, Inspector, KMS, Secrets Manager
- Databases: RDS, Aurora, DynamoDB, ElastiCache, Redshift, specialized databases
- Analytics: Athena, EMR, Glue, Kinesis, MSK, QuickSight
- AI/ML: SageMaker, Rekognition, Transcribe, Polly, Comprehend, Translate, Lex, Textract
- Cost Optimization: Reserved Instances, Spot Instances, Savings Plans, Cost Explorer, Budgets

## Congratulations!
You've completed all 15 AWS Cloud Practitioner Practice Exams (975 questions total). Review your incorrect answers, understand the explanations, and focus on weak areas before taking the real exam.
