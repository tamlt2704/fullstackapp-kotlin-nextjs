# Python Manim - Mathematical Animation Engine

## Installation
```bash
pip install manim
# or for community edition
pip install manim-ce
```

## Beginner Level

### Basic Scene Structure
```python
from manim import *

class BasicScene(Scene):
    def construct(self):
        text = Text("Hello Manim")
        self.play(Write(text))
        self.wait()
```

### Shapes and Colors
```python
class Shapes(Scene):
    def construct(self):
        circle = Circle(radius=1, color=BLUE)
        square = Square(side_length=2, color=RED)
        triangle = Triangle(color=GREEN)
        
        self.play(Create(circle))
        self.play(Transform(circle, square))
        self.play(ReplacementTransform(square, triangle))
        self.wait()
```

### Positioning Objects
```python
class Positioning(Scene):
    def construct(self):
        c1 = Circle().shift(LEFT * 2)
        c2 = Circle().shift(RIGHT * 2)
        c3 = Circle().move_to(UP * 2)
        c4 = Circle().to_edge(DOWN)
        
        self.play(*[Create(obj) for obj in [c1, c2, c3, c4]])
```

## Intermediate Level

### Animations and Timing
```python
class AnimationTiming(Scene):
    def construct(self):
        square = Square()
        
        self.play(Create(square), run_time=2)
        self.play(square.animate.shift(UP), rate_func=smooth)
        self.play(square.animate.rotate(PI/4), rate_func=there_and_back)
        self.play(FadeOut(square), run_time=0.5)
```

### Mathematical Equations
```python
class MathEquations(Scene):
    def construct(self):
        eq1 = MathTex(r"e^{i\pi} + 1 = 0")
        eq2 = MathTex(r"\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}")
        eq3 = MathTex(r"\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}")
        
        self.play(Write(eq1))
        self.wait()
        self.play(ReplacementTransform(eq1, eq2))
        self.wait()
        self.play(ReplacementTransform(eq2, eq3))
        self.wait()
```

### Graphs and Plots
```python
class GraphPlot(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-5, 5, 1],
            axis_config={"color": BLUE}
        )
        
        graph = axes.plot(lambda x: x**2, color=RED)
        labels = axes.get_axis_labels(x_label="x", y_label="f(x)")
        
        self.play(Create(axes), Write(labels))
        self.play(Create(graph))
        self.wait()
```

### Value Trackers and Updaters
```python
class ValueTrackerExample(Scene):
    def construct(self):
        tracker = ValueTracker(0)
        number = DecimalNumber(0).add_updater(
            lambda m: m.set_value(tracker.get_value())
        )
        
        self.add(number)
        self.play(tracker.animate.set_value(10), run_time=3)
        self.wait()
```

## Advanced Level

### 3D Scenes
```python
class ThreeDScene(ThreeDScene):
    def construct(self):
        axes = ThreeDAxes()
        sphere = Surface(
            lambda u, v: np.array([
                np.cos(u) * np.cos(v),
                np.cos(u) * np.sin(v),
                np.sin(u)
            ]),
            u_range=[-PI/2, PI/2],
            v_range=[0, TAU],
            resolution=(15, 32)
        )
        
        self.set_camera_orientation(phi=75 * DEGREES, theta=30 * DEGREES)
        self.play(Create(axes))
        self.play(Create(sphere))
        self.begin_ambient_camera_rotation(rate=0.2)
        self.wait(5)
```

### Custom Animations
```python
class CustomAnimation(Animation):
    def __init__(self, mobject, **kwargs):
        super().__init__(mobject, **kwargs)
        
    def interpolate_mobject(self, alpha):
        self.mobject.set_opacity(1 - alpha)
        self.mobject.scale(1 + alpha)

class UseCustomAnimation(Scene):
    def construct(self):
        square = Square()
        self.add(square)
        self.play(CustomAnimation(square))
```

### Complex Mathematical Visualizations
```python
class FourierSeries(Scene):
    def construct(self):
        axes = Axes(x_range=[-4, 4], y_range=[-2, 2])
        
        def fourier_approx(x, n_terms):
            result = 0
            for n in range(1, n_terms + 1):
                result += (4 / (np.pi * (2*n - 1))) * np.sin((2*n - 1) * x)
            return result
        
        graphs = VGroup(*[
            axes.plot(lambda x: fourier_approx(x, n), color=BLUE)
            for n in range(1, 10)
        ])
        
        self.play(Create(axes))
        for i in range(len(graphs) - 1):
            if i == 0:
                self.play(Create(graphs[i]))
            else:
                self.play(Transform(graphs[0], graphs[i]))
            self.wait(0.5)
```

