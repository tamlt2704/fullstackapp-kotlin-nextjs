---
title: "AWS Cloud Practitioner Practice Exam 14 (Questions 846-910)"
date: "2024-01-25"
category: "AWS Certification"
tags: ["AWS", "Cloud Practitioner", "Certification", "Practice Exam"]
---

# AWS Cloud Practitioner Practice Exam 14
## Migration, Hybrid Cloud & Edge Services (Questions 846-910)

### Cloud Concepts (17 questions)

**Q846: A company wants to migrate their on-premises applications to AWS. Which service provides a framework to assess, plan, and execute the migration?**
- A) AWS Migration Hub
- B) AWS Application Discovery Service
- C) AWS Server Migration Service
- D) AWS Database Migration Service

**Answer: A) AWS Migration Hub**
**Explanation:** AWS Migration Hub provides a central location to track application migrations across multiple AWS and partner solutions, offering a framework for the entire migration process.

**Q847: What are the 6 R's of cloud migration?**
- A) Rehost, Replatform, Repurchase, Refactor, Retire, Retain
- B) Rebuild, Replace, Restore, Recover, Retire, Retain
- C) Rehost, Rebuild, Repurchase, Refactor, Remove, Retain
- D) Relocate, Replatform, Repurchase, Refactor, Retire, Restore

**Answer: A) Rehost, Replatform, Repurchase, Refactor, Retire, Retain**
**Explanation:** The 6 R's are AWS's migration strategies: Rehost (lift-and-shift), Replatform (lift-tinker-and-shift), Repurchase (move to SaaS), Refactor (re-architect), Retire (decommission), and Retain (keep on-premises).

**Q848: Which migration strategy involves moving applications to AWS without modifications?**
- A) Refactor
- B) Replatform
- C) Rehost
- D) Repurchase

**Answer: C) Rehost**
**Explanation:** Rehost (lift-and-shift) involves moving applications to AWS without making changes, providing the fastest migration path.

**Q849: A company wants to extend their on-premises data center to AWS. What is this architecture called?**
- A) Multi-cloud
- B) Hybrid cloud
- C) Private cloud
- D) Edge cloud

**Answer: B) Hybrid cloud**
**Explanation:** Hybrid cloud architecture connects on-premises infrastructure with cloud resources, allowing workloads to run across both environments.

**Q850: Which AWS service helps discover on-premises servers and databases for migration planning?**
- A) AWS Migration Hub
- B) AWS Application Discovery Service
- C) AWS Server Migration Service
- D) AWS DataSync

**Answer: B) AWS Application Discovery Service**
**Explanation:** AWS Application Discovery Service collects information about on-premises servers, including configuration, usage, and behavior data to plan migrations.

**Q851: What is the benefit of using AWS Outposts?**
- A) Lower latency for on-premises applications
- B) Run AWS services in your data center
- C) Meet data residency requirements
- D) All of the above

**Answer: D) All of the above**
**Explanation:** AWS Outposts brings AWS infrastructure and services to your on-premises location, providing low latency, local data processing, and meeting residency requirements.

**Q852: Which service provides content delivery at the edge with low latency?**
- A) Amazon S3
- B) Amazon CloudFront
- C) AWS Direct Connect
- D) Amazon Route 53

**Answer: B) Amazon CloudFront**
**Explanation:** CloudFront is a CDN that caches content at edge locations worldwide, delivering content with low latency to end users.

**Q853: A company needs to process IoT data at remote locations with intermittent connectivity. Which service should they use?**
- A) AWS IoT Core
- B) AWS Greengrass
- C) AWS Lambda
- D) Amazon Kinesis

**Answer: B) AWS Greengrass**
**Explanation:** AWS Greengrass extends AWS to edge devices, allowing local compute, messaging, and data caching even with intermittent connectivity.

**Q854: What is the primary benefit of edge computing?**
- A) Lower costs
- B) Reduced latency
- C) Increased storage
- D) Better security

**Answer: B) Reduced latency**
**Explanation:** Edge computing processes data closer to the source, significantly reducing latency by minimizing the distance data travels.

