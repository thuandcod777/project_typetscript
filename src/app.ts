import express from 'express'
import dotenv from 'dotenv'
import CompositionRoot from './Compositition'

dotenv.config()
CompositionRoot.configure()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/user', CompositionRoot.authRouter())
app.use('/person', CompositionRoot.getAllUserRouter())
app.use('/delivery', CompositionRoot.orderRouter())

const HOST = '0.0.0.0';
app.listen(Number(PORT), HOST, () => console.log(`listening on port ${PORT}`))