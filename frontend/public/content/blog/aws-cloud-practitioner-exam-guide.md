---
title: "AWS Cloud Practitioner Certification - Complete Practice Guide"
date: "2024-12-13"
category: "Cloud"
tags: ["AWS", "Cloud", "Certification", "Cloud Practitioner", "Exam Prep"]
---

# AWS Cloud Practitioner Certification - Complete Practice Guide

*Published on December 13, 2024*

## Exam Overview

- **Exam Code**: CLF-C02
- **Duration**: 90 minutes
- **Questions**: 65 questions (50 scored, 15 unscored)
- **Format**: Multiple choice and multiple response
- **Passing Score**: 700/1000
- **Cost**: $100 USD
- **Validity**: 3 years

### Exam Domains

1. **Cloud Concepts** (24%)
2. **Security and Compliance** (30%)
3. **Cloud Technology and Services** (34%)
4. **Billing, Pricing, and Support** (12%)

---

## Domain 1: Cloud Concepts (24%)

### Q1: What is cloud computing?
**Answer**: On-demand delivery of IT resources over the internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services on an as-needed basis.

### Q2: What are the three main cloud computing models?
**Answer**:
- **IaaS** (Infrastructure as a Service) - EC2, VPC
- **PaaS** (Platform as a Service) - Elastic Beanstalk, RDS
- **SaaS** (Software as a Service) - Amazon Chime, WorkMail

### Q3: What are the three cloud deployment models?
**Answer**:
- **Public Cloud**: AWS, Azure, GCP
- **Private Cloud**: On-premises cloud (OpenStack, VMware)
- **Hybrid Cloud**: Combination of public and private

### Q4: What are the six advantages of cloud computing?
**Answer**:
1. Trade capital expense for variable expense
2. Benefit from massive economies of scale
3. Stop guessing capacity
4. Increase speed and agility
5. Stop spending money on data center maintenance
6. Go global in minutes

### Q5: What is the AWS Well-Architected Framework?
**Answer**: A framework with 6 pillars to help build secure, high-performing, resilient, and efficient infrastructure:
1. **Operational Excellence**
2. **Security**
3. **Reliability**
4. **Performance Efficiency**
5. **Cost Optimization**
6. **Sustainability**

### Q6: What is elasticity in cloud computing?
**Answer**: The ability to automatically scale resources up or down based on demand. Example: Auto Scaling groups that add EC2 instances during high traffic and remove them during low traffic.

### Q7: What is high availability?
**Answer**: Ensuring systems are operational and accessible for the maximum amount of time, typically achieved through redundancy across multiple Availability Zones.

### Q8: What is fault tolerance?
**Answer**: The ability of a system to remain operational even if some components fail. AWS achieves this through redundancy and failover mechanisms.

### Q9: What is the difference between scalability and elasticity?
**Answer**:
- **Scalability**: Ability to handle increased load by adding resources (manual or automatic)
- **Elasticity**: Automatic scaling up and down based on demand in real-time

### Q10: What is an AWS Region?
**Answer**: A physical location around the world where AWS clusters data centers. Each Region consists of multiple isolated Availability Zones. Examples: us-east-1, eu-west-1, ap-southeast-1.

### Q11: What is an Availability Zone (AZ)?
**Answer**: One or more discrete data centers with redundant power, networking, and connectivity in an AWS Region. Each Region has multiple AZs (typically 3-6) for high availability.

### Q12: What is an Edge Location?
**Answer**: A site that CloudFront uses to cache copies of content for faster delivery to users. There are more Edge Locations than Regions (400+ globally).

---

## Domain 2: Security and Compliance (30%)

### Q13: What is the AWS Shared Responsibility Model?
**Answer**:
- **AWS Responsibility** (Security OF the cloud): Physical infrastructure, hardware, networking, facilities
- **Customer Responsibility** (Security IN the cloud): Data, applications, IAM, OS patches, firewall configuration, encryption

### Q14: What is AWS IAM?
**Answer**: Identity and Access Management - A service to securely control access to AWS resources. It manages users, groups, roles, and permissions.

### Q15: What is an IAM User?
**Answer**: An entity representing a person or service that interacts with AWS. Each user has unique credentials (username/password or access keys).

### Q16: What is an IAM Group?
**Answer**: A collection of IAM users. Groups let you specify permissions for multiple users, making it easier to manage permissions.

### Q17: What is an IAM Role?
**Answer**: An IAM identity with specific permissions that can be assumed by users, applications, or services. Unlike users, roles don't have permanent credentials.

### Q18: What is an IAM Policy?
**Answer**: A JSON document that defines permissions. Policies specify what actions are allowed or denied on which resources.

### Q19: What is MFA (Multi-Factor Authentication)?
**Answer**: An extra layer of security requiring users to provide two or more verification factors: something you know (password) and something you have (MFA device/token).

### Q20: What is the principle of least privilege?
**Answer**: Granting only the minimum permissions necessary to perform a task. This reduces security risks by limiting access.

### Q21: What is AWS Organizations?
**Answer**: A service to centrally manage and govern multiple AWS accounts. It enables consolidated billing, account grouping, and policy-based management.

### Q22: What is an SCP (Service Control Policy)?
**Answer**: A policy in AWS Organizations that sets permission guardrails for accounts. SCPs don't grant permissions but limit what actions can be performed.

### Q23: What is AWS CloudTrail?
**Answer**: A service that logs all API calls made in your AWS account for auditing and compliance. It tracks who did what, when, and from where.

### Q24: What is AWS Config?
**Answer**: A service that assesses, audits, and evaluates configurations of AWS resources. It tracks resource configuration changes over time.

### Q25: What is Amazon GuardDuty?
**Answer**: A threat detection service that continuously monitors for malicious activity and unauthorized behavior using machine learning.

### Q26: What is AWS Shield?
**Answer**: A managed DDoS (Distributed Denial of Service) protection service.
- **Shield Standard**: Free, automatic protection
- **Shield Advanced**: Paid, enhanced protection with 24/7 support

### Q27: What is AWS WAF?
**Answer**: Web Application Firewall - Protects web applications from common exploits like SQL injection and cross-site scripting (XSS).

### Q28: What is Amazon Inspector?
**Answer**: An automated security assessment service that helps improve security and compliance by identifying vulnerabilities in EC2 instances and container images.

### Q29: What is AWS Artifact?
**Answer**: A portal providing on-demand access to AWS compliance reports and agreements (SOC, PCI, ISO certifications).

### Q30: What is AWS KMS (Key Management Service)?
**Answer**: A managed service to create and control encryption keys used to encrypt data across AWS services.

### Q31: What is AWS Secrets Manager?
**Answer**: A service to securely store, manage, and rotate database credentials, API keys, and other secrets.

