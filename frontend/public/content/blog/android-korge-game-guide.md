---
title: "KorGE Game Development - Complete Guide from Beginner to Professional"
date: "2024-12-13"
category: "Game Development"
tags: ["KorGE", "Kotlin", "Game Development", "Multiplatform", "Android"]
---

# KorGE Game Development - Complete Guide

## Overview

**KorGE** is a modern multiplatform game engine written in Kotlin. Build games once and deploy to JVM, Android, iOS, JavaScript, and Desktop.

### Key Features
- **Multiplatform**: Write once, run everywhere
- **Kotlin-First**: 100% Kotlin with coroutines
- **2D Focus**: Optimized for 2D games
- **Rich API**: Sprites, animations, physics, audio
- **Scene Management**: Built-in scene system
- **Asset Loading**: Easy resource management

---

## Getting Started

### 1. Setup Project

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "1.9.20"
    id("com.soywiz.korge") version "4.0.10"
}

korge {
    id = "com.example.mygame"
    name = "My Game"
    targetJvm()
    targetJs()
    targetAndroid()
}

dependencies {
    commonMainApi("com.soywiz.korlibs.korge2:korge:4.0.10")
}
```

### 2. First Game

```kotlin
import com.soywiz.korge.*
import com.soywiz.korge.view.*
import com.soywiz.korim.color.*
import com.soywiz.korma.geom.*

suspend fun main() = Korge(
    width = 800,
    height = 600,
    bgcolor = Colors["#2b2b2b"]
) {
    // Add a circle
    circle(50.0, Colors.RED) {
        position(400, 300)
    }
    
    // Add text
    text("Hello KorGE!", 32.0, Colors.WHITE) {
        centerOnStage()
    }
}
```

---

## Core Concepts

### 1. Views and Containers

```kotlin
suspend fun main() = Korge(width = 800, height = 600) {
    // Container - group views
    val container = container {
        position(100, 100)
        
        // Add children
        solidRect(100, 100, Colors.RED)
        circle(50.0, Colors.BLUE) {
            position(50, 50)
        }
    }
    
    // SolidRect
    solidRect(200, 100, Colors.GREEN) {
        position(300, 200)
        rotation = 45.degrees
    }
    
    // Image
    image(resourcesVfs["player.png"].readBitmap()) {
        position(400, 300)
        scale = 2.0
    }
    
    // Text
    text("Score: 0", 24.0, Colors.WHITE) {
        position(10, 10)
    }
    
    // Graphics - custom drawing
    graphics {
        fill(Colors.YELLOW) {
            rect(0, 0, 100, 100)
            circle(50, 50, 30)
        }
        stroke(Colors.BLACK, lineWidth = 2.0) {
            line(0, 0, 100, 100)
        }
    }
}
```

### 2. Input Handling

```kotlin
suspend fun main() = Korge(width = 800, height = 600) {
    val player = circle(30.0, Colors.BLUE) {
        centerOnStage()
    }
    
    // Mouse/Touch input
    addUpdater {
        if (views.input.mouseButtons != 0) {
            player.position(views.input.mouse.x, views.input.mouse.y)
        }
    }
    
    // Click events
    player.onClick {
        player.color = Colors.RED
    }
    
    // Keyboard input
    keys {
        down(Key.LEFT) { player.x -= 5 }
        down(Key.RIGHT) { player.x += 5 }
        down(Key.UP) { player.y -= 5 }
        down(Key.DOWN) { player.y += 5 }
        
        press(Key.SPACE) {
            println("Space pressed!")
        }
    }
    
    // Game loop
    addUpdater { dt ->
        // Update logic every frame
        // dt = delta time in seconds
    }
}
```

### 3. Animations

```kotlin
suspend fun main() = Korge(width = 800, height = 600) {
    val box = solidRect(100, 100, Colors.RED) {
        position(100, 100)
    }
    
    // Tween animation
    launchImmediately {
        box.tween(
            box::x[700],
            time = 1.seconds,
            easing = Easing.EASE_IN_OUT
        )
    }
    
    // Sequential animations
    launchImmediately {
        box.moveTo(700, 100, time = 1.seconds)
        box.rotateTo(360.degrees, time = 0.5.seconds)
        box.scaleTo(2.0, time = 0.5.seconds)
        box.hide(time = 0.3.seconds)
    }
    
    // Parallel animations
    launchImmediately {
        parallel {
            box.moveTo(700, 500, time = 2.seconds)
            box.rotateTo(720.degrees, time = 2.seconds)
        }
    }
    
    // Sprite animation
    val spriteMap = resourcesVfs["spritesheet.png"].readBitmap()
    val animation = SpriteAnimation(
        spriteMap = spriteMap,
        spriteWidth = 32,
        spriteHeight = 32,
        columns = 8,
        rows = 1,
        offsetBetweenColumns = 0,
        offsetBetweenRows = 0
    )
    
    sprite(animation) {
        position(400, 300)
        playAnimationLooped()
    }
}
```

### 4. Collision Detection

```kotlin
data class GameObject(val view: View, var vx: Double = 0.0, var vy: Double = 0.0)

