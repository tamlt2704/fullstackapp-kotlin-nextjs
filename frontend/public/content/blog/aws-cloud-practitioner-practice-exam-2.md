---
title: "AWS Cloud Practitioner Practice Exam 2 (Questions 66-130)"
date: "2024-01-26"
category: "AWS Certification"
tags: ["AWS", "Cloud Practitioner", "Certification", "Practice Exam"]
---

# AWS Cloud Practitioner Practice Exam 2

## Compute & Storage Focus (Questions 66-130)

### Question 66
What is the difference between EBS and instance store?
- A) EBS is temporary, instance store is persistent
- B) EBS is persistent, instance store is temporary
- C) Both are persistent
- D) Both are temporary

**Answer: B**
**Explanation:** EBS volumes persist independently from EC2 instances. Instance store is ephemeral and data is lost when instance stops.

### Question 67
Which EC2 instance type is optimized for memory-intensive applications?
- A) T3
- B) C5
- C) R5
- D) M5

**Answer: C**
**Explanation:** R5 instances are memory-optimized for memory-intensive workloads.

### Question 68
What is AWS Elastic Beanstalk?
- A) Container service
- B) PaaS for deploying applications
- C) Database service
- D) Storage service

**Answer: B**
**Explanation:** Elastic Beanstalk is a PaaS that handles deployment, capacity provisioning, and monitoring.

### Question 69
Which storage class has the lowest cost for long-term archival?
- A) S3 Standard
- B) S3 Glacier
- C) S3 Glacier Deep Archive
- D) S3 Intelligent-Tiering

**Answer: C**
**Explanation:** S3 Glacier Deep Archive offers the lowest cost for long-term archival (180-day minimum).

### Question 70
What is the maximum size of an S3 object?
- A) 5 GB
- B) 5 TB
- C) 500 GB
- D) Unlimited

**Answer: B**
**Explanation:** Maximum object size in S3 is 5 TB. Use multipart upload for objects over 100 MB.

### Question 71
Which service provides block storage for EC2?
- A) Amazon S3
- B) Amazon EBS
- C) Amazon EFS
- D) AWS Storage Gateway

**Answer: B**
**Explanation:** EBS provides block-level storage volumes for EC2 instances.

### Question 72
What is AWS Lambda's maximum execution time?
- A) 5 minutes
- B) 15 minutes
- C) 30 minutes
- D) 1 hour

**Answer: B**
**Explanation:** Lambda functions can run for a maximum of 15 minutes (900 seconds).

### Question 73
Which EC2 pricing option requires a 1 or 3-year commitment?
- A) On-Demand
- B) Spot Instances
- C) Reserved Instances
- D) Dedicated Hosts

**Answer: C**
**Explanation:** Reserved Instances require 1 or 3-year commitment for discounted pricing.

### Question 74
What is Amazon EFS?
- A) Block storage
- B) Object storage
- C) File storage
- D) Database storage

**Answer: C**
**Explanation:** EFS provides scalable file storage for use with EC2 instances.

### Question 75
Which service automatically scales EC2 instances?
- A) Elastic Load Balancing
- B) AWS Auto Scaling
- C) Amazon CloudWatch
- D) AWS Lambda

**Answer: B**
**Explanation:** AWS Auto Scaling automatically adjusts EC2 capacity based on demand.

### Question 76
What is the purpose of an AMI?
- A) Monitor instances
- B) Template for launching instances
- C) Store data
- D) Balance load

**Answer: B**
**Explanation:** AMI (Amazon Machine Image) is a template containing OS and applications for launching instances.

### Question 77
Which storage option provides the lowest latency?
- A) S3 Standard
- B) EBS SSD
- C) Instance Store
- D) EFS

**Answer: C**
**Explanation:** Instance store provides the lowest latency as it's physically attached to the host.

### Question 78
What is AWS Fargate?
- A) Container registry
- B) Serverless compute for containers
- C) Virtual machine service
- D) Database service

**Answer: B**
**Explanation:** Fargate is serverless compute engine for containers (ECS/EKS).

### Question 79
Which S3 storage class automatically moves objects between tiers?
- A) S3 Standard
- B) S3 Standard-IA
- C) S3 Intelligent-Tiering
- D) S3 One Zone-IA

**Answer: C**
**Explanation:** S3 Intelligent-Tiering automatically moves objects between access tiers based on usage.

### Question 80
What is the purpose of EC2 user data?
- A) Store user credentials
- B) Run scripts at instance launch
- C) Monitor instance
- D) Backup data

