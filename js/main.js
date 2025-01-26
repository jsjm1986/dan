document.addEventListener('DOMContentLoaded', async () => {
    // 初始化物理引擎
    const canvas = document.getElementById('reaction-canvas');
    const physics = new AlchemyPhysics(canvas);
    
    // 初始化炼丹系统并设置为全局变量
    window.alchemy = new AlchemySystem(physics);
    await window.alchemy.initialize();

    // 初始化UI元素
    const fireIntensitySlider = document.getElementById('fire-intensity');
    const recipeSelect = document.getElementById('recipe-select');
    const searchRecipeBtn = document.getElementById('search-recipe');
    const startAlchemyBtn = document.getElementById('start-alchemy');
    const stopAlchemyBtn = document.getElementById('stop-alchemy');
    const ingredientsList = document.getElementById('ingredients-list');
    const resultModal = document.getElementById('result-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // 初始化丹方选择列表
    function initializeRecipeSelect() {
        // 清空现有选项，只保留默认选项
        recipeSelect.innerHTML = '<option value="">请选择丹方</option>';
        
        // 添加预设丹方
        CONFIG.RECIPES.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.id;
            option.textContent = `${recipe.name}（难度：${recipe.difficulty}星）`;
            option.title = recipe.description;
            recipeSelect.appendChild(option);
        });
    }

    // 初始化药材列表
    function initializeIngredientsList() {
        ingredientsList.innerHTML = CONFIG.BASE_INGREDIENTS.map((ingredient, index) => `
            <div class="ingredient-item" data-id="${ingredient.id}" style="--animation-offset: ${index}">
                <span class="ingredient-name">${ingredient.name}</span>
                <span class="ingredient-quality">品质: ${ingredient.quality}</span>
                <span class="ingredient-element">五行: ${ingredient.element}</span>
                <button class="add-ingredient-btn" onclick="window.alchemy.addIngredient('${ingredient.id}'); window.updateUI();">添加</button>
            </div>
        `).join('');
    }

    // 更新UI状态
    window.updateUI = function() {
        const isProcessing = window.alchemy.isProcessing;
        startAlchemyBtn.disabled = isProcessing;
        stopAlchemyBtn.disabled = !isProcessing;
        fireIntensitySlider.disabled = isProcessing;
        recipeSelect.disabled = isProcessing;
        
        // 更新药材按钮状态
        document.querySelectorAll('.add-ingredient-btn').forEach(btn => {
            const ingredientId = btn.closest('.ingredient-item').dataset.id;
            const isSelected = window.alchemy.selectedIngredients.some(i => i.id === ingredientId);
            btn.disabled = isProcessing || isSelected || window.alchemy.selectedIngredients.length >= 5;
            if (isSelected) {
                btn.textContent = '已添加';
                btn.style.background = '#ccc';
            } else if (window.alchemy.selectedIngredients.length >= 5) {
                btn.textContent = '已满';
                btn.style.background = '#ccc';
            } else {
                btn.textContent = '添加';
                btn.style.background = '';
            }
        });
    }

    // 显示丹方详情
    function showRecipeDetails(recipeId) {
        const recipe = CONFIG.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;

        // 清空已选药材
        window.alchemy.reset();
        
        // 显示丹方信息
        const details = `
            丹方：${recipe.name}
            功效：${recipe.effects.join('、')}
            所需药材：${recipe.ingredients.map(id => 
                CONFIG.BASE_INGREDIENTS.find(i => i.id === id)?.name
            ).join('、')}
            最佳火候：${recipe.optimal_fire}
            适宜节气：${recipe.best_term}
        `;
        alert(details);
    }

    // 显示结果
    function showResult(result) {
        const resultMessage = document.getElementById('result-message');
        const successRate = document.getElementById('success-rate');
        
        let qualityText = '';
        switch(result.quality) {
            case CONFIG.QUALITY_LEVELS.IMMORTAL:
                qualityText = '仙品';
                break;
            case CONFIG.QUALITY_LEVELS.PERFECT:
                qualityText = '极品';
                break;
            case CONFIG.QUALITY_LEVELS.EXCELLENT:
                qualityText = '上品';
                break;
            case CONFIG.QUALITY_LEVELS.GOOD:
                qualityText = '中品';
                break;
            case CONFIG.QUALITY_LEVELS.NORMAL:
                qualityText = '下品';
                break;
            default:
                qualityText = '失败';
        }

        resultMessage.textContent = result.success ? 
            `炼丹成功！丹药品质：${qualityText}` : 
            '炼丹失败！丹药化为乌有...';
        
        successRate.textContent = `成功率：${(result.successRate * 100).toFixed(1)}%`;
        resultModal.style.display = 'block';
    }

    // 事件监听器
    fireIntensitySlider.addEventListener('input', (e) => {
        physics.setFireIntensity(parseInt(e.target.value));
    });

    recipeSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            showRecipeDetails(e.target.value);
        }
    });

    searchRecipeBtn.addEventListener('click', async () => {
        const recipeText = prompt('请输入要分析的丹方文本：');
        if (recipeText) {
            const recipe = await window.alchemy.analyzeRecipe(recipeText);
            if (recipe) {
                alert(`
                    分析结果：
                    可用药材：${recipe.ingredients.join('、')}
                    功效：${recipe.effects.join('、')}
                    ${recipe.requirements.length ? '要求：' + recipe.requirements.join('、') : ''}
                `);
            }
        }
    });

    startAlchemyBtn.addEventListener('click', async () => {
        const result = await window.alchemy.startAlchemy();
        if (result) {
            showResult(result);
        }
        window.updateUI();
    });

    stopAlchemyBtn.addEventListener('click', () => {
        window.alchemy.reset();
        window.updateUI();
    });

    closeModalBtn.addEventListener('click', () => {
        resultModal.style.display = 'none';
    });

    // 初始化界面
    initializeRecipeSelect();
    initializeIngredientsList();
    window.updateUI();
}); 