### Q32: What is Amazon Cognito?
**Answer**: A service providing user authentication, authorization, and user management for web and mobile apps.

### Q33: What is AWS Certificate Manager (ACM)?
**Answer**: A service to provision, manage, and deploy SSL/TLS certificates for use with AWS services.

### Q34: What encryption options does AWS provide?
**Answer**:
- **Encryption at rest**: Data encrypted when stored (S3, EBS, RDS)
- **Encryption in transit**: Data encrypted during transmission (SSL/TLS)
- **Client-side encryption**: Data encrypted before sending to AWS
- **Server-side encryption**: AWS encrypts data after receiving it

---

## Domain 3: Cloud Technology and Services (34%)

### Compute Services

### Q35: What is Amazon EC2?
**Answer**: Elastic Compute Cloud - Virtual servers in the cloud. Provides resizable compute capacity with various instance types for different workloads.

### Q36: What are EC2 instance types?
**Answer**:
- **General Purpose**: T3, M5 (balanced compute, memory, networking)
- **Compute Optimized**: C5 (high-performance processors)
- **Memory Optimized**: R5, X1 (large datasets in memory)
- **Storage Optimized**: I3, D2 (high sequential read/write)
- **Accelerated Computing**: P3, G4 (GPU instances)

### Q37: What are EC2 pricing models?
**Answer**:
- **On-Demand**: Pay per hour/second, no commitment
- **Reserved Instances**: 1 or 3-year commitment, up to 75% discount
- **Spot Instances**: Bid for unused capacity, up to 90% discount
- **Dedicated Hosts**: Physical servers dedicated to your use
- **Savings Plans**: Flexible pricing model with commitment

### Q38: What is Amazon EC2 Auto Scaling?
**Answer**: Automatically adds or removes EC2 instances based on demand or schedule to maintain application availability and optimize costs.

### Q39: What is Elastic Load Balancing (ELB)?
**Answer**: Automatically distributes incoming traffic across multiple targets (EC2 instances, containers, IP addresses) in multiple Availability Zones.

### Q40: What are the types of load balancers?
**Answer**:
- **Application Load Balancer (ALB)**: HTTP/HTTPS traffic, Layer 7
- **Network Load Balancer (NLB)**: TCP/UDP traffic, Layer 4, ultra-low latency
- **Gateway Load Balancer**: Deploy and manage third-party virtual appliances
- **Classic Load Balancer**: Legacy, Layer 4 and 7

### Q41: What is AWS Lambda?
**Answer**: Serverless compute service that runs code in response to events without provisioning servers. You pay only for compute time consumed.

### Q42: What is Amazon ECS?
**Answer**: Elastic Container Service - Fully managed container orchestration service to run Docker containers.

### Q43: What is Amazon EKS?
**Answer**: Elastic Kubernetes Service - Managed Kubernetes service to run Kubernetes on AWS without managing control plane.

### Q44: What is AWS Fargate?
**Answer**: Serverless compute engine for containers that works with ECS and EKS. No need to manage servers or clusters.

### Q45: What is AWS Elastic Beanstalk?
**Answer**: PaaS service for deploying and scaling web applications. You upload code, and Beanstalk handles deployment, capacity provisioning, load balancing, and auto-scaling.

### Storage Services

### Q46: What is Amazon S3?
**Answer**: Simple Storage Service - Object storage service offering scalability, data availability, security, and performance. Stores data as objects in buckets.

### Q47: What are S3 storage classes?
**Answer**:
- **S3 Standard**: Frequent access, low latency
- **S3 Intelligent-Tiering**: Automatic cost optimization
- **S3 Standard-IA**: Infrequent access, lower cost
- **S3 One Zone-IA**: Infrequent access, single AZ
- **S3 Glacier Instant Retrieval**: Archive, millisecond retrieval
- **S3 Glacier Flexible Retrieval**: Archive, minutes to hours retrieval
- **S3 Glacier Deep Archive**: Lowest cost, 12-hour retrieval

### Q48: What is Amazon EBS?
**Answer**: Elastic Block Store - Block-level storage volumes for EC2 instances. Persistent storage that persists independently from instance lifetime.

### Q49: What are EBS volume types?
**Answer**:
- **gp3/gp2**: General Purpose SSD
- **io2/io1**: Provisioned IOPS SSD (high performance)
- **st1**: Throughput Optimized HDD
- **sc1**: Cold HDD (lowest cost)

### Q50: What is Amazon EFS?
**Answer**: Elastic File System - Fully managed NFS file system that can be mounted on multiple EC2 instances simultaneously. Scales automatically.

### Q51: What is AWS Storage Gateway?
**Answer**: Hybrid cloud storage service connecting on-premises environments to AWS cloud storage (S3, EBS, Glacier).

### Q52: What is Amazon FSx?
**Answer**: Fully managed third-party file systems:
- **FSx for Windows File Server**: Windows-native file system
- **FSx for Lustre**: High-performance computing workloads

### Database Services

### Q53: What is Amazon RDS?
**Answer**: Relational Database Service - Managed relational database supporting MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Amazon Aurora.

### Q54: What is Amazon Aurora?
**Answer**: MySQL and PostgreSQL-compatible relational database built for the cloud. Up to 5x faster than MySQL and 3x faster than PostgreSQL.

### Q55: What is Amazon DynamoDB?
**Answer**: Fully managed NoSQL database service providing fast and predictable performance with seamless scalability. Key-value and document database.

### Q56: What is Amazon ElastiCache?
**Answer**: Fully managed in-memory caching service supporting Redis and Memcached. Improves application performance by retrieving data from fast in-memory caches.

### Q57: What is Amazon Redshift?
**Answer**: Fully managed data warehouse service for analytics. Optimized for complex queries on large datasets using SQL.

### Q58: What is Amazon Neptune?
**Answer**: Fully managed graph database service for highly connected datasets (social networks, recommendation engines).

### Q59: What is Amazon DocumentDB?
**Answer**: Fully managed MongoDB-compatible document database service.

### Q60: What is AWS Database Migration Service (DMS)?
**Answer**: Service to migrate databases to AWS quickly and securely. Source database remains operational during migration.

### Networking Services

### Q61: What is Amazon VPC?
**Answer**: Virtual Private Cloud - Isolated virtual network where you can launch AWS resources. You control IP address range, subnets, route tables, and gateways.

### Q62: What is a subnet?
**Answer**: A range of IP addresses in your VPC. Can be public (internet-accessible) or private (internal only).

### Q63: What is an Internet Gateway?
**Answer**: A VPC component that allows communication between instances in VPC and the internet.

### Q64: What is a NAT Gateway?
**Answer**: Network Address Translation gateway - Enables instances in private subnets to connect to the internet while preventing inbound connections.

