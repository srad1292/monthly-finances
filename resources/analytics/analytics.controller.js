const AnalyticsService = require("./analytics.service");
const Database = require("../../db");
const MonthlyService = require("../monthly/monthly.service");
const path = require('path');
const fs = require('fs');


AnalyticsController = {
    getExpenseBreakdown: async(req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            console.log(filter);
            const records = await MonthlyService.getAllData(db, filter);
            const data = MonthlyService.convertMonthlyDbToExpensesJson(records);
            let exampleConfig = AnalyticsService.createDoughnutChartConfig("Expenses", data, "Expenses Breakdown");
            let chartImg = await AnalyticsService.createImage(exampleConfig);
            chartImg = chartImg.replace("data:image/png;base64,", "");
            // console.log(chartImg);
            const filePath = path.join(__dirname, "expenses-breakdown.png");
            const buffer = Buffer.from(chartImg, 'base64');
            fs.writeFileSync(filePath, buffer);
            res.status(200).sendFile(filePath);
        } catch(e) {
            next(e);
        }
    },
    getImage: async (req, res, next) => {
        try {
            const db = await Database.getDb();
            const filter = {
                sort: req.query.sort,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            }
            console.log(filter);
            const records = await MonthlyService.getAllData(db, filter);
            const result = records.map(r => MonthlyService.convertMonthlyDbToJson(r));
            let exampleConfig = AnalyticsService.createLineConfig();
            let chartImg = await AnalyticsService.createImage(exampleConfig);
            chartImg = chartImg.replace("data:image/png;base64,", "");
            // console.log(chartImg);
            const filePath = path.join(__dirname, "example-chart.png");
            const buffer = Buffer.from(chartImg, 'base64');
            fs.writeFileSync(filePath, buffer);
            res.status(200).sendFile(filePath);
        } catch(e) {
            next(e);
        }
    },

}

module.exports = AnalyticsController;