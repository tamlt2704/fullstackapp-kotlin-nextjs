---
title: "Gradle Complete Guide - Day-to-Day Java Builds"
date: "2024-12-13"
category: "Build Tools"
tags: ["Gradle", "Java", "Build", "Multi-Project", "Submodules", "DevOps"]
---

# Gradle Complete Guide - Day-to-Day Java Builds

## What is Gradle?

Gradle is a powerful build automation tool that uses Groovy or Kotlin DSL for configuration. It's the preferred build system for Android and widely used in Java/Kotlin projects.

**Key Features**:
- Declarative builds with convention over configuration
- Incremental builds for faster compilation
- Multi-project support
- Dependency management
- Plugin ecosystem
- Build caching and parallel execution

---

## Getting Started

### Installation

```bash
# Using SDKMAN
sdk install gradle

# Using Homebrew (macOS)
brew install gradle

# Using Chocolatey (Windows)
choco install gradle

# Verify installation
gradle --version
```

### Gradle Wrapper (Recommended)

```bash
# Generate wrapper
gradle wrapper --gradle-version 8.5

# Use wrapper (cross-platform)
./gradlew build        # Unix/macOS
gradlew.bat build      # Windows
```

**Benefits**: Ensures consistent Gradle version across team, no local installation needed.

---

## Basic Project Structure

```
my-project/
├── build.gradle(.kts)      # Build configuration
├── settings.gradle(.kts)   # Project settings
├── gradle.properties       # Properties
├── gradlew                 # Wrapper script (Unix)
├── gradlew.bat            # Wrapper script (Windows)
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
└── src/
    ├── main/
    │   ├── java/
    │   └── resources/
    └── test/
        ├── java/
        └── resources/
```

---

## Build File Basics

### build.gradle (Groovy)

```groovy
plugins {
    id 'java'
    id 'application'
}

group = 'com.example'
version = '1.0.0'

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.guava:guava:32.1.3-jre'
    testImplementation 'junit:junit:4.13.2'
}

application {
    mainClass = 'com.example.Main'
}
```

### build.gradle.kts (Kotlin DSL)

```kotlin
plugins {
    java
    application
}

group = "com.example"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.guava:guava:32.1.3-jre")
    testImplementation("junit:junit:4.13.2")
}

application {
    mainClass.set("com.example.Main")
}
```

---

## Essential Commands

### Build Lifecycle

```bash
# Clean build directory
./gradlew clean

# Compile main sources
./gradlew compileJava

# Compile test sources
./gradlew compileTestJava

# Run tests
./gradlew test

# Build JAR (without tests)
./gradlew assemble

# Full build (with tests)
./gradlew build

# Run application
./gradlew run

# Install to local Maven repo
./gradlew publishToMavenLocal
```

### Information Commands

```bash
# List all tasks
./gradlew tasks

# List all tasks including subtasks
./gradlew tasks --all

# Show project dependencies
./gradlew dependencies

# Show dependency tree
./gradlew dependencies --configuration compileClasspath

# Show project properties
./gradlew properties

# Show project structure
./gradlew projects
```

### Build Options

```bash
# Parallel execution
./gradlew build --parallel

# Build with info logging
./gradlew build --info

# Debug mode
./gradlew build --debug

# Offline mode
./gradlew build --offline

# Refresh dependencies
./gradlew build --refresh-dependencies

# Continue on failure
./gradlew build --continue

# Build cache
./gradlew build --build-cache

# Profile build
./gradlew build --profile
```

---

## Dependency Management

### Dependency Configurations

```groovy
dependencies {
    // Compile and runtime
    implementation 'group:artifact:version'
    
    // Compile only (not in runtime)
    compileOnly 'org.projectlombok:lombok:1.18.30'
    
    // Runtime only
    runtimeOnly 'com.h2database:h2:2.2.224'
    
    // Compile and runtime (transitive to consumers)
    api 'com.google.guava:guava:32.1.3-jre'
    
    // Test dependencies
    testImplementation 'junit:junit:4.13.2'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    
    // Annotation processors
    annotationProcessor 'org.projectlombok:lombok:1.18.30'
}
```

### Version Management

```groovy
// Using ext properties
ext {
    springVersion = '3.2.0'
    junitVersion = '5.10.1'
}

dependencies {
    implementation "org.springframework.boot:spring-boot-starter:${springVersion}"
    testImplementation "org.junit.jupiter:junit-jupiter:${junitVersion}"
}

// Using version catalog (gradle/libs.versions.toml)
dependencies {
    implementation libs.spring.boot.starter
    testImplementation libs.junit.jupiter
}
```

### Dependency Constraints

```groovy
dependencies {
    constraints {
        implementation('org.apache.commons:commons-lang3:3.13.0')
    }
}
```

### Exclude Transitive Dependencies

```groovy
dependencies {
    implementation('com.example:library:1.0') {
        exclude group: 'org.slf4j', module: 'slf4j-api'
    }
    
    // Exclude all transitive dependencies
    implementation('com.example:library:1.0') {
        transitive = false
    }
}
```

### Force Dependency Version

