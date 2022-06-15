const Sequelize = require('sequelize');
const connection = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/anna_luleepop');

const Volunteer = connection.define('volunteer', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fullName: {
        type: Sequelize.VIRTUAL,
        get: function(){
            return `${this.firstName} ${this.lastName}`
        }
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});

const Task = connection.define('task', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const AssignedTask = connection.define('assignedTask', {
});

AssignedTask.belongsTo(Task);
AssignedTask.belongsTo(Volunteer);
Volunteer.hasMany(AssignedTask, {
    foreignKey: 'volunteerId'
});
//     , {
//     foreignKey: 'volunteer.id',
//     onDelete: 'cascade'
// });

const syncAndSeed = async() => {
    await connection.sync({force: true});

    const [Ally, Jordan, Kelly, Donna, Raquel, MJ, Doris, Berlyn] = await Promise.all([
        Volunteer.create({firstName: 'Ally', lastName: 'Brown', phone: '456-789-8596', email: 'allybrown@aim.com'}),
        Volunteer.create({firstName: 'Jordan', lastName: 'Meyers', phone: '978-858-9689', email: 'jordanmeyers21@hotmail.com'}),
        Volunteer.create({firstName: 'Kelly', lastName: 'Clarkson', phone: '765-125-5236', email: 'kellyclarkson43@optimum.net'}),
        Volunteer.create({firstName: 'Donna', lastName: 'Bellosario', phone: '453-625-3564', email: 'donnabellosario23@gmail.com'}),
        Volunteer.create({firstName: 'Raquel', lastName: 'Coleman', phone: '965-458-7412', email: 'raquelcoleman@aim.com'}),
        Volunteer.create({firstName: 'MJ', lastName: 'Abrogar', phone: '656-526-1023', email: 'mjabrogar78@yahoo.com'}),
        Volunteer.create({firstName: 'Doris', lastName: 'Chu', phone: '455-785-9620', email: 'dorischu44@gmail.com'}),
        Volunteer.create({firstName: 'Berlyn', lastName: 'Sanchez', phone: '123-852-1052', email: 'berlynsanchez22@gmail.com'})
    ]);
    const [bathroom, playArea, kitchen, patio, trash, cleaningSupplies, grocery, schoolSupplies, breakfast, lunch, snacks] = await Promise.all([
        Task.create({name: 'Clean Bathroom'}),
        Task.create({name: 'Clean Play-Area'}),
        Task.create({name: 'Clean Kitchen'}),
        Task.create({name: 'Clean Patio'}),
        Task.create({name: 'Take out the Trash'}),
        Task.create({name: 'Buy Cleaning Supplies'}),
        Task.create({name: 'Buy Groceries for Kids Program'}),
        Task.create({name: 'Buy School Supplies for Kids Program'}),
        Task.create({name: 'Prepare Breakfast Meals'}),
        Task.create({name: 'Prepare Lunch Meals'}),
        Task.create({name: 'Prepare Snacks'})
    ]);
    await Promise.all([
        AssignedTask.create({volunteerId: Ally.id, taskId: kitchen.id}),
        AssignedTask.create({volunteerId: Ally.id, taskId: breakfast.id}),
        AssignedTask.create({volunteerId: Ally.id, taskId: lunch.id}),
        AssignedTask.create({volunteerId: Jordan.id, taskId: trash.id}),
        AssignedTask.create({volunteerId: Kelly.id, taskId: patio.id})
    ])
}

module.exports = {
    syncAndSeed,
    Volunteer,
    Task,
    AssignedTask
}