## Professional Level

### Scene Management and Composition
```python
class SceneComposition(Scene):
    def construct(self):
        self.intro_section()
        self.main_content()
        self.conclusion()
    
    def intro_section(self):
        title = Text("Advanced Topic", font_size=48)
        self.play(Write(title))
        self.play(title.animate.to_edge(UP))
        
    def main_content(self):
        pass
        
    def conclusion(self):
        thanks = Text("Thank you!", font_size=36)
        self.play(FadeIn(thanks))
        self.wait()
```

### Camera Manipulation
```python
class CameraManipulation(MovingCameraScene):
    def construct(self):
        square = Square()
        self.play(Create(square))
        
        self.play(self.camera.frame.animate.scale(0.5))
        self.play(self.camera.frame.animate.move_to(RIGHT * 3))
        self.play(self.camera.frame.animate.scale(2).move_to(ORIGIN))
```

### Vector Fields and Differential Equations
```python
class VectorFieldExample(Scene):
    def construct(self):
        func = lambda pos: np.array([
            pos[1],
            -pos[0],
            0
        ])
        
        vector_field = ArrowVectorField(func, x_range=[-5, 5, 1], y_range=[-5, 5, 1])
        self.play(Create(vector_field))
        
        stream_lines = StreamLines(func, x_range=[-5, 5], y_range=[-5, 5])
        self.add(stream_lines)
        stream_lines.start_animation(warm_up=False, flow_speed=1.5)
        self.wait(5)
```

### Interactive Animations with Updaters
```python
class ComplexUpdaters(Scene):
    def construct(self):
        plane = NumberPlane()
        self.add(plane)
        
        dot = Dot(color=RED)
        path = TracedPath(dot.get_center, stroke_color=YELLOW, stroke_width=3)
        
        t = ValueTracker(0)
        
        dot.add_updater(
            lambda m: m.move_to(plane.c2p(
                2 * np.cos(t.get_value()),
                2 * np.sin(2 * t.get_value())
            ))
        )
        
        self.add(dot, path)
        self.play(t.animate.set_value(TAU), run_time=5, rate_func=linear)
        self.wait()
```

### Optimization and Performance
```python
class OptimizedScene(Scene):
    def construct(self):
        dots = VGroup(*[Dot(point=np.random.rand(3) * 4 - 2) for _ in range(100)])
        
        self.play(LaggedStart(*[FadeIn(dot) for dot in dots], lag_ratio=0.01))
        
        self.play(
            *[dot.animate.set_color(random_bright_color()) for dot in dots],
            run_time=2
        )
```

## Best Practices

### Project Structure
```
project/
├── scenes/
│   ├── intro.py
│   ├── main.py
│   └── outro.py
├── utils/
│   ├── custom_animations.py
│   └── helpers.py
├── config.py
└── render.py
```

### Configuration
```python
# config.py
from manim import *

config.frame_width = 16
config.frame_height = 9
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 60
```

### Rendering Commands
```bash
# Render single scene
manim -pql scene.py SceneName  # Low quality preview
manim -pqh scene.py SceneName  # High quality
manim -pqk scene.py SceneName  # 4K quality

# Render specific section
manim scene.py SceneName -n 0,10  # First 10 frames

# Save last frame
manim -sqh scene.py SceneName
```

## Advanced Techniques

### Shader-based Effects
```python
class ShaderExample(Scene):
    def construct(self):
        square = Square()
        square.set_sheen_direction(UP)
        square.set_sheen(0.5)
        self.play(Create(square))
        self.play(Rotate(square, TAU), run_time=3)
```

### Text Animation Techniques
```python
class TextAnimations(Scene):
    def construct(self):
        text = Text("Manim Animation")
        
        self.play(AddTextLetterByLetter(text))
        self.wait()
        
        self.play(text.animate.set_color_by_gradient(BLUE, GREEN, RED))
        
        self.play(*[
            char.animate.scale(1.5)
            for char in text
        ], lag_ratio=0.1)
```

## Resources
- Official Docs: https://docs.manim.community/
- GitHub: https://github.com/ManimCommunity/manim
- Discord: https://discord.gg/mMRrZQW
- Examples: https://docs.manim.community/en/stable/examples.html
