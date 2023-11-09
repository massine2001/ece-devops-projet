const express = require('express')
const userController = require('../controllers/user')

  const userRouter = express.Router()

  userRouter.use((req, res, next) => {
    const header = `
              <div style="background-color: #f2f2f2; padding: 10px; text-align: center; position: fixed; width: 100%; top: 0; left: 0;">
              <a href="/">Accueil</a> |
              <a href="/user">Liste des utilisateurs</a> |
              <a href="/user/add">Créer un utilisateur</a> |
              <a href="/user/update">Modifier un utilisateur</a> |
              <a href="/user/delete">Supprimer un utilisateur</a>
            </div>
              `;
    res.headerContent = header;
    next();
  });




  userRouter.get('/', (req, res) => {
    const htmlResponse = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
          ${res.headerContent}
          <div class="text-center bg-gray-100 p-8 rounded-md" style="width: 400px;">
            <h2 class="text-3xl font-bold mb-4">Accueil</h2>
            <p>Bienvenue sur la page d'accueil</p>
          </div>
        </body>
      </html>
    `;
    res.send(htmlResponse);
  });


    
  userRouter.get('/user', (req, res) => {
    userController.getAllUsers((err, users) => {
      if (err) {
        return res.status(400).json({ status: 'error', message: err.message });
      }
      const userList = users.map(
        (user) => `
        <div class="p-4 my-4 bg-white shadow-md rounded-md">
          <p><strong>Nom d'utilisateur :</strong> ${user.username}</p>
          <p><strong>Prénom :</strong> ${user.firstname}</p>
          <p><strong>Nom :</strong> ${user.lastname}</p>
        </div>
      `
      ).join('');

      const htmlResponse = `
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
            ${res.headerContent}
            <div class="text-center bg-gray-100 p-8 rounded-md" style="width: 500px;margin-top: 50px;" >
              <h2 class="text-3xl font-bold mb-4">Liste des Utilisateurs</h2>
              ${userList}
            </div>
          </body>
        </html>
      `;
      res.send(htmlResponse);
    });
  });


  userRouter.get('/user/add', (req, res) => {
      let notification = '';
      if (req.query.success) {
        notification = 'L\'utilisateur a été ajouté avec succès.';
      } else if (req.query.error) {
        notification = 'Une erreur s\'est produite lors de l\'ajout de l\'utilisateur.';
      }
      
      res.send(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
          ${res.headerContent}
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: rgba(0, 0, 0, 0);">
          <div id="notification" style="background-color: #f3f4f6; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);">
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem; text-align: center;">Ajouter un utilisateur</h2>
            <p id="notificationText" style="text-align: center; color: ${req.query.error ? 'red' : 'green'}; margin-bottom: 1rem;">${notification}</p>
            <form style="width: 300px;" action="/user/add" method="post" onsubmit="return validateForm()">
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-size: 0.875rem; font-weight: 500;" for="username">Nom d'utilisateur:</label>
                <input style="width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; color: #374151;" type="text" id="username" name="username" required>
              </div>
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-size: 0.875rem; font-weight: 500;" for="firstname">Prénom:</label>
                <input style="width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; color: #374151;" type="text" id="firstname" name="firstname" required>
              </div>
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-size: 0.875rem; font-weight: 500;" for="lastname">Nom:</label>
                <input style="width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; color: #374151;" type="text" id="lastname" name="lastname" required>
              </div>
              <button style="background-color: #3b82f6; color: #ffffff; font-weight: 500; border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; cursor: pointer;" type="submit">Ajouter Utilisateur</button>
            </form>
          </div>
        </div>
        <script>
          function validateForm() {
            const username = document.getElementById('username').value;
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            if (username === '' || firstname === '' || lastname === '') {
              document.getElementById('notificationText').textContent = 'Veuillez remplir tous les champs.';
              document.getElementById('notificationText').style.color = 'red';
              return false;
            }
            setTimeout(function() {
              document.getElementById('notification').style.display = 'none';
            }, 5000);
            return true;
          }
        </script>
      `);
  });
    
    
  userRouter.post('/user/add', (req, res) => {
      userController.create(req.body, (err) => {
        if (err) {
          return res.redirect('/user/add?error=true');
        }
        return res.redirect('/user/add?success=true');
      });
  });


  userRouter.get('/user/delete', (req, res) => {
      const htmlResponse = `
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
            ${res.headerContent}
            <div class="text-center bg-gray-100 p-8 rounded-md" style="width: 400px;">
              <h2 class="text-3xl font-bold mb-4">Supprimer un utilisateur</h2>
              <form id="updateForm" style="width: 300px;" action="/user/delete" method="post" onsubmit="updateFormAction();">
              <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur :</label>
              <input type="text" name="username" id="username" class="mt-1 p-2 border border-gray-300 rounded-md" required>
            </div>
              <button style="background-color: #3b82f6; color: #ffffff; font-weight: 500; border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; cursor: pointer;" type="submit">Supprimer Utilisateur</button>
            </form>
            </div>
          </body>
          <script>
          function updateFormAction() {
            const usernameValue = document.getElementById('username').value;
            const form = document.getElementById('updateForm');
            form.action = "/user/delete/" + usernameValue;
          }
        </script>
        </html>
      `;
      res.send(htmlResponse);
  });

  userRouter.get('/user/delete/:username', (req, res) => {
      const username = req.params.username;
      userController.get(username, (err, user) => {
          if (err) {
              return res.status(400).json({ status: 'error', message: err.message });
          }

          const htmlResponse = `
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
            ${res.headerContent}
            <div class="text-center bg-gray-100 p-8 rounded-md" style="width: 400px;">
              <h2 class="text-3xl font-bold mb-4">Supprimer l'utilisateur ${user.username}</h2>
              <p class="mb-4 text-red-600">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
              <form method="post" action="/user/delete/${user.username}">
                <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md">Supprimer</button>
              </form>
            </div>
          </body>
        </html>
      `;
          res.send(htmlResponse);
      });
  });



  userRouter.post('/user/delete/:username', (req, res) => {
      const username = req.params.username;
      userController.deleteUser(username, (err) => {
          if (err) {
              return res.redirect(`/user?error=${encodeURIComponent(err.message)}`);
          }
          return res.redirect(`/user?success=true`);
      });
  });
    
  userRouter.get('/user/update', (req, res) => {
    const htmlResponse = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
          ${res.headerContent}
          <div class="text-center bg-gray-100 p-8 rounded-md" style="width: 400px;">
            <h2 class="text-3xl font-bold mb-4">Modifier un utilisateur</h2>
              <form id="updateForm" style="width: 300px;" action="/user/update" method="post" onsubmit="updateFormAction();">
              <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur :</label>
              <input type="text" name="username" id="username" class="mt-1 p-2 border border-gray-300 rounded-md" required>
            </div>
              <button style="background-color: #3b82f6; color: #ffffff; font-weight: 500; border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; cursor: pointer;" type="submit">Modifier Utilisateur</button>
            </form>
          </div>
          <script>
            function updateFormAction() {
              const usernameValue = document.getElementById('username').value;
              const form = document.getElementById('updateForm');
              form.action = "/user/update/" + usernameValue;
            }
          </script>
        </body>
      </html>
    `;
    res.send(htmlResponse);
  });


  userRouter.get('/user/update/:username', (req, res) => {
    const username = req.params.username;
    userController.get(username, (err, user) => {
        if (err) {
            return res.status(400).json({ status: 'error', message: err.message });
        }

        const htmlResponse = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="flex flex-col items-center justify-center min-h-screen bg-gray-400">
        ${res.headerContent}
          <div class="text-center bg-gray-100 p-8 rounded-md" style="width: 400px;">
            <h2 class="text-3xl font-bold mb-4">Mettre à jour l'utilisateur ${user.username}</h2>
            <form method="post" action="/user/update/${user.username}">
              <div class="mb-4">
                <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom :</label>
                <input type="text" name="firstname" id="firstname" value="${user.firstname}" class="mt-1 p-2 border border-gray-300 rounded-md" required>
              </div>
              <div class="mb-4">
                <label for="lastname" class="block text-sm font-medium text-gray-700">Nom :</label>
                <input type="text" name="lastname" id="lastname" value="${user.lastname}" class="mt-1 p-2 border border-gray-300 rounded-md" required>
              </div>
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Mettre à jour</button>
            </form>
          </div>
        </body>
      </html>
    `;
        res.send(htmlResponse);
    });
  });


  userRouter.post('/user/update/:username', (req, res) => {
    const username = req.params.username;
    const objU = {
      username : req.params.username,
      lastname: req.body.lastname,
      firstname : req.body.firstname
    }
    userController.update(username, objU, (err) => {
        if (err) {
            return res.redirect(`/user/update/${username}?error=${encodeURIComponent(err.message)}`);
        }
        return res.redirect(`/user?success=true`);
    });
  });
    


  userRouter.get('/user/:username', (req, resp) => {
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

  module.exports = userRouter
