class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset


    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ position, velocity, color = 'red', imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        } }) {
        super({
            position, imageSrc, scale, framesMax, offset
        })
        this.velocity = velocity;
        this.height = 150
        this.lastKey
        this.width = 50
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,

        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.Sprites = sprites
        this.dead = false

        for (const sprite in this.Sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }



    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else {
            this.velocity.y += gravity
        }
    }

    attack(attackType = "attack1") {
        this.switchSprite(attackType)
        this.isAttacking = true

    }
    takeHit() {

        this.health -= 20
        if (this.health <= 0) {
            this.switchSprite("death")
        } else {
            this.switchSprite("takeHit")
        }
    }

    switchSprite(sprite) {
        // overwriting all other animation with fighter dies
        if (this.image === this.Sprites.death.image) {
            if (this.frameCurrent === this.Sprites.death.framesMax - 1) {
                this.dead = true
            }
            return
        }
        // overwriting all other animation with attack
        if ((this.image === this.Sprites.attack1.image || this.image === this.Sprites.attack2.image) && this.frameCurrent < this.Sprites.attack1.framesMax - 1) {
            return
        }
        // overwriting all other animation with fighter get hit
        if (this.image === this.Sprites.takeHit.image && this.frameCurrent < this.Sprites.takeHit.framesMax - 1) {
            return
        }

        switch (sprite) {
            case "idle":
                if (this.image !== this.Sprites.idle.image) {
                    this.image = this.Sprites.idle.image
                    this.framesMax = this.Sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case "run":
                if (this.image !== this.Sprites.run.image) {
                    this.image = this.Sprites.run.image
                    this.framesMax = this.Sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case "jump":
                this.image = this.Sprites.jump.image
                this.framesMax = this.Sprites.jump.framesMax
                this.frameCurrent = 0
                break
            case "fall":
                this.image = this.Sprites.fall.image
                this.framesMax = this.Sprites.fall.framesMax
                this.frameCurrent = 0
                break
            case "attack1":
                this.image = this.Sprites.attack1.image
                this.framesMax = this.Sprites.attack1.framesMax
                this.frameCurrent = 0
                break
            case "attack2":
                this.image = this.Sprites.attack2.image
                this.framesMax = this.Sprites.attack2.framesMax
                this.frameCurrent = 0
                break
            case "takeHit":
                this.image = this.Sprites.takeHit.image
                this.framesMax = this.Sprites.takeHit.framesMax
                this.frameCurrent = 0
                break
            case "death":
                this.image = this.Sprites.death.image
                this.framesMax = this.Sprites.death.framesMax
                this.frameCurrent = 0
                break
        }
    }
}