suspend fun main() = Korge(width = 800, height = 600) {
    val player = GameObject(
        circle(20.0, Colors.BLUE) {
            position(400, 300)
        }
    )
    
    val enemies = List(5) { i ->
        GameObject(
            circle(15.0, Colors.RED) {
                position(100.0 + i * 150, 100.0)
            },
            vx = 2.0
        )
    }
    
    addUpdater { dt ->
        // Move enemies
        enemies.forEach { enemy ->
            enemy.view.x += enemy.vx
            if (enemy.view.x > width || enemy.view.x < 0) {
                enemy.vx = -enemy.vx
            }
        }
        
        // Check collisions
        enemies.forEach { enemy ->
            if (player.view.collidesWith(enemy.view)) {
                enemy.view.removeFromParent()
                println("Hit!")
            }
        }
    }
}

// Collision helper
fun View.collidesWith(other: View): Boolean {
    val bounds1 = this.getGlobalBounds()
    val bounds2 = other.getGlobalBounds()
    return bounds1.intersects(bounds2)
}
```

---

## Complete Game: Flappy Bird Clone

### 1. Game Setup

```kotlin
import com.soywiz.korge.*
import com.soywiz.korge.scene.*
import com.soywiz.korge.view.*
import com.soywiz.korim.color.*
import com.soywiz.korio.file.std.*
import kotlin.random.Random

suspend fun main() = Korge(
    width = 400,
    height = 600,
    bgcolor = Colors["#4EC0CA"]
) {
    val sceneContainer = sceneContainer()
    sceneContainer.changeTo({ GameScene() })
}
```

### 2. Game Scene

```kotlin
class GameScene : Scene() {
    private var score = 0
    private var gameOver = false
    
    private lateinit var bird: Bird
    private val pipes = mutableListOf<Pipe>()
    private lateinit var scoreText: Text
    
    override suspend fun SContainer.sceneInit() {
        // Background
        solidRect(width, height, Colors["#4EC0CA"])
        
        // Ground
        solidRect(width, 100.0, Colors["#DED895"]) {
            position(0, height - 100)
        }
        
        // Bird
        bird = Bird(this)
        
        // Score
        scoreText = text("Score: 0", 32.0, Colors.WHITE) {
            position(10, 10)
        }
        
        // Input
        onClick {
            if (!gameOver) {
                bird.flap()
            } else {
                restart()
            }
        }
        
        keys {
            press(Key.SPACE) {
                if (!gameOver) {
                    bird.flap()
                }
            }
        }
        
        // Game loop
        addUpdater { dt ->
            if (!gameOver) {
                updateGame(dt)
            }
        }
        
        // Spawn pipes
        launchImmediately {
            while (!gameOver) {
                spawnPipe()
                delay(2.seconds)
            }
        }
    }
    
    private fun updateGame(dt: Double) {
        // Update bird
        bird.update(dt)
        
        // Check ground collision
        if (bird.y > height - 100 - bird.radius) {
            endGame()
            return
        }
        
        // Update pipes
        pipes.forEach { pipe ->
            pipe.update(dt)
            
            // Check collision
            if (bird.collidesWith(pipe)) {
                endGame()
                return
            }
            
            // Score
            if (!pipe.scored && bird.x > pipe.x + pipe.width) {
                pipe.scored = true
                score++
                scoreText.text = "Score: $score"
            }
        }
        
        // Remove off-screen pipes
        pipes.removeAll { it.x < -100 }
    }
    
    private fun spawnPipe() {
        pipes.add(Pipe(this, width))
    }
    
