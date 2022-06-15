const {syncAndSeed, Volunteer, Task, AssignedTask} = require('./db/db');

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use('/assets', express.static('assets'));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/volunteers', async(req, res, next) => {
    try{
        res.send(await Volunteer.findAll());
    }
    catch(err){
        next(err)
    }
});
app.post('/volunteers', async(req, res, next) => {
    try{
        res.status(201).send(await Volunteer.create(req.body))
    }
    catch(err){
        next(err)
    }
});

app.delete('/volunteers/:id', async(req, res, next) => {
    try{
        const volunteerDeleted = await Volunteer.findByPk(req.params.id);
        await volunteerDeleted.destroy();
        res.sendStatus(204);
    }
    catch(err){
        next(err)
    }
});

app.get('/tasks', async(req, res, next) => {
    try{
        res.send(await Task.findAll());
    }
    catch(err){
        next(err)
    }
});

app.get('/volunteers/:volunteerId/assignedTask', async(req, res, next) => {
    try{
        res.send(await AssignedTask.findAll({
            where: {
                volunteerId: req.params.volunteerId
            }
        }));
    }
    catch(err){
        next(err)
    }
});

app.post('/volunteers/:volunteerId/assignedTask', async(req, res, next) => {
    try{
        res.status(201).send(await AssignedTask.create(req.body))
    }
    catch(err){
        next(err)
    }
});

app.delete('/volunteers/assignedTask/:id', async(req, res, next) => {
    try{
        const assignedTaskDeleted = await AssignedTask.findByPk(req.params.id)
        await assignedTaskDeleted.destroy();
        res.sendStatus(204);
    }
    catch(err){
        next(err)
    }
});

const setup =async() => {
    try{
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(err){
        console.log(err)
    }
}
setup();