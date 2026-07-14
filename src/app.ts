import express from 'express'
import dotenv from 'dotenv'
import CompositionRoot from './compositition'

dotenv.config();
CompositionRoot.configure();

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/user', CompositionRoot.authRouter());
app.use('/api/v1/delivery', CompositionRoot.orderRouter());
app.use('/api/v1/picktime', CompositionRoot.pickTimeRouter());
app.use('/api/v1/scope', CompositionRoot.scopeRouter());
app.use('/api/v1/brand', CompositionRoot.brandRouter());
app.use('/api/v1/exchange', CompositionRoot.contractRouter());

const HOST = '0.0.0.0';
app.listen(Number(PORT), HOST, () => console.log(`listening on port ${PORT}`));