    private fun endGame() {
        gameOver = true
        
        // Game over text
        text("Game Over", 48.0, Colors.RED) {
            centerXOnStage()
            y = height / 2 - 50
        }
        
        text("Tap to Restart", 24.0, Colors.WHITE) {
            centerXOnStage()
            y = height / 2 + 20
        }
    }
    
    private suspend fun restart() {
        sceneContainer.changeTo({ GameScene() })
    }
}
```

### 3. Bird Class

```kotlin
class Bird(parent: Container) {
    val radius = 20.0
    private val gravity = 800.0
    private val flapStrength = -300.0
    
    private var vy = 0.0
    
    val view = parent.circle(radius, Colors.YELLOW) {
        position(100, 300)
    }
    
    val x: Double get() = view.x
    val y: Double get() = view.y
    
    fun update(dt: Double) {
        vy += gravity * dt
        view.y += vy * dt
        
        // Rotation based on velocity
        view.rotation = (vy / 10).degrees.clamp(-45.degrees, 45.degrees)
    }
    
    fun flap() {
        vy = flapStrength
    }
    
    fun collidesWith(pipe: Pipe): Boolean {
        val birdBounds = view.getGlobalBounds()
        return pipe.topView.getGlobalBounds().intersects(birdBounds) ||
               pipe.bottomView.getGlobalBounds().intersects(birdBounds)
    }
}
```

### 4. Pipe Class

```kotlin
class Pipe(parent: Container, startX: Double) {
    val width = 60.0
    private val gap = 150.0
    private val speed = 150.0
    
    var scored = false
    
    private val gapY = Random.nextDouble(150.0, parent.height - 250.0)
    
    val topView = parent.solidRect(width, gapY, Colors.GREEN) {
        position(startX, 0)
    }
    
    val bottomView = parent.solidRect(width, parent.height - gapY - gap, Colors.GREEN) {
        position(startX, gapY + gap)
    }
    
    val x: Double get() = topView.x
    
    fun update(dt: Double) {
        val dx = -speed * dt
        topView.x += dx
        bottomView.x += dx
    }
}
```

---

## Complete Game: Breakout/Arkanoid

### 1. Game Setup

```kotlin
class BreakoutScene : Scene() {
    private var score = 0
    private var lives = 3
    private var gameOver = false
    
    private lateinit var paddle: Paddle
    private lateinit var ball: Ball
    private val bricks = mutableListOf<Brick>()
    private lateinit var scoreText: Text
    private lateinit var livesText: Text
    
    override suspend fun SContainer.sceneInit() {
        // Background
        solidRect(width, height, Colors.BLACK)
        
        // Paddle
        paddle = Paddle(this)
        
        // Ball
        ball = Ball(this, paddle)
        
        // Bricks
        createBricks()
        
        // UI
        scoreText = text("Score: 0", 24.0, Colors.WHITE) {
            position(10, 10)
        }
        
        livesText = text("Lives: 3", 24.0, Colors.WHITE) {
            position(width - 100, 10)
        }
        
        // Input
        addUpdater {
            paddle.x = views.input.mouse.x.clamp(
                paddle.width / 2,
                width - paddle.width / 2
            )
        }
        
        keys {
            down(Key.LEFT) { paddle.x -= 10 }
            down(Key.RIGHT) { paddle.x += 10 }
            press(Key.SPACE) { ball.launch() }
        }
        
        // Game loop
        addUpdater { dt ->
            if (!gameOver) {
                updateGame(dt)
            }
        }
    }
    
    private fun createBricks() {
        val rows = 5
        val cols = 10
        val brickWidth = width / cols
        val brickHeight = 30.0
        val colors = listOf(Colors.RED, Colors.ORANGE, Colors.YELLOW, Colors.GREEN, Colors.BLUE)
        
        for (row in 0 until rows) {
            for (col in 0 until cols) {
                bricks.add(
                    Brick(
                        this,
                        col * brickWidth,
                        50.0 + row * (brickHeight + 5),
                        brickWidth - 5,
                        brickHeight,
                        colors[row]
                    )
                )
            }
        }
    }
    
    private fun updateGame(dt: Double) {
        ball.update(dt)
        
        // Ball-paddle collision
        if (ball.collidesWith(paddle.view)) {
            ball.bounceOffPaddle(paddle)
        }
        
        // Ball-brick collision
        bricks.forEach { brick ->
            if (!brick.destroyed && ball.collidesWith(brick.view)) {
                brick.destroy()
                ball.vy = -ball.vy
                score += 10
                scoreText.text = "Score: $score"
            }
        }
        
        // Ball out of bounds
        if (ball.y > height) {
            lives--
            livesText.text = "Lives: $lives"
            
            if (lives <= 0) {
                endGame()
            } else {
                ball.reset()
            }
        }
        
        // Win condition
        if (bricks.all { it.destroyed }) {
            winGame()
        }
    }
    
