const InvestmentsValidator = require('./investments.validator');
const DatabaseTable = require('../../utils/database/database_table.enum');
const DatabaseColumns = require('../../utils/database/database_columns.enum');
const COLUMNS = DatabaseColumns.InvestmentsColumns;
const Convert = require('../../utils/snake_and_camel');
const Money = require('../../utils/money');
const APIException = require('../../errors/api_exception');

const InvestmentsDao = {
    createInvestmentsData: async (db, body) => {
        let dbData = InvestmentsDao.getCreateData(body);
        let columns = dbData.columns;
        let placeholders = dbData.placeholders;
        let values = dbData.values;
        let sql = `INSERT INTO ${DatabaseTable.investments}${columns} VALUES${placeholders}`;
        
        console.log(dbData);
        try {
            const runResult = await db.run(sql, values);
            return {id: runResult.lastID, ...body};
            // return {id: 1000, ...body};
        } catch (e) {
            throw new DatabaseException("Error creating investments data: " + e, 500);
        }
    },
    getRecordById: async (db, id) => {
        let sql = `SELECT * FROM ${DatabaseTable.investments} WHERE ${DatabaseColumns.InvestmentsColumns.Id} = ${id};`
        try {
            let data = await db.get(sql);
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
    // DAO helpers
    getCreateData: (body) => {
        let columns = "(" + InvestmentsValidator.getCreateColumns().join(",") + ")";
        let placeholders = "(" + InvestmentsValidator.getCreateColumns().map(c => '?').join(',') + ")";
        let values = InvestmentsValidator.getCreateColumns().map(c => {
            let key = Convert.snakeToCamel(c);
            if(c === COLUMNS.RecordDate) {
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
};

module.exports = InvestmentsDao;