**Q855: Which service provides a dedicated network connection from on-premises to AWS?**
- A) VPN
- B) AWS Direct Connect
- C) AWS PrivateLink
- D) VPC Peering

**Answer: B) AWS Direct Connect**
**Explanation:** AWS Direct Connect provides a dedicated private network connection from your data center to AWS, offering consistent network performance.

**Q856: A company wants to run containerized applications consistently across on-premises and AWS. Which service should they use?**
- A) Amazon ECS
- B) Amazon EKS
- C) AWS Fargate
- D) AWS Outposts

**Answer: B) Amazon EKS**
**Explanation:** Amazon EKS (Elastic Kubernetes Service) provides consistent Kubernetes experience across on-premises and AWS environments using EKS Anywhere.

**Q857: What is the difference between AWS Site-to-Site VPN and AWS Client VPN?**
- A) Site-to-Site connects networks, Client VPN connects individual users
- B) Site-to-Site is faster than Client VPN
- C) Site-to-Site is more expensive than Client VPN
- D) There is no difference

**Answer: A) Site-to-Site connects networks, Client VPN connects individual users**
**Explanation:** Site-to-Site VPN connects entire networks (data center to VPC), while Client VPN allows individual users to securely connect to AWS resources.

**Q858: Which service helps migrate petabyte-scale data to AWS when network transfer is impractical?**
- A) AWS DataSync
- B) AWS Snowball
- C) AWS Transfer Family
- D) AWS Direct Connect

**Answer: B) AWS Snowball**
**Explanation:** AWS Snowball is a physical device for transferring large amounts of data (petabytes) when network transfer would take too long or be too expensive.

**Q859: What is the Cloud Adoption Framework (CAF)?**
- A) A pricing model
- B) A security framework
- C) Guidance for cloud transformation
- D) A compliance standard

**Answer: C) Guidance for cloud transformation**
**Explanation:** AWS CAF provides guidance and best practices to help organizations develop efficient cloud adoption plans across six perspectives: Business, People, Governance, Platform, Security, and Operations.

**Q860: Which migration strategy involves moving to a different product, typically SaaS?**
- A) Rehost
- B) Replatform
- C) Repurchase
- D) Refactor

**Answer: C) Repurchase**
**Explanation:** Repurchase involves moving to a different product, typically from a traditional license to SaaS (e.g., migrating from on-premises CRM to Salesforce).

**Q861: A company wants to cache frequently accessed data from on-premises applications in AWS. Which service should they use?**
- A) Amazon ElastiCache
- B) AWS Storage Gateway
- C) Amazon S3
- D) AWS DataSync

**Answer: B) AWS Storage Gateway**
**Explanation:** AWS Storage Gateway provides hybrid cloud storage with local caching, allowing on-premises applications to access AWS storage with low latency.

**Q862: What is the benefit of using AWS Wavelength?**
- A) Ultra-low latency for 5G applications
- B) Lower costs for compute
- C) Better security
- D) Increased storage capacity

**Answer: A) Ultra-low latency for 5G applications**
**Explanation:** AWS Wavelength embeds AWS compute and storage services within telecom providers' 5G networks, enabling ultra-low latency applications.

### Security & Compliance (16 questions)

**Q863: How does AWS Direct Connect improve security compared to internet-based connections?**
- A) It provides encryption by default
- B) Traffic doesn't traverse the public internet
- C) It includes built-in DDoS protection
- D) It automatically applies security groups

**Answer: B) Traffic doesn't traverse the public internet**
**Explanation:** Direct Connect provides a private connection that doesn't traverse the public internet, reducing exposure to internet-based threats.

**Q864: Which service encrypts data in transit for hybrid cloud storage?**
- A) AWS KMS
- B) AWS Storage Gateway
- C) Amazon S3
- D) AWS Certificate Manager

**Answer: B) AWS Storage Gateway**
**Explanation:** AWS Storage Gateway encrypts data in transit between on-premises and AWS using SSL/TLS, and can encrypt data at rest using AWS KMS.

**Q865: A company needs to ensure data residency compliance by keeping data on-premises. Which service allows them to use AWS services locally?**
- A) AWS Regions
- B) AWS Outposts
- C) AWS Local Zones
- D) AWS Wavelength