### Q65: What is Amazon Route 53?
**Answer**: Scalable DNS (Domain Name System) web service. Routes users to applications by translating domain names to IP addresses.

### Q66: What is Amazon CloudFront?
**Answer**: Content Delivery Network (CDN) service that delivers data, videos, applications, and APIs globally with low latency using edge locations.

### Q67: What is AWS Direct Connect?
**Answer**: Dedicated network connection from your premises to AWS. Provides more consistent network performance than internet-based connections.

### Q68: What is AWS VPN?
**Answer**: Virtual Private Network - Secure connection between on-premises network and AWS VPC over the internet.

### Q69: What is a Security Group?
**Answer**: Virtual firewall controlling inbound and outbound traffic for EC2 instances. Stateful (return traffic automatically allowed).

### Q70: What is a Network ACL (NACL)?
**Answer**: Network Access Control List - Firewall at subnet level controlling inbound and outbound traffic. Stateless (must explicitly allow return traffic).

### Analytics & Application Integration

### Q71: What is Amazon Athena?
**Answer**: Interactive query service to analyze data in S3 using standard SQL. Serverless, pay per query.

### Q72: What is Amazon EMR?
**Answer**: Elastic MapReduce - Managed Hadoop framework for processing vast amounts of data using tools like Spark, Hive, and Presto.

### Q73: What is AWS Glue?
**Answer**: Fully managed ETL (Extract, Transform, Load) service for preparing data for analytics.

### Q74: What is Amazon Kinesis?
**Answer**: Platform for streaming data on AWS. Real-time processing of streaming data at scale.

### Q75: What is Amazon SNS?
**Answer**: Simple Notification Service - Pub/sub messaging service for sending notifications to subscribers (email, SMS, HTTP, Lambda).

### Q76: What is Amazon SQS?
**Answer**: Simple Queue Service - Fully managed message queuing service for decoupling application components.

### Q77: What is AWS Step Functions?
**Answer**: Serverless orchestration service to coordinate multiple AWS services into serverless workflows.

### Q78: What is Amazon EventBridge?
**Answer**: Serverless event bus service for building event-driven applications at scale.

### Management & Monitoring

### Q79: What is Amazon CloudWatch?
**Answer**: Monitoring and observability service for AWS resources and applications. Collects metrics, logs, and events.

### Q80: What is AWS CloudFormation?
**Answer**: Infrastructure as Code (IaC) service to model and provision AWS resources using templates (JSON/YAML).

### Q81: What is AWS Systems Manager?
**Answer**: Unified interface to view operational data and automate tasks across AWS resources.

### Q82: What is AWS Trusted Advisor?
**Answer**: Online tool providing real-time guidance to help provision resources following AWS best practices in 5 categories:
1. Cost Optimization
2. Performance
3. Security
4. Fault Tolerance
5. Service Limits

### Q83: What is AWS Personal Health Dashboard?
**Answer**: Provides alerts and guidance when AWS events might affect your resources. Personalized view of service health.

### Q84: What is AWS Service Health Dashboard?
**Answer**: Shows the general status of AWS services across all regions. Public view of AWS service availability.

### Q85: What is AWS Control Tower?
**Answer**: Service to set up and govern secure, multi-account AWS environment based on best practices.

### Q86: What is AWS License Manager?
**Answer**: Service to manage software licenses from vendors like Microsoft, SAP, Oracle across AWS and on-premises.

### Developer Tools

### Q87: What is AWS CodeCommit?
**Answer**: Fully managed source control service hosting secure Git repositories.

### Q88: What is AWS CodeBuild?
**Answer**: Fully managed continuous integration service that compiles source code, runs tests, and produces deployable artifacts.

### Q89: What is AWS CodeDeploy?
**Answer**: Automated deployment service to deploy applications to EC2, Fargate, Lambda, and on-premises servers.

### Q90: What is AWS CodePipeline?
**Answer**: Continuous delivery service to automate release pipelines for fast and reliable updates.

### Q91: What is AWS Cloud9?
**Answer**: Cloud-based IDE (Integrated Development Environment) for writing, running, and debugging code in a browser.

### Machine Learning & AI

### Q92: What is Amazon SageMaker?
**Answer**: Fully managed service to build, train, and deploy machine learning models at scale.

### Q93: What is Amazon Rekognition?
**Answer**: Service for image and video analysis using deep learning. Identifies objects, people, text, scenes, and activities.

### Q94: What is Amazon Comprehend?
**Answer**: Natural Language Processing (NLP) service to find insights and relationships in text.

### Q95: What is Amazon Lex?
**Answer**: Service for building conversational interfaces (chatbots) using voice and text.

### Q96: What is Amazon Polly?
**Answer**: Text-to-speech service that turns text into lifelike speech.

### Q97: What is Amazon Transcribe?
**Answer**: Automatic speech recognition (ASR) service to convert speech to text.

### Q98: What is Amazon Translate?
**Answer**: Neural machine translation service for translating text between languages.

---

## Domain 4: Billing, Pricing, and Support (12%)

### Q99: What is the AWS Free Tier?
**Answer**: Offers free usage of AWS services in three ways:
- **Always Free**: Services free forever (Lambda 1M requests/month, DynamoDB 25GB)
- **12 Months Free**: Free for 12 months from signup (EC2 750 hours/month)
- **Trials**: Short-term free trials (SageMaker 2 months)

### Q100: What is AWS Pricing Calculator?
**Answer**: Web-based tool to estimate costs for AWS services based on your usage requirements.

### Q101: What is AWS Cost Explorer?
**Answer**: Tool to visualize, understand, and manage AWS costs and usage over time with graphs and reports.

### Q102: What is AWS Budgets?
**Answer**: Service to set custom budgets and receive alerts when costs or usage exceed thresholds.

### Q103: What is AWS Cost and Usage Report?
**Answer**: Most comprehensive set of cost and usage data available. Detailed information about AWS costs delivered to S3.

### Q104: What is Consolidated Billing?
**Answer**: Feature of AWS Organizations allowing one bill for multiple AWS accounts. Enables volume discounts across accounts.

### Q105: What are AWS Support Plans?
**Answer**:
- **Basic**: Free, 24/7 customer service, documentation, forums
- **Developer**: $29/month, business hours email support, 12-24 hour response
- **Business**: $100/month, 24/7 phone/chat/email, 1-hour response for urgent cases
- **Enterprise On-Ramp**: $5,500/month, 30-minute response, TAM pool
- **Enterprise**: $15,000/month, 15-minute response, dedicated TAM

### Q106: What is a Technical Account Manager (TAM)?
**Answer**: Designated technical point of contact for Enterprise Support customers. Provides guidance, architectural reviews, and operational support.

