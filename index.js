const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(express.json());
app.use(cors());
const port = 3000;
var groupDataObj = {
    'a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955':
    {
        "groupName": "Chikmagalur Trip", "members": ["Ankur", "Mridul", "Abhishek"],
        "id": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955",
        "expenses": [
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Toll", "amount": 610, "paidBy": "Mridul", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Dinner", "amount": 600, "paidBy": "Mridul", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Kailash parwat", "amount": 2400, "paidBy": "Mridul", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Kailash parwat for abhishek", "amount": 1000, "paidBy": "Mridul", "splitAmong": ["Abhishek"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Breakfast ( krishna keshwa)", "amount": 750, "paidBy": "Mridul", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Petrol", "amount": 6902, "paidBy": "Mridul", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Dinner at Maharaja", "amount": 1163, "paidBy": "Ankur", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Hotel Stay", "amount": 12000, "paidBy": "Ankur", "splitAmong": ["Ankur", "Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Jeep to hebbe for Abhishek", "amount": 2832, "paidBy": "Ankur", "splitAmong": ["Abhishek"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Jeep to hebbe for Mridul", "amount": 1416, "paidBy": "Ankur", "splitAmong": ["Mridul"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Lunch while returning to blr", "amount": 2470, "paidBy": "Ankur", "splitAmong": ["Ankur", "Mridul", "Abhishek"] },
            { "groupId": "a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955", "expenseName": "Spice Hub", "amount": 693, "paidBy": "Ankur", "splitAmong": ["Mridul"] }
        ]
    }
};

const uri = 'mongodb+srv://ankur101045_db_user:G6FmHh7CmioXIQZ5@cluster0.xtpdock.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group')
    const findResult = await collection.find({_id:'a8811a7e-eea5-4c92-b0bb-e9cf5d2d6955'}).toArray();
    console.log(findResult);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.get('/', async (req, res) => {
    await run();
    res.send('Hello World!');
});

app.post('/createGroup', async (req, res) => {
    const groupData = req.body;
    await client.connect();
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group')
    await collection.insertOne(groupData);
    await client.close();
    res.send({ message: 'Group created successfully!' });
});

app.post('/addExpense', async (req, res) => {
    const expenseData = req.body;
    await client.connect();
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group')
    const groupId = expenseData.groupId;
    await collection.updateOne({_id:`${groupId}`}, {$push: {expenses: expenseData}});
    await client.close();
    res.send({ message: 'Expense added successfully!' });
});

app.put('/edit/expense', async (req, res) => {
    const groupId = req.query.groupId;
    const expenseObj = req.body;
    await client.connect();
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group')
    await collection.updateOne({ _id: `${groupId}`, "expenses.expenseId": expenseObj.expenseId },
        {
            $set: { "expenses.$": expenseObj }
        });
    await client.close();
    res.send({ message: 'Expense updated successfully!' });
})

app.delete('/delete/expense', async (req, res)=> {
    const groupId = req.query.groupId;
    const expenseId = req.query.expenseId;
    await client.connect();
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group')
    await collection.updateOne({_id: groupId}, {
        $pull: {
            expenses: {
                expenseId: expenseId
            }
        }
    })
    await client.close();
    res.send({ message: 'Expense deleted successfully!' });
})

app.delete('/delete/group', async(req, res) => {
    const groupId = req.query.groupId;
    await client.connect();
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group');
    await collection.deleteOne({_id: groupId});
    await client.close();
    res.send({message: 'Group deleted successfully!'})
})

app.get('/getGroupData', async (req, res) => {
    const groupId = req.query.groupId;
    await client.connect();
    const db = client.db("divide_and_pay");
    const collection = db.collection('expense_group')
    let groupDoc = await collection.findOne({_id: groupId});
    await client.close();
    res.send(groupDoc);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});