**Answer: B) AWS Outposts**
**Explanation:** AWS Outposts brings AWS infrastructure to your on-premises location, allowing you to keep data locally while using AWS services.

**Q866: Which service provides secure file transfer using SFTP, FTPS, and FTP protocols?**
- A) Amazon S3
- B) AWS Transfer Family
- C) AWS DataSync
- D) AWS Storage Gateway

**Answer: B) AWS Transfer Family**
**Explanation:** AWS Transfer Family provides fully managed SFTP, FTPS, and FTP services for transferring files into and out of Amazon S3 or EFS.

**Q867: How can you secure data during migration to AWS?**
- A) Use encryption in transit (SSL/TLS)
- B) Use encryption at rest
- C) Use VPN or Direct Connect
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Secure migrations use encryption in transit, encryption at rest, and private network connections like VPN or Direct Connect.

**Q868: Which service helps ensure compliance during cloud migration?**
- A) AWS Artifact
- B) AWS Config
- C) AWS CloudTrail
- D) All of the above

**Answer: D) All of the above**
**Explanation:** AWS Artifact provides compliance reports, Config tracks resource configurations, and CloudTrail logs API calls for audit trails.

**Q869: A company wants to extend their Active Directory to AWS. Which service should they use?**
- A) AWS IAM
- B) AWS Directory Service
- C) Amazon Cognito
- D) AWS SSO

**Answer: B) AWS Directory Service**
**Explanation:** AWS Directory Service provides managed Active Directory options, including AD Connector to extend on-premises AD to AWS.

**Q870: Which feature of AWS Site-to-Site VPN provides redundancy?**
- A) Multiple VPN tunnels
- B) Two VPN tunnels per connection
- C) Automatic failover
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Site-to-Site VPN provides two VPN tunnels per connection for redundancy with automatic failover between tunnels.

**Q871: How does AWS Outposts maintain security?**
- A) Uses same AWS security services as cloud
- B) Physically secured in your data center
- C) Encrypted connections to AWS Regions
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Outposts maintains security through AWS security services, physical security in your facility, and encrypted connections to AWS Regions.

**Q872: Which service provides network isolation for hybrid cloud architectures?**
- A) Security Groups
- B) Network ACLs
- C) Amazon VPC
- D) All of the above

**Answer: D) All of the above**
**Explanation:** VPC provides network isolation, with Security Groups and Network ACLs controlling traffic for hybrid architectures.

**Q873: A company needs to audit all data transfers between on-premises and AWS. Which service should they use?**
- A) AWS CloudTrail
- B) Amazon CloudWatch
- C) AWS Config
- D) VPC Flow Logs

**Answer: A) AWS CloudTrail**
**Explanation:** CloudTrail logs all API calls, including data transfer operations, providing a complete audit trail.

**Q874: Which service provides DDoS protection for applications running on AWS Outposts?**
- A) AWS Shield Standard
- B) AWS Shield Advanced
- C) AWS WAF
- D) Security Groups

**Answer: B) AWS Shield Advanced**
**Explanation:** AWS Shield Advanced provides DDoS protection for applications on Outposts, with 24/7 support from the DDoS Response Team.

**Q875: How can you secure API calls from on-premises applications to AWS?**
- A) Use IAM credentials
- B) Use VPN or Direct Connect
- C) Use SSL/TLS encryption
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Secure API calls use IAM for authentication, private connections (VPN/Direct Connect), and SSL/TLS for encryption.

**Q876: Which service helps discover security vulnerabilities during migration?**
- A) Amazon Inspector
- B) AWS Security Hub
- C) Amazon GuardDuty
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Inspector scans for vulnerabilities, Security Hub aggregates findings, and GuardDuty detects threats during migration.

**Q877: A company wants to use the same IAM policies for on-premises and AWS resources. Which service enables this?**
- A) AWS IAM
- B) AWS SSO
- C) AWS Directory Service
- D) AWS Organizations

**Answer: B) AWS SSO**
**Explanation:** AWS SSO (IAM Identity Center) provides centralized access management for both AWS accounts and on-premises applications.

