const express = require('express');
const webPush = require('web-push');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config()

webPush.setVapidDetails('mailto: test@test.nl', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)

const app = express()

app.use(cors({
    origin: '*'
}))
app.use(express.json())

app.post('/api/subscribe', async (req, res) => {
    const subscription = req.body

    const subscriptionsJSON = await fs.readFileSync('./db/db.json')
    let subscriptions = JSON.parse(subscriptionsJSON)

    const alreadySubscribed = subscriptions.find(item => item === subscription)

    if(!alreadySubscribed){
        subscriptions.push(subscription)

        await fs.writeFileSync('./db/db.json', JSON.stringify(subscriptions, null, 2))

        res.status(200).json({
            message: 'subscribed!'
        })
    }else{
        res.status(200).json({
            message: 'subscribed!'
        })
    }
})

app.push('/api/send-notification', async (req, res) => {
    const data = req.body

    const subsJSON = await fs.readFileSync('./db/db.json');
    const subs = JSON.parse(subsJSON)

    if(subs.length <= 0){
        res.status(500).json({
            message: 'No subs available'
        })
    }else{
        subs.forEach(sub => {
            webPush.sendNotification(sub, data)
        })

        res.status(200).json({
            message: 'Notification send!'
        })
    }
})

app.listen(5000, () => console.log('Server started on port 5000...'))