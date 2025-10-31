import {
    Client,
    PrivateKey,
    AccountId,
    FileCreateTransaction,
    FileAppendTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

async function deployContract(
    client: Client,
    bytecode: string,
    gasLimit: number = 100000
) {
    try {
        // Create a file on Hedera to store the contract bytecode
        console.log('📤 Uploading contract bytecode...');
        const fileCreateTx = await new FileCreateTransaction()
            .setContents(bytecode.slice(0, 4096))
            .setKeys([client.operatorPublicKey!])
            .freezeWith(client);

        const fileCreateSign = await fileCreateTx.sign(
            PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)
        );
        const fileCreateSubmit = await fileCreateSign.execute(client);
        const fileCreateReceipt = await fileCreateSubmit.getReceipt(client);
        const fileId = fileCreateReceipt.fileId;

        console.log(`✅ Contract bytecode file created: ${fileId}`);

        // Append remaining bytecode if needed
        if (bytecode.length > 4096) {
            console.log('📤 Appending remaining bytecode...');
            for (let i = 4096; i < bytecode.length; i += 4096) {
                const chunk = bytecode.slice(i, Math.min(i + 4096, bytecode.length));
                const fileAppendTx = await new FileAppendTransaction()
                    .setFileId(fileId!)
                    .setContents(chunk)
                    .freezeWith(client);

                const fileAppendSign = await fileAppendTx.sign(
                    PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)
                );
                await fileAppendSign.execute(client);
            }
            console.log('✅ Bytecode append complete');
        }

        // Create the smart contract
        console.log('🚀 Deploying contract...');
        const contractCreateTx = await new ContractCreateTransaction()
            .setBytecodeFileId(fileId!)
            .setGas(gasLimit)
            .setConstructorParameters(
                new ContractFunctionParameters().addAddress(
                    client.operatorAccountId!.toSolidityAddress()
                )
            );

        const contractCreateSubmit = await contractCreateTx.execute(client);
        const contractCreateReceipt = await contractCreateSubmit.getReceipt(client);
        const contractId = contractCreateReceipt.contractId;

        console.log(`✅ Contract deployed: ${contractId}`);

        return {
            contractId: contractId?.toString(),
            transactionId: contractCreateSubmit.transactionId.toString(),
        };
    } catch (error: any) {
        console.error('❌ Deployment error:', error);
        throw error;
    }
}

async function main() {
    console.log('🚀 Hedera Smart Contract Deployment\n');

    // Initialize client
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;
    const network = process.env.HEDERA_NETWORK || 'testnet';

    if (!accountId || !privateKey) {
        throw new Error('Please set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in .env');
    }

    const client =
        network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();

    client.setOperator(
        AccountId.fromString(accountId),
        PrivateKey.fromString(privateKey)
    );

    console.log(`📡 Network: ${network}`);
    console.log(`👤 Operator: ${accountId}\n`);

    try {
        // Note: You would need to compile your Solidity contracts first
        // This is a placeholder for the actual bytecode

        // Deploy EventFactory
        console.log('📝 Deploying EventFactory...');
        // const eventFactoryBytecode = fs.readFileSync(
        //   path.join(__dirname, '../contracts/compiled/EventFactory.bin'),
        //   'utf8'
        // );
        // const eventFactory = await deployContract(client, eventFactoryBytecode, 150000);
        // console.log(`\n✅ EventFactory deployed: ${eventFactory.contractId}\n`);

        // Deploy TicketNFT
        console.log('📝 Deploying TicketNFT...');
        // const ticketNFTBytecode = fs.readFileSync(
        //   path.join(__dirname, '../contracts/compiled/TicketNFT.bin'),
        //   'utf8'
        // );
        // const ticketNFT = await deployContract(client, ticketNFTBytecode, 150000);
        // console.log(`\n✅ TicketNFT deployed: ${ticketNFT.contractId}\n`);

        console.log('🎉 Deployment Complete!\n');
        console.log('📝 Update your .env file with these contract IDs:');
        console.log('EVENT_FACTORY_CONTRACT_ID=0.0.xxxxx');
        console.log('TICKET_NFT_CONTRACT_ID=0.0.xxxxx');

        console.log('\n💡 TIP: For better performance, consider using Hedera Token Service (HTS)');
        console.log('instead of smart contracts for NFT tickets. See HederaService.createTicketNFT()');

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    } finally {
        client.close();
    }
}

// Run deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export { deployContract };