### Q107: What is AWS Concierge?
**Answer**: Billing and account experts available for Enterprise Support customers to help with billing and account inquiries.

### Q108: What is AWS Marketplace?
**Answer**: Digital catalog with thousands of software listings from independent software vendors. Easy to find, buy, and deploy software on AWS.

### Q109: What factors affect EC2 pricing?
**Answer**:
- Instance type and size
- Region
- Operating system
- Pricing model (On-Demand, Reserved, Spot)
- Data transfer
- Elastic IP addresses
- EBS volumes

### Q110: What factors affect S3 pricing?
**Answer**:
- Storage class
- Amount of data stored
- Number of requests
- Data transfer out
- Data retrieval fees (for Glacier)

### Q111: What is AWS Total Cost of Ownership (TCO)?
**Answer**: Comparison of costs between running infrastructure on-premises versus in AWS cloud, including hardware, software, labor, and facilities.

### Q112: What are AWS Cost Allocation Tags?
**Answer**: Labels you assign to AWS resources to organize and track costs. Can be used in Cost Explorer and billing reports.

### Q113: What is AWS Compute Optimizer?
**Answer**: Service that recommends optimal AWS resources based on utilization metrics to reduce costs and improve performance.

### Q114: What is Amazon EC2 Savings Plans?
**Answer**: Flexible pricing model offering lower prices in exchange for commitment to consistent compute usage (measured in $/hour) for 1 or 3 years.

### Q115: What is AWS Cost Anomaly Detection?
**Answer**: Uses machine learning to detect unusual spending patterns and sends alerts to prevent unexpected charges.

---

## Additional Practice Questions

### Scenario-Based Questions

### Q116: A company needs to run a batch processing job once per week. What's the most cost-effective EC2 option?
**Answer**: Spot Instances - Since the job is flexible and can tolerate interruptions, Spot Instances offer up to 90% discount compared to On-Demand.

### Q117: An application needs to store user-uploaded images that are frequently accessed for 30 days, then rarely accessed. What S3 strategy should be used?
**Answer**: Use S3 Standard for 30 days, then use S3 Lifecycle policies to transition to S3 Standard-IA or S3 Intelligent-Tiering.

### Q118: A company wants to ensure their EC2 instances are distributed across multiple physical locations for high availability. What should they use?
**Answer**: Deploy instances across multiple Availability Zones within a Region.

### Q119: A startup needs to host a website with unpredictable traffic. What AWS service is most suitable?
**Answer**: AWS Elastic Beanstalk with Auto Scaling - Automatically handles traffic spikes and scales down during low traffic.

### Q120: A company needs to analyze clickstream data in real-time. Which service should they use?
**Answer**: Amazon Kinesis Data Streams for real-time data ingestion and processing.

### Q121: An organization needs to ensure compliance with HIPAA regulations. Where can they find AWS compliance documentation?
**Answer**: AWS Artifact - Provides on-demand access to compliance reports and agreements.

### Q122: A company wants to migrate their on-premises MySQL database to AWS with minimal downtime. What service should they use?
**Answer**: AWS Database Migration Service (DMS) - Keeps source database operational during migration.

### Q123: A development team needs to deploy code changes multiple times per day. What AWS services should they use?
**Answer**: AWS CodePipeline with CodeBuild and CodeDeploy for continuous integration and continuous deployment (CI/CD).

### Q124: A company needs to provide temporary access to an S3 bucket for external contractors. What's the best approach?
**Answer**: Create IAM roles with temporary security credentials using AWS STS (Security Token Service).

### Q125: An application needs to send email notifications to thousands of users. What service should be used?
**Answer**: Amazon SNS (Simple Notification Service) for pub/sub messaging or Amazon SES (Simple Email Service) for email-specific needs.

### Q126: What is the difference between horizontal and vertical scaling?
**Answer**:
- **Horizontal Scaling (Scale Out)**: Adding more instances (e.g., more EC2 instances)
- **Vertical Scaling (Scale Up)**: Increasing instance size (e.g., t2.micro to t2.large)

### Q127: What is Amazon Lightsail?
**Answer**: Simplified compute service offering virtual private servers, storage, databases, and networking at a low, predictable monthly price. Ideal for simple applications.

### Q128: What is AWS Outposts?
**Answer**: Fully managed service extending AWS infrastructure, services, and tools to on-premises facilities for a hybrid cloud experience.

### Q129: What is AWS Local Zones?
**Answer**: Infrastructure deployments placing compute, storage, and database closer to end-users for single-digit millisecond latency applications.

### Q130: What is AWS Wavelength?
**Answer**: Embeds AWS compute and storage within 5G networks to deliver ultra-low latency applications for mobile devices.

### Q131: What is Amazon WorkSpaces?
**Answer**: Managed Desktop-as-a-Service (DaaS) solution to provision Windows or Linux desktops in the cloud.

### Q132: What is Amazon AppStream 2.0?
**Answer**: Fully managed application streaming service to deliver desktop applications to users without rewriting them.

### Q133: What is AWS Backup?
**Answer**: Centralized backup service to automate and manage backups across AWS services (EC2, EBS, RDS, DynamoDB, EFS).

### Q134: What is Amazon FSx for NetApp ONTAP?
**Answer**: Fully managed storage built on NetApp's ONTAP file system with enterprise features.

### Q135: What is AWS Snow Family?
**Answer**: Physical devices to migrate large amounts of data into and out of AWS:
- **Snowcone**: 8TB, portable (2.1 kg)
- **Snowball Edge**: 80TB, compute capabilities
- **Snowmobile**: 100PB, shipping container truck

### Q136: What is AWS DataSync?
**Answer**: Online data transfer service to automate moving data between on-premises storage and AWS (S3, EFS, FSx).

### Q137: What is AWS Transfer Family?
**Answer**: Fully managed support for SFTP, FTPS, and FTP directly into and out of S3 or EFS.

### Q138: What is Amazon Macie?
**Answer**: Data security service using machine learning to discover, classify, and protect sensitive data in S3.

### Q139: What is AWS Security Hub?
**Answer**: Centralized security service providing comprehensive view of security alerts and compliance status across AWS accounts.

### Q140: What is Amazon Detective?
**Answer**: Service to analyze and investigate potential security issues using log data from CloudTrail, VPC Flow Logs, and GuardDuty.

### Q141: What is AWS Firewall Manager?
**Answer**: Security management service to centrally configure and manage firewall rules across accounts and applications.

### Q142: What is AWS Network Firewall?
**Answer**: Managed firewall service for VPC providing filtering for inbound and outbound network traffic.

### Q143: What is Amazon QuickSight?
**Answer**: Business intelligence service to create and publish interactive dashboards with ML-powered insights.