    private fun endGame() {
        gameOver = true
        text("Game Over", 48.0, Colors.RED) {
            centerOnStage()
        }
    }
    
    private fun winGame() {
        gameOver = true
        text("You Win!", 48.0, Colors.GREEN) {
            centerOnStage()
        }
    }
}
```

### 2. Paddle Class

```kotlin
class Paddle(parent: Container) {
    val width = 100.0
    val height = 20.0
    
    val view = parent.solidRect(width, height, Colors.WHITE) {
        position(parent.width / 2 - width / 2, parent.height - 50)
    }
    
    var x: Double
        get() = view.x + width / 2
        set(value) {
            view.x = value - width / 2
        }
    
    val y: Double get() = view.y
}
```

### 3. Ball Class

```kotlin
class Ball(private val parent: Container, private val paddle: Paddle) {
    private val radius = 10.0
    private val speed = 300.0
    
    var vx = 0.0
    var vy = 0.0
    private var launched = false
    
    val view = parent.circle(radius, Colors.WHITE) {
        centerXOnStage()
        y = paddle.y - 30
    }
    
    val x: Double get() = view.x
    val y: Double get() = view.y
    
    fun update(dt: Double) {
        if (!launched) {
            view.x = paddle.x
            return
        }
        
        view.x += vx * dt
        view.y += vy * dt
        
        // Wall collision
        if (view.x - radius < 0 || view.x + radius > parent.width) {
            vx = -vx
            view.x = view.x.clamp(radius, parent.width - radius)
        }
        
        if (view.y - radius < 0) {
            vy = -vy
            view.y = radius
        }
    }
    
    fun launch() {
        if (!launched) {
            launched = true
            vx = speed * 0.7
            vy = -speed
        }
    }
    
    fun bounceOffPaddle(paddle: Paddle) {
        val hitPos = (x - paddle.x) / (paddle.width / 2)
        vx = hitPos * speed
        vy = -abs(vy)
    }
    
    fun collidesWith(other: View): Boolean {
        return view.getGlobalBounds().intersects(other.getGlobalBounds())
    }
    
    fun reset() {
        launched = false
        vx = 0.0
        vy = 0.0
        view.centerXOnStage()
        view.y = paddle.y - 30
    }
}
```

### 4. Brick Class

```kotlin
class Brick(
    parent: Container,
    x: Double,
    y: Double,
    width: Double,
    height: Double,
    color: RGBA
) {
    var destroyed = false
    
    val view = parent.solidRect(width, height, color) {
        position(x, y)
    }
    
    fun destroy() {
        destroyed = true
        view.removeFromParent()
    }
}
```

---

## Advanced Features

### 1. Particle System

```kotlin
class ParticleSystem(private val parent: Container) {
    private val particles = mutableListOf<Particle>()
    
    fun emit(x: Double, y: Double, count: Int = 20) {
        repeat(count) {
            val angle = Random.nextDouble(0.0, 360.0).degrees
            val speed = Random.nextDouble(50.0, 200.0)
            
            particles.add(
                Particle(
                    parent,
                    x, y,
                    cos(angle) * speed,
                    sin(angle) * speed
                )
            )
        }
    }
    
    fun update(dt: Double) {
        particles.forEach { it.update(dt) }
        particles.removeAll { it.isDead() }
    }
}

class Particle(
    parent: Container,
    x: Double,
    y: Double,
    private var vx: Double,
    private var vy: Double
) {
    private var life = 1.0
    
    private val view = parent.circle(3.0, Colors.YELLOW) {
        position(x, y)
    }
    
    fun update(dt: Double) {
        view.x += vx * dt
        view.y += vy * dt
        vy += 200 * dt  // Gravity
        
        life -= dt
        view.alpha = life.clamp(0.0, 1.0)
    }
    
    fun isDead() = life <= 0
}
```

### 2. Sound Effects

```kotlin
class GameWithSound : Scene() {
    private lateinit var jumpSound: Sound
    private lateinit var hitSound: Sound
    private lateinit var bgMusic: Sound
    
