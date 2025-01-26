const CONFIG = {
    // API配置
    API: {
        OPENAI_ENDPOINT: '/api/analyze-recipe',
        LUNAR_CALENDAR_API: '/api/lunar-calendar',
    },

    // 炼丹炉物理引擎配置
    PHYSICS: {
        GRAVITY: 0.5,
        REACTION_SPEED: 1.0,
        PARTICLE_SIZE: 5,
        MAX_PARTICLES: 100,
    },

    // 丹药品质等级
    QUALITY_LEVELS: {
        FAILED: 0,
        NORMAL: 1,
        GOOD: 2,
        EXCELLENT: 3,
        PERFECT: 4,
        IMMORTAL: 5,
    },

    // 基础药材列表
    BASE_INGREDIENTS: [
        { id: 'ginseng', name: '人参', element: '土', quality: 3 },
        { id: 'lingzhi', name: '灵芝', element: '木', quality: 4 },
        { id: 'cinnabar', name: '朱砂', element: '火', quality: 3 },
        { id: 'realgar', name: '雄黄', element: '土', quality: 2 },
        { id: 'pearl', name: '珍珠', element: '水', quality: 4 },
        { id: 'amber', name: '琥珀', element: '木', quality: 3 },
    ],

    // 预设丹方列表
    RECIPES: [
        {
            id: 'health_elixir',
            name: '养生丹',
            description: '延年益寿，强身健体',
            ingredients: ['ginseng', 'lingzhi'],
            difficulty: 1,
            effects: ['补气养血', '延年益寿'],
            optimal_fire: 40,
            best_term: 'LICHUN'
        },
        {
            id: 'spirit_pill',
            name: '安神丹',
            description: '静心安神，明目开慧',
            ingredients: ['pearl', 'amber'],
            difficulty: 2,
            effects: ['安神静气', '明目开慧'],
            optimal_fire: 35,
            best_term: 'LIQIU'
        },
        {
            id: 'five_elements',
            name: '五行聚灵丹',
            description: '调和五行，聚天地灵气',
            ingredients: ['ginseng', 'lingzhi', 'cinnabar', 'pearl', 'amber'],
            difficulty: 4,
            effects: ['调和五行', '聚灵培元'],
            optimal_fire: 60,
            best_term: 'LIXIA'
        },
        {
            id: 'purification',
            name: '纯阳清心丹',
            description: '化浊为清，炼神返虚',
            ingredients: ['cinnabar', 'realgar', 'pearl'],
            difficulty: 3,
            effects: ['化浊为清', '炼神返虚'],
            optimal_fire: 75,
            best_term: 'XIAOSHU'
        }
    ],

    // 五行相生相克关系
    FIVE_ELEMENTS: {
        WOOD: { generates: 'FIRE', restrains: 'EARTH' },
        FIRE: { generates: 'EARTH', restrains: 'METAL' },
        EARTH: { generates: 'METAL', restrains: 'WATER' },
        METAL: { generates: 'WATER', restrains: 'WOOD' },
        WATER: { generates: 'WOOD', restrains: 'FIRE' },
    },

    // 节气影响系数
    SOLAR_TERMS_EFFECTS: {
        // 春
        'LICHUN': { wood: 1.5, fire: 1.2 },
        'JINGZHE': { wood: 1.4, water: 1.1 },
        // 夏
        'LIXIA': { fire: 1.5, earth: 1.2 },
        'XIAOSHU': { fire: 1.4, wood: 1.1 },
        // 秋
        'LIQIU': { metal: 1.5, earth: 1.2 },
        'SHUANGJIANG': { metal: 1.4, fire: 1.1 },
        // 冬
        'LIDONG': { water: 1.5, metal: 1.2 },
        'DAXUE': { water: 1.4, earth: 1.1 },
    },

    // 隐藏丹方解锁条件
    SECRET_RECIPE_CONDITIONS: {
        'immortality_elixir': {
            required_items: ['ginseng', 'lingzhi', 'pearl'],
            min_quality: 4,
            solar_term: 'LIXIA',
            success_rate: 0.01,
        }
    },

    // 炼丹成功率基础值
    BASE_SUCCESS_RATE: 0.6,

    // 火候影响系数
    FIRE_INTENSITY_EFFECTS: {
        MIN: 0.5,
        MAX: 1.5,
        OPTIMAL: 1.0,
    },
}; 