### Q144: What is AWS Data Exchange?
**Answer**: Service to find, subscribe to, and use third-party data in the cloud.

### Q145: What is Amazon Managed Blockchain?
**Answer**: Fully managed service to create and manage blockchain networks using Hyperledger Fabric or Ethereum.

### Q146: What is Amazon Quantum Ledger Database (QLDB)?
**Answer**: Fully managed ledger database providing transparent, immutable, and cryptographically verifiable transaction log.

### Q147: What is AWS IoT Core?
**Answer**: Managed cloud service for connecting IoT devices to AWS and other devices securely.

### Q148: What is AWS Greengrass?
**Answer**: Software extending AWS to edge devices to act locally on data while using the cloud for management and analytics.

### Q149: What is Amazon Timestream?
**Answer**: Fast, scalable, serverless time series database for IoT and operational applications.

### Q150: What is Amazon Forecast?
**Answer**: Fully managed service using machine learning to deliver accurate forecasts based on time-series data.

### Q151: What is Amazon Personalize?
**Answer**: Machine learning service to create individualized recommendations for customers.

### Q152: What is Amazon Kendra?
**Answer**: Intelligent search service powered by machine learning to provide accurate answers from documents.

### Q153: What is Amazon Textract?
**Answer**: Machine learning service to automatically extract text, handwriting, and data from scanned documents.

### Q154: What is Amazon Fraud Detector?
**Answer**: Fully managed service using machine learning to identify potentially fraudulent online activities.

### Q155: What is Amazon DevOps Guru?
**Answer**: ML-powered service to improve application availability by automatically detecting operational issues.

### Q156: What is Amazon CodeGuru?
**Answer**: Developer tool powered by machine learning for automated code reviews and application performance recommendations.

### Q157: What is AWS X-Ray?
**Answer**: Service to analyze and debug distributed applications, providing insights into application behavior.

### Q158: What is AWS App Runner?
**Answer**: Fully managed service to quickly deploy containerized web applications and APIs without infrastructure experience.

### Q159: What is Amazon Elastic Container Registry (ECR)?
**Answer**: Fully managed Docker container registry to store, manage, and deploy container images.

### Q160: What is AWS Proton?
**Answer**: Automated management service for container and serverless deployments with infrastructure as code.

### Q161: What is AWS Amplify?
**Answer**: Complete solution for building, deploying, and hosting full-stack web and mobile applications.

### Q162: What is AWS Device Farm?
**Answer**: Application testing service to test and interact with Android, iOS, and web apps on real devices in the cloud.

### Q163: What is Amazon API Gateway?
**Answer**: Fully managed service to create, publish, maintain, monitor, and secure APIs at any scale.

### Q164: What is AWS AppSync?
**Answer**: Managed GraphQL service to build data-driven apps with real-time and offline capabilities.

### Q165: What is Amazon MQ?
**Answer**: Managed message broker service for Apache ActiveMQ and RabbitMQ.

### Q166: What is Amazon Managed Streaming for Apache Kafka (MSK)?
**Answer**: Fully managed service for building and running applications using Apache Kafka.

### Q167: What is AWS Batch?
**Answer**: Fully managed batch processing service to run hundreds of thousands of batch computing jobs.

### Q168: What is Amazon Elastic Transcoder?
**Answer**: Media transcoding service to convert media files into formats required by consumer playback devices.

### Q169: What is Amazon Elastic MapReduce (EMR)?
**Answer**: Cloud big data platform for processing vast amounts of data using open-source tools like Spark, Hadoop, and Hive.

### Q170: What is AWS Lake Formation?
**Answer**: Service to set up secure data lakes in days instead of months.

### Q171: What is Amazon OpenSearch Service (formerly Elasticsearch)?
**Answer**: Managed service to deploy, operate, and scale OpenSearch clusters for log analytics and search.

### Q172: What is AWS Data Pipeline?
**Answer**: Web service to process and move data between AWS compute and storage services at specified intervals.

### Q173: What is Amazon Connect?
**Answer**: Cloud-based contact center service providing customer service at lower cost than traditional systems.

### Q174: What is Amazon Pinpoint?
**Answer**: Flexible marketing communications service to send emails, SMS, push notifications, and voice messages.

### Q175: What is Amazon Simple Email Service (SES)?
**Answer**: Cost-effective email service for sending transactional, marketing, or mass email communications.

### Q176: What is AWS Chatbot?
**Answer**: Interactive agent for monitoring and interacting with AWS resources in Slack and Microsoft Teams.

### Q177: What is AWS Service Catalog?
**Answer**: Service to create and manage catalogs of IT services approved for use on AWS.

### Q178: What is AWS OpsWorks?
**Answer**: Configuration management service using Chef and Puppet for automated server configuration.

### Q179: What is AWS Resource Access Manager (RAM)?
**Answer**: Service to share AWS resources with other AWS accounts or within AWS Organizations.

### Q180: What is AWS Secrets Manager vs Systems Manager Parameter Store?
**Answer**:
- **Secrets Manager**: Automatic rotation, RDS integration, higher cost
- **Parameter Store**: Simple key-value store, free tier, manual rotation

### Q181: What is Amazon CloudSearch?
**Answer**: Managed search service to add search functionality to websites or applications.

### Q182: What is AWS Elemental MediaConvert?
**Answer**: File-based video transcoding service for broadcast and multiscreen delivery.

### Q183: What is AWS Elemental MediaLive?
**Answer**: Broadcast-grade live video processing service for creating streams for TV and internet delivery.

### Q184: What is AWS Ground Station?
**Answer**: Fully managed service to control satellite communications and process satellite data.

### Q185: What is AWS RoboMaker?
**Answer**: Service to develop, test, and deploy robotics applications at scale.

### Q186: What is Amazon Sumerian?
**Answer**: Service to create and run 3D, AR, and VR applications without specialized programming.

### Q187: What is AWS DeepRacer?
**Answer**: 1/18th scale autonomous race car for learning reinforcement learning.

### Q188: What is AWS DeepLens?
**Answer**: Deep learning-enabled video camera for developers to learn machine learning.

### Q189: What is AWS DeepComposer?
**Answer**: Musical keyboard and learning service for generative AI.

### Q190: What is Amazon Honeycode?
**Answer**: No-code service to build mobile and web applications without programming.

### Q191: What is the difference between S3 and EBS?
**Answer**:
- **S3**: Object storage, accessible via internet, unlimited storage, 99.999999999% durability
- **EBS**: Block storage, attached to EC2, limited by volume size, AZ-specific

### Q192: What is the difference between Security Groups and NACLs?
**Answer**:
- **Security Groups**: Instance-level, stateful, allow rules only, evaluate all rules
- **NACLs**: Subnet-level, stateless, allow and deny rules, process rules in order