**Answer: B**
**Explanation:** User data allows running scripts automatically when an instance launches.

### Question 81
Which service provides hybrid cloud storage?
- A) Amazon S3
- B) AWS Storage Gateway
- C) Amazon EBS
- D) Amazon EFS

**Answer: B**
**Explanation:** Storage Gateway connects on-premises environments with AWS cloud storage.

### Question 82
What is the difference between horizontal and vertical scaling?
- A) Horizontal adds more instances, vertical increases instance size
- B) Horizontal increases instance size, vertical adds more instances
- C) Both are the same
- D) Neither affects capacity

**Answer: A**
**Explanation:** Horizontal scaling adds more instances (scale out), vertical scaling increases instance size (scale up).

### Question 83
Which EC2 instance type is best for general-purpose workloads?
- A) T3
- B) C5
- C) R5
- D) I3

**Answer: A**
**Explanation:** T3 instances provide burstable performance for general-purpose workloads.

### Question 84
What is S3 Transfer Acceleration?
- A) Faster uploads using CloudFront edge locations
- B) Compression service
- C) Encryption service
- D) Backup service

**Answer: A**
**Explanation:** Transfer Acceleration uses CloudFront edge locations for faster uploads to S3.

### Question 85
Which service provides managed Docker container orchestration?
- A) AWS Lambda
- B) Amazon ECS
- C) Amazon EC2
- D) AWS Batch

**Answer: B**
**Explanation:** ECS (Elastic Container Service) provides managed Docker container orchestration.

### Question 86
What is the minimum storage duration for S3 Standard-IA?
- A) 7 days
- B) 30 days
- C) 90 days
- D) 180 days

**Answer: B**
**Explanation:** S3 Standard-IA has a minimum storage duration of 30 days.

### Question 87
Which feature allows EC2 instances to automatically recover from failures?
- A) Auto Scaling
- B) Elastic Load Balancing
- C) EC2 Auto Recovery
- D) AWS Backup

**Answer: C**
**Explanation:** EC2 Auto Recovery automatically recovers instances when system status checks fail.

### Question 88
What is AWS Batch?
- A) Database service
- B) Batch computing service
- C) Storage service
- D) Networking service

**Answer: B**
**Explanation:** AWS Batch runs batch computing workloads on AWS.

### Question 89
Which EBS volume type provides the highest IOPS?
- A) General Purpose SSD (gp3)
- B) Provisioned IOPS SSD (io2)
- C) Throughput Optimized HDD (st1)
- D) Cold HDD (sc1)

**Answer: B**
**Explanation:** Provisioned IOPS SSD (io2) provides the highest IOPS for critical workloads.

### Question 90
What is the purpose of S3 Lifecycle policies?
- A) Monitor access
- B) Automatically transition objects between storage classes
- C) Encrypt data
- D) Replicate data

**Answer: B**
**Explanation:** Lifecycle policies automatically transition objects to different storage classes or delete them.

### Question 91
Which service provides serverless application deployment?
- A) Amazon EC2
- B) AWS Lambda
- C) Amazon ECS
- D) AWS Elastic Beanstalk

**Answer: B**
**Explanation:** Lambda provides serverless compute without managing servers.

### Question 92
What is the difference between S3 Standard and S3 One Zone-IA?
- A) Durability
- B) Availability zones
- C) Cost
- D) All of the above

**Answer: D**
**Explanation:** One Zone-IA stores data in single AZ (lower availability), costs less, but has same durability.

### Question 93
Which EC2 feature allows changing instance type?
- A) Instance modification
- B) Instance resizing
- C) Instance type change
- D) All of the above

**Answer: D**
**Explanation:** You can change instance type by stopping instance and modifying it.

### Question 94
What is AWS App Runner?
- A) Container orchestration
- B) Fully managed service for containerized web apps
- C) Serverless functions
- D) Virtual machines

**Answer: B**
**Explanation:** App Runner is a fully managed service for deploying containerized web applications.

### Question 95
Which storage option is best for frequently accessed data?
- A) S3 Glacier
- B) S3 Standard
- C) S3 Glacier Deep Archive
- D) S3 One Zone-IA

**Answer: B**
**Explanation:** S3 Standard is optimized for frequently accessed data.

### Question 96
What is EC2 placement group?
- A) Security feature
- B) Logical grouping for low latency
- C) Backup feature
- D) Monitoring feature

**Answer: B**
**Explanation:** Placement groups control instance placement for low latency or high availability.

