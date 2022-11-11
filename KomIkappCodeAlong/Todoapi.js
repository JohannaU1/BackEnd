//Inbyggda moduler i node js för att vårat program funkar
const http = require('http');
const url = require('url')
const mysql = require('mysql');
const { listenerCount } = require('process');
//Kontaken med databasen
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo3"
});

con.connect(function(err){
    if(err) throw err
})


const server = http.createServer((req,res) => {
    if(req.method === "OPTIONS"){ 
        res.writeHead(200, {"Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Methods': 'DELETE, PUT, GET, POST', 'Access-Control-Allow-Headers' : 'Content-Type'})
        res.end()
    }
    else{
        res.writeHead(200, {"Content-Type" : "application/json", "Access-Control-Allow-Origin": "*"})
    }

    const urlparse = url.parse(req.url, true);

    console.log("Req" , urlparse.pathname, res.method)
// --------------------------------------------------------------------------------


// Hantera vad vi vill plock ut från databasen. Hämta något från todoes --> sql är kommunikation för databas

    if(urlparse.pathename == '/todoes' && req.method == 'GET'){
        //Val vad det är vi tar från databasen
       
       
        let sql = "SELECT t.Id, t.Title, t.Completed, u.FirstName, u.LastName FROM todoes t  JOIN users u ON t.UserId = u.Id"
        //Connection till mysql (Spekulerarar men query samlar data i json format)Datan ovan är sql.
        //function till om det är fel,
       
       
        con.query(sql, function(err, result, fields){
            if(err) throw err
       
       
            //och vad för resultat
            console.log(result)
       
       
            //detta ska bli en sträng ({todoes : result} är ett object detta är en array av resultat)
            res.end(JSON.stringify({todoes : result}))

        })
    }
// Servern lyssnar på port 1234



// --------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

                                    //HÄR KOMMER POST APIET


//Våran data skickas nu från html sidan in till denna api
if(urlparse.patname == "/todoes" && req.method == "POST"){
    //Vi samlar inkommen data i variabeln data som är en tom sträng
    var data = ''
    //så länge det kommer data stoppa in det i variabeln data
    req.on('data', chunk => {
        //datan plussas in i chunk?  FRÅGA MICKE OM CHUNK TILFÄLLIG PLATS INNAN VARIABLN KOMMER IN TILL SIN BOX?
        data += chunk

        //data = data + chunk samma sak.
    })
    req.on('end', () =>{
        // Parse översätter till ett object
        // alltså när vi hämta data ifrån databasen använder vi stringyfy och när vi skickar till databasen anväder vi parse
        theData = JSON.parse(data)
    

    //Datan är redo att skickas in i databasen. Det gör vi nedan. Vi har samlat stängar i html överstt dom till Databasens språk i
    //theData Variabln och skickar nu in objectet.
    let Sql = `INSERT INTO todoes (Title, userId, Completed) VALUES ('${theData.title}', ${theData.userId}, ${theData.completed})`


    //conection med rätt dataformat sänds in i sql kollar om det finns fel om de finns blir vi alerted
    con.query(sql, function(err,result){
        if(err)throw err
        console.log('1 record inserted')
    })
  //slutmeddelande i från api till frontend som du kan se i consolen ? FRÅGA MICKE
    res.end('{"status" : "posted"}')
    })
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                      NU BÖRJAR APIET PUT


// sista slachen betyder att vi letar efter någonting mer i detta fall ett id
// http://localhost:1234/todos/4  (4=id) Metod GET
if(urlparse.pathname.includes('/todoes/') && req.method == 'GET'){


let id = urlparse.pathname.split("/")[2]
let sql = "SELECT * FROM todoes WHERE id=" + id

con.query(sql, function(err, result){
    if(err) throw err

///skickas tillbaka till frontend koden, result som skickas är en array av resultat  från object todoes
    res.end(JSON.stringify({todoes : result}))
})
}
 // http://localhost:1234/todos/4  (4=id) Metod PUT viktig info(föreläsning 9, 5 tim 2min)
if(urlparse.pathname.includes('/todoes/') && req.method == "PUT"){
    let id = urlparse.pathname.split("/")[2]

    let data=""

    req.on('data', chunk=>{
        data+= chunk
    })

    req.on ('end', ()=>{
        theData = JSON.parse(data)
        console.log(theData)

        let sql = `UPDATE todoes SET title='${theData.title}', userId=${theData.userId}, completed=${theData.completed} WHERE Id=${id}`
 
        con.query(sql, function(err, result){
            if(err)throw err

            console.log(" 1 Record changed")
        })
    })


    res.end('{"Status" : "Changed"}')


}
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------

                                        //DELETE


 // http://localhost:1234/todos/4  (4=id) Metod Delete
if(urlparse.pathname.includes('/todoes/') && req.method == 'DELETE'){
    let id = urlparse.pathname.split("/")[2]

    let sql = "DELETE FROM todoes WHERE Id =" + id

    con.query(sql, function(err, result){
        if(err) throw err

        console.log(" Deleted")
    })
    res.end('{"Status" : "Deleted"}')
}

}).listen(1111)