### Q193: What is the difference between RDS and DynamoDB?
**Answer**:
- **RDS**: Relational database, SQL, structured data, ACID transactions
- **DynamoDB**: NoSQL database, key-value/document, flexible schema, millisecond latency

### Q194: What is the difference between CloudWatch and CloudTrail?
**Answer**:
- **CloudWatch**: Performance monitoring, metrics, logs, alarms
- **CloudTrail**: API activity logging, who did what and when, compliance auditing

### Q195: What is the difference between IAM Roles and IAM Users?
**Answer**:
- **Users**: Permanent credentials, for people
- **Roles**: Temporary credentials, for services/applications, can be assumed

### Q196: What is AWS Single Sign-On (SSO)?
**Answer**: Centralized service to manage SSO access to multiple AWS accounts and business applications.

### Q197: What is Amazon WorkDocs?
**Answer**: Fully managed secure enterprise storage and sharing service with feedback capabilities.

### Q198: What is Amazon WorkMail?
**Answer**: Managed business email and calendar service with support for existing desktop and mobile clients.

### Q199: What is Amazon Chime?
**Answer**: Communications service for online meetings, video conferencing, calls, and chat.

### Q200: What is AWS Migration Hub?
**Answer**: Service to track application migrations across multiple AWS and partner solutions.

### Q201: What is AWS Application Discovery Service?
**Answer**: Service to plan migration by collecting usage and configuration data about on-premises servers.

### Q202: What is AWS Server Migration Service (SMS)?
**Answer**: Agentless service to migrate on-premises workloads to AWS (being replaced by Application Migration Service).

### Q203: What is AWS Application Migration Service (MGN)?
**Answer**: Automated lift-and-shift solution to migrate applications to AWS.

### Q204: What is AWS Elastic Disaster Recovery (DRS)?
**Answer**: Scalable, cost-effective disaster recovery service for physical, virtual, and cloud servers.

### Q205: What is Amazon Elastic Inference?
**Answer**: Service to attach low-cost GPU-powered acceleration to EC2 and SageMaker instances.

### Q206: What is AWS Inferentia?
**Answer**: Custom machine learning inference chip designed by AWS for high performance at low cost.

### Q207: What is AWS Graviton?
**Answer**: ARM-based processors designed by AWS for better price-performance in EC2.

### Q208: What is Amazon Braket?
**Answer**: Fully managed quantum computing service to explore and experiment with quantum computers.

### Q209: What is AWS Panorama?
**Answer**: Machine learning appliance and SDK to add computer vision to on-premises cameras.

### Q210: What is AWS PrivateLink?
**Answer**: Provides private connectivity between VPCs and AWS services without exposing traffic to the internet.

### Q211: What is AWS Transit Gateway?
**Answer**: Service to connect VPCs and on-premises networks through a central hub.

### Q212: What is AWS Global Accelerator?
**Answer**: Networking service improving availability and performance using AWS global network infrastructure.

### Q213: What is Amazon VPC Peering?
**Answer**: Networking connection between two VPCs enabling routing using private IP addresses.

### Q214: What is AWS Client VPN?
**Answer**: Managed client-based VPN service for secure access to AWS resources and on-premises networks.

### Q215: What is AWS Site-to-Site VPN?
**Answer**: Creates encrypted tunnel between on-premises network and AWS VPC.

### Q216: What is Elastic IP Address?
**Answer**: Static IPv4 address designed for dynamic cloud computing, can be remapped to instances.

### Q217: What is AWS Resource Groups?
**Answer**: Service to organize AWS resources using tags for management and automation.

### Q218: What is AWS Tag Editor?
**Answer**: Tool to manage tags across multiple resources and services from a central location.

### Q219: What is AWS Compute Optimizer?
**Answer**: Service recommending optimal AWS resources based on utilization metrics to reduce costs.

### Q220: What is AWS Launch Wizard?
**Answer**: Guides deployment of enterprise applications (SQL Server, SAP) following AWS best practices.

### Q221: What is AWS Managed Services (AMS)?
**Answer**: Service providing ongoing management of AWS infrastructure for enterprise customers.

### Q222: What is AWS Professional Services?
**Answer**: Team of experts helping customers achieve desired business outcomes using AWS.

### Q223: What is AWS Partner Network (APN)?
**Answer**: Global community of partners leveraging AWS to build solutions and services.

### Q224: What is AWS IQ?
**Answer**: Marketplace to find, engage, and pay AWS Certified experts for on-demand project work.

### Q225: What is AWS re:Post?
**Answer**: AWS-managed Q&A service (replacement for AWS Forums) for community-driven support.

### Q226: What is AWS Activate?
**Answer**: Program providing startups with resources to get started on AWS (credits, training, support).

### Q227: What is AWS Educate?
**Answer**: Program providing students and educators with resources to learn cloud computing.

### Q228: What is AWS Training and Certification?
**Answer**: Program offering courses and certifications to build and validate AWS cloud skills.

### Q229: What is the AWS Acceptable Use Policy?
**Answer**: Policy describing prohibited uses of AWS services (no illegal activity, no network abuse, no security violations).

### Q230: What is AWS Abuse Report?
**Answer**: Process to report suspected abuse of AWS resources (spam, DDoS, malware).

### Q231: What is AWS Compliance Programs?
**Answer**: AWS certifications and attestations for various compliance standards:
- **SOC 1/2/3**: Audit reports
- **PCI DSS**: Payment card industry
- **HIPAA**: Healthcare data
- **FedRAMP**: US government
- **GDPR**: EU data protection
- **ISO 27001**: Information security

### Q232: What is AWS CAF (Cloud Adoption Framework)?
**Answer**: Framework providing guidance for cloud adoption organized into 6 perspectives:
- Business, People, Governance (business capabilities)
- Platform, Security, Operations (technical capabilities)

### Q233: What are the 7 R's of Migration?
**Answer**:
1. **Retire**: Decommission unneeded applications
2. **Retain**: Keep in source environment
3. **Rehost**: Lift-and-shift
4. **Relocate**: Move to AWS without changes
5. **Repurchase**: Move to SaaS
6. **Replatform**: Lift-tinker-and-shift
7. **Refactor/Re-architect**: Redesign for cloud-native

### Q234: What is AWS Nitro System?
**Answer**: Underlying platform for next-generation EC2 instances providing better performance, security, and innovation.

### Q235: What is Amazon EC2 Instance Store?
**Answer**: Temporary block-level storage physically attached to host computer. Data lost when instance stops.

### Q236: What is Amazon EBS Snapshot?
**Answer**: Point-in-time backup of EBS volume stored in S3. Incremental backups.

