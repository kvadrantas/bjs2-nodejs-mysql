import moment from 'moment';

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
    host: '127.0.0.1',
    user: 'sql_usr_zmonesDB',
    password: 'Laikinas2',
    database: 'zmones'
};

let connection1;

const sqlSrv2 = {
    host: '127.0.0.1',
    user: 'sql_usr_zmonesDB2',
    password: 'Laikinas2',
    database: 'zmones'
};

let connection2;
// *****************************************************************************
// *********************** PROMISIFIED MYSQL CONNECTION ************************

import * as mysql from 'mysql';

async function connectMysql(sqlServer) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(sqlServer);
        connection.connect((error) => {
            error ? reject(error) : resolve(connection);
        });
    });
}

async function queryMysql(connection, sql, values) {   // sql = query; values = values for query. This technic is used to awoid sql injection atacks when user inputs sql commands
    return new Promise((resolve, reject) => {
        connection.query({ sql, values }, (error, results, fields) => {
            error ? reject(error) : resolve({ results, fields });
        }); //results = table rows; fields = table field/column properties
    });
}
// *****************************************************************************
// *************************** READ FROM KEYBOARD ******************************
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function input(msg) {
    return new Promise((resolve) => {
        rl.question(msg, (txt) => {
            resolve(txt);
        });
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
let choice;
let zmones_id;
let id;
let data;

try {
    connection1 = await connectMysql(sqlSrv1);
    while (choice !== 0) {
        console.log('1. visi zmones');
        console.log('2. naujas zmogus');
        console.log('3. istrinti zmogu');
        console.log('4. visi zmogaus adresai');
        console.log('5. naujas zmogaus adresas');
        console.log('6. istrinti zmogaus adresai');
        console.log('7. visi zmogaus kontaktai');
        console.log('8. naujas zmogaus kontaktas');
        console.log('9. istrinti zmogaus kontakta');
        console.log('0. baigti\n');

        choice = await input('Ivesk pasirinkima: ');
        choice = parseInt(choice);

        switch (choice) {
            case 1:
                data = await queryMysql(connection1, 'select * from zmones');
                printTable(data.results, data.fields);
                break;
            case 2:
                let vardas = await input('Ivesk varda: ');
                let pavarde = await input('Ivesk pavarde: ');
                let gim_data = await input('Ivesk gimimo data ("YYYY-MM-DD"): ');
                // checks if provided date is in correct format
                while (!moment(gim_data, "YYYY-MM-DD", true).isValid()) {
                    console.log('\nBloga gimimo data!!!');
                    gim_data = await input('Ivesk gimimo data ("YYYY-MM-DD"): ');
                }
                gim_data = new Date(gim_data);
                let alga = parseFloat(await input('Ivesk alga: '));
                if (vardas.trim() === "") {
                    vardas = null;
                }
                if (pavarde.trim() === "") {
                    pavarde = null;
                }
                if (isNaN(gim_data.getTime())) {
                    gim_data = null;
                }
                if (isNaN(alga)) {
                    alga = null;
                }
                try {
                    queryMysql(connection1,
                        'insert into zmones (vardas, pavarde, gim_data, alga) values(?, ?, ?, ?)',
                        [vardas, pavarde, gim_data, alga]);
                } catch (error) {
                    console.log("Klaida įrašant naują įrašą", error);
                }
                break;
            case 3:
                id = await input('Ivesk zmogaus ID: ');
                id = parseInt(id);
                if (isFinite(id)) {
                    try {
                        queryMysql(connection1, 'delete from zmones where id = ?', [id]);
                    } catch (error) {
                        console.log("Klaida trinant įrašą", error);
                    }
                }
                break;
            case 4:
                id = await input('Ivesk zmogaus ID: ');
                id = parseInt(id);
                if (isFinite(id)) {
                    data = await queryMysql(connection1, 'select * from adresai where zmones_id = ?', [id]);
                    printTable(data.results, data.fields);
                }
                break;
            case 5:
                zmones_id = await input('Ivesk zmogaus ID: ');
                zmones_id = parseInt(zmones_id);
                if (isFinite(id)) {
                    let adresas = await input('Ivesk adresa: ');
                    let miestas = await input('Ivesk miesta: ');
                    let valstybe = await input('Ivesk valstybes koda: ');
                    let pasto_kodas = await input('Ivesk pasto koda pvz. (LT-00222): ');
                    if (adresas.trim() === "") {
                        adresas = null;
                    }
                    if (miestas.trim() === "") {
                        miestas = null;
                    }
                    if (valstybe.trim() === "") {
                        valstybe = null;
                    }
                    if (pasto_kodas.trim() === "") {
                        pasto_kodas = null;
                    }
                    try {
                        queryMysql(connection1,
                            'insert into adresai (zmones_id, adresas, miestas, valstybe, pasto_kodas) values (?, ?, ?, ?, ?)',
                            [zmones_id, adresas, miestas, valstybe, pasto_kodas]);
                    } catch (error) {
                        console.log("Klaida įrašant naują įrašą", error);
                    }
                }
                break;
            case 6:
                id = await input('Ivesk adreso ID: ');
                id = parseInt(id);
                if (isFinite(id)) {
                    try {
                        queryMysql(connection1, 'delete from adresai where id = ?', [id]);
                    } catch (error) {
                        console.log("Klaida trinant įrašą", error);
                    }
                }
                break;
            case 7:
                id = await input('Ivesk zmogaus ID: ');
                id = parseInt(id);
                if (isFinite(id)) {
                    data = await queryMysql(connection1, 'select * from kontaktai where zmones_id = ?', [id]);
                    printTable(data.results, data.fields);
                }
                break;
            case 8:
                zmones_id = await input('Ivesk zmogaus ID: ');
                zmones_id = parseInt(zmones_id);
                if (isFinite(id)) {
                    let tipas = await input('Ivesk kontakto tipa pvz. (mob/email): ');
                    let reiksme = await input('Ivesk kontakta: ');
                    if (tipas.trim() === "") {
                        tipas = null;
                    }
                    if (reiksme.trim() === "") {
                        reiksme = null;
                    }
                    try {
                        queryMysql(connection1,
                            'insert into kontaktai (zmones_id, tipas, reiksme) values(?, ?, ?)',
                            [zmones_id, tipas, reiksme]);
                    } catch (error) {
                        console.log("Klaida įrašant naują įrašą", error);
                    }
                }
                break;
            case 9:
                id = await input('Ivesk kontakto ID: ');
                id = parseInt(id);
                if (isFinite(id)) {
                    try {
                        queryMysql(connection1, 'delete from kontaktai where id = ?', [id]);

                    } catch (error) {
                        console.log("Klaida trinant įrašą", error);
                    }
                }
                break;
            case 0:
                connection1.end();
                rl.close();
                break;

            default:
                console.log('Nera tokio varianto pasirinkime!\n');
                break;
        }
        console.log(`\n\n ---------------------------------- \n\n`);
    }
}
catch (error) {
    console.log('KLAIDA: ', error);
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
// connection2.end();