### Question 97
Which service provides managed Apache Spark?
- A) Amazon EMR
- B) AWS Glue
- C) Amazon Kinesis
- D) AWS Lambda

**Answer: A**
**Explanation:** EMR (Elastic MapReduce) provides managed Hadoop and Spark clusters.

### Question 98
What is the purpose of S3 versioning?
- A) Compress files
- B) Keep multiple versions of objects
- C) Encrypt data
- D) Monitor access

**Answer: B**
**Explanation:** Versioning keeps multiple versions of objects for recovery and archival.

### Question 99
Which EC2 instance purchasing option can be interrupted?
- A) On-Demand
- B) Reserved
- C) Spot
- D) Dedicated

**Answer: C**
**Explanation:** Spot Instances can be interrupted by AWS with 2-minute notice.

### Question 100
What is AWS Lightsail?
- A) Serverless compute
- B) Simplified VPS service
- C) Container service
- D) Database service

**Answer: B**
**Explanation:** Lightsail provides easy-to-use virtual private servers with predictable pricing.

### Question 101
Which service provides file storage that can be mounted on multiple EC2 instances?
- A) Amazon EBS
- B) Amazon EFS
- C) Amazon S3
- D) Instance Store

**Answer: B**
**Explanation:** EFS can be mounted on multiple EC2 instances simultaneously.

### Question 102
What is the purpose of EC2 security groups?
- A) Encrypt data
- B) Virtual firewall for instances
- C) Monitor traffic
- D) Balance load

**Answer: B**
**Explanation:** Security groups act as virtual firewalls controlling inbound and outbound traffic.

### Question 103
Which storage class is best for data accessed once per quarter?
- A) S3 Standard
- B) S3 Standard-IA
- C) S3 Glacier
- D) S3 Intelligent-Tiering

**Answer: C**
**Explanation:** S3 Glacier is cost-effective for infrequently accessed archival data.

### Question 104
What is AWS Outposts?
- A) Cloud-only service
- B) Hybrid infrastructure bringing AWS to on-premises
- C) Migration tool
- D) Monitoring service

**Answer: B**
**Explanation:** Outposts brings AWS infrastructure and services to on-premises locations.

### Question 105
Which EC2 instance type is optimized for compute-intensive workloads?
- A) T3
- B) C5
- C) R5
- D) M5

**Answer: B**
**Explanation:** C5 instances are compute-optimized for compute-intensive applications.

### Question 106
What is S3 Cross-Region Replication?
- A) Backup service
- B) Automatic replication to another region
- C) Encryption service
- D) Monitoring service

**Answer: B**
**Explanation:** CRR automatically replicates objects to buckets in different regions.

### Question 107
Which service provides managed Redis or Memcached?
- A) Amazon RDS
- B) Amazon DynamoDB
- C) Amazon ElastiCache
- D) Amazon Redshift

**Answer: C**
**Explanation:** ElastiCache provides managed in-memory caching with Redis or Memcached.

### Question 108
What is the purpose of EBS snapshots?
- A) Monitor volumes
- B) Backup volumes to S3
- C) Encrypt volumes
- D) Resize volumes

**Answer: B**
**Explanation:** EBS snapshots create point-in-time backups stored in S3.

### Question 109
Which Lambda pricing component is NOT charged?
- A) Number of requests
- B) Compute time
- C) Code storage
- D) Network bandwidth within same region

**Answer: D**
**Explanation:** Lambda charges for requests and compute time, not for bandwidth within same region.

### Question 110
What is AWS Wavelength?
- A) Database service
- B) 5G edge computing service
- C) Storage service
- D) Analytics service

**Answer: B**
**Explanation:** Wavelength brings AWS services to 5G networks for ultra-low latency.

### Question 111
Which S3 feature prevents accidental deletion?
- A) Versioning
- B) MFA Delete
- C) Object Lock
- D) All of the above

**Answer: D**
**Explanation:** Versioning, MFA Delete, and Object Lock all help prevent accidental deletion.

### Question 112
What is the difference between ECS and EKS?
- A) ECS uses Docker, EKS uses Kubernetes
- B) ECS is serverless, EKS is not
- C) No difference
- D) ECS is for VMs, EKS is for containers

**Answer: A**
**Explanation:** ECS is AWS's container orchestration, EKS is managed Kubernetes.

### Question 113
Which EC2 feature provides a static IP address?
- A) Private IP
- B) Public IP
- C) Elastic IP
- D) Dynamic IP

**Answer: C**
**Explanation:** Elastic IP provides a static public IPv4 address.

