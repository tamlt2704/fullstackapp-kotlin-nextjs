---
title: "AWS Cloud Practitioner Study Notes"
date: "2024-12-03"
category: "Cloud"
tags: ["AWS", "Cloud", "Certification", "Study Notes"]
---

# AWS Cloud Practitioner Study Notes

*Published on December 3, 2024*

## Cloud Computing Fundamentals

### What is Cloud Computing?
- **On-demand delivery** of IT resources over the internet
- **Pay-as-you-go** pricing model
- **No upfront infrastructure investment**

### Cloud Deployment Models
1. **Public Cloud** - AWS, Azure, GCP
2. **Private Cloud** - On-premises, dedicated
3. **Hybrid Cloud** - Mix of public and private

### Cloud Computing Benefits
- **Cost Savings** - No upfront costs, pay for what you use
- **Scalability** - Scale up/down based on demand
- **Reliability** - Multiple data centers, redundancy
- **Security** - AWS handles infrastructure security
- **Global Reach** - Deploy worldwide in minutes

## AWS Global Infrastructure

### Regions
- **Geographic areas** with multiple Availability Zones
- **Choose based on**: Compliance, latency, pricing, services
- **Examples**: us-east-1, eu-west-1, ap-southeast-1

### Availability Zones (AZs)
- **Isolated data centers** within a region
- **Minimum 3 AZs** per region
- **Connected via high-speed networks**

### Edge Locations
- **Content delivery** endpoints for CloudFront
- **Lower latency** for global users

## Core AWS Services

### Compute Services

#### EC2 (Elastic Compute Cloud)
```bash
# Instance Types
- t3.micro (1 vCPU, 1GB RAM) - General purpose
- c5.large (2 vCPU, 4GB RAM) - Compute optimized
- r5.xlarge (4 vCPU, 32GB RAM) - Memory optimized
```

#### Lambda
- **Serverless** compute service
- **Event-driven** execution
- **Pay per request** and compute time
- **Automatic scaling**

### Storage Services

#### S3 (Simple Storage Service)
- **Object storage** with unlimited capacity
- **Storage Classes**:
  - Standard - Frequent access
  - IA (Infrequent Access) - Lower cost
  - Glacier - Long-term archival
  - Deep Archive - Lowest cost archival

#### EBS (Elastic Block Store)
- **Block storage** for EC2 instances
- **Persistent** storage that survives instance termination
- **Types**: gp3, io2, st1, sc1

### Database Services

#### RDS (Relational Database Service)
- **Managed databases**: MySQL, PostgreSQL, Oracle, SQL Server
- **Automated backups** and patching
- **Multi-AZ** for high availability

#### DynamoDB
- **NoSQL database** service
- **Serverless** and fully managed
- **Single-digit millisecond** latency

### Networking Services

#### VPC (Virtual Private Cloud)
- **Isolated network** in AWS cloud
- **Subnets**: Public and private
- **Security Groups**: Instance-level firewall
- **NACLs**: Subnet-level firewall

#### CloudFront
- **Content Delivery Network** (CDN)
- **Global edge locations**
- **Caches content** closer to users

## Security & Compliance

### Shared Responsibility Model
- **AWS Responsibility**: Security OF the cloud
  - Physical security, infrastructure, services
- **Customer Responsibility**: Security IN the cloud
  - Data, applications, operating systems, network configuration

### IAM (Identity and Access Management)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

#### Key Concepts
- **Users**: Individual accounts
- **Groups**: Collection of users
- **Roles**: Temporary permissions for services
- **Policies**: JSON documents defining permissions

### Security Services
- **CloudTrail**: API call logging
- **Config**: Resource configuration monitoring
- **GuardDuty**: Threat detection
- **Inspector**: Application security assessment

## Pricing & Billing

### Pricing Models
1. **Pay-as-you-go** - No upfront costs
2. **Reserved Instances** - 1-3 year commitments, up to 75% savings
3. **Spot Instances** - Unused capacity, up to 90% savings

### Cost Management Tools
- **Cost Explorer**: Visualize spending patterns
- **Budgets**: Set spending alerts
- **Trusted Advisor**: Cost optimization recommendations
- **Cost and Usage Reports**: Detailed billing data

### Free Tier
- **12 months free** for new accounts
- **Always free** services (Lambda, DynamoDB)
- **Trials** for specific services

## Support Plans

1. **Basic** - Free, documentation and forums
2. **Developer** - $29/month, business hours support
3. **Business** - $100/month, 24/7 support, API access
4. **Enterprise** - $15,000/month, dedicated TAM

## Well-Architected Framework

### 6 Pillars
1. **Operational Excellence** - Run and monitor systems
2. **Security** - Protect information and systems
3. **Reliability** - Recover from failures, scale
4. **Performance Efficiency** - Use resources efficiently
5. **Cost Optimization** - Avoid unnecessary costs
6. **Sustainability** - Minimize environmental impact

## Study Tips

### Practice Areas
- **Hands-on Labs**: Create EC2 instances, S3 buckets
- **AWS Free Tier**: Experiment without cost
- **Practice Exams**: Identify knowledge gaps
- **AWS Documentation**: Official source of truth

### Key Exam Topics
- Cloud concepts (25%)
- Security and compliance (30%)
- Technology (33%)
- Billing and pricing (12%)

### Common Scenarios
- **Cost optimization**: Reserved instances, right-sizing
- **High availability**: Multi-AZ deployments
- **Disaster recovery**: Backup strategies, RTO/RPO
- **Security**: IAM policies, encryption, compliance

## Quick Reference

### Service Categories
```
Compute: EC2, Lambda, ECS, EKS
Storage: S3, EBS, EFS, FSx
Database: RDS, DynamoDB, Redshift, Aurora
Networking: VPC, CloudFront, Route 53, ELB
Security: IAM, KMS, Secrets Manager, WAF
Management: CloudWatch, CloudTrail, Config
```

### Exam Preparation Checklist
- [ ] Understand cloud computing benefits
- [ ] Know AWS global infrastructure
- [ ] Learn core services and use cases
- [ ] Understand shared responsibility model
- [ ] Practice IAM policies and permissions
- [ ] Study pricing models and cost optimization
- [ ] Review Well-Architected Framework
- [ ] Take practice exams

## Resources

- **AWS Training**: Free digital courses
- **AWS Skill Builder**: Interactive learning
- **AWS Whitepapers**: In-depth technical content
- **Practice Exams**: Official AWS practice tests
- **Community**: AWS forums, Reddit, Discord

---

*Good luck with your AWS Cloud Practitioner certification! Remember to practice hands-on with the AWS Free Tier.*