### Q237: What is Amazon Machine Image (AMI)?
**Answer**: Template containing software configuration (OS, application server, applications) to launch EC2 instances.

### Q238: What is AWS Marketplace AMI?
**Answer**: Pre-configured AMIs from third-party vendors available for purchase or free use.

### Q239: What is EC2 User Data?
**Answer**: Script that runs automatically when launching an EC2 instance for bootstrapping.

### Q240: What is EC2 Metadata?
**Answer**: Data about EC2 instance accessible from within the instance (instance ID, IP, etc.).

### Q241: What is Amazon EC2 Placement Groups?
**Answer**: Logical grouping of instances:
- **Cluster**: Low latency, same AZ
- **Spread**: Different hardware, max 7 per AZ
- **Partition**: Different partitions (racks), for distributed systems

### Q242: What is Amazon EC2 Hibernate?
**Answer**: Saves RAM contents to EBS volume, allowing faster startup by resuming from saved state.

### Q243: What is AWS Lambda Layers?
**Answer**: Distribution mechanism for libraries, custom runtimes, and other dependencies for Lambda functions.

### Q244: What is AWS Lambda@Edge?
**Answer**: Extension of Lambda running code at CloudFront edge locations for low latency.

### Q245: What is AWS Lambda SnapStart?
**Answer**: Feature improving startup performance for Java Lambda functions.

### Q246: What is Amazon S3 Versioning?
**Answer**: Feature keeping multiple variants of an object in the same bucket for recovery from accidental deletions.

### Q247: What is Amazon S3 Lifecycle Policy?
**Answer**: Rules to automatically transition objects between storage classes or delete them after specified time.

### Q248: What is Amazon S3 Replication?
**Answer**: Automatic, asynchronous copying of objects:
- **CRR**: Cross-Region Replication
- **SRR**: Same-Region Replication

### Q249: What is Amazon S3 Transfer Acceleration?
**Answer**: Fast, easy, secure transfer of files over long distances using CloudFront edge locations.

### Q250: What is Amazon S3 Multipart Upload?
**Answer**: Upload large objects in parts for improved throughput and quick recovery from network issues.

### Q251: What is Amazon S3 Pre-signed URL?
**Answer**: Temporary URL granting time-limited access to private S3 objects.

### Q252: What is Amazon S3 Object Lock?
**Answer**: WORM (Write Once Read Many) model to prevent object deletion or modification for fixed time or indefinitely.

### Q253: What is Amazon S3 Event Notifications?
**Answer**: Trigger notifications (SNS, SQS, Lambda) when specific events occur in S3 bucket.

### Q254: What is Amazon S3 Select?
**Answer**: Retrieve subset of data from object using SQL expressions without retrieving entire object.

### Q255: What is Amazon S3 Inventory?
**Answer**: Scheduled report of objects and metadata for audit and compliance.

### Q256: What is Amazon RDS Multi-AZ?
**Answer**: High availability deployment with synchronous replication to standby instance in different AZ.

### Q257: What is Amazon RDS Read Replica?
**Answer**: Asynchronous replication for read-heavy workloads, can be in different region.

### Q258: What is Amazon RDS Automated Backup?
**Answer**: Automatic daily backups with transaction logs, retention 0-35 days.

### Q259: What is Amazon RDS Manual Snapshot?
**Answer**: User-initiated backup retained until explicitly deleted.

### Q260: What is Amazon Aurora Serverless?
**Answer**: On-demand, auto-scaling configuration for Aurora, pay per second of database usage.

### Q261: What is Amazon Aurora Global Database?
**Answer**: Single database spanning multiple regions for low-latency global reads and disaster recovery.

### Q262: What is DynamoDB Global Tables?
**Answer**: Fully managed multi-region, multi-active database for globally distributed applications.

### Q263: What is DynamoDB Streams?
**Answer**: Ordered flow of information about changes to items in DynamoDB table.

### Q264: What is DynamoDB DAX?
**Answer**: DynamoDB Accelerator - Fully managed in-memory cache providing microsecond latency.

### Q265: What is DynamoDB On-Demand Mode?
**Answer**: Flexible billing option paying per request, no capacity planning needed.

### Q266: What is DynamoDB Provisioned Mode?
**Answer**: Specify read/write capacity units, predictable performance, lower cost for steady workloads.

### Q267: What is Amazon VPC Flow Logs?
**Answer**: Captures information about IP traffic going to and from network interfaces in VPC.

### Q268: What is AWS VPN CloudHub?
**Answer**: Hub-and-spoke model for connecting multiple remote offices via VPN.

### Q269: What is Amazon Route 53 Routing Policies?
**Answer**:
- **Simple**: Single resource
- **Weighted**: Traffic distribution by percentage
- **Latency**: Lowest latency region
- **Failover**: Active-passive failover
- **Geolocation**: Based on user location
- **Geoproximity**: Based on resource location
- **Multi-value**: Multiple resources with health checks

### Q270: What is Route 53 Health Checks?
**Answer**: Monitors endpoint health and routes traffic only to healthy endpoints.

### Q271: What is CloudFront Origin?
**Answer**: Source of content that CloudFront distributes (S3, EC2, ELB, or custom origin).

### Q272: What is CloudFront Distribution?
**Answer**: Configuration specifying content origin and delivery settings.

### Q273: What is CloudFront Signed URL/Cookies?
**Answer**: Restrict access to content by requiring signed URLs or cookies.

### Q274: What is CloudFront Origin Access Identity (OAI)?
**Answer**: Special CloudFront user to access private S3 content.

### Q275: What is AWS Auto Scaling Plans?
**Answer**: Unified scaling for multiple resources across services (EC2, ECS, DynamoDB).

---

## Advanced Scenario Questions

### Q276: A company needs to process millions of IoT sensor messages per second. Which services should they use?
**Answer**: Amazon Kinesis Data Streams for ingestion, AWS Lambda for processing, and DynamoDB for storage.

### Q277: How can you ensure EC2 instances in private subnet can download updates from the internet?
**Answer**: Use NAT Gateway in public subnet with route table directing internet traffic through it.

### Q278: A company wants to analyze SQL queries on S3 data without loading it into a database. What service?
**Answer**: Amazon Athena - serverless interactive query service using standard SQL.

### Q279: How do you provide temporary access to S3 bucket for mobile app users?
**Answer**: Use Amazon Cognito to authenticate users and provide temporary AWS credentials via STS.

### Q280: A company needs to run Docker containers without managing servers. What options?
**Answer**: AWS Fargate with ECS or EKS, or AWS App Runner for simpler deployments.

### Q281: How can you reduce data transfer costs between EC2 and S3?
**Answer**: Use VPC Endpoint (Gateway Endpoint) for S3 to keep traffic within AWS network.

