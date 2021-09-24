// ************************* DEFAULT MYSQL CONNECTION **************************
// MYSQL CONNECTION
// mysql import and default connection parameters
// import * as mysql from 'mysql';
// var connection = mysql.createConnection({
//   host     : '127.0.0.1',
//   user     : 'sql_usr_zmonesDB',
//   password : 'Laikinas2',
//   database : 'zmones'
// });
 
// connection.connect();
 
// connection.query('SELECT * from zmones', function (error, results, fields) {
//   if (error) throw error;
//    console.log('Results: ', results);
// });
 
// connection.end();
// *****************************************************************************




// *********************** PROMISIFIED MYSQL CONNECTION ************************

import * as mysql from 'mysql';

async function connectMysql (sqlServer) {
    return new Promise ((resolve, reject) => {
            const connection = mysql.createConnection(sqlServer);
            connection.connect((error) => {
                error ? reject(error) : resolve(connection);
            });
    });
}

async function queryMysql (connection, sql, values) {   // sql = query; values = values for query. This technic is used to awoid sql injection atacks when user inputs sql commands
    return new Promise ((resolve, reject) => {
            connection.query({sql, values}, (error, results, fields) => {
                error ? reject(error) : resolve({results, fields});
            }); //results = table rows; fields = table field/column properties
    });
}
// *****************************************************************************
// **************************** SQL SERVER LIST ********************************
const sqlSrv1 = {
    host     : '127.0.0.1',
    user     : 'sql_usr_zmonesDB',
    password : 'Laikinas2',
    database : 'zmones'
};

let connection1;

const sqlSrv2 = {
    host     : '127.0.0.1',
    user     : 'sql_usr_zmonesDB2',
    password : 'Laikinas2',
    database : 'zmones'
};

let connection2;
// ****************************** PRINT TABLE **********************************
function printTable(rows, columns) {
    let th = '';
    for (const column of columns) {
        th += column.name + '\t';
    };
    console.log(th);

    for (const row of rows) {
        let tr = '';
        for (const column of columns) {
            tr += row[column.name] + '\t';
        }
        console.log(tr);
    }
}
// *****************************************************************************


// Connecting to server1 and quering server1
connection1 = await connectMysql(sqlSrv1);
const a = await queryMysql(connection1, 'select * from zmones;');
console.log(a.results); 
printTable(a.results, a.fields);

console.log('----------------------');

// Connecting to server2 and quering server2
// connection2 = await connectMysql(sqlSrv2);
// const b = await queryMysql(connection2, 'select * from adresai;');
// console.log(b.results);


console.log('\nPIRMAS \n');





connection1.end();
// connection2.end();