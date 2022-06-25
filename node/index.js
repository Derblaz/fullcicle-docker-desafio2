const express = require("express")
const mysql = require('mysql')
const app = express()
const port = 3000

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database:'nodedb',
  multipleStatements: true
};

createTebleAndData()

app.get('/', (req, res) => {
  findAllPeople()
    .then(result => {
      res.send(createHTML(result))
    })
    .catch(error => {
      res.send(createHTML())
    })
})


app.listen(port, () => {
  console.log("Rodando na porta " + port)
})


function createTebleAndData() {
  const connection = mysql.createConnection(config)

  const query = 
  `CREATE TABLE IF NOT EXISTS people (
    id int not null auto_increment,
    name varchar(255),
    primary key(id)
  );
  INSERT INTO people (name) VALUES ('O CARA');`

  connection.query(query)
  connection.end()
}

function findAllPeople(){
  const connection = mysql.createConnection(config)
  return new Promise(function(resolve, reject){
    connection.query(
        "SELECT * FROM people", 
        function(err, rows){                                                
            if(rows === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
              resolve(rows);
            }
        }
    )}
  )
}

function createHTML(result) {
  const title = '<h1>Full Cycle Rocks!</h1>'

  if (result) {
    return `
    ${title}
    <ul>
      ${result.map(element => {
        return `<li> ${element.name} </li>`
      }).join("")}
    </ul>`
  }

  return title;
}