```groovy
configurations.all {
    resolutionStrategy {
        force 'org.slf4j:slf4j-api:2.0.9'
    }
}
```

---

## Multi-Project Builds

### Project Structure

```
root-project/
├── settings.gradle
├── build.gradle
├── core/
│   ├── build.gradle
│   └── src/
├── api/
│   ├── build.gradle
│   └── src/
├── web/
│   ├── build.gradle
│   └── src/
└── shared/
    ├── build.gradle
    └── src/
```

### settings.gradle

```groovy
rootProject.name = 'my-application'

include 'core'
include 'api'
include 'web'
include 'shared'

// Nested subprojects
include 'services:auth'
include 'services:payment'
```

### Root build.gradle

```groovy
plugins {
    id 'java' apply false
}

// Apply to all projects
allprojects {
    group = 'com.example'
    version = '1.0.0'
    
    repositories {
        mavenCentral()
    }
}

// Apply to all subprojects
subprojects {
    apply plugin: 'java'
    
    java {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    dependencies {
        testImplementation 'junit:junit:4.13.2'
    }
    
    test {
        useJUnitPlatform()
    }
}
```

### Subproject Dependencies

```groovy
// In api/build.gradle
dependencies {
    implementation project(':core')
    implementation project(':shared')
    
    implementation 'org.springframework.boot:spring-boot-starter-web:3.2.0'
}

// In web/build.gradle
dependencies {
    implementation project(':api')
    implementation project(':shared')
}
```

### Composite Builds

```groovy
// settings.gradle
includeBuild('../other-project')

// Use dependencies from included build
dependencies {
    implementation 'com.other:other-project:1.0'
}
```

---

## Advanced Multi-Project Patterns

### Shared Configuration

```groovy
// buildSrc/src/main/groovy/java-conventions.gradle
plugins {
    id 'java'
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.1'
}

test {
    useJUnitPlatform()
}

// Apply in subprojects
// build.gradle
plugins {
    id 'java-conventions'
}
```

### Platform/BOM Projects

```groovy
// platform/build.gradle
plugins {
    id 'java-platform'
}

dependencies {
    constraints {
        api 'com.google.guava:guava:32.1.3-jre'
        api 'org.slf4j:slf4j-api:2.0.9'
        api 'com.fasterxml.jackson.core:jackson-databind:2.16.0'
    }
}

// Consumer project
dependencies {
    implementation platform(project(':platform'))
    implementation 'com.google.guava:guava' // Version from platform
}
```

### Conditional Subproject Configuration

```groovy
subprojects {
    if (name.startsWith('service-')) {
        apply plugin: 'org.springframework.boot'
        
        dependencies {
            implementation 'org.springframework.boot:spring-boot-starter'
        }
    }
}
```

---

## Custom Tasks

### Simple Task

```groovy
tasks.register('hello') {
    doLast {
        println 'Hello, Gradle!'
    }
}

// Run: ./gradlew hello
```

### Task with Configuration

```groovy
tasks.register('copyDocs', Copy) {
    from 'src/docs'
    into 'build/docs'
    include '**/*.md'
}
```

### Task Dependencies

```groovy
tasks.register('taskA') {
    doLast {
        println 'Task A'
    }
}

tasks.register('taskB') {
    dependsOn 'taskA'
    doLast {
        println 'Task B'
    }
}

// taskB runs after taskA
```

### Custom Task Class

```groovy
abstract class GenerateVersionTask extends DefaultTask {
    @Input
    abstract Property<String> getVersion()
    
    @OutputFile
    abstract RegularFileProperty getOutputFile()
    
    @TaskAction
    void generate() {
        outputFile.get().asFile.text = "version=${version.get()}"
    }
}

tasks.register('generateVersion', GenerateVersionTask) {
    version = project.version
    outputFile = layout.buildDirectory.file('version.properties')
}
```

---

## Testing

### JUnit 5 Configuration

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.1'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

test {
    useJUnitPlatform()
    
    testLogging {
        events "passed", "skipped", "failed"
        exceptionFormat "full"
    }
    
    // Parallel execution
    maxParallelForks = Runtime.runtime.availableProcessors().intdiv(2) ?: 1
}
```

### Test Filtering

```bash
# Run specific test class
./gradlew test --tests com.example.MyTest

# Run tests matching pattern
./gradlew test --tests *IntegrationTest

# Run single test method
./gradlew test --tests com.example.MyTest.testMethod
```

### Integration Tests

```groovy
sourceSets {
    integrationTest {
        java.srcDir 'src/integration/java'
        resources.srcDir 'src/integration/resources'
        compileClasspath += main.output + test.output
        runtimeClasspath += main.output + test.output
    }
}

configurations {
    integrationTestImplementation.extendsFrom testImplementation
    integrationTestRuntimeOnly.extendsFrom testRuntimeOnly
}

tasks.register('integrationTest', Test) {
    testClassesDirs = sourceSets.integrationTest.output.classesDirs
    classpath = sourceSets.integrationTest.runtimeClasspath
    useJUnitPlatform()
}

check.dependsOn integrationTest
```

---

## Plugins

### Applying Plugins

```groovy
plugins {
    id 'java'
    id 'application'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}
