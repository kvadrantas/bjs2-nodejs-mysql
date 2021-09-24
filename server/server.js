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
// ***************************** ACTION SWITCH *********************************

let choice = 2;
let zmones_id;
let data;

connection1 = await connectMysql(sqlSrv1);

while (choice !== 0) {
    console.log('1. visi zmones');
    console.log('2. naujas zmogus');
    console.log('3. istrinti zmogu');
    console.log('4. visi zmogaus adresai');
    console.log('5. naujas zmogaus adresas');
    console.log('6. istrinti zmogaus adresa');
    console.log('7. visi zmogaus kontaktai');
    console.log('8. naujas zmogaus kontaktas');
    console.log('9. istrinti zmogaus kontakta');
    console.log('0. baigti\n');

    switch (choice) {
        case 1:
            data = await queryMysql(connection1, 'select * from zmones');
            printTable(data.results, data.fields);
            break;
        case 2:
            let vardas = 'rolandas';
            let pavarde = 'rolandenis';
            let gim_data = '1982-01-16';
            let alga = '2300';
            queryMysql(connection1, 
                'insert into zmones (vardas, pavarde, gim_data, alga) values(?, ?, ?, ?)',
                [vardas, pavarde, gim_data, alga]);
                choice = 0;
            break;
        case 3:
            
            break;
        case 4:
            data = await queryMysql(connection1, 'select * from adresai where zmones_id = ?', [1]);
            printTable(data.results, data.fields);
            break;
        case 5:
            zmones_id = 7;
            let adresas = 'Vivulskio';
            let miestas = 'Pakruojis';
            let valstybe = 'LT';
            let pasto_kodas = 'LT-00222';
            queryMysql(connection1, 
                'insert into adresai (zmones_id, adresas, miestas, valstybe, pasto_kodas) values (?, ?, ?, ?, ?)',
                [zmones_id, adresas, miestas, valstybe, pasto_kodas]);
            break;
        case 6:
        
            break;
        case 7:
            data = await queryMysql(connection1, 'select * from kontaktai where zmones_id = ?', [1]);
            printTable(data.results, data.fields);
            break;
        case 8:
            zmones_id = 7;
            let tipas = 'mob';
            let reiksme = '111111111';
            queryMysql(connection1, 
                'insert into kontaktai (zmones_id, tipas, reiksme) values(?, ?, ?)',
                [zmones_id, tipas, reiksme]);
            break;
        case 9:
        
            break;
        case 0:
        
            break;

        default:
            console.log('Nera tokio varianto pasirinkime!\n');
            break;
    }
    choice = 0;
}

// Connecting to server1 and quering server1
// connection1 = await connectMysql(sqlSrv1);
// const a = await queryMysql(connection1, 'select * from zmones;');
// console.log(a.results); 

// console.log('----------------------');

// Connecting to server2 and quering server2
// connection2 = await connectMysql(sqlSrv2);
// const b = await queryMysql(connection2, 'select * from adresai;');
// console.log(b.results);







connection1.end();
// connection2.end();