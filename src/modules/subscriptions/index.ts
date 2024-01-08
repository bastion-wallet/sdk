
import { Address, PublicClient, WalletClient, encodeFunctionData, getContract } from "viem";
import * as aaContracts from "@account-abstraction/contracts";
import { SubExecutor__factory, Initiator__factory, Kernel__factory, BatchActions__factory } from "../smart-wallet/contracts";
import { SmartWalletViem } from "../smart-wallet/viemSmartWallet";
import { BastionSignerOptions } from "../bastionConnect";
import { ethers, utils } from "ethers";
import { UserOperationStructViem } from "bastion-wallet-web-sdk/dist/modules/viemConnect/type";

export class Subscription {

    SUB_EXECUTOR_ADDRESS:  `0x${string}` = "0xD872A6834F12ebf66a0B28bab77442Dc423f0304";

    smartAccountAddress: Address;
    initiatorAddress: Address;
    smartWallet: SmartWalletViem;
    options: BastionSignerOptions;
    walletClient: WalletClient;
    publicClient: PublicClient;
    entryPoint: any;

    async init(_initiatorAddress:Address, _smartWallet: SmartWalletViem, _options: BastionSignerOptions) {
        this.initiatorAddress = _initiatorAddress;
        this.smartWallet = _smartWallet;
        this.walletClient = this.smartWallet.walletClient;
        this.publicClient = this.smartWallet.publicClient;
        this.options = _options;
        const { smartAccountAddress, exists, entryPoint } = await this.smartWallet.initParams(this.walletClient, this.publicClient, this.options);
        if(!exists) throw new Error("smart account doesn't exist, please create smart account first");
        this.smartAccountAddress = smartAccountAddress;
        this.entryPoint = entryPoint;
        const attached = await this.checkSubExecutorAttached();
        return {attached};
    }

    private async checkSubExecutorAttached() {
        try {
            const kernelAccount = getContract({
                address: this.smartAccountAddress,
                abi: Kernel__factory.abi,
                publicClient: this.publicClient,
                walletClient: this.walletClient
            })
            const subExecutorInterface = new utils.Interface(["function createSubscription(address _initiator,uint256 _amount,uint256 _interval,uint256 _paymentLimit,address _erc20Token) external"]);
            const funcSignature = (subExecutorInterface.getSighash("createSubscription(address,uint256,uint256,uint256,address)")) as `0x${string}`;
           console.log("funcSignature",funcSignature);
            // First get the execution details from kernerlAccount
            const executionDetails = await kernelAccount.read.getExecution([funcSignature]);
            console.log("executionDetails",executionDetails);
            if (executionDetails.validUntil === 0) {
                return false;
            }
            else return true;    
        } catch (error) {
            throw error;
        }
    }

    private async sendUserOperation(callData:any, _userOperation?: aaContracts.UserOperationStruct){
        try {
            const userOperation = _userOperation ? _userOperation : await this.smartWallet.prepareTransaction(this.publicClient, this.walletClient, this.smartAccountAddress, 0, this.options, callData);
            const sponsoredUserOperation = await this.smartWallet.getPaymasterSponsorship(this.options.chainId, userOperation, this.options.apiKey) as UserOperationStructViem;
            const signedUserOperation = await this.smartWallet.signUserOperation(this.publicClient, this.walletClient, sponsoredUserOperation, this.options) as UserOperationStructViem;
            console.log("signedUserOperation",signedUserOperation);
            return await this.smartWallet.sendTransaction(signedUserOperation, this.options);
        } catch (error) {
            throw error;
        }
      
    }

    private async prepareAndSendUserOperation(callData:any){
        try {
            const gasPrice = await this.publicClient.getGasPrice() 
            const nonce = await this.entryPoint.read.getNonce([this.smartAccountAddress, BigInt(0)]);
            const userOperation = {
                sender: this.smartAccountAddress,
                nonce: utils.hexlify(nonce),
                initCode: "0x" as `0x${string}`,
                callData,
                callGasLimit: utils.hexlify(3_000_000),
                verificationGasLimit: utils.hexlify(800_000),
                preVerificationGas: utils.hexlify(800_000),
                maxFeePerGas: utils.hexlify(gasPrice),
                maxPriorityFeePerGas: utils.hexlify(gasPrice),
                paymasterAndData: "0x",
                signature: "0x",
            };

            return await this.sendUserOperation(callData, userOperation);
        } catch (error) {
            throw error;
        }
      
    }