**Q878: Which service provides private connectivity between VPCs and on-premises networks without using the internet?**
- A) VPC Peering
- B) AWS Transit Gateway
- C) AWS PrivateLink
- D) AWS Direct Connect

**Answer: D) AWS Direct Connect**
**Explanation:** Direct Connect provides private connectivity between on-premises and AWS without traversing the public internet.

### Technology (22 questions)

**Q879: Which AWS service automates the migration of on-premises VMware workloads to AWS?**
- A) AWS Application Migration Service
- B) AWS Server Migration Service
- C) AWS Database Migration Service
- D) AWS Migration Hub

**Answer: A) AWS Application Migration Service**
**Explanation:** AWS Application Migration Service (formerly CloudEndure) automates lift-and-shift migrations of physical, virtual, and cloud servers to AWS.

**Q880: A company needs to synchronize files between on-premises NFS and Amazon S3. Which service should they use?**
- A) AWS Storage Gateway
- B) AWS DataSync
- C) AWS Transfer Family
- D) AWS Snowball

**Answer: B) AWS DataSync**
**Explanation:** AWS DataSync automates and accelerates data transfer between on-premises storage and AWS storage services like S3 and EFS.

**Q881: Which Storage Gateway type provides a file interface to S3?**
- A) Volume Gateway
- B) Tape Gateway
- C) File Gateway
- D) Object Gateway

**Answer: C) File Gateway**
**Explanation:** File Gateway provides a file interface (NFS/SMB) to store and retrieve objects in S3 using standard file protocols.

**Q882: A company wants to migrate their Oracle database to AWS with minimal downtime. Which service should they use?**
- A) AWS Database Migration Service
- B) AWS DataSync
- C) AWS Snowball
- D) AWS Transfer Family

**Answer: A) AWS Database Migration Service**
**Explanation:** AWS DMS supports live database migrations with minimal downtime, including Oracle to AWS database services.

**Q883: Which service provides a rugged, portable edge computing device for harsh environments?**
- A) AWS Snowball
- B) AWS Snowball Edge
- C) AWS Snowcone
- D) AWS Snowmobile

**Answer: C) AWS Snowcone**
**Explanation:** AWS Snowcone is the smallest, most rugged device in the Snow Family, designed for edge computing in harsh environments.

**Q884: What is the storage capacity of AWS Snowball Edge Storage Optimized?**
- A) 8 TB
- B) 42 TB
- C) 80 TB
- D) 100 TB

**Answer: C) 80 TB**
**Explanation:** Snowball Edge Storage Optimized provides 80 TB of usable storage for large-scale data transfers and edge computing.

**Q885: Which service provides a fully managed VMware Cloud environment on AWS?**
- A) AWS Outposts
- B) VMware Cloud on AWS
- C) Amazon EC2
- D) AWS Elastic Beanstalk

**Answer: B) VMware Cloud on AWS**
**Explanation:** VMware Cloud on AWS provides a fully managed VMware SDDC running on AWS infrastructure, enabling seamless hybrid cloud.

**Q886: A company needs to run AWS services on-premises with the same APIs and tools. Which service should they use?**
- A) AWS Local Zones
- B) AWS Wavelength
- C) AWS Outposts
- D) AWS Direct Connect

**Answer: C) AWS Outposts**
**Explanation:** AWS Outposts brings AWS infrastructure, services, APIs, and tools to your on-premises location for a consistent hybrid experience.

**Q887: Which service provides low-latency compute for applications in specific geographic locations?**
- A) AWS Regions
- B) AWS Local Zones
- C) AWS Wavelength
- D) AWS Outposts

**Answer: B) AWS Local Zones**
**Explanation:** AWS Local Zones place compute, storage, and database services closer to end users in specific geographic locations for low-latency applications.

**Q888: What is the maximum data transfer capacity of AWS Snowmobile?**
- A) 100 TB
- B) 1 PB
- C) 10 PB
- D) 100 PB

**Answer: D) 100 PB**
**Explanation:** AWS Snowmobile is a shipping container on a truck that can transfer up to 100 PB of data for exabyte-scale migrations.