```

### Common Plugins

```groovy
// Java Library
plugins {
    id 'java-library'
}

// Shadow JAR (Fat JAR)
plugins {
    id 'com.github.johnrengelman.shadow' version '8.1.1'
}

// Code Quality
plugins {
    id 'checkstyle'
    id 'pmd'
    id 'jacoco'
}

checkstyle {
    toolVersion = '10.12.5'
    configFile = file("${rootDir}/config/checkstyle/checkstyle.xml")
}

jacoco {
    toolVersion = "0.8.11"
}

jacocoTestReport {
    reports {
        xml.required = true
        html.required = true
    }
}
```

---

## Build Performance

### Gradle Daemon

```bash
# Enable daemon (default in gradle.properties)
org.gradle.daemon=true

# Stop daemon
./gradlew --stop
```

### Parallel Builds

```properties
# gradle.properties
org.gradle.parallel=true
org.gradle.workers.max=4
```

### Build Cache

```properties
# gradle.properties
org.gradle.caching=true
```

```groovy
// settings.gradle
buildCache {
    local {
        enabled = true
        directory = file("${rootDir}/.gradle/build-cache")
        removeUnusedEntriesAfterDays = 30
    }
}
```

### Configuration on Demand

```properties
# gradle.properties
org.gradle.configureondemand=true
```

### JVM Options

```properties
# gradle.properties
org.gradle.jvmargs=-Xmx2g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError
```

---

## Publishing

### Maven Publish

```groovy
plugins {
    id 'maven-publish'
}

publishing {
    publications {
        maven(MavenPublication) {
            from components.java
            
            groupId = 'com.example'
            artifactId = 'my-library'
            version = '1.0.0'
            
            pom {
                name = 'My Library'
                description = 'A library for doing things'
                url = 'https://github.com/example/my-library'
                
                licenses {
                    license {
                        name = 'The Apache License, Version 2.0'
                        url = 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                    }
                }
                
                developers {
                    developer {
                        id = 'dev'
                        name = 'Developer Name'
                        email = 'dev@example.com'
                    }
                }
            }
        }
    }
    
    repositories {
        maven {
            url = uri("${buildDir}/repo")
        }
    }
}
```

---

## Practical Examples

### Spring Boot Application

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### Multi-Module Microservices

```groovy
// settings.gradle
rootProject.name = 'microservices'
include 'common'
include 'user-service'
include 'order-service'
include 'gateway'

// Root build.gradle
subprojects {
    apply plugin: 'java'
    apply plugin: 'org.springframework.boot'
    apply plugin: 'io.spring.dependency-management'
    
    group = 'com.example.microservices'
    version = '1.0.0'
    sourceCompatibility = '17'
    
    repositories {
        mavenCentral()
    }
    
    dependencies {
        implementation 'org.springframework.boot:spring-boot-starter'
        testImplementation 'org.springframework.boot:spring-boot-starter-test'
    }
}

// user-service/build.gradle
dependencies {
    implementation project(':common')
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
}
```

---

## Troubleshooting

### Common Issues

```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches/

# Refresh dependencies
./gradlew build --refresh-dependencies

# Debug dependency resolution
./gradlew dependencyInsight --dependency guava

# Verbose output
./gradlew build --info --stacktrace

# Scan for issues
./gradlew build --scan
```

### Dependency Conflicts

```groovy
configurations.all {
    resolutionStrategy {
        // Fail on version conflict
        failOnVersionConflict()
        
        // Force specific version
        force 'org.slf4j:slf4j-api:2.0.9'
        
        // Prefer project modules
        preferProjectModules()
    }
}
```

---

## Best Practices

1. **Use Gradle Wrapper**: Ensures consistent builds across environments
2. **Enable Build Cache**: Speeds up builds significantly
3. **Parallel Execution**: Use for multi-project builds
4. **Version Catalogs**: Centralize dependency versions
5. **Convention Plugins**: Share configuration across projects
6. **Incremental Builds**: Don't clean unless necessary
7. **Dependency Locking**: Lock dependency versions for reproducibility
8. **Build Scans**: Use for performance analysis
9. **Minimal Dependencies**: Only include what you need
10. **Regular Updates**: Keep Gradle and dependencies current

---

## Quick Reference

```bash
# Build
./gradlew build              # Full build
./gradlew clean build        # Clean build
./gradlew assemble          # Build without tests
./gradlew jar               # Create JAR

# Test
./gradlew test              # Run tests
./gradlew check             # Run all checks

# Run
./gradlew run               # Run application
./gradlew bootRun           # Run Spring Boot app

# Dependencies
./gradlew dependencies      # Show dependencies
./gradlew dependencyUpdates # Check for updates

# Multi-project
./gradlew :api:build        # Build specific project
./gradlew build --parallel  # Parallel build

# Info
./gradlew tasks             # List tasks
./gradlew projects          # List projects
./gradlew properties        # Show properties
```

---

## Resources

- [Gradle Documentation](https://docs.gradle.org)
- [Gradle Build Scans](https://scans.gradle.com)
- [Gradle Plugin Portal](https://plugins.gradle.org)
- [Gradle Community](https://gradle.org/community)
