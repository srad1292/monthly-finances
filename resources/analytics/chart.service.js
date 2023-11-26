const { ChartJSNodeCanvas  } = require('chartjs-node-canvas');
const Convert = require('../../utils/snake_and_camel');

ChartService = {
    createImage: async (configuration, height = 1000, width = 1000) => {
        const chartJSNodeCanvas = new ChartJSNodeCanvas ({ type: 'png', width: width, height: height });
        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration); // converts chart to image
        return dataUrl;
    },
    createVerticalBarChartConfig: (data, title, options) => {
        return config = {
            type: 'bar',
            data: {
                labels: data.map(i => Convert.snakeToTitle(i.label)),
                datasets: [
                    {
                        data: data.map(i => i.value),
                        backgroundColor: options.mono === false ? AnalyticsService.getChartColors(data) : 'rgb(110, 178, 230)',
                    }
                ]
            },
            options: {
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: false
                    },
                }
            }
        };
    },
    createHorizontalBarChartConfig: (data, title, options = {}) => {
        return config = {
            type: 'bar',
            data: {
                labels: data.map(i => Convert.snakeToTitle(i.label)),
                datasets: [
                    {
                        data: data.map(i => i.value),
                        backgroundColor: options.mono === false ? AnalyticsService.getChartColors(data) : 'rgb(110, 178, 230)',
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: false
                    },
                }
            }
        };
    },
    /**
     * 
     * @param {String} label 
     * @param {[{key: string, value: number}]} data 
     * @param {String} title 
     * @returns DoughnutConfig
     */
    createDoughnutChartConfig: (label, data, title = "") => {
        return {
            type: 'doughnut',
            data: {
                labels: data.map(i => i.label),
                datasets: [
                    {
                        label: label,
                        data: data.map(i => i.value),
                        backgroundColor: AnalyticsService.getChartColors(data),
                        hoverOffset: 2
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: title !== "",
                        text: title
                    }
                }
            }
        };
    },
    createPieChartConfig: (label, data, title = "") => {
        return {
            type: 'doughnut',
            data: {
                labels: data.map(i => i.label),
                datasets: [
                    {
                        label: label,
                        data: data.map(i => i.value),
                        backgroundColor: AnalyticsService.getChartColors(data),
                        hoverOffset: 2
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: title !== "",
                        text: title
                    }
                }
            }
        };
    },
    createLineConfig: (data, title, options = {}) => {
        return config = {
            type: 'line',
            data: {
                labels: data.map(i => Convert.snakeToTitle(i.label)),
                datasets: [
                    {
                        data: data.map(i => i.value),
                        backgroundColor: options.mono === false ? AnalyticsService.getChartColors(data) : 'rgb(110, 178, 230)',
                    }
                ]
            },
            options: {
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title,
                    },
                    legend: {
                        display: false
                    },
                }
            }
        };
    },
    getChartColors: (data) => {
        let basicColors = [
            'rgb(212, 44, 6)',
            'rgb(20, 150, 20)',
            'rgb(237, 157, 38)',
            'rgb(65, 250, 228)',
            'rgb(247, 230, 96)',
            'rgb(147, 51, 212)',
            'rgb(116, 237, 9)',
            'rgb(242, 124, 126)',
            'rgb(54, 52, 46)',
            'rgb(124, 222, 242)',
            'rgb(240, 134, 29)',
            'rgb(65, 158, 104)',
            'rgb(204, 80, 133)',
            'rgb(105, 101, 230)',
        ];
        let result = [];
        const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
        for(let i = 0; i < data.length; i++) {
            if(i < basicColors.length) {
                result.push(basicColors[i]);
            } else {
                result.push(randomBetween(0, 207), randomBetween(0, 207), randomBetween(0, 207));
            }
        }
        return result;
    },
}


module.exports = ChartService;
