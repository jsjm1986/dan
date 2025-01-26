class AlchemySystem {
    constructor(physics) {
        this.physics = physics || window.physics;
        this.currentRecipe = null;
        this.selectedIngredients = [];
        this.isProcessing = false;
        this.currentSolarTerm = null;
        this.lunarDate = null;
    }

    async initialize() {
        try {
            // 使用本地农历计算
            this.lunarDate = window.lunarCalendar.getCurrentLunar();
            this.currentSolarTerm = window.lunarCalendar.getCurrentSolarTerm();
            
            // 更新UI显示
            document.getElementById('lunar-date').textContent = `农历：${this.lunarDate}`;
            document.getElementById('solar-term').textContent = `节气：${this.currentSolarTerm}`;
            
            return true;
        } catch (error) {
            console.error('初始化失败:', error);
            return false;
        }
    }

    analyzeRecipe(recipeText) {
        // 扩展关键词库
        const keywords = {
            '人参': ['补气', '养神'],
            '灵芝': ['延年', '益寿'],
            '朱砂': ['安神', '明目'],
            '雄黄': ['驱邪', '解毒'],
            '珍珠': ['养颜', '明目'],
            '琥珀': ['镇静', '安神'],
            '凤血草': ['再生', '灼热'],
            '云影草': ['轻盈', '迅捷'],
            '月华石': ['阴寒', '滋养'],
            // ...其他新增药材关键词
        };

        // 新增特殊成分检测
        const specialComponents = {
            '子时': { type: '时辰要求' },
            '新月': { type: '月相要求' },
            '五行': { type: '元素平衡' }
        };

        const analysis = {
            ingredients: [],
            requirements: [],
            effects: []
        };

        // 分析文本中包含的药材
        Object.entries(keywords).forEach(([herb, effects]) => {
            if (recipeText.includes(herb)) {
                analysis.ingredients.push(herb);
                analysis.effects.push(...effects);
            }
        });

        // 在分析结果中添加特殊要求
        Object.keys(specialComponents).forEach(key => {
            if (recipeText.includes(key)) {
                analysis.requirements.push(specialComponents[key].type);
            }
        });

        // 如果没有找到药材，返回一些基本建议
        if (analysis.ingredients.length === 0) {
            analysis.requirements.push('需要包含基本药材');
            analysis.effects.push('效果未知');
        }

        return analysis;
    }

    processRecipeAnalysis(analysisData) {
        // 处理API返回的丹方分析结果
        return {
            ingredients: analysisData.ingredients,
            requirements: analysisData.requirements,
            expectedEffects: analysisData.effects
        };
    }

    addIngredient(ingredientId) {
        // 检查是否正在炼制中
        if (this.isProcessing) {
            console.log('炼制过程中无法添加药材');
            return false;
        }

        // 检查是否已经添加过该药材
        if (this.selectedIngredients.some(i => i.id === ingredientId)) {
            console.log('该药材已经添加过了');
            return false;
        }

        // 检查是否超过最大药材数量
        if (this.selectedIngredients.length >= 5) {
            console.log('药材数量已达到上限');
            return false;
        }

        // 查找药材信息
        const ingredient = CONFIG.BASE_INGREDIENTS.find(i => i.id === ingredientId);
        if (!ingredient) {
            console.log('未找到该药材');
            return false;
        }

        // 添加到已选药材列表
        this.selectedIngredients.push(ingredient);

        // 在物理引擎中添加药材粒子
        this.physics.addIngredient(ingredientId);

        // 更新药材显示
        this.updateIngredientsDisplay();

        // 更新UI状态
        if (typeof window.updateUI === 'function') {
            window.updateUI();
        }

        return true;
    }

    removeIngredient(ingredientId) {
        if (this.isProcessing) {
            console.log('炼制过程中无法移除药材');
            return false;
        }

        const index = this.selectedIngredients.findIndex(i => i.id === ingredientId);
        if (index !== -1) {
            this.selectedIngredients.splice(index, 1);
            this.updateIngredientsDisplay();
            
            // 更新UI状态
            if (typeof window.updateUI === 'function') {
                window.updateUI();
            }
            
            return true;
        }
        return false;
    }

    updateIngredientsDisplay() {
        const selectedIngredientsContainer = document.querySelector('.selected-ingredients');
        if (!selectedIngredientsContainer) {
            const container = document.createElement('div');
            container.className = 'selected-ingredients';
            const ingredientsSection = document.querySelector('.ingredients-section');
            ingredientsSection.insertBefore(container, document.getElementById('ingredients-list'));
        }

        const displayArea = document.querySelector('.selected-ingredients');
        if (this.selectedIngredients.length === 0) {
            displayArea.innerHTML = '<div class="empty-ingredients">尚未添加药材</div>';
            return;
        }

        displayArea.innerHTML = this.selectedIngredients.map(ingredient => `
            <div class="selected-ingredient" data-id="${ingredient.id}">
                <span>${ingredient.name}</span>
                <div class="ingredient-info">
                    <span class="quality">品质: ${ingredient.quality}</span>
                    <span class="element">五行: ${ingredient.element}</span>
                </div>
                <button class="remove-ingredient-btn" onclick="window.alchemy.removeIngredient('${ingredient.id}'); window.updateUI();">移除</button>
            </div>
        `).join('');
    }

    calculateSuccessRate() {
        if (this.selectedIngredients.length === 0) return 0;

        let rate = CONFIG.BASE_SUCCESS_RATE;

        // 考虑节气影响
        const solarTermEffect = CONFIG.SOLAR_TERMS_EFFECTS[this.currentSolarTerm] || {};
        this.selectedIngredients.forEach(ingredient => {
            if (solarTermEffect[ingredient.element.toLowerCase()]) {
                rate *= solarTermEffect[ingredient.element.toLowerCase()];
            }
        });

        // 考虑火候影响
        const fireIntensity = this.physics.fireIntensity;
        const fireEffect = this.calculateFireEffect(fireIntensity);
        rate *= fireEffect;

        // 考虑药材品质
        const avgQuality = this.selectedIngredients.reduce((sum, ing) => sum + ing.quality, 0) 
            / this.selectedIngredients.length;
        rate *= (avgQuality / 3); // 标准化品质影响

        // 检查是否符合特殊丹方条件
        if (this.checkSecretRecipe()) {
            rate = CONFIG.SECRET_RECIPE_CONDITIONS.immortality_elixir.success_rate;
        }

        return Math.min(Math.max(rate, 0), 1);
    }

    calculateFireEffect(intensity) {
        const optimal = 50; // 最佳火候
        const diff = Math.abs(intensity - optimal);
        
        if (diff <= 10) {
            return CONFIG.FIRE_INTENSITY_EFFECTS.OPTIMAL;
        } else if (diff <= 20) {
            return CONFIG.FIRE_INTENSITY_EFFECTS.MAX;
        } else {
            return CONFIG.FIRE_INTENSITY_EFFECTS.MIN;
        }
    }

    checkSecretRecipe() {
        const conditions = CONFIG.SECRET_RECIPE_CONDITIONS.immortality_elixir;
        
        // 检查必需材料
        const hasAllRequired = conditions.required_items.every(item => 
            this.selectedIngredients.some(ing => ing.id === item)
        );

        // 检查品质要求
        const meetsQuality = this.selectedIngredients.every(ing => 
            ing.quality >= conditions.min_quality
        );

        // 检查节气条件
        const correctSolarTerm = this.currentSolarTerm === conditions.solar_term;

        return hasAllRequired && meetsQuality && correctSolarTerm;
    }

    async startAlchemy() {
        if (this.isProcessing || this.selectedIngredients.length === 0) return false;

        this.isProcessing = true;
        this.physics.start();

        // 模拟炼丹过程
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = this.completeAlchemy();
                this.physics.showCompletionEffect(result.success);
                this.physics.stop();
                this.isProcessing = false;
                resolve(result);
            }, 10000); // 炼丹持续10秒
        });
    }

    completeAlchemy() {
        const successRate = this.calculateSuccessRate();
        const isSuccess = Math.random() < successRate;

        let quality = CONFIG.QUALITY_LEVELS.FAILED;
        const effects = [];

        if (isSuccess) {
            const roll = Math.random();
            if (roll > 0.99) quality = CONFIG.QUALITY_LEVELS.IMMORTAL;
            else if (roll > 0.95) quality = CONFIG.QUALITY_LEVELS.PERFECT;
            else if (roll > 0.85) quality = CONFIG.QUALITY_LEVELS.EXCELLENT;
            else if (roll > 0.70) quality = CONFIG.QUALITY_LEVELS.GOOD;
            else quality = CONFIG.QUALITY_LEVELS.NORMAL;

            // 生成效果
            effects.push(...quality.effects.map(e => ({
                description: e,
                isMain: e === quality.mainEffect,
                success: Math.random() > 0.3 // 70%概率达成效果
            })));
        } else {
            effects.push({
                description: '药力失控导致丹毒',
                isMain: true,
                success: false
            });
        }

        return {
            success: isSuccess,
            quality: quality,
            successRate: successRate,
            effects: effects // 添加效果数据
        };
    }

    reset() {
        this.selectedIngredients = [];
        this.isProcessing = false;
        this.physics.clear();
        this.updateIngredientsDisplay();
    }
} 