'use strict';

const { Contract } = require('fabric-contract-api');

class AyurChainContract extends Contract {

    async InitLedger(ctx) {
        const sampleBatches = [
            {
                docType: 'herbBatch',
                batchID: 'T-101',
                species: 'Ocimum tenuiflorum',
                farmerID: 'FARMER_ANIL',
                cultivationLocation: 'Uttarakhand, India',
                harvestDate: '2025-08-01T08:00:00Z',
                currentOwner: 'FARMER_ANIL',
                ownerHistory: ['FARMER_ANIL'],
                processingSteps: []
            },
            {
                docType: 'herbBatch',
                batchID: 'T-102',
                species: 'Withania somnifera',
                farmerID: 'FARMER_RADHA',
                cultivationLocation: 'Rajasthan, India',
                harvestDate: '2025-08-05T08:00:00Z',
                currentOwner: 'FARMER_RADHA',
                ownerHistory: ['FARMER_RADHA'],
                processingSteps: []
            }
        ];

        for (const batch of sampleBatches) {
            await ctx.stub.putState(batch.batchID, Buffer.from(JSON.stringify(batch)));
            console.info('Added <--> ', batch.batchID);
        }
        return 'Ledger Initialized';
    }

    async CreateHerbBatch(ctx, batchID, species, farmerID, location, harvestDate) {
        const exists = await this._assetExists(ctx, batchID);
        if (exists) {
            throw new Error(`Batch ${batchID} already exists`);
        }
        const batch = {
            docType: 'herbBatch',
            batchID,
            species,
            farmerID,
            cultivationLocation: location,
            harvestDate,
            currentOwner: farmerID,
            ownerHistory: [farmerID],
            processingSteps: []
        };
        await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(batch)));
        return JSON.stringify(batch);
    }

    async QueryBatch(ctx, batchID) {
        const data = await ctx.stub.getState(batchID);
        if (!data || data.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }
        return data.toString();
    }

    async GetBatchHistory(ctx, batchID) {
        const iterator = await ctx.stub.getHistoryForKey(batchID);
        const all = [];
        let res = await iterator.next();
        while (!res.done) {
            const tx = res.value;
            const value = tx.value && tx.value.toString('utf8') ? tx.value.toString('utf8') : null;
            all.push({
                txId: tx.tx_id,
                timestamp: tx.timestamp,
                isDelete: tx.is_delete,
                value: value ? JSON.parse(value) : null
            });
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(all);
    }

    async TransferBatch(ctx, batchID, newOwner) {
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }
        const batch = JSON.parse(batchBuffer.toString());
        const clientMSP = ctx.clientIdentity.getID(); // optional check
        // For hackathon prototype: we skip strict identity check; production must check authority.
        batch.currentOwner = newOwner;
        batch.ownerHistory.push(newOwner);
        await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(batch)));
        return `Batch ${batchID} transferred to ${newOwner}`;
    }

    async AddProcessingStep(ctx, batchID, stepDescription) {
        const batchBuffer = await ctx.stub.getState(batchID);
        if (!batchBuffer || batchBuffer.length === 0) {
            throw new Error(`Batch ${batchID} does not exist`);
        }
        const batch = JSON.parse(batchBuffer.toString());
        const step = {
            description: stepDescription,
            timestamp: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
        };
        batch.processingSteps.push(step);
        await ctx.stub.putState(batchID, Buffer.from(JSON.stringify(batch)));
        return JSON.stringify(batch);
    }

    async _assetExists(ctx, id) {
        const data = await ctx.stub.getState(id);
        return data && data.length > 0;
    }
}

module.exports = AyurChainContract;