### Question 114
What is AWS Snow Family used for?
- A) Monitoring
- B) Physical data transfer
- C) Encryption
- D) Backup

**Answer: B**
**Explanation:** Snow Family (Snowcone, Snowball, Snowmobile) transfers large amounts of data physically.

### Question 115
Which storage option provides the highest durability?
- A) Instance Store
- B) EBS
- C) S3
- D) EFS

**Answer: C**
**Explanation:** S3 provides 99.999999999% (11 9's) durability.

### Question 116
What is the purpose of EC2 key pairs?
- A) Encrypt data
- B) Secure SSH access
- C) Monitor instances
- D) Balance load

**Answer: B**
**Explanation:** Key pairs provide secure SSH access to Linux instances.

### Question 117
Which service provides managed message queuing with FIFO?
- A) Amazon SNS
- B) Amazon SQS FIFO
- C) Amazon Kinesis
- D) AWS EventBridge

**Answer: B**
**Explanation:** SQS FIFO queues provide exactly-once processing in order.

### Question 118
What is S3 Object Lock?
- A) Encryption feature
- B) WORM (Write Once Read Many) storage
- C) Access control
- D) Monitoring feature

**Answer: B**
**Explanation:** Object Lock provides WORM storage to prevent object deletion or modification.

### Question 119
Which EC2 instance type is optimized for storage-intensive workloads?
- A) T3
- B) C5
- C) I3
- D) M5

**Answer: C**
**Explanation:** I3 instances are storage-optimized with high IOPS.

### Question 120
What is AWS DataSync?
- A) Database service
- B) Automated data transfer service
- C) Backup service
- D) Monitoring service

**Answer: B**
**Explanation:** DataSync automates data transfer between on-premises and AWS.

### Question 121
Which S3 storage class has the lowest availability?
- A) S3 Standard
- B) S3 Standard-IA
- C) S3 One Zone-IA
- D) S3 Glacier

**Answer: C**
**Explanation:** S3 One Zone-IA stores data in single AZ with 99.5% availability.

### Question 122
What is the purpose of EC2 instance metadata?
- A) Monitor instance
- B) Access instance information from within instance
- C) Encrypt data
- D) Balance load

**Answer: B**
**Explanation:** Instance metadata provides information about the instance accessible from within.

### Question 123
Which service provides managed Hadoop?
- A) Amazon EMR
- B) AWS Glue
- C) Amazon Athena
- D) Amazon Redshift

**Answer: A**
**Explanation:** EMR provides managed Hadoop framework for big data processing.

### Question 124
What is S3 Select?
- A) Query service
- B) Retrieve subset of object data
- C) Backup service
- D) Monitoring service

**Answer: B**
**Explanation:** S3 Select retrieves subset of data from objects using SQL expressions.

### Question 125
Which EC2 pricing option provides capacity reservation?
- A) On-Demand Capacity Reservations
- B) Spot Instances
- C) Savings Plans
- D) All of the above

**Answer: A**
**Explanation:** On-Demand Capacity Reservations reserve capacity in specific AZ.

### Question 126
What is AWS Local Zones?
- A) Availability Zone
- B) Extension of region closer to users
- C) Edge location
- D) Data center

**Answer: B**
**Explanation:** Local Zones extend AWS regions closer to end users for low latency.

### Question 127
Which storage option is best for big data analytics?
- A) S3
- B) EBS
- C) EFS
- D) Instance Store

**Answer: A**
**Explanation:** S3 is ideal for big data analytics with services like Athena and EMR.

### Question 128
What is the purpose of EC2 Hibernate?
- A) Stop instance
- B) Save RAM contents to EBS and resume
- C) Terminate instance
- D) Restart instance

**Answer: B**
**Explanation:** Hibernate saves RAM contents to EBS for faster startup.

### Question 129
Which service provides serverless ETL?
- A) Amazon EMR
- B) AWS Glue
- C) AWS DataSync
- D) AWS DMS

**Answer: B**
**Explanation:** AWS Glue is a serverless ETL service for data preparation.

### Question 130
What is S3 Glacier retrieval time for Expedited retrieval?
- A) 1-5 minutes
- B) 3-5 hours
- C) 5-12 hours
- D) 12-48 hours

**Answer: A**
**Explanation:** Expedited retrieval from Glacier takes 1-5 minutes for urgent access.

---

## Exam Tips
- Understand EC2 instance types and use cases
- Know S3 storage classes and pricing
- Understand difference between EBS, EFS, and S3
- Know Lambda limitations and pricing
- Understand Auto Scaling and ELB
