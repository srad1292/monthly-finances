const MonthlyService = require('./monthly.service');
const DatabaseTable = require('../../utils/database_table.enum');
const DatabaseColumns = require('../../utils/database_columns.enum');
const DatabaseException = require('../../errors/database_exception');

MonthlyDao = {
    createMonthlyData: async (db, body) => {
        let dbData = MonthlyService.getCreateData(body);
        let columns = dbData.columns;
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `INSERT INTO ${DatabaseTable.monthly}${columns} VALUES${placeholders}`;
        
        console.log(dbData);
        try {
            const runResult = await db.run(sql, values);
            return {id: runResult.lastID, ...body};
            // return {id: 1000, ...body};
        } catch (e) {
            throw new DatabaseException("Error creating monthly data: " + e, 500);
        }
    },
    getAllMonthlyData: async (db) => {
        let sql = `SELECT * FROM ${DatabaseTable.monthly} ORDER BY ${DatabaseColumns.MonthlyColumns.FinanceDate};`
        try {
            let data = await db.all(sql);
            return MonthlyService.convertMonthlyDbToJson(data);  
        } catch(e) {
            throw new DatabaseException("Error getting monthly data: " + e, 500);
        }
    }    
}

module.exports = MonthlyDao;