import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Initialize provider
const getProvider = () => {
    const network = process.env.BLOCKCHAIN_NETWORK || 'sepolia';
    const infuraProjectId = process.env.INFURA_PROJECT_ID;

    if (!infuraProjectId) {
        console.warn('⚠️  INFURA_PROJECT_ID not set, using default provider');
        return ethers.getDefaultProvider(network);
    }

    return new ethers.InfuraProvider(network, infuraProjectId);
};

// Initialize wallet for contract deployment
const getWallet = () => {
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('PRIVATE_KEY not set in environment variables');
    }

    const provider = getProvider();
    return new ethers.Wallet(privateKey, provider);
};

// Ticket NFT Contract ABI (simplified)
const TICKET_NFT_ABI = [
    'function mintTicket(address to, uint256 eventId, string memory tokenURI) public returns (uint256)',
    'function balanceOf(address owner) public view returns (uint256)',
    'function ownerOf(uint256 tokenId) public view returns (address)',
    'function tokenURI(uint256 tokenId) public view returns (string)',
    'function transferFrom(address from, address to, uint256 tokenId) public',
    'event TicketMinted(address indexed to, uint256 indexed eventId, uint256 tokenId)',
];

// Event Factory Contract ABI (simplified)
const EVENT_FACTORY_ABI = [
    'function createEvent(string memory name, uint256 startDate, uint256 ticketSupply) public returns (uint256)',
    'function getEvent(uint256 eventId) public view returns (string memory, uint256, uint256, address)',
    'event EventCreated(uint256 indexed eventId, address indexed creator, string name)',
];

export class Web3Service {
    private provider: ethers.Provider;
    private wallet?: ethers.Wallet;

    constructor() {
        this.provider = getProvider();
    }

    // Initialize wallet (for transactions)
    initWallet() {
        this.wallet = getWallet();
    }

    // Get ticket NFT contract
    getTicketContract(contractAddress?: string) {
        const address = contractAddress || process.env.TICKET_NFT_CONTRACT;
        if (!address) {
            throw new Error('Ticket NFT contract address not configured');
        }

        if (this.wallet) {
            return new ethers.Contract(address, TICKET_NFT_ABI, this.wallet);
        }
        return new ethers.Contract(address, TICKET_NFT_ABI, this.provider);
    }

    // Get event factory contract
    getEventFactoryContract(contractAddress?: string) {
        const address = contractAddress || process.env.EVENT_FACTORY_CONTRACT;
        if (!address) {
            throw new Error('Event factory contract address not configured');
        }

        if (this.wallet) {
            return new ethers.Contract(address, EVENT_FACTORY_ABI, this.wallet);
        }
        return new ethers.Contract(address, EVENT_FACTORY_ABI, this.provider);
    }

    // Mint ticket NFT
    async mintTicket(
        toAddress: string,
        eventId: number,
        tokenURI: string,
        contractAddress?: string
    ) {
        try {
            this.initWallet();
            const contract = this.getTicketContract(contractAddress);

            const tx = await contract.mintTicket(toAddress, eventId, tokenURI);
            const receipt = await tx.wait();

            // Extract token ID from event
            const event = receipt.logs.find(
                (log: any) => log.fragment && log.fragment.name === 'TicketMinted'
            );

            return {
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber,
                tokenId: event?.args?.tokenId?.toString(),
                gasUsed: receipt.gasUsed.toString(),
            };
        } catch (error: any) {
            console.error('Mint ticket error:', error);
            throw new Error(`Failed to mint ticket: ${error.message}`);
        }
    }

    // Verify transaction
    async verifyTransaction(txHash: string) {
        try {
            const tx = await this.provider.getTransaction(txHash);
            if (!tx) {
                return { verified: false, message: 'Transaction not found' };
            }

            const receipt = await this.provider.getTransactionReceipt(txHash);
            if (!receipt) {
                return { verified: false, message: 'Transaction pending' };
            }

            return {
                verified: true,
                status: receipt.status === 1 ? 'success' : 'failed',
                blockNumber: receipt.blockNumber,
                from: receipt.from,
                to: receipt.to,
                gasUsed: receipt.gasUsed.toString(),
            };
        } catch (error: any) {
            console.error('Verify transaction error:', error);
            throw new Error(`Failed to verify transaction: ${error.message}`);
        }
    }

    // Get wallet balance
    async getBalance(address: string) {
        try {
            const balance = await this.provider.getBalance(address);
            return ethers.formatEther(balance);
        } catch (error: any) {
            console.error('Get balance error:', error);
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    // Validate wallet address
    isValidAddress(address: string): boolean {
        return ethers.isAddress(address);
    }

    // Get current gas price
    async getGasPrice() {
        try {
            const feeData = await this.provider.getFeeData();
            return {
                gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : null,
                maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null,
            };
        } catch (error: any) {
            console.error('Get gas price error:', error);
            throw new Error(`Failed to get gas price: ${error.message}`);
        }
    }
}

export default new Web3Service();
