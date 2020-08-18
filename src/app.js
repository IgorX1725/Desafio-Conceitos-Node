const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idRepositoryFinder(request,response,next){
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0){
    return response.status(400).json({error:'Repository id not found'})
  }
  return next()
}

app.get("/repositories", (request, response) => {

    return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const repository = {
     id: uuid(),
      title,
      url,
      techs,
      likes: 0
     }
     repositories.push(repository)

     return response.json(repository)
});

app.put("/repositories/:id", idRepositoryFinder, (request, response) => {
  const {id} = request.params
  const {title, url, techs, likes} = request.body
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  const RepositoryLikes = likes ? repositories[repositoryIndex].likes : undefined

  const repository = {id, title, url, techs, likes:RepositoryLikes}
  
  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", idRepositoryFinder, (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryIndex,1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", idRepositoryFinder, (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes+1
  return response.json({likes:repositories[repositoryIndex].likes})
});

module.exports = app;
