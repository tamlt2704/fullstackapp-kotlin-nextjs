---
title: "JMathAnim: Mathematical Animations in Java from Beginner to Professional"
date: "2024-01-21"
category: "Visualization & Animation"
tags: ["JMathAnim", "Java", "Animation", "Mathematics", "Visualization", "Manim"]
---

# JMathAnim: Mathematical Animations in Java

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Installation](#setup)
3. [Basic Animations](#basic-animations)
4. [Intermediate Techniques](#intermediate-techniques)
5. [Advanced Animations](#advanced-animations)
6. [Mathematical Visualizations](#mathematical-visualizations)
7. [Professional Production](#professional-production)

## Introduction

JMathAnim is a Java library for creating mathematical animations, inspired by Manim (3Blue1Brown's animation engine). It provides a programmatic way to create educational math videos.

**Key Features:**
- Pure Java implementation
- LaTeX support for mathematical notation
- 2D and 3D animations
- Shape morphing and transformations
- Camera controls
- Export to video formats

**Use Cases:**
- Educational math videos
- Scientific presentations
- Algorithm visualizations
- Data animations

## Setup & Installation

### Gradle Setup

```gradle
repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.davidgutierrezrubio:jmathanim:v0.8'
}
```

### Maven Setup

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependency>
    <groupId>com.github.davidgutierrezrubio</groupId>
    <artifactId>jmathanim</artifactId>
    <version>v0.8</version>
</dependency>
```

### First Scene

```java
import com.jmathanim.jmathanim.JMathAnimScene;
import com.jmathanim.mathobjects.Shape;

public class HelloWorld extends JMathAnimScene {
    @Override
    public void setupSketch() {
        config.setOutputFileName("hello_world");
        config.setFPS(30);
    }

    @Override
    public void runSketch() {
        Shape circle = Shape.circle();
        add(circle);
        playAnimation(circle.fadeIn());
        waitSeconds(1);
        playAnimation(circle.fadeOut());
    }
}
```

## Basic Animations

### Creating Shapes

```java
// Basic shapes
Shape circle = Shape.circle();
Shape square = Shape.square();
Shape triangle = Shape.regularPolygon(3);
Shape line = Shape.segment(Point.at(0, 0), Point.at(2, 1));

// Styling
circle.fillColor("blue").drawColor("white").thickness(3);
square.fillColor("#FF5733").alpha(0.5);

// Positioning
circle.shift(1, 0);  // Move right
square.moveTo(Point.at(-2, 1));
triangle.scale(2);  // Double size
```

### Basic Animations

```java
@Override
public void runSketch() {
    Shape obj = Shape.circle();
    add(obj);
    
    // Fade animations
    playAnimation(obj.fadeIn());
    playAnimation(obj.fadeOut());
    
    // Movement
    playAnimation(obj.shift(2, 1).setRunTime(2));
    
    // Scaling
    playAnimation(obj.scale(2).setRunTime(1));
    
    // Rotation
    playAnimation(obj.rotate(Math.PI).setRunTime(1.5));
}
```

### Text and LaTeX

```java
// Simple text
MathObject text = MathObject.text("Hello World");
text.scale(2);
add(text);
playAnimation(text.fadeIn());

// LaTeX formulas
LaTeX formula = LaTeX.parse("E = mc^2");
formula.moveTo(Point.origin());
add(formula);
playAnimation(formula.fadeIn());

// Complex equations
LaTeX integral = LaTeX.parse("\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}");
add(integral);
```

### Animation Timing

```java
// Sequential animations
playAnimation(obj1.fadeIn());
playAnimation(obj2.fadeIn());

// Parallel animations
playAnimation(obj1.fadeIn(), obj2.shift(1, 0));

// Custom duration
playAnimation(obj.scale(2).setRunTime(3));

// Wait
waitSeconds(2);

// Animation rate functions
playAnimation(obj.shift(2, 0).setLambda(t -> t * t));  // Ease in
```

## Intermediate Techniques

### Shape Transformations

```java
@Override
public void runSketch() {
    Shape circle = Shape.circle();
    Shape square = Shape.square();
    
    add(circle);
    playAnimation(circle.fadeIn());
    waitSeconds(1);
    
    // Morph circle into square
    playAnimation(circle.transform(square).setRunTime(2));
    waitSeconds(1);
    
    // Transform back
    playAnimation(square.transform(circle).setRunTime(2));
}
```

### Custom Paths

```java
// Bezier curve path
Point p0 = Point.at(-2, 0);
Point p1 = Point.at(-1, 2);
Point p2 = Point.at(1, 2);
Point p3 = Point.at(2, 0);

Shape path = Shape.bezier(p0, p1, p2, p3);
add(path);

// Move object along path
Shape ball = Shape.circle().scale(0.2);
add(ball);
playAnimation(ball.moveAlongPath(path).setRunTime(3));
```

### Camera Controls

```java
// Zoom in
playAnimation(camera.scale(2).setRunTime(2));

// Pan camera
playAnimation(camera.shift(1, 1).setRunTime(2));

// Rotate camera (3D)
playAnimation(camera.rotate(Math.PI / 4, 0, 0).setRunTime(2));

// Focus on object
playAnimation(camera.focusOn(obj).setRunTime(1.5));
```

### Grouping Objects

```java
// Create group
MathObjectGroup group = MathObjectGroup.make(obj1, obj2, obj3);

// Animate group
playAnimation(group.shift(1, 0));
playAnimation(group.scale(1.5));
playAnimation(group.rotate(Math.PI / 2));

// Arrange objects
group.arrange(MathObjectGroup.Layout.HORIZONTAL, 0.5);
group.arrange(MathObjectGroup.Layout.VERTICAL, 1.0);
```

### Color Gradients

```java
Shape rect = Shape.rectangle(4, 2);

// Linear gradient
rect.fillColorGradient(
    JMColor.parse("blue"),
    JMColor.parse("red"),
    Point.at(-2, 0),
    Point.at(2, 0)
);

// Radial gradient
circle.fillColorRadialGradient(
    JMColor.parse("yellow"),
    JMColor.parse("orange"),
    Point.origin(),
    1.5
);

add(rect);
playAnimation(rect.fadeIn());
```

## Advanced Animations

### Function Plotting

```java
@Override
public void runSketch() {
    // Create axes
    Axes axes = Axes.make(-3, 3, -2, 2);
    add(axes);
    playAnimation(axes.fadeIn());
    
    // Plot function
    FunctionGraph graph = FunctionGraph.make(
        x -> Math.sin(x),
        -Math.PI,
        Math.PI
    );
    graph.drawColor("blue").thickness(3);
    
    add(graph);
    playAnimation(graph.drawFromStart().setRunTime(3));
}
```

### Parametric Curves

```java
// Parametric curve: circle
FunctionGraph parametric = FunctionGraph.makeParametric(
    t -> Math.cos(t),
    t -> Math.sin(t),
    0,
    2 * Math.PI
);

add(parametric);
playAnimation(parametric.drawFromStart().setRunTime(4));

// Lissajous curve
FunctionGraph lissajous = FunctionGraph.makeParametric(
    t -> Math.sin(3 * t),
    t -> Math.sin(2 * t),
    0,
    2 * Math.PI
);
```

### 3D Objects

```java
// 3D shapes
Shape3D sphere = Shape3D.sphere();
Shape3D cube = Shape3D.cube();
Shape3D cylinder = Shape3D.cylinder();

// 3D transformations
playAnimation(sphere.rotate3D(Math.PI / 4, Math.PI / 4, 0));
playAnimation(cube.scale3D(1.5, 1, 2));

// Camera 3D movement
playAnimation(camera.rotate3D(0, Math.PI / 2, 0).setRunTime(3));
```

### Animation Sequences

```java
@Override
public void runSketch() {
    AnimationSequence seq = new AnimationSequence();
    
    Shape circle = Shape.circle();
    Shape square = Shape.square().shift(2, 0);
    
    seq.add(circle.fadeIn());
    seq.add(square.fadeIn());
    seq.add(circle.shift(1, 1));
    seq.add(square.shift(-1, 1));
    seq.add(circle.fadeOut(), square.fadeOut());
    
    playAnimation(seq);
}
```

### Custom Animations

```java
public class CustomAnimation extends Animation {
    private Shape shape;
    
    public CustomAnimation(Shape shape) {
        this.shape = shape;
        setRunTime(2);
    }
    
    @Override
    public void initialize() {
        // Setup initial state
    }
    
    @Override
    public void doAnim(double t) {
        // t goes from 0 to 1
        double scale = 1 + Math.sin(t * Math.PI * 4) * 0.2;
        shape.scale(scale);
        shape.rotate(t * Math.PI * 2);
    }
    
    @Override
    public void finishAnimation() {
        // Cleanup
    }
}

// Usage
playAnimation(new CustomAnimation(circle));
```

## Mathematical Visualizations

### Pythagorean Theorem

```java
@Override
public void runSketch() {
    // Right triangle
    Point a = Point.at(0, 0);
    Point b = Point.at(3, 0);
    Point c = Point.at(3, 4);
    
    Shape triangle = Shape.polygon(a, b, c);
    triangle.drawColor("white").thickness(3);
    add(triangle);
    playAnimation(triangle.fadeIn());
    
    // Squares on each side
    Shape sqA = Shape.square().scale(3).moveTo(Point.at(1.5, -1.5));
    Shape sqB = Shape.square().scale(4).moveTo(Point.at(5, 2));
    Shape sqC = Shape.square().scale(5).moveTo(Point.at(1.5, 2));
    
    sqA.fillColor("red").alpha(0.5);
    sqB.fillColor("blue").alpha(0.5);
    sqC.fillColor("green").alpha(0.5);
    
    add(sqA, sqB, sqC);
    playAnimation(sqA.fadeIn(), sqB.fadeIn(), sqC.fadeIn());
    
    // Labels
    LaTeX labelA = LaTeX.parse("a^2").moveTo(Point.at(1.5, -1.5));
    LaTeX labelB = LaTeX.parse("b^2").moveTo(Point.at(5, 2));
    LaTeX labelC = LaTeX.parse("c^2 = a^2 + b^2").moveTo(Point.at(1.5, 5));
    
    add(labelA, labelB, labelC);
    playAnimation(labelA.fadeIn(), labelB.fadeIn());
    waitSeconds(1);
    playAnimation(labelC.fadeIn());
}
```

### Derivative Visualization

```java
@Override
public void runSketch() {
    Axes axes = Axes.make(-2, 2, -1, 3);
    add(axes);
    playAnimation(axes.fadeIn());
    
    // Function f(x) = x^2
    FunctionGraph func = FunctionGraph.make(x -> x * x, -2, 2);
    func.drawColor("blue").thickness(3);
    add(func);
    playAnimation(func.drawFromStart().setRunTime(2));
    
    // Tangent line animation
    for (double x = -1.5; x <= 1.5; x += 0.1) {
        double y = x * x;
        double slope = 2 * x;
        
        Shape tangent = Shape.segment(
            Point.at(x - 0.5, y - 0.5 * slope),
            Point.at(x + 0.5, y + 0.5 * slope)
        );
        tangent.drawColor("red").thickness(2);
        
        if (x == -1.5) {
            add(tangent);
            playAnimation(tangent.fadeIn());
        } else {
            playAnimation(tangent.shift(0.1, 0).setRunTime(0.1));
        }
    }
}
```

### Fourier Series

```java
@Override
public void runSketch() {
    Axes axes = Axes.make(-Math.PI, Math.PI, -2, 2);
    add(axes);
    
    // Square wave approximation
    for (int n = 1; n <= 10; n++) {
        final int terms = n;
        FunctionGraph approx = FunctionGraph.make(x -> {
            double sum = 0;
            for (int k = 1; k <= terms; k++) {
                sum += Math.sin((2 * k - 1) * x) / (2 * k - 1);
            }
            return (4 / Math.PI) * sum;
        }, -Math.PI, Math.PI);
        
        approx.drawColor("blue").thickness(2);
        
        if (n == 1) {
            add(approx);
            playAnimation(approx.drawFromStart().setRunTime(2));
        } else {
            playAnimation(approx.fadeIn().setRunTime(0.5));
        }
        waitSeconds(0.3);
    }
}
```

### Matrix Transformations

```java
@Override
public void runSketch() {
    // Grid
    Grid grid = Grid.make(-3, 3, -3, 3, 1, 1);
    add(grid);
    playAnimation(grid.fadeIn());
    
    // Vector
    Shape vector = Shape.arrow(Point.origin(), Point.at(1, 1));
    vector.drawColor("red").thickness(3);
    add(vector);
    playAnimation(vector.fadeIn());
    
    // Apply transformation matrix
    double[][] matrix = {{2, 1}, {1, 2}};
    
    playAnimation(
        grid.applyMatrix(matrix).setRunTime(3),
        vector.applyMatrix(matrix).setRunTime(3)
    );
    
    waitSeconds(1);
}
```

### Limit Visualization

```java
@Override
public void runSketch() {
    Axes axes = Axes.make(-1, 3, -1, 3);
    add(axes);
    
    // Function with discontinuity
    FunctionGraph left = FunctionGraph.make(x -> x * x, -1, 1);
    FunctionGraph right = FunctionGraph.make(x -> 2 * x, 1, 3);
    
    left.drawColor("blue").thickness(3);
    right.drawColor("blue").thickness(3);
    
    add(left, right);
    playAnimation(left.drawFromStart(), right.drawFromStart());
    
    // Approaching point
    Shape dot = Shape.circle().scale(0.1).fillColor("red");
    
    for (double x = 0; x <= 0.99; x += 0.01) {
        dot.moveTo(Point.at(x, x * x));
        if (x == 0) {
            add(dot);
            playAnimation(dot.fadeIn());
        }
        waitSeconds(0.02);
    }
    
    LaTeX limit = LaTeX.parse("\\lim_{x \\to 1^-} f(x) = 1");
    limit.moveTo(Point.at(0, 2.5));
    add(limit);
    playAnimation(limit.fadeIn());
}
```

## Professional Production

### Scene Management

```java
public class MultiSceneAnimation extends JMathAnimScene {
    @Override
    public void runSketch() {
        scene1_Introduction();
        scene2_MainContent();
        scene3_Conclusion();
    }
    
    private void scene1_Introduction() {
        LaTeX title = LaTeX.parse("\\text{Mathematical Animations}");
        title.scale(2);
        add(title);
        playAnimation(title.fadeIn());
        waitSeconds(2);
        playAnimation(title.fadeOut());
        clear();
    }
    
    private void scene2_MainContent() {
        // Main animation logic
    }
    
    private void scene3_Conclusion() {
        // Conclusion
    }
}
```

### Reusable Components

```java
public class AnimationUtils {
    public static Animation highlightObject(Shape obj) {
        return new AnimationSequence()
            .add(obj.scale(1.2).setRunTime(0.3))
            .add(obj.scale(1 / 1.2).setRunTime(0.3));
    }
    
    public static LaTeX createTitle(String text) {
        LaTeX title = LaTeX.parse("\\text{" + text + "}");
        title.scale(2).moveTo(Point.at(0, 3));
        return title;
    }
    
    public static void showFormula(JMathAnimScene scene, String latex) {
        LaTeX formula = LaTeX.parse(latex);
        scene.add(formula);
        scene.playAnimation(formula.fadeIn());
        scene.waitSeconds(2);
        scene.playAnimation(formula.fadeOut());
        scene.remove(formula);
    }
}
```

### Configuration

```java
@Override
public void setupSketch() {
    // Output settings
    config.setOutputFileName("my_animation");
    config.setOutputDir("./output");
    config.setFPS(60);
    config.setWidth(1920);
    config.setHeight(1080);
    
    // Quality settings
    config.setAntialiasing(true);
    config.setQuality(Config.Quality.HIGH);
    
    // Background
    config.setBackgroundColor(JMColor.parse("#1a1a1a"));
    
    // Preview mode (faster rendering)
    config.setPreviewMode(false);
}
```

### Export Options

```java
// Video export
config.setOutputFormat(Config.OutputFormat.MP4);
config.setVideoCodec("h264");
config.setBitrate(5000);

// Image sequence
config.setOutputFormat(Config.OutputFormat.PNG_SEQUENCE);

// GIF export
config.setOutputFormat(Config.OutputFormat.GIF);
config.setGifLoop(true);
```

### Performance Optimization

```java
// Reduce object complexity
Shape simplified = complexShape.simplify(0.01);

// Cache expensive calculations
private Map<String, FunctionGraph> graphCache = new HashMap<>();

private FunctionGraph getCachedGraph(String key, Function<Double, Double> func) {
    return graphCache.computeIfAbsent(key, 
        k -> FunctionGraph.make(func, -10, 10));
}

// Batch animations
List<Animation> animations = new ArrayList<>();
for (Shape obj : objects) {
    animations.add(obj.fadeIn());
}
playAnimation(animations.toArray(new Animation[0]));

// Use lower FPS for preview
if (config.isPreviewMode()) {
    config.setFPS(15);
} else {
    config.setFPS(60);
}
```

### Complete Example: Sorting Algorithm

```java
public class BubbleSortVisualization extends JMathAnimScene {
    @Override
    public void setupSketch() {
        config.setOutputFileName("bubble_sort");
        config.setFPS(30);
    }
    
    @Override
    public void runSketch() {
        int[] arr = {5, 2, 8, 1, 9, 3};
        List<Shape> bars = new ArrayList<>();
        
        // Create bars
        for (int i = 0; i < arr.length; i++) {
            Shape bar = Shape.rectangle(0.8, arr[i] * 0.5);
            bar.moveTo(Point.at(i * 1.2 - 3, arr[i] * 0.25));
            bar.fillColor("blue");
            bars.add(bar);
            add(bar);
        }
        
        playAnimation(bars.stream()
            .map(Shape::fadeIn)
            .toArray(Animation[]::new));
        
        waitSeconds(1);
        
        // Bubble sort with animation
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - i - 1; j++) {
                // Highlight comparison
                bars.get(j).fillColor("red");
                bars.get(j + 1).fillColor("red");
                waitSeconds(0.3);
                
                if (arr[j] > arr[j + 1]) {
                    // Swap animation
                    Point pos1 = bars.get(j).getCenter();
                    Point pos2 = bars.get(j + 1).getCenter();
                    
                    playAnimation(
                        bars.get(j).moveTo(pos2).setRunTime(0.5),
                        bars.get(j + 1).moveTo(pos1).setRunTime(0.5)
                    );
                    
                    // Swap in list
                    Collections.swap(bars, j, j + 1);
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
                
                // Reset color
                bars.get(j).fillColor("blue");
                bars.get(j + 1).fillColor("blue");
            }
            
            // Mark as sorted
            bars.get(arr.length - i - 1).fillColor("green");
        }
        
        bars.get(0).fillColor("green");
        waitSeconds(2);
    }
}
```

## Summary

**Beginner Level:**
- Basic shapes and styling
- Simple animations (fade, move, scale, rotate)
- Text and LaTeX rendering
- Animation timing

**Intermediate Level:**
- Shape transformations and morphing
- Custom paths and bezier curves
- Camera controls
- Object grouping and arrangement
- Color gradients

**Advanced Level:**
- Function plotting and parametric curves
- 3D objects and transformations
- Custom animation classes
- Animation sequences
- Mathematical visualizations

**Professional Level:**
- Scene management and organization
- Reusable components and utilities
- Performance optimization
- Export configuration
- Complex algorithm visualizations

**Best Practices:**
- Use meaningful variable names
- Break complex animations into scenes
- Cache expensive calculations
- Test with preview mode first
- Use appropriate frame rates (30 for web, 60 for high quality)
- Organize code with helper methods
- Comment complex mathematical logic

**Common Patterns:**
- Fade in → animate → fade out
- Highlight → transform → reset
- Build up → show result → clean up
- Sequential reveals for educational content
- Parallel animations for dynamic scenes