    async attachSubExecutorToSmartWallet(){
        try {
            const attached = await this.checkSubExecutorAttached();
            if(attached) { return true;}
            const validUntil = 1893456000;
            const block = await this.publicClient.getBlock();
            const timestamp = block.timestamp;
            const validAfter = timestamp;
            const owner = this.walletClient.account.address;
            const ownerSliced = owner.slice(2).padStart(40, "0");
            const packedData = utils.hexlify(utils.arrayify("0x" + ownerSliced)) as `0x${string}`;
            

            const kernelAccount = getContract({
                address: this.smartAccountAddress,
                abi: Kernel__factory.abi,
                publicClient: this.publicClient,
                walletClient: this.walletClient
            })
            const subExecutorInterface = new utils.Interface(["function createSubscription(address _initiator,uint256 _amount,uint256 _interval,uint256 _paymentLimit,address _erc20Token) external"]);
            const funcSignature = (subExecutorInterface.getSighash("createSubscription(address,uint256,uint256,uint256,address)")) as `0x${string}`;
    
            const setExecutionCallData = encodeFunctionData({
                abi: kernelAccount.abi,
                functionName: "setExecution",
                args: [
                    funcSignature,
                    this.SUB_EXECUTOR_ADDRESS,
                    this.smartWallet.VALIDATOR_ADDRESS,
                    validUntil,
                    validAfter,
                    packedData,
                ]
            })
            const useropTrx = await this.sendUserOperation(setExecutionCallData);
            console.log("useropTrx",useropTrx.userOperationHash);
            return useropTrx;
        } catch (error) {
            console.log("attachSubExecutorToSmartWallet:error", error);
            throw new Error("attachSubExecutorToSmartWallet:",error);
        }
    };

    async createSubscription(amount: string, interval: number, paymentLimit: string, erc20TokenAddress: Address){
       try {
        console.log("createSubscription in")
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const subExecutor = getContract({
                address: this.smartAccountAddress,
                abi: SubExecutor__factory.abi,
                publicClient: this.publicClient,
                walletClient: this.walletClient
            })
            console.log("erc20TokenAddress",erc20TokenAddress);
            // 0 = call, 1 = delegatecall (type of Operation)
            const callData = encodeFunctionData({
                abi: SubExecutor__factory.abi,
                functionName: "createSubscription",
                args: [this.initiatorAddress, BigInt(amount), BigInt(interval), BigInt(paymentLimit), erc20TokenAddress]
            })
            console.log("callData",callData);
            return await this.prepareAndSendUserOperation(callData);
            
       } catch (error) {
            throw new Error(`createSubscription:${error}`,);
       } 
    };

    async modifySubscription(amount: string, interval: number, paymentLimit: string, erc20TokenAddress: Address){
        try {
                const isAttached = await this.checkSubExecutorAttached();
                if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
                const callData = encodeFunctionData({
                    abi: SubExecutor__factory.abi,
                    functionName: "modifySubscription",
                    args: [this.initiatorAddress, BigInt(amount), BigInt(interval), BigInt(paymentLimit), erc20TokenAddress]
                })
                return await this.prepareAndSendUserOperation(callData);
           } catch (error) {
                throw new Error(`modifySubscription:${error}`,);
           } 

    };
    async revokeSubscription(initiator: Address, amount: number, interval:number){
        try {
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const callData = encodeFunctionData({
                abi: SubExecutor__factory.abi,
                functionName: "revokeSubscription",
                args: [initiator, BigInt(amount), BigInt(interval)]
            })
            return await this.prepareAndSendUserOperation(callData);
       } catch (error) {
            throw new Error(`revokeSubscription:${error}`,);
       } 
    };


    async getSubscription(initiator: Address){
        try {
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const subscription = await this.publicClient.readContract({
                address: this.smartAccountAddress,
                abi: SubExecutor__factory.abi,
                functionName: "getSubscription",
                args: [initiator]
            })

            console.log("subscription",subscription);
            return subscription;
       } catch (error) {
            throw new Error(`getSubscription:${error}`,);
       } 
    };

    // async registerWithInitiator(){};
    // async registerSubscription(){};

}