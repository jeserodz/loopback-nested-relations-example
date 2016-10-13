module.exports = function (server) {
    'use strict'
    
    // Create the goal
    server.models.Goal.create({ description: 'An ambitious goal!' }, function (err, goal) {
        if (err) {
            return err;
        }

        // Create a child task for goal
        goal.tasks.create({ description: 'A main task for the goal', goalId: goal.id }, function (err, task) {
            if (err) {
                return err;
            }

            task.subTasks.create({ description: 'A sub-task for the task', parentTaskId: task.id }, function (err, subTask) {
                if (err) {
                    return err;
                }
            });
        });
    });

    // Query the Goal with nested relations
    setTimeout(function () {
        server.models.Goal.find({ include: [{ relation: 'tasks', scope: { include: ['subTasks'] } }] }, function (err, goals) {
            goals.forEach((goal) => {
                let g = goal.toJSON();
                console.log(JSON.stringify(g));
            });
        });
    }, 3000);
};
