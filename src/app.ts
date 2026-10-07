import express from 'express'
import dotenv from 'dotenv'
import CompositionRoot from './compositition'

dotenv.config();
CompositionRoot.configure();

const PORT = 5000

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v2/user', CompositionRoot.authRouter());
app.use('/api/v2/delivery', CompositionRoot.orderRouter());
app.use('/api/v2/picktime', CompositionRoot.pickTimeRouter());
app.use('/api/v2/scope', CompositionRoot.scopeRouter());
app.use('/api/v2/brand', CompositionRoot.brandRouter());
app.use('/api/v2/exchange', CompositionRoot.contractRouter());
app.use('/api/v2/contact', CompositionRoot.contactRouter());

const HOST = '0.0.0.0';
app.listen(Number(PORT), HOST, () => console.log(`listening on port ${PORT}`));