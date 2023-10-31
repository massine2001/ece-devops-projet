const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter.post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  userRouter.get('/user/:username', (req, resp, next) => { // Express URL params - https://expressjs.com/en/guide/routing.html
    // TODO Create get method API
    const username = req.params.username
    userController.get(username, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(200).json(respObj)
    })
  })
  userRouter.get('/user', (req, resp, next) => { // Express URL params - https://expressjs.com/en/guide/routing.html
    // TODO Create get method API
    
    userController.get((err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(200).json(respObj)
    })
  })
  userRouter.get('/',(req,res)=>{
    res.send('Hellow wor')
  });
  userRouter.get('/add', (req, res) => {
    res.send(`
    <div class="p-4">
      <h2 class="text-2xl mb-4">Ajouter un utilisateur</h2>
      <form class="w-96" action="/user/add" method="post">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Nom d'utilisateur:</label>
          <input class="w-full border rounded-md py-2 px-3 text-gray-700" type="text" id="username" name="username">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="firstname">Prénom:</label>
          <input class="w-full border rounded-md py-2 px-3 text-gray-700" type="text" id="firstname" name="firstname">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="lastname">Nom:</label>
          <input class="w-full border rounded-md py-2 px-3 text-gray-700" type="text" id="lastname" name="lastname">
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Ajouter Utilisateur</button>
      </form>
    </div>
    `);
    });
  userRouter.post('/add', (req,resp)=>{
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  
  
module.exports = userRouter
