class AlchemyPhysics {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isRunning = false;
        this.fireIntensity = 50;
        this.smokeParticles = [];
        this.alchemyProgress = 0;
        this.currentStage = 0;
        this.elixirFormed = false;
        
        // 设置画布尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 初始化视觉效果
        this.initVisualEffects();
    }

    initVisualEffects() {
        // 添加CSS变量
        const style = document.createElement('style');
        style.textContent = `
            .fire-effect {
                --fire-height: 60px;
                --fire-opacity: 0.8;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: var(--fire-height);
                background: radial-gradient(ellipse at 50% 100%, 
                    rgba(255,69,0,var(--fire-opacity)) 0%,
                    rgba(255,69,0,calc(var(--fire-opacity) * 0.5)) 30%,
                    transparent 70%);
                animation: fireAnimation 2s infinite alternate;
                transform-origin: center bottom;
            }

            @keyframes fireAnimation {
                0% {
                    transform: scaleY(0.8) scaleX(0.95);
                }
                100% {
                    transform: scaleY(1.1) scaleX(1.05);
                }
            }
        `;
        document.head.appendChild(style);

        // 初始化火焰效果
        const fireEffect = document.createElement('div');
        fireEffect.className = 'fire-effect';
        this.canvas.parentElement.appendChild(fireEffect);
        this.fireEffect = fireEffect;

        // 初始化烟雾效果
        const smokeEffect = document.createElement('div');
        smokeEffect.className = 'smoke-effect';
        this.canvas.parentElement.appendChild(smokeEffect);
        this.smokeEffect = smokeEffect;

        // 初始化进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'alchemy-progress';
        progressBar.innerHTML = '<div class="progress-bar"></div>';
        this.canvas.parentElement.appendChild(progressBar);
        this.progressBar = progressBar.querySelector('.progress-bar');

        // 初始化阶段指示器
        const stageIndicator = document.createElement('div');
        stageIndicator.className = 'stage-indicator';
        this.canvas.parentElement.appendChild(stageIndicator);
        this.stageIndicator = stageIndicator;

        // 初始化丹药成型效果
        const elixirForming = document.createElement('div');
        elixirForming.className = 'elixir-forming';
        this.canvas.parentElement.appendChild(elixirForming);
        this.elixirForming = elixirForming;

        // 初始化能量波动效果
        const energyWaves = document.createElement('div');
        energyWaves.className = 'energy-waves';
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'energy-wave';
            wave.style.animationDelay = `${i * 1.3}s`;
            energyWaves.appendChild(wave);
        }
        this.canvas.parentElement.appendChild(energyWaves);
        this.energyWaves = energyWaves;

        // 初始化五行能量效果
        const elementEnergy = document.createElement('div');
        elementEnergy.className = 'element-energy';
        this.canvas.parentElement.appendChild(elementEnergy);
        this.elementEnergy = elementEnergy;

        // 初始化完成效果
        const completionEffect = document.createElement('div');
        completionEffect.className = 'completion-effect';
        this.canvas.parentElement.appendChild(completionEffect);
        this.completionEffect = completionEffect;
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticle(type, x, y) {
        const colors = {
            ginseng: '#8B4513',
            lingzhi: '#D2691E',
            cinnabar: '#DC143C',
            realgar: '#FF4500',
            pearl: '#F0F8FF',
            amber: '#FFD700'
        };

        const glowColors = {
            ginseng: 'rgba(139, 69, 19, 0.5)',
            lingzhi: 'rgba(210, 105, 30, 0.5)',
            cinnabar: 'rgba(220, 20, 60, 0.5)',
            realgar: 'rgba(255, 69, 0, 0.5)',
            pearl: 'rgba(240, 248, 255, 0.5)',
            amber: 'rgba(255, 215, 0, 0.5)'
        };

        return {
            x: x || Math.random() * this.canvas.width,
            y: y || this.canvas.height - 20,
            radius: CONFIG.PHYSICS.PARTICLE_SIZE,
            color: colors[type] || '#ffffff',
            glowColor: glowColors[type],
            type: type,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: -2 - Math.random() * 2
            },
            life: 1.0,
            rotation: Math.random() * Math.PI * 2,
            angularVelocity: (Math.random() - 0.5) * 0.1,
            temperature: 0,
            state: 'solid' // solid, melting, gas
        };
    }

    createSmokeParticle(x, y) {
        return {
            x: x,
            y: y,
            radius: 2 + Math.random() * 3,
            color: 'rgba(200, 200, 200, 0.3)',
            velocity: {
                x: (Math.random() - 0.5) * 0.5,
                y: -1 - Math.random()
            },
            life: 1.0
        };
    }

    addIngredient(type, amount = 10) {
        for (let i = 0; i < amount; i++) {
            if (this.particles.length < CONFIG.PHYSICS.MAX_PARTICLES) {
                this.particles.push(this.createParticle(type));
            }
        }
    }

    updateParticles() {
        const gravity = CONFIG.PHYSICS.GRAVITY * (this.fireIntensity / 50);
        const speed = CONFIG.PHYSICS.REACTION_SPEED * (this.fireIntensity / 50);

        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.velocity.x * speed;
            particle.y += particle.velocity.y * speed + gravity;
            particle.rotation += particle.angularVelocity;

            // 更新温度
            particle.temperature = Math.min(1, particle.temperature + 0.01 * (this.fireIntensity / 50));

            // 状态转换
            if (particle.temperature > 0.7 && particle.state === 'solid') {
                particle.state = 'melting';
                particle.radius *= 0.8;
            } else if (particle.temperature > 0.9 && particle.state === 'melting') {
                particle.state = 'gas';
                this.createSmokeEffect(particle.x, particle.y);
            }

            // 边界碰撞检测
            if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.canvas.width) {
                particle.velocity.x *= -0.8;
            }
            if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.canvas.height) {
                particle.velocity.y *= -0.8;
                
                // 地面摩擦
                if (particle.y + particle.radius > this.canvas.height) {
                    particle.velocity.x *= 0.95;
                }
            }

            // 粒子生命周期
            if (particle.state === 'gas') {
                particle.life -= 0.02 * (this.fireIntensity / 50);
            } else {
                particle.life -= 0.001 * (this.fireIntensity / 50);
            }

            // 根据温度更新粒子颜色
            const heatIntensity = particle.temperature * (this.fireIntensity / 50);
            particle.currentColor = this.interpolateColors(particle.color, '#ff4500', heatIntensity);
        });

        // 更新烟雾粒子
        this.smokeParticles.forEach(smoke => {
            smoke.x += smoke.velocity.x;
            smoke.y += smoke.velocity.y;
            smoke.life -= 0.01;
        });

        // 移除消失的粒子
        this.particles = this.particles.filter(particle => particle.life > 0);
        this.smokeParticles = this.smokeParticles.filter(smoke => smoke.life > 0);
    }

    createSmokeEffect(x, y) {
        for (let i = 0; i < 3; i++) {
            this.smokeParticles.push(this.createSmokeParticle(x, y));
        }
    }

    checkCollisions() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < p1.radius + p2.radius) {
                    // 碰撞反应
                    this.handleCollision(p1, p2);

                    // 更新速度
                    const angle = Math.atan2(dy, dx);
                    const speed1 = Math.sqrt(p1.velocity.x * p1.velocity.x + p1.velocity.y * p1.velocity.y);
                    const speed2 = Math.sqrt(p2.velocity.x * p2.velocity.x + p2.velocity.y * p2.velocity.y);

                    // 添加一些随机性
                    const randomFactor = 0.8 + Math.random() * 0.4;

                    p1.velocity.x = -Math.cos(angle) * speed2 * randomFactor;
                    p1.velocity.y = -Math.sin(angle) * speed2 * randomFactor;
                    p2.velocity.x = Math.cos(angle) * speed1 * randomFactor;
                    p2.velocity.y = Math.sin(angle) * speed1 * randomFactor;

                    // 添加旋转效果
                    p1.angularVelocity = (Math.random() - 0.5) * 0.2;
                    p2.angularVelocity = (Math.random() - 0.5) * 0.2;
                }
            }
        }
    }

    handleCollision(p1, p2) {
        // 五行相生相克效果
        const elements = CONFIG.FIVE_ELEMENTS;
        if (elements[p1.type] && elements[p2.type]) {
            if (elements[p1.type].generates === p2.type) {
                p2.life += 0.1;
                this.createReactionEffect(p2.x, p2.y, 'generate');
            } else if (elements[p1.type].restrains === p2.type) {
                p2.life -= 0.1;
                this.createReactionEffect(p2.x, p2.y, 'restrain');
            }
        }

        // 温度传递
        const tempDiff = p1.temperature - p2.temperature;
        p1.temperature -= tempDiff * 0.1;
        p2.temperature += tempDiff * 0.1;
    }

    createReactionEffect(x, y, type) {
        const effect = document.createElement('div');
        effect.className = 'particle-effect';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        effect.style.color = type === 'generate' ? '#00ff00' : '#ff0000';
        
        this.canvas.parentElement.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);

            // 绘制光晕
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.radius * 2);
            gradient.addColorStop(0, particle.glowColor);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-particle.radius * 2, -particle.radius * 2, 
                             particle.radius * 4, particle.radius * 4);

            // 绘制主体
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.currentColor;
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.restore();
        });

        // 绘制烟雾
        this.smokeParticles.forEach(smoke => {
            this.ctx.beginPath();
            this.ctx.arc(smoke.x, smoke.y, smoke.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = smoke.color;
            this.ctx.fill();
            this.ctx.closePath();
        });
    }

    setFireIntensity(intensity) {
        this.fireIntensity = Math.max(0, Math.min(100, intensity));
        
        // 更新火焰效果
        const height = 30 + this.fireIntensity * 0.5;
        const opacity = 0.3 + (this.fireIntensity / 100) * 0.7; // 基础透明度0.3，最大1.0
        
        // 更新火焰大小和亮度，但保持动画效果
        this.fireEffect.style.setProperty('--fire-height', `${height}px`);
        this.fireEffect.style.setProperty('--fire-opacity', opacity);
    }

    updateAlchemyProgress(elapsed, totalTime) {
        // 更新进度
        this.alchemyProgress = Math.min(elapsed / totalTime, 1);
        this.progressBar.style.width = `${this.alchemyProgress * 100}%`;

        // 更新阶段
        const newStage = Math.floor(this.alchemyProgress * 4); // 4个阶段
        if (newStage !== this.currentStage) {
            this.currentStage = newStage;
            this.updateStageEffects();
        }

        // 在80%进度时开始形成丹药
        if (this.alchemyProgress >= 0.8 && !this.elixirFormed) {
            this.elixirFormed = true;
            this.elixirForming.classList.add('active');
        }
    }

    updateStageEffects() {
        const stages = [
            '凝神聚气',
            '五行调和',
            '丹气凝结',
            '丹成蜕变'
        ];

        this.stageIndicator.textContent = stages[this.currentStage];
        this.stageIndicator.classList.add('active');

        // 根据不同阶段显示不同效果
        switch (this.currentStage) {
            case 0: // 凝神聚气
                this.energyWaves.classList.add('active');
                break;
            case 1: // 五行调和
                this.elementEnergy.style.opacity = '1';
                break;
            case 2: // 丹气凝结
                this.particles.forEach(p => {
                    p.velocity.x *= 0.5;
                    p.velocity.y *= 0.5;
                });
                break;
            case 3: // 丹成蜕变
                this.elixirForming.classList.add('active');
                break;
        }
    }

    showCompletionEffect(success) {
        this.completionEffect.classList.add(success ? 'success' : 'failure');
        setTimeout(() => {
            this.completionEffect.classList.remove('success', 'failure');
        }, 2000);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.smokeEffect.classList.add('active');
            this.energyWaves.classList.add('active');
            this.startTime = Date.now();
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        this.smokeEffect.classList.remove('active');
        this.energyWaves.classList.remove('active');
        this.elixirForming.classList.remove('active');
        this.elementEnergy.style.opacity = '0';
        this.stageIndicator.classList.remove('active');
        this.progressBar.style.width = '0%';
        this.alchemyProgress = 0;
        this.currentStage = 0;
        this.elixirFormed = false;
    }

    animate() {
        if (!this.isRunning) return;

        const elapsed = Date.now() - this.startTime;
        const totalTime = 10000; // 10秒炼丹时间

        this.updateAlchemyProgress(elapsed, totalTime);
        this.updateParticles();
        this.checkCollisions();
        this.render();

        requestAnimationFrame(() => this.animate());
    }

    clear() {
        this.particles = [];
        this.smokeParticles = [];
        this.stop();
        this.render();
    }

    // 添加颜色插值方法
    interpolateColors(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        
        return `rgb(${r},${g},${b})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        }
        return { r: 255, g: 255, b: 255 };
    }
} 