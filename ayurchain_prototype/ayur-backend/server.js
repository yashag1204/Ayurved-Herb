const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getContract } = require('./fabric-connector');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/batches', async (req, res) => {
    try {
        const { batchID, species, farmerID, location, harvestDate } = req.body;
        const { contract, gateway } = await getContract('appUser');
        const result = await contract.submitTransaction('CreateHerbBatch', batchID, species, farmerID, location, harvestDate);
        await gateway.disconnect();
        return res.status(201).json({ message: `Batch ${batchID} created`, data: JSON.parse(result.toString()) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.get('/api/batches/:id', async (req, res) => {
    try {
        const { contract, gateway } = await getContract('appUser');
        const result = await contract.evaluateTransaction('QueryBatch', req.params.id);
        await gateway.disconnect();
        return res.status(200).json(JSON.parse(result.toString()));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.get('/api/batches/:id/history', async (req, res) => {
    try {
        const { contract, gateway } = await getContract('appUser');
        const result = await contract.evaluateTransaction('GetBatchHistory', req.params.id);
        await gateway.disconnect();
        return res.status(200).json(JSON.parse(result.toString()));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/batches/:id/transfer', async (req, res) => {
    try {
        const { newOwner } = req.body;
        const { contract, gateway } = await getContract('appUser');
        const result = await contract.submitTransaction('TransferBatch', req.params.id, newOwner);
        await gateway.disconnect();
        return res.status(200).json({ message: result.toString() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/batches/:id/process', async (req, res) => {
    try {
        const { stepDescription } = req.body;
        const { contract, gateway } = await getContract('appUser');
        const result = await contract.submitTransaction('AddProcessingStep', req.params.id, stepDescription);
        await gateway.disconnect();
        return res.status(200).json({ message: 'Processing step added', data: JSON.parse(result.toString()) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AyurChain backend running on port ${PORT}`));
