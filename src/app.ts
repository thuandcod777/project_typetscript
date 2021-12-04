import express from 'express'
import dotenv from 'dotenv'
import CompositionRoot from './Compositition'

dotenv.config()
CompositionRoot.configure()

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/user', CompositionRoot.authRouter())

app.listen(PORT, () => console.log(`listening on port ${PORT}`))