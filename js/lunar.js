// 农历日期计算器
class LunarCalendar {
    constructor() {
        this.lunarInfo = [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557
        ];
        
        this.solarTerms = [
            '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
            '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
            '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
            '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
        ];
        
        // 节气对应的月日
        this.solarTermDates = [
            [1, 5], [1, 20], [2, 4], [2, 19], [3, 5], [3, 20],
            [4, 5], [4, 20], [5, 5], [5, 21], [6, 6], [6, 21],
            [7, 7], [7, 22], [8, 7], [8, 23], [9, 7], [9, 23],
            [10, 8], [10, 23], [11, 7], [11, 22], [12, 7], [12, 22]
        ];
    }

    // 获取当前农历日期
    getCurrentLunar() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let lunarYear = year;
        let lunarMonth = month;
        let lunarDay = day;

        // 简化的农历转换算法
        if (month > 2) {
            lunarYear = year;
            lunarMonth = month - 1;
            lunarDay = day;
        } else {
            lunarYear = year - 1;
            lunarMonth = month + 11;
            lunarDay = day;
        }

        return `${lunarYear}年${lunarMonth}月${lunarDay}日`;
    }

    // 获取当前节气
    getCurrentSolarTerm() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 查找当前日期最接近的节气
        for (let i = 0; i < this.solarTermDates.length; i++) {
            const [termMonth, termDay] = this.solarTermDates[i];
            if (month === termMonth) {
                if (Math.abs(day - termDay) <= 3) { // 在节气前后3天内
                    return this.solarTermsToConfig[this.solarTerms[i]];
                }
            }
        }

        return 'LICHUN'; // 默认返回立春
    }

    // 节气名称转配置键名映射
    solarTermsToConfig = {
        '立春': 'LICHUN',
        '惊蛰': 'JINGZHE',
        '立夏': 'LIXIA',
        '小暑': 'XIAOSHU',
        '立秋': 'LIQIU',
        '霜降': 'SHUANGJIANG',
        '立冬': 'LIDONG',
        '大雪': 'DAXUE'
    };
}

// 导出单例实例
window.lunarCalendar = new LunarCalendar(); 