import express from 'express';
import connection from 'express-myconnection';
import mysql from 'mysql';
import path from 'path';
import cors from 'cors';

const app = express();
const port = parseInt(process.env.PORT, 10) || 8080;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'react-app-cloudtech/public')));
app.use(cors());
app.use(express.json());
app.use(connection(mysql, {
    host: '127.0.0.1',
    port: '3306',
    //socketPath: '/cloudsql/cloudtech-3course-website:us-central1:cloudtech-3course-website',
    user: 'root',
    password: '0000',
    database: 'team_tasks'
  })
);

app.get('/api/tasks', (request, response) => {
  request.getConnection((error, connection) => {
    if (error) throw error;
    connection.query('SELECT * FROM team_tasks.tasks', (error, data) => {
      response.json(data.map(data => {
        return (
          {
            id: data.id,
            task: data.task,
            status: data.status,
            createdat: data.created_at
          }
        );
      }));
    });
  });
});

app.get('/api/users', (request, response) => {
  request.getConnection((error, connection) => {
    if (error) throw error;
    connection.query('SELECT * FROM team_tasks.users', (error, data) => {
      response.json(data.map(data => {
        return (
          {
            id: data.id,
            email: data.email
          }
        );
      }));
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/react-app-cloudtech/public/index.html'));
});

app.post('/api/tasks/add', (request, response) => {
  let data = {
    id: request.body.id,
    task: request.body.task,
    status: request.body.status,
    created_at: request.body.createdat
  };

  request.getConnection((error, connection) => {
    if (error) throw error;
    connection.query('INSERT INTO team_tasks.tasks SET ?', [data], results => {
        response.send(JSON.stringify(results));
      }
    )
  })
});

app.post('/api/users/register', (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  let queryInsertion = `INSERT INTO team_tasks.users (email, password)
       SELECT * FROM (SELECT '${email}', '${password}') AS tmp
       WHERE NOT EXISTS (SELECT email FROM team_tasks.users
       WHERE email = '${email}') LIMIT 1;`;

  request.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(queryInsertion, results => response.send(JSON.stringify(results)));
  });
});

app.post('/api/users/login', (request, response) => {
  let email = request.body.email;

  request.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(`SELECT * FROM team_tasks.users WhERE email = '${email}'`, (error, data) => {
      if (data === undefined || data.length === 0) {
        response.sendStatus(404);
        console.log('RESPONSE FAILED : ' + response.statusCode);
      } else {
        response.sendStatus(200);
        console.log('RESPONSE PASSED : ' + response.statusCode);
      }
    });
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));