import express from 'express';
//import { v4 as uuidv4 } from 'uuid';
import sqlite from 'sqlite3';
sqlite.verbose();
import bodyParser from 'body-parser';


const router = express.Router();

let lists = [];
const db = new sqlite.Database('data.db', sqlite.OPEN_READWRITE, (err) => {
   if (err) return console.log(err.massage)
});
let sql

sql = ("CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, post TEXT NOT NULL)");
db.run(sql)

//all routs in here are starting with /users
router.get('/',(req, res) => {
   db.all("SELECT * FROM lists", (err, rows) => {
      res.send(rows);
   })
});

router.post('/', bodyParser.json(), (req, res) => {
//const list = req.body;
let title = req.body["title"]
let post = req.body["post"]
const newList = {
   title : title,
   post : post
}
lists.push(newList)

// lists.push({...list, id: uuidv4()});

db.run("INSERT INTO lists(title, post) VALUES(?,?)", title, post)
res.send(JSON.stringify({message: 'successfully added'}))

});

//  router.get('/:id', (req,res) => {
//     const {id} = req.params;

//     const foundList = lists.find((list) => list.id === id);

//     res.send(foundList);

//  });

router.delete('/:id', (req,res) => {
   const {id} = req.params;

   //lists = lists.filter((list) => list.id !== id)

   sql = `DELETE FROM lists WHERE = id= ?`;
   db.run(sql, id)
   res.send (`List with the ${id} deleted from the database.`);

})

router.patch('/:id', (req, res) => {
   const {id} = req.params;

   const listUpdated = lists.find((list) => list.id === id);

   const {title, post} = req.body;

   if(title) listUpdated.title = title;
   if(post) listUpdated.post = post;

   sql = `UPDATE lists SET title = ?, post = ?  WHERE id = ?`;
   db.run(sql, $(id), $(title), $(post))
   res.send(`List with the id ${id} has been updated`);
})



export default router;
