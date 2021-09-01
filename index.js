const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))


async function start() {
    try {
        await mongoose.connect('<your path>', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })

    } catch (e) {
        console.log(e)
    }
}

start()