---
title: "Docker & Kubernetes Complete Guide"
date: "2024-12-11"
category: "DevOps"
tags: ["Docker", "Kubernetes", "Containers", "DevOps", "Orchestration"]
---

# Docker & Kubernetes Complete Guide

*Published on December 11, 2024*

## 1. Docker Fundamentals

### What is Docker?
Docker is a platform for developing, shipping, and running applications in containers. Containers package software with all dependencies, ensuring consistency across environments.

### Docker Architecture
```
Docker Client → Docker Daemon → Containers
                    ↓
              Docker Images
                    ↓
              Docker Registry (Docker Hub)
```

### Basic Docker Commands
```bash
# Image management
docker pull nginx:latest
docker images
docker rmi image_name
docker build -t myapp:1.0 .

# Container management
docker run -d -p 8080:80 --name webserver nginx
docker ps
docker ps -a
docker stop container_id
docker start container_id
docker rm container_id
docker logs container_id
docker exec -it container_id bash

# System commands
docker system prune
docker volume ls
docker network ls
```

### Dockerfile Best Practices
```dockerfile
# Multi-stage build for smaller images
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Best practices:
# - Use specific versions
# - Minimize layers
# - Use .dockerignore
# - Run as non-root user
# - Use multi-stage builds
```

### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://db:5432/mydb
    depends_on:
      - db
    networks:
      - app-network
    volumes:
      - ./backend:/app
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8080
    depends_on:
      - backend
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

### Q&A: Docker Fundamentals

**Q1: What's the difference between Docker image and container?**
A: Image is a read-only template with instructions. Container is a running instance of an image.

**Q2: What's the difference between CMD and ENTRYPOINT?**
A: ENTRYPOINT defines the executable, CMD provides default arguments. ENTRYPOINT is harder to override.

**Q3: How do you optimize Docker image size?**
A: Use multi-stage builds, alpine base images, minimize layers, remove unnecessary files, and use .dockerignore.

**Q4: What's the difference between COPY and ADD?**
A: COPY is simpler and preferred. ADD has extra features (tar extraction, URL support) but less predictable.

**Q5: How do you handle secrets in Docker?**
A: Use Docker secrets, environment variables from secure sources, or secret management tools like Vault.

## 2. Kubernetes Fundamentals

### Kubernetes Architecture
```
Master Node:
- API Server
- Scheduler
- Controller Manager
- etcd

Worker Nodes:
- Kubelet
- Kube-proxy
- Container Runtime
- Pods
```

### Core Kubernetes Objects

#### Pods
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: myapp:1.0
    ports:
    - containerPort: 8080
    env:
    - name: DATABASE_URL
      value: "postgresql://db:5432/mydb"
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

#### Deployments
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
        ports:
        - containerPort: 8080
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

#### Services
```yaml
# ClusterIP Service (internal)
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP

---
# LoadBalancer Service (external)
apiVersion: v1
kind: Service
metadata:
  name: myapp-lb
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer

---
# NodePort Service
apiVersion: v1
kind: Service
metadata:
  name: myapp-nodeport
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
    nodePort: 30080
  type: NodePort
```

#### ConfigMaps and Secrets
```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database.host: "db.example.com"
  database.port: "5432"
  app.properties: |
    key1=value1
    key2=value2

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database-password: cGFzc3dvcmQxMjM=  # base64 encoded
  api-key: YXBpa2V5MTIz

---
# Using ConfigMap and Secret in Pod
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
spec:
  containers:
  - name: myapp
    image: myapp:1.0
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database.host
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: database-password
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

### Q&A: Kubernetes Fundamentals

**Q1: What's the difference between Deployment and StatefulSet?**
A: Deployment for stateless apps with interchangeable pods. StatefulSet for stateful apps needing stable network identity and persistent storage.

**Q2: What are the different Service types?**
A: ClusterIP (internal), NodePort (external via node port), LoadBalancer (external with cloud LB), ExternalName (DNS alias).

**Q3: What's the difference between ConfigMap and Secret?**
A: ConfigMap for non-sensitive configuration. Secret for sensitive data (base64 encoded, can be encrypted at rest).

**Q4: How does Kubernetes handle pod failures?**
A: Controllers (Deployment, ReplicaSet) automatically restart failed pods to maintain desired replica count.

**Q5: What's the purpose of namespaces?**
A: Logical isolation of resources, multi-tenancy, resource quotas, and access control within a cluster.

## 3. Advanced Kubernetes Concepts

### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 3000
```

### Persistent Volumes
```yaml
# PersistentVolume
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard
  hostPath:
    path: /data/postgres

---
# PersistentVolumeClaim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard

---
# Using PVC in Pod
apiVersion: v1
kind: Pod
metadata:
  name: postgres-pod
spec:
  containers:
  - name: postgres
    image: postgres:15
    volumeMounts:
    - name: postgres-storage
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: postgres-storage
    persistentVolumeClaim:
      claimName: postgres-pvc
```

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
```

### Jobs and CronJobs
```yaml
# Job
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  template:
    spec:
      containers:
      - name: migration
        image: myapp:1.0
        command: ["./migrate.sh"]
      restartPolicy: OnFailure
  backoffLimit: 3
  completions: 1
  parallelism: 1

