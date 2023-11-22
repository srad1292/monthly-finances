const DatabaseTable = require('../../utils/database_table.enum');
const DatabaseColumns = require('../../utils/database_columns.enum');
const DatabaseException = require('../../errors/database_exception');
const MonthlyValidator = require('./monthly.validator');
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');
const APIException = require('../../errors/api_exception');

MonthlyDao = {
    createMonthlyData: async (db, body) => {
        let dbData = MonthlyDao.getCreateData(body);
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
    getMonthlyDataById: async (db, id) => {
        let sql = `SELECT * FROM ${DatabaseTable.monthly} WHERE ${DatabaseColumns.MonthlyColumns.Id} = ${id};`
        try {
            let data = await db.get(sql);
            console.log("done with sql get by id");
            console.log(data);
            if(data === null || data === undefined) {
                throw new APIException("No record found with ID: " + id, [], 404);
            }
            return data;
        } catch(e) {
            if(e instanceof APIException) {
                throw(e);
            }
            throw new DatabaseException("Error getting monthly data with id " + id + ": " + e, 500);
        }
    },
    getAllMonthlyData: async (db, filters) => {
        let select = `SELECT * FROM ${DatabaseTable.monthly}`;
        let where = '';
        if(!!filters.startDate && !!filters.endDate) {
            where = `WHERE ${DatabaseColumns.MonthlyColumns.FinanceDate} >= '${filters.startDate}' AND ${DatabaseColumns.MonthlyColumns.FinanceDate} <= '${filters.endDate}'`;
        } else if(!!filters.startDate) {
            where = `WHERE ${DatabaseColumns.MonthlyColumns.FinanceDate} >= '${filters.startDate}'`;
        } else if(!!filters.endDate) {
            where = `WHERE ${DatabaseColumns.MonthlyColumns.FinanceDate} <= '${filters.endDate}'`;
        }
        let order = `ORDER BY ${DatabaseColumns.MonthlyColumns.FinanceDate} ${filters.sort === 'DESC' ? 'DESC' : 'ASC'};`;
        let sql = where === '' ? select + " " + order : select + " " + where + " " + order;
        console.log(sql);
        try {
            let data = await db.all(sql);
            return data;
        } catch(e) {
            throw new DatabaseException("Error getting monthly data: " + e, 500);
        }
    },
    // DAO Helpers
    getCreateData: (body) => {
        let columns = "(" + MonthlyValidator.createColumns.join(",") + ")";
        let placeholders = "(" + MonthlyValidator.createColumns.map(c => '?').join(',') + ")";
        let values = MonthlyValidator.createColumns.map(c => {
            let key = Convert.snakeToCamel(c);
            if(c === 'finance_date') {
                return body[key];
            } else {
                if(body[key] === undefined) {
                    return 0;
                }
                return Money.moneyToCents(body[key]);
            }
        });
    
        return {columns, placeholders, values};
    },
    
}

module.exports = MonthlyDao;
