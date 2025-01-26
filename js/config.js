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
        FAILED: {
            displayName: '失败',
            color: '#ff4444',
            effects: []
        },
        NORMAL: {
            displayName: '凡品',
            color: '#a0a0a0',
            mainEffect: '强身健体',
            effects: ['气血通畅']
        },
        GOOD: {
            displayName: '良品', 
            color: '#98fb98',
            mainEffect: '延年益寿',
            effects: ['耳聪目明', '精力充沛']
        },
        EXCELLENT: {
            displayName: '上品',
            color: '#87ceeb',
            mainEffect: '洗经伐髓',
            effects: ['内力增长', '根骨提升']
        },
        PERFECT: {
            displayName: '极品',
            color: '#ff6347',
            mainEffect: '延寿百年',
            effects: ['强身健体', '青春永驻']
        },
        IMMORTAL: {
            displayName: '仙品',
            color: '#FFD700',
            mainEffect: '羽化登仙',
            effects: ['长生不老', '百毒不侵', '御空飞行']
        }
    },

    // 基础药材列表
    BASE_INGREDIENTS: [
        { id: 'ginseng', name: '人参', element: '土', quality: 3 },
        { id: 'lingzhi', name: '灵芝', element: '木', quality: 4 },
        { id: 'cinnabar', name: '朱砂', element: '火', quality: 3 },
        { id: 'realgar', name: '雄黄', element: '土', quality: 2 },
        { id: 'pearl', name: '珍珠', element: '水', quality: 4 },
        { id: 'amber', name: '琥珀', element: '木', quality: 3 },
        { id: 'phoenix_herb', name: '凤血草', quality: 3, element: '火', properties: ['再生', '灼热'] },
        { id: 'cloud_grass', name: '云影草', quality: 4, element: '风', properties: ['轻盈', '迅捷'] },
        { id: 'moonlight_stone', name: '月华石', quality: 5, element: '水', properties: ['阴寒', '滋养'] },
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
        },
        {
            id: 'basic_qi',
            name: '基础养气丹',
            description: '修士入门级丹药，可调理气息',
            difficulty: 1,
            requiredIngredients: ['ginseng', 'poria'],
            effects: ['气血通畅']
        },
        {
            id: 'jade_purity',
            name: '清心玉露丹',
            description: '清除心魔，提升悟性',
            difficulty: 3,
            requiredIngredients: ['snow_lotus', 'pearl', 'amber'],
            effects: ['灵台清明', '悟性提升'],
            specialCondition: '需在子时炼制',
            ingredients: ['snow_lotus', 'pearl', 'amber']
        },
        {
            id: 'nirvana',
            name: '涅槃重生丹',
            description: '疗伤圣药，可修复经脉',
            difficulty: 4,
            requiredIngredients: ['phoenix_herb', 'dragon_blood', 'ginseng'],
            effects: ['断肢重生', '功力恢复'],
            elementBalance: { 火: 2, 木: 1 }
        },
        {
            id: 'celestial_light',
            name: '天光云影丹',
            description: '提升轻功修为',
            difficulty: 5,
            requiredIngredients: ['cloud_grass', 'moonlight_stone', 'white_tiger_bone'],
            effects: ['身轻如燕', '凌空虚度'],
            lunarPhase: '新月'
        },
        {
            id: 'five_elements',
            name: '五行造化丹',
            description: '平衡五行之气',
            difficulty: 4,
            requiredIngredients: [
                'golden_stone',  // 金
                'greenwood_root',// 木
                'abyss_water',   // 水
                'flame_flower',  // 火
                'yellow_earth'   // 土
            ],
            effects: ['五行调和', '内力精纯']
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