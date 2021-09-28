import * as readline from "readline";
import * as mysql from "mysql";

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

const OPTIONS = {
  host: "192.168.1.2",
  user: "apskaita",
  password: "apskaita",
  database: "zmones",
  multipleStatements: true,
};

function connect() {
  return new Promise((resolve, reject) => {
    let conn = mysql.createConnection(OPTIONS);
    conn.connect((err) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });
}

function query(conn, sql, values) {
  return new Promise((resolve, reject) => {
    conn.query({
      sql,
      values,
    }, (err, results, fields) => {
      if (err) {
        return reject(err);
      }
      resolve({ results, fields });
    });
  });
}

function end(conn) {
  return new Promise((resolve, reject) => {
    conn.end((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function printResults({ results, fields }) {
  if (Array.isArray(fields) && Array.isArray(results)) {
    let header = "";
    for (const field of fields) {
      header += field.name + "\t";
    }
    console.log(header);
    for (const row of results) {
      let rowStr = "";
      for (const field of fields) {
        rowStr += row[field.name] + "\t";
      }
      console.log(rowStr);
    }
  }
}

let conn;
try {
  conn = await connect();
  let run = true;
  while (run) {
    console.log(`
1. visi zmones
2. naujas zmogus
3. istrinti zmogu
4. visi zmogaus adresai
5. naujas zmogaus adresas
6. istrinti zmogaus adresa
7. visi zmogaus kontaktai
8. naujas zmogaus kontaktas
9. istrinti zmogaus kontakta
0. baigti
        `);
    const choice = parseInt(await input("Pasirink: "));
    let r;
    switch (choice) {
      case 1:
        r = await query(
          conn,
          `
        select
          id, vardas, pavarde, gim_data, alga
        from zmones
        order by
          vardas, pavarde`,
        );
        printResults(r);
        break;
      case 2: {
        let vardas = await input("Vardas: ");
        let pavarde = await input("Pavarde: ");
        let gimData = new Date(await input("Gimimo data: "));
        let alga = parseFloat(await input("Alga: "));
        if (vardas.trim() === "") {
          vardas = null;
        }
        if (pavarde.trim() === "") {
          pavarde = null;
        }
        if (isNaN(gimData.getTime())) {
          gimData = null;
        }
        if (isNaN(alga)) {
          alga = null;
        }
        try {
          r = await query(
            conn,
            `insert into zmones (vardas, pavarde, gim_data, alga)
            values (?, ?, ?, ?)`,
            [vardas, pavarde, gimData, alga],
          );
        } catch (err) {
          console.log("Klaida įrašant naują įrašą", err);
        }
        break;
      }
      case 3: {
        const id = parseInt(await input("Ivesk zmogaus id: "));
        if (isFinite(id)) {
          try {
            r = await query(
              conn,
              `delete from zmones
              where id = ?`,
              [id],
            );
          } catch (err) {
            console.log("Klaida trinant įrašą", err);
          }
          break;
        }
      }
      case 4: {
        const id = parseInt(await input("Ivesk zmogaus id: "));
        if (isFinite(id)) {
          r = await query(
            conn,
            `
          select
            id, adresas, miestas, valstybe, pasto_kodas
          from adresai
          where zmones_id = ?
          order by
            valstybe, miestas, adresas`,
            [id]
          );
          printResults(r);
          break;
        }
      }
      case 5:{
        const id = parseInt(await input("Ivesk zmogaus id: "));
        if (isFinite(id)) {
          let adresas = await input("Adresas: ");
          let miestas = await input("Miestas: ");
          let valstybe = await input("Valstybė: ");
          let pastoKodas = await input("Pašto kodas: ");
          if (adresas.trim() === "") {
            adresas = null;
          }
          if (miestas.trim() === "") {
            miestas = null;
          }
          if (valstybe.trim() === "") {
            valstybe = null;
          }
          if (pastoKodas.trim() === "") {
            pastoKodas = null;
          }
          try {
            r = await query(
              conn,
              `insert into adresai (zmones_id, adresas, miestas, valstybe, pasto_kodas)
              values (?, ?, ?, ?, ?)`,
              [id, adresas, miestas, valstybe, pastoKodas],
            );
          } catch (err) {
            console.log("Klaida įrašant naują įrašą", err);
          }
          break;
        }
      }
      case 6:{
        const id = parseInt(await input("Ivesk adreso id: "));
        if (isFinite(id)) {
          try {
            r = await query(
              conn,
              `delete from adresai
              where id = ?`,
              [id],
            );
          } catch (err) {
            console.log("Klaida trinant įrašą", err);
          }
          break;
        }
      }
      case 7:{
        const id = parseInt(await input("Ivesk zmogaus id: "));
        if (isFinite(id)) {
          r = await query(
            conn,
            `
          select
            id, tipas, reiksme
          from kontaktai
          where zmones_id = ?
          order by
            tipas, reiksme`,
            [id]
          );
          printResults(r);
          break;
        }
      }
      case 8:{
        const id = parseInt(await input("Ivesk zmogaus id: "));
        if (isFinite(id)) {
          let tipas = await input("Tipas: ");
          let reiksme = await input("Reiksme: ");
          if (tipas.trim() === "") {
            tipas = null;
          }
          if (reiksme.trim() === "") {
            reiksme = null;
          }
          try {
            r = await query(
              conn,
              `insert into kontaktai (zmones_id, tipas, reiksme)
              values (?, ?, ?)`,
              [id, tipas, reiksme],
            );
          } catch (err) {
            console.log("Klaida įrašant naują įrašą", err);
          }
          break;
        }
      }
      case 9:{
        const id = parseInt(await input("Ivesk kontakto id: "));
        if (isFinite(id)) {
          try {
            r = await query(
              conn,
              `delete from kontaktai
              where id = ?`,
              [id],
            );
          } catch (err) {
            console.log("Klaida trinant įrašą", err);
          }
          break;
        }
      }
      case 0:
        run = false;
        break;
      default:
        console.log("Mulki, išmok naudotis klaviatūra !!!");
    }
  }
} catch (err) {
  console.log("Klaida:", err);
} finally {
  if (conn) {
    try {
      await end(conn);
    } catch (e) {
      console.log("Klaida atsijungiant:", e);
    }
  }
  rl.close();
}