### Q282: A company needs to ensure RDS database survives AZ failure. What should they enable?
**Answer**: RDS Multi-AZ deployment for automatic failover to standby instance.

### Q283: How can you monitor and alert when AWS bill exceeds $1000?
**Answer**: Use AWS Budgets to set cost budget with alert notifications via SNS.

### Q284: A company needs to run batch jobs that can be interrupted. What EC2 pricing?
**Answer**: Spot Instances - up to 90% discount, suitable for fault-tolerant workloads.

### Q285: How can you ensure S3 data is encrypted at rest?
**Answer**: Enable S3 default encryption (SSE-S3, SSE-KMS, or SSE-C) or use bucket policies to enforce encryption.

### Q286: A company needs to share files between multiple EC2 instances. What storage?
**Answer**: Amazon EFS - shared file system that can be mounted on multiple EC2 instances.

### Q287: How can you improve application performance for global users?
**Answer**: Use CloudFront CDN to cache content at edge locations closer to users.

### Q288: A company needs to audit all API calls made in their AWS account. What service?
**Answer**: AWS CloudTrail - logs all API calls with details of who, what, when, and where.

### Q289: How can you automatically scale EC2 instances based on CPU utilization?
**Answer**: Create Auto Scaling Group with CloudWatch alarm triggering scaling policies.

### Q290: A company needs to run code in response to S3 uploads without managing servers. What service?
**Answer**: AWS Lambda triggered by S3 event notifications.

### Q291: How can you ensure high availability for web application?
**Answer**: Deploy across multiple AZs with Application Load Balancer and Auto Scaling Group.

### Q292: A company needs to migrate 100TB of data to AWS. What's the fastest method?
**Answer**: AWS Snowball Edge device for physical data transfer, faster than internet upload.

### Q293: How can you restrict S3 bucket access to specific VPC?
**Answer**: Use S3 bucket policy with condition checking VPC endpoint ID (aws:SourceVpce).

### Q294: A company needs to run Windows applications without managing infrastructure. What service?
**Answer**: AWS Elastic Beanstalk or AWS App Runner for containerized apps.

### Q295: How can you ensure DynamoDB table handles unpredictable traffic?
**Answer**: Use DynamoDB On-Demand mode for automatic scaling based on traffic.

### Q296: A company needs to convert video files to different formats. What service?
**Answer**: Amazon Elastic Transcoder or AWS Elemental MediaConvert.

### Q297: How can you provide secure access to AWS Console for federated users?
**Answer**: Use AWS Single Sign-On (SSO) or IAM Identity Federation with SAML 2.0.

### Q298: A company needs to detect and respond to security threats automatically. What services?
**Answer**: Amazon GuardDuty for detection, AWS Lambda for automated response, AWS Security Hub for centralized view.

### Q299: How can you ensure Lambda function has access to RDS database in private subnet?
**Answer**: Deploy Lambda in same VPC with security group allowing access to RDS security group.

### Q300: A company needs to build machine learning model without ML expertise. What service?
**Answer**: Amazon SageMaker Autopilot for automated machine learning (AutoML).

---

## Exam Tips & Strategy

### Before the Exam
1. **Review AWS Whitepapers**:
   - Overview of Amazon Web Services
   - AWS Well-Architected Framework
   - AWS Pricing/TCO

2. **Hands-On Practice**:
   - Create free tier account
   - Launch EC2 instances
   - Create S3 buckets
   - Set up VPC
   - Explore AWS Console

3. **Take Practice Exams**:
   - AWS Official Practice Exam
   - Online practice tests
   - Review incorrect answers

### During the Exam
1. **Time Management**: 90 minutes for 65 questions ≈ 1.4 minutes per question
2. **Flag Difficult Questions**: Skip and return later
3. **Eliminate Wrong Answers**: Narrow down choices
4. **Read Carefully**: Watch for keywords like "most cost-effective", "most secure", "least operational overhead"
5. **No Penalty for Guessing**: Answer all questions

### Common Keywords
- **Most cost-effective**: Look for Spot Instances, S3 Glacier, Reserved Instances
- **High availability**: Multiple AZs, ELB, Auto Scaling
- **Least operational overhead**: Managed services, serverless (Lambda, Fargate)
- **Real-time**: Kinesis, Lambda
- **Serverless**: Lambda, Fargate, DynamoDB, S3
- **Disaster recovery**: Multi-region, backups, snapshots

### Key Concepts to Remember
1. **Shared Responsibility Model**: Know what AWS manages vs. what you manage
2. **IAM Best Practices**: MFA, least privilege, roles over users
3. **S3 Storage Classes**: Understand use cases and costs
4. **EC2 Pricing Models**: When to use each type
5. **VPC Components**: Subnets, route tables, gateways
6. **Support Plans**: Features and pricing tiers
7. **Well-Architected Framework**: 6 pillars

---

## Study Resources

### Official AWS Resources
- AWS Skill Builder (free digital training)
- AWS Cloud Practitioner Essentials (free course)
- AWS Whitepapers & Documentation
- AWS Official Practice Exam ($20)

### Third-Party Resources
- A Cloud Guru / Pluralsight courses
- Udemy courses (Stephane Maarek, Neal Davis)
- TutorialsDojo Practice Exams
- YouTube channels (FreeCodeCamp, AWS Online Tech Talks)

### Practice Labs
- AWS Free Tier account
- AWS Workshops (workshops.aws)
- Qwiklabs / CloudAcademy hands-on labs

---

## Quick Reference Cheat Sheet

### Compute
- **EC2**: Virtual servers
- **Lambda**: Serverless functions
- **Elastic Beanstalk**: PaaS deployment
- **ECS/EKS**: Container orchestration

### Storage
- **S3**: Object storage
- **EBS**: Block storage for EC2
- **EFS**: Shared file storage
- **Glacier**: Archive storage

### Database
- **RDS**: Managed relational DB
- **DynamoDB**: NoSQL database
- **Aurora**: High-performance RDS
- **Redshift**: Data warehouse

### Networking
- **VPC**: Virtual network
- **Route 53**: DNS service
- **CloudFront**: CDN
- **Direct Connect**: Dedicated connection

### Security
- **IAM**: Identity management
- **KMS**: Key management
- **WAF**: Web application firewall
- **Shield**: DDoS protection

### Management
- **CloudWatch**: Monitoring
- **CloudTrail**: API logging
- **CloudFormation**: Infrastructure as Code
- **Trusted Advisor**: Best practices

### Support Tiers
- Basic: Free
- Developer: $29/month
- Business: $100/month
- Enterprise: $15,000/month

---

*Good luck with your AWS Cloud Practitioner certification! Remember to practice hands-on with AWS services and understand the core concepts rather than memorizing.*