    override suspend fun SContainer.sceneInit() {
        // Load sounds
        jumpSound = resourcesVfs["jump.wav"].readSound()
        hitSound = resourcesVfs["hit.wav"].readSound()
        bgMusic = resourcesVfs["music.mp3"].readMusic()
        
        // Play background music
        bgMusic.play(PlaybackParameters(volume = 0.5, loop = true))
        
        // Play sound effects
        onClick {
            jumpSound.play()
        }
    }
}
```

### 3. Tilemaps

```kotlin
class TilemapScene : Scene() {
    override suspend fun SContainer.sceneInit() {
        val tileSize = 32
        val map = listOf(
            listOf(1, 1, 1, 1, 1, 1, 1, 1),
            listOf(1, 0, 0, 0, 0, 0, 0, 1),
            listOf(1, 0, 2, 0, 0, 2, 0, 1),
            listOf(1, 0, 0, 0, 0, 0, 0, 1),
            listOf(1, 1, 1, 1, 1, 1, 1, 1)
        )
        
        val tileset = resourcesVfs["tileset.png"].readBitmap()
        
        map.forEachIndexed { row, columns ->
            columns.forEachIndexed { col, tile ->
                if (tile > 0) {
                    image(tileset.sliceWithSize(tile * tileSize, 0, tileSize, tileSize)) {
                        position(col * tileSize, row * tileSize)
                    }
                }
            }
        }
    }
}
```

### 4. State Machine

```kotlin
sealed class GameState {
    object Menu : GameState()
    object Playing : GameState()
    object Paused : GameState()
    object GameOver : GameState()
}

class StateMachineGame : Scene() {
    private var state: GameState = GameState.Menu
    
    override suspend fun SContainer.sceneInit() {
        addUpdater { dt ->
            when (state) {
                GameState.Menu -> updateMenu()
                GameState.Playing -> updateGame(dt)
                GameState.Paused -> updatePaused()
                GameState.GameOver -> updateGameOver()
            }
        }
        
        keys {
            press(Key.ESCAPE) {
                state = when (state) {
                    GameState.Playing -> GameState.Paused
                    GameState.Paused -> GameState.Playing
                    else -> state
                }
            }
        }
    }
    
    private fun updateMenu() { /* Menu logic */ }
    private fun updateGame(dt: Double) { /* Game logic */ }
    private fun updatePaused() { /* Pause logic */ }
    private fun updateGameOver() { /* Game over logic */ }
}
```

---

## Performance Tips

### 1. Object Pooling

```kotlin
class ObjectPool<T>(private val create: () -> T) {
    private val available = mutableListOf<T>()
    private val inUse = mutableListOf<T>()
    
    fun obtain(): T {
        val obj = if (available.isEmpty()) create() else available.removeAt(0)
        inUse.add(obj)
        return obj
    }
    
    fun free(obj: T) {
        inUse.remove(obj)
        available.add(obj)
    }
}

// Usage
val bulletPool = ObjectPool { Bullet(this) }
val bullet = bulletPool.obtain()
// Use bullet
bulletPool.free(bullet)
```

### 2. Sprite Batching

```kotlin
// Use sprite batches for many similar objects
val batch = spriteBatch {
    repeat(1000) {
        sprite(texture) {
            position(Random.nextDouble(width), Random.nextDouble(height))
        }
    }
}
```

---

## Best Practices

1. **Scene Management**: Use scenes for different game states
2. **Resource Loading**: Load assets asynchronously
3. **Update Loop**: Keep game logic in addUpdater
4. **Collision**: Use spatial partitioning for many objects
5. **Memory**: Pool frequently created objects
6. **Input**: Handle both mouse and keyboard
7. **Testing**: Test on target platforms early

---

## Resources

### Official
- [KorGE Docs](https://korge.org)
- [KorGE Samples](https://github.com/korlibs/korge-samples)
- [KorGE Discord](https://discord.korge.org)

### Tutorials
- [KorGE Tutorial Series](https://korge.org/tutorials)
- [Game Development Patterns](https://gameprogrammingpatterns.com)

---

## Congratulations!

You now know:
✅ KorGE fundamentals
✅ Input handling and animations
✅ Complete game development
✅ Particle systems and effects
✅ Sound and music
✅ Performance optimization

**Start building your multiplatform games!**

---

*"Games are the most elevated form of investigation." - Albert Einstein*

*Happy Game Development! 🎮*
