import {
  Client,
  PrivateKey,
  AccountId,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TransferTransaction,
  AccountBalanceQuery,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

export class HederaService {
  private client!: Client;
  private operatorId!: AccountId;
  private operatorKey!: PrivateKey;    constructor() {
        this.initializeClient();
    }

    private initializeClient() {
        const network = process.env.HEDERA_NETWORK || 'testnet';
        const accountId = process.env.HEDERA_ACCOUNT_ID;
        const privateKey = process.env.HEDERA_PRIVATE_KEY;

        if (!accountId || !privateKey) {
            throw new Error('Hedera credentials not set in environment variables');
        }

        this.operatorId = AccountId.fromString(accountId);
        this.operatorKey = PrivateKey.fromString(privateKey);

        // Initialize client based on network
        if (network === 'mainnet') {
            this.client = Client.forMainnet();
        } else {
            this.client = Client.forTestnet();
        }

        this.client.setOperator(this.operatorId, this.operatorKey);
        console.log(`✅ Hedera client initialized for ${network}`);
    }

    // Get the initialized client
    getClient(): Client {
        return this.client;
    }

    // Create NFT Token for Event Tickets
    async createTicketNFT(
        tokenName: string,
        tokenSymbol: string,
        treasuryAccountId: string
    ) {
        try {
            const transaction = await new TokenCreateTransaction()
                .setTokenName(tokenName)
                .setTokenSymbol(tokenSymbol)
                .setTokenType(TokenType.NonFungibleUnique)
                .setDecimals(0)
                .setInitialSupply(0)
                .setTreasuryAccountId(treasuryAccountId)
                .setSupplyType(TokenSupplyType.Infinite)
                .setSupplyKey(this.operatorKey)
                .setAdminKey(this.operatorKey)
                .freezeWith(this.client);

            const signedTx = await transaction.sign(this.operatorKey);
            const response = await signedTx.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                tokenId: receipt.tokenId?.toString(),
                status: receipt.status.toString(),
                transactionId: response.transactionId.toString(),
            };
        } catch (error: any) {
            console.error('Create NFT token error:', error);
            throw new Error(`Failed to create NFT token: ${error.message}`);
        }
    }

    // Mint NFT Ticket
    async mintTicket(
        tokenId: string,
        metadata: string[] // Array of metadata URIs
    ) {
        try {
            const transaction = await new TokenMintTransaction()
                .setTokenId(tokenId)
                .setMetadata(metadata.map((m) => Buffer.from(m)))
                .freezeWith(this.client);

            const signedTx = await transaction.sign(this.operatorKey);
            const response = await signedTx.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                status: receipt.status.toString(),
                transactionId: response.transactionId.toString(),
                serialNumbers: receipt.serials.map((s) => s.toString()),
            };
        } catch (error: any) {
            console.error('Mint ticket error:', error);
            throw new Error(`Failed to mint ticket: ${error.message}`);
        }
    }

    // Associate token with user account
    async associateToken(tokenId: string, accountId: string, accountKey: string) {
        try {
            const userKey = PrivateKey.fromString(accountKey);
            const transaction = await new TokenAssociateTransaction()
                .setAccountId(accountId)
                .setTokenIds([tokenId])
                .freezeWith(this.client);

            const signedTx = await transaction.sign(userKey);
            const response = await signedTx.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                status: receipt.status.toString(),
                transactionId: response.transactionId.toString(),
            };
        } catch (error: any) {
            console.error('Associate token error:', error);
            throw new Error(`Failed to associate token: ${error.message}`);
        }
    }

    // Transfer NFT ticket to buyer
    async transferTicket(
        tokenId: string,
        fromAccountId: string,
        toAccountId: string,
        serialNumber: number
    ) {
        try {
            const transaction = await new TransferTransaction()
                .addNftTransfer(tokenId, serialNumber, fromAccountId, toAccountId)
                .freezeWith(this.client);

            const signedTx = await transaction.sign(this.operatorKey);
            const response = await signedTx.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                status: receipt.status.toString(),
                transactionId: response.transactionId.toString(),
            };
        } catch (error: any) {
            console.error('Transfer ticket error:', error);
            throw new Error(`Failed to transfer ticket: ${error.message}`);
        }
    }

    // Execute smart contract function
    async executeContract(
        contractId: string,
        functionName: string,
        params: ContractFunctionParameters,
        gasLimit: number = 100000
    ) {
        try {
            const transaction = await new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(gasLimit)
                .setFunction(functionName, params)
                .freezeWith(this.client);

            const signedTx = await transaction.sign(this.operatorKey);
            const response = await signedTx.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                status: receipt.status.toString(),
                transactionId: response.transactionId.toString(),
                contractId: receipt.contractId?.toString(),
            };
        } catch (error: any) {
            console.error('Execute contract error:', error);
            throw new Error(`Failed to execute contract: ${error.message}`);
        }
    }

    // Query smart contract
    async queryContract(
        contractId: string,
        functionName: string,
        params: ContractFunctionParameters,
        gasLimit: number = 100000
    ) {
        try {
            const query = new ContractCallQuery()
                .setContractId(contractId)
                .setGas(gasLimit)
                .setFunction(functionName, params);

            const result = await query.execute(this.client);
            return result;
        } catch (error: any) {
            console.error('Query contract error:', error);
            throw new Error(`Failed to query contract: ${error.message}`);
        }
    }

    // Get account balance
    async getAccountBalance(accountId: string) {
        try {
            const balance = await new AccountBalanceQuery()
                .setAccountId(accountId)
                .execute(this.client);

            return {
                hbars: balance.hbars.toString(),
                tokens: balance.tokens?.toString(),
            };
        } catch (error: any) {
            console.error('Get balance error:', error);
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    // Validate Hedera account ID
    isValidAccountId(accountId: string): boolean {
        try {
            AccountId.fromString(accountId);
            return true;
        } catch {
            return false;
        }
    }

    // Get transaction info
    async getTransactionInfo(transactionId: string) {
        try {
            // Note: You would need to implement transaction record query
            // This is a placeholder for the actual implementation
            return {
                transactionId,
                status: 'success',
            };
        } catch (error: any) {
            console.error('Get transaction info error:', error);
            throw new Error(`Failed to get transaction info: ${error.message}`);
        }
    }

    // Create event on smart contract
    async createEventOnChain(
        eventName: string,
        startDate: number,
        endDate: number,
        totalTickets: number,
        ticketPrice: number
    ) {
        try {
            const contractId = process.env.EVENT_FACTORY_CONTRACT_ID;
            if (!contractId) {
                throw new Error('Event factory contract ID not configured');
            }

            const params = new ContractFunctionParameters()
                .addString(eventName)
                .addUint256(startDate)
                .addUint256(endDate)
                .addUint256(totalTickets)
                .addUint256(ticketPrice);

            const result = await this.executeContract(
                contractId,
                'createEvent',
                params,
                150000
            );

            return result;
        } catch (error: any) {
            console.error('Create event on chain error:', error);
            throw new Error(`Failed to create event on chain: ${error.message}`);
        }
    }

    // Record ticket sale on smart contract
    async recordTicketSaleOnChain(eventId: number, quantity: number) {
        try {
            const contractId = process.env.EVENT_FACTORY_CONTRACT_ID;
            if (!contractId) {
                throw new Error('Event factory contract ID not configured');
            }

            const params = new ContractFunctionParameters()
                .addUint256(eventId)
                .addUint256(quantity);

            const result = await this.executeContract(
                contractId,
                'recordTicketSale',
                params,
                100000
            );

            return result;
        } catch (error: any) {
            console.error('Record ticket sale error:', error);
            throw new Error(`Failed to record ticket sale: ${error.message}`);
        }
    }

    // Close client connection
    close() {
        this.client.close();
    }
}

export default new HederaService();