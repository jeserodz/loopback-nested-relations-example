#LoopBack Nested Relations Example


###Summary

LoopBack is a highly-extensible, open-source Node.js framework that enables you to:

* Create dynamic end-to-end REST APIs with little or no coding.
* Access data from major relational and NoSQL databases, SOAP and REST APIs.
* Incorporate model relationships and access controls for complex APIs.

This repository demonstrates how to define models with nested relations. 

The models used in this examples are:

- **Goal** (*hasMany* **Task**(s))
- **Task** (*belongsTo* **Goal**, *hasMany* **SubTask**(s))
- **SubTask** (*belongsTo* **Task**)

###Instructions

 1. git clone https://github.com/jeserodz/loopback-nested-relations-example.git
 2. cd loopback-nested-relations-example
 3. npm install
 4. node .
 5. Console outputs query result of a Goal instance including its tasks, and those tasks including their subtasks:

```
 {
  "description": "An ambitious goal!",
  "id": 1,
  "tasks": [
    {
      "description": "A main task for the goal",
      "goalId": 1,
      "id": 1,
      "subTasks": [
        {
          "description": "A sub-task for the task",
          "parentT askId": 1,
          "id": 1
        }
      ]
    }
  ]
}
```

###Details

See `server/boot/example.js` for details on how to include nested relations in a query: 

```
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
```