---
# CronJob
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-job
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:1.0
            command: ["./backup.sh"]
          restartPolicy: OnFailure
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
```

### Q&A: Advanced Kubernetes

**Q1: How does Ingress differ from Service?**
A: Service exposes pods within cluster or via NodePort/LoadBalancer. Ingress provides HTTP/HTTPS routing with path-based rules and SSL termination.

**Q2: What's the difference between PV and PVC?**
A: PV is cluster resource provisioned by admin. PVC is user request for storage that binds to a PV.

**Q3: How does HPA work?**
A: HPA monitors metrics (CPU, memory, custom) and automatically scales pod replicas to maintain target utilization.

**Q4: What's the difference between Job and CronJob?**
A: Job runs once to completion. CronJob runs Jobs on a schedule (like cron).

**Q5: How do you handle database migrations in Kubernetes?**
A: Use Init Containers, Jobs for one-time migrations, or include in application startup with idempotency.

## 4. Kubernetes Best Practices

### Resource Management
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    persistentvolumeclaims: "10"

---
apiVersion: v1
kind: LimitRange
metadata:
  name: resource-limits
  namespace: production
spec:
  limits:
  - max:
      cpu: "2"
      memory: 4Gi
    min:
      cpu: "100m"
      memory: 128Mi
    default:
      cpu: "500m"
      memory: 512Mi
    defaultRequest:
      cpu: "250m"
      memory: 256Mi
    type: Container
```

### Health Checks
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: healthy-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    # Liveness: Is container alive?
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    
    # Readiness: Is container ready to serve traffic?
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
    
    # Startup: Has container started?
    startupProbe:
      httpGet:
        path: /startup
        port: 8080
      initialDelaySeconds: 0
      periodSeconds: 10
      timeoutSeconds: 3
      failureThreshold: 30
```

### Security Best Practices
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}

---
# Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

### Monitoring and Logging
```yaml
# ServiceMonitor for Prometheus
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: myapp-metrics
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics

---
# Pod with logging sidecar
apiVersion: v1
kind: Pod
metadata:
  name: app-with-logging
spec:
  containers:
  - name: app
    image: myapp:1.0
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  - name: log-shipper
    image: fluent/fluent-bit:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
      readOnly: true
  volumes:
  - name: logs
    emptyDir: {}
```

### Q&A: Best Practices

**Q1: What are the recommended resource limits?**
A: Set requests based on average usage, limits 1.5-2x requests. Monitor and adjust based on actual usage patterns.

**Q2: How do you implement zero-downtime deployments?**
A: Use rolling updates, readiness probes, PodDisruptionBudgets, and proper health checks.

**Q3: What's the difference between liveness and readiness probes?**
A: Liveness restarts unhealthy containers. Readiness removes pods from service endpoints when not ready.

**Q4: How do you secure Kubernetes clusters?**
A: RBAC, Network Policies, Pod Security Standards, secrets encryption, regular updates, and security scanning.

**Q5: What's the best way to manage configurations?**
A: Use ConfigMaps for non-sensitive data, Secrets for sensitive data, and consider tools like Helm or Kustomize for templating.

## 5. Helm and Package Management

### Helm Basics
```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search charts
helm search repo postgres

# Install chart
helm install my-postgres bitnami/postgresql

# List releases
helm list

# Upgrade release
helm upgrade my-postgres bitnami/postgresql --set auth.password=newpassword

# Rollback
helm rollback my-postgres 1

# Uninstall
helm uninstall my-postgres
```

### Creating Helm Charts
```yaml
# Chart.yaml
apiVersion: v2
name: myapp
description: My Application Helm Chart
version: 1.0.0
appVersion: "1.0"

---
# values.yaml
replicaCount: 3

image:
  repository: myapp
  tag: "1.0"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

---
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: 8080
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
```

### Q&A: Helm

**Q1: What are the benefits of using Helm?**
A: Package management, templating, versioning, easy rollbacks, and sharing charts across teams.

**Q2: What's the difference between Helm 2 and Helm 3?**
A: Helm 3 removed Tiller (server component), improved security, and added better CRD support.

**Q3: How do you manage secrets in Helm?**
A: Use helm-secrets plugin, external secret managers (Vault), or encrypt values files with SOPS.

**Q4: What's the purpose of _helpers.tpl?**
A: Define reusable template functions and labels for consistency across chart templates.

**Q5: How do you test Helm charts?**
A: Use `helm lint`, `helm template`, `helm test`, and tools like chart-testing for CI/CD.

## 6. Production Deployment Strategies

### Complete Application Stack
```yaml
# Full stack deployment with all components
---
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production

---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: myapp-backend:1.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: myapp-frontend:1.0
        ports:
        - containerPort: 3000

---
# Database StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: production
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi

---
# Services and Ingress
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: production
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
spec:
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### Q&A: Production Deployment

**Q1: How do you handle database migrations in production?**
A: Use Init Containers, Jobs before deployment, or application-managed migrations with proper rollback strategies.

**Q2: What's the recommended approach for secrets management?**
A: Use external secret managers (Vault, AWS Secrets Manager), sealed secrets, or SOPS with GitOps.

**Q3: How do you implement blue-green deployments?**
A: Use separate Deployments with Service selector switching, or tools like Argo Rollouts or Flagger.

**Q4: What's the best way to handle persistent data?**
A: Use StatefulSets with PVCs, managed databases (RDS, Cloud SQL), or operators for complex stateful applications.

**Q5: How do you monitor Kubernetes in production?**
A: Use Prometheus + Grafana for metrics, ELK/Loki for logs, Jaeger for tracing, and tools like Lens or k9s for cluster management.

---

*This comprehensive Docker & Kubernetes guide covers fundamental concepts to production deployment strategies. Master these tools to build, deploy, and manage containerized applications at scale.*