**Q889: Which service helps migrate databases to AWS with schema conversion?**
- A) AWS Database Migration Service
- B) AWS Schema Conversion Tool
- C) Both A and B
- D) AWS DataSync

**Answer: C) Both A and B**
**Explanation:** AWS DMS migrates databases, and AWS Schema Conversion Tool (SCT) converts database schemas between different database engines.

**Q890: A company wants to cache frequently accessed files from S3 on-premises. Which Storage Gateway type should they use?**
- A) Volume Gateway
- B) Tape Gateway
- C) File Gateway
- D) Cached Gateway

**Answer: C) File Gateway**
**Explanation:** File Gateway caches frequently accessed files locally while storing all data in S3, providing low-latency access.

**Q891: Which service provides managed DNS for hybrid cloud architectures?**
- A) Amazon Route 53
- B) AWS Direct Connect
- C) Amazon CloudFront
- D) AWS Global Accelerator

**Answer: A) Amazon Route 53**
**Explanation:** Route 53 provides managed DNS that works across hybrid architectures, routing traffic between on-premises and AWS resources.

**Q892: What is the purpose of AWS Transit Gateway?**
- A) Connect multiple VPCs and on-premises networks
- B) Provide internet gateway functionality
- C) Enable VPC peering
- D) Provide NAT gateway functionality

**Answer: A) Connect multiple VPCs and on-premises networks**
**Explanation:** AWS Transit Gateway acts as a hub to connect multiple VPCs, on-premises networks, and remote offices through a single gateway.

**Q893: Which service provides edge computing with machine learning inference?**
- A) AWS Lambda
- B) AWS Greengrass
- C) Amazon SageMaker
- D) AWS IoT Core

**Answer: B) AWS Greengrass**
**Explanation:** AWS Greengrass extends AWS to edge devices, enabling local compute, messaging, and ML inference even with intermittent connectivity.

**Q894: A company needs to transfer 50 TB of data to AWS within one week. Which service is most appropriate?**
- A) AWS DataSync over internet
- B) AWS Snowball
- C) AWS Direct Connect
- D) AWS Transfer Family

**Answer: B) AWS Snowball**
**Explanation:** For 50 TB with a one-week timeline, Snowball is most appropriate as it's faster and more cost-effective than internet transfer.

**Q895: Which service provides a virtual tape library interface for backup applications?**
- A) File Gateway
- B) Volume Gateway
- C) Tape Gateway
- D) AWS Backup

**Answer: C) Tape Gateway**
**Explanation:** Tape Gateway provides a virtual tape library (VTL) interface, allowing backup applications to write to virtual tapes stored in S3 and Glacier.

**Q896: What is the benefit of using AWS Local Zones?**
- A) Single-digit millisecond latency to end users
- B) Lower costs than Regions
- C) More services than Regions
- D) Better security than Regions

**Answer: A) Single-digit millisecond latency to end users**
**Explanation:** Local Zones place AWS services closer to end users in specific locations, providing single-digit millisecond latency.

**Q897: Which service provides a consistent Kubernetes experience across on-premises and AWS?**
- A) Amazon ECS
- B) Amazon EKS Anywhere
- C) AWS Fargate
- D) AWS App Runner

**Answer: B) Amazon EKS Anywhere**
**Explanation:** Amazon EKS Anywhere allows you to run Kubernetes clusters on-premises using the same EKS software and APIs as in AWS.

**Q898: A company wants to run latency-sensitive applications at 5G edge locations. Which service should they use?**
- A) AWS Local Zones
- B) AWS Wavelength
- C) AWS Outposts
- D) Amazon CloudFront

**Answer: B) AWS Wavelength**
**Explanation:** AWS Wavelength embeds AWS compute and storage within telecom providers' 5G networks for ultra-low latency applications.

**Q899: Which service provides block storage volumes for on-premises applications backed by S3?**
- A) File Gateway
- B) Volume Gateway
- C) Tape Gateway
- D) Amazon EBS

**Answer: B) Volume Gateway**
**Explanation:** Volume Gateway provides block storage volumes (iSCSI) for on-premises applications, with data stored in S3 and cached locally.

**Q900: What is the purpose of AWS Application Discovery Service?**
- A) Discover AWS services
- B) Discover on-premises servers and dependencies
- C) Discover security vulnerabilities
- D) Discover cost optimization opportunities

**Answer: B) Discover on-premises servers and dependencies**
**Explanation:** Application Discovery Service collects data about on-premises servers, including configurations, usage, and dependencies for migration planning.

### Billing & Pricing (10 questions)

**Q901: How does AWS Direct Connect pricing work?**
- A) Charged per hour for port usage and data transfer out
- B) Charged only for data transfer
- C) Charged only for port usage
- D) Free service

**Answer: A) Charged per hour for port usage and data transfer out**
**Explanation:** Direct Connect charges hourly for dedicated port usage and for data transferred out of AWS (data in is free).

**Q902: Which data transfer is free with AWS Storage Gateway?**
- A) Data transfer from on-premises to AWS
- B) Data transfer from AWS to on-premises
- C) Both directions
- D) Neither direction

**Answer: A) Data transfer from on-premises to AWS**
**Explanation:** Data transfer into AWS (ingress) is free, but data transfer out of AWS (egress) incurs charges.

**Q903: How is AWS Outposts priced?**
- A) Pay-as-you-go hourly
- B) 3-year commitment
- C) Monthly subscription
- D) One-time purchase

**Answer: B) 3-year commitment**
**Explanation:** AWS Outposts requires a 3-year commitment with pricing based on the Outpost configuration and capacity.

**Q904: Which Snow Family device has the lowest cost for small data transfers (under 10 TB)?**
- A) Snowball
- B) Snowball Edge
- C) Snowcone
- D) Snowmobile

**Answer: C) Snowcone**
**Explanation:** Snowcone is the most cost-effective option for smaller data transfers (8 TB usable capacity) and edge computing.

**Q905: How can you reduce data transfer costs in hybrid architectures?**
- A) Use AWS Direct Connect instead of internet
- B) Use VPC endpoints
- C) Compress data before transfer
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Direct Connect reduces transfer costs, VPC endpoints eliminate internet charges, and compression reduces data volume.

**Q906: Which service has no data transfer charges between on-premises and AWS?**
- A) AWS DataSync
- B) AWS Direct Connect (data in)
- C) AWS Storage Gateway (data in)
- D) Both B and C

**Answer: D) Both B and C**
**Explanation:** Data transfer into AWS is free for both Direct Connect and Storage Gateway (data out incurs charges).

**Q907: How is AWS DataSync priced?**
- A) Per GB of data transferred
- B) Hourly for running tasks
- C) Monthly subscription
- D) Free service

**Answer: A) Per GB of data transferred**
**Explanation:** AWS DataSync charges per GB of data copied, with no upfront fees or minimum commitments.

**Q908: Which migration strategy typically has the lowest initial cost?**
- A) Refactor
- B) Replatform
- C) Rehost
- D) Repurchase

**Answer: C) Rehost**
**Explanation:** Rehost (lift-and-shift) has the lowest initial cost as it requires minimal changes, though it may not optimize for cloud cost savings.

**Q909: How can AWS Cost Explorer help with migration planning?**
- A) Estimate migration costs
- B) Track actual migration costs
- C) Forecast post-migration costs
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Cost Explorer helps estimate migration costs, track actual spending during migration, and forecast future costs after migration.

**Q910: Which service provides cost optimization recommendations for hybrid architectures?**
- A) AWS Cost Explorer
- B) AWS Trusted Advisor
- C) AWS Compute Optimizer
- D) All of the above

**Answer: D) All of the above**
**Explanation:** Cost Explorer analyzes spending, Trusted Advisor provides recommendations, and Compute Optimizer suggests right-sizing for hybrid workloads.

---

## Exam 14 Complete - 65 Questions
**Focus Areas:** Migration strategies (6 R's), hybrid cloud architecture, AWS Outposts, Direct Connect, Storage Gateway, DataSync, Snow Family, edge computing (Greengrass, Wavelength, Local Zones), VMware Cloud on AWS, Transit Gateway, and migration cost optimization.
