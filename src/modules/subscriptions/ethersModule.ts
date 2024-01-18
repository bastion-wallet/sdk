import { Address, Hex, Transport, encodeFunctionData } from "viem";
import * as aaContracts from "@account-abstraction/contracts";
import { SubExecutor__factory, Initiator__factory, Kernel__factory } from "../smart-wallet/contracts";
import { SmartWallet } from "../smart-wallet";
import { BastionSignerOptions } from "../bastionConnect";
import { ethers, utils } from "ethers";
import { erc20ABI } from "../smart-wallet/contracts/ABIs/ERC20_ABI";
import { JsonRpcProvider } from "@ethersproject/providers";

export class Subscription {

    SUB_EXECUTOR_ADDRESS:  `0x${string}` = "0x5F85621D7f78609784FDeFBc6fDd5A8b183C5C76";

    smartAccountAddress: string;
    initiatorAddress: string;
    smartWallet: SmartWallet;
    options: BastionSignerOptions;
    entryPoint: any;
    externalProvider: JsonRpcProvider;
    signer: any;

    async init(_initiatorAddress:Address, _externalProvider: JsonRpcProvider,_smartWallet: SmartWallet, _options: BastionSignerOptions) {
        this.initiatorAddress = _initiatorAddress;
        this.smartWallet = _smartWallet;
        this.signer = this.smartWallet.signerInstance;
        this.options = _options;
        this.externalProvider = _externalProvider;
        const { smartAccountAddress, exists, entryPoint } = await this.smartWallet.initParams(_externalProvider, this.options);
        if(!exists) throw new Error("smart account doesn't exist, please create smart account first");
        this.smartAccountAddress = smartAccountAddress;
        this.entryPoint = entryPoint;
        const attached = await this.checkSubExecutorAttached();
        return {attached};
    }

    private async checkSubExecutorAttached() {
        try {
            const kernelAccount = await Kernel__factory.connect(this.smartAccountAddress, this.signer);

            const subExecutorInterface = new utils.Interface(["function createSubscription(address _initiator,uint256 _amount, uint256 _interval, uint256 _validUntil,address _erc20Token) external"]);
            const funcSignature = (subExecutorInterface.getSighash("createSubscription(address,uint256,uint256,uint256,address)")) as `0x${string}`;
            // First get the execution details from kernerlAccount
            const executionDetails = await kernelAccount.getExecution(funcSignature);
            if (executionDetails.validUntil === 0) {
                return false;
            }
            else return true;    
        } catch (error) {
            throw error;
        }
    }

    private async sendUserOperation(callData:any, _userOperation?: aaContracts.UserOperationStruct, incrementNonce?:boolean){
        try {
            let userOperation = _userOperation ? _userOperation : await this.smartWallet.prepareTransaction(this.externalProvider, this.smartAccountAddress, 0, this.options, callData);
            if(incrementNonce) userOperation = { ...userOperation, nonce: utils.hexlify(parseInt(userOperation.nonce.toString()) + 1)}
            const sponsoredUserOperation = await this.smartWallet.getPaymasterSponsorship(this.options.chainId, userOperation, this.options.apiKey);
            const signedUserOperation = await this.smartWallet.signUserOperation(this.externalProvider, sponsoredUserOperation, this.options);
            return await this.smartWallet.sendTransaction(this.externalProvider,signedUserOperation, this.options);
        } catch (error) {
            throw error;
        }
    }

    private async prepareAndSendUserOperation(callData:any){
        try {
            const gasPrice = await this.externalProvider.getGasPrice() 
            const nonce = await this.entryPoint.callStatic.getNonce(this.smartAccountAddress, 0);
            const userOperation = {
                sender: this.smartAccountAddress,
                nonce: utils.hexlify(nonce),
                initCode: "0x",
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
			const block = await this.externalProvider.getBlock("latest");
            const timestamp = block.timestamp;
            const validAfter = timestamp;
			const owner = await this.signer.getAddress();
            const ownerSliced = owner.slice(2).padStart(40, "0");
            const packedData = utils.hexlify(utils.arrayify("0x" + ownerSliced));

            //CREATE
            const createInterface = new utils.Interface(["function createSubscription(address _initiator,uint256 _amount,uint256 _interval,uint256 _validUntil,address _erc20Token) external"]);
            const funcSignatureCreate = (createInterface.getSighash("createSubscription(address,uint256,uint256,uint256,address)")) as `0x${string}`;
           
            //GET
            const getSubInterface = new utils.Interface(["function getSubscription(address _initiator) external"]);
            const funcSignatureGetSub = (getSubInterface.getSighash("getSubscription(address)")) as `0x${string}`;
          
            // //MODIFY
            const modifyInterface = new utils.Interface(["function modifySubscription(address _initiator,uint256 _amount,uint256 _interval, uint256 _validUntil,address _erc20Token) external"]);
            const funcSignatureModify = (modifyInterface.getSighash("modifySubscription(address,uint256,uint256,uint256,address)")) as `0x${string}`;
            
            // //REVOKE
            const revokeInterface = new utils.Interface(["function revokeSubscription(address _initiator) external"]);
            const funcSignatureRevoke = (revokeInterface.getSighash("revokeSubscription(address)")) as `0x${string}`;
           
            // //GET PAYMENT HISTORY
            const payHistoryInterface = new utils.Interface(["function getPaymentHistory(address _initiator) external"]);
            const funcSignaturePayHistory= (payHistoryInterface.getSighash("getPaymentHistory(address)")) as `0x${string}`;
            
            // //GET LAST PAID TIMESTAMP
            const lastPaidTimeInterface = new utils.Interface(["function getLastPaidTimestamp(address _initiator) external"]);
            const funcSignatureLastPaidTime= (lastPaidTimeInterface.getSighash("getLastPaidTimestamp(address)")) as `0x${string}`;
            
            //PROCESS PAYMENT
            const processPaymentTimeInterface = new utils.Interface(["function processPayment() external"]);
            const funcSignatureProcessPayment= (processPaymentTimeInterface.getSighash("processPayment()")) as `0x${string}`;
			
            const setExecutionCallData = encodeFunctionData({
				abi: Kernel__factory.abi,
				functionName: "setExecutionMultiSelector",
				args: [
					[
						funcSignatureCreate,
						funcSignatureGetSub,
						funcSignatureModify,
						funcSignatureRevoke,
					],
					this.SUB_EXECUTOR_ADDRESS,
					this.smartWallet.VALIDATOR_ADDRESS as `0x${string}`,
					validUntil,
					validAfter,
					packedData as `0x${string}`,
				],
			});
            // const useropTrx1 = await this.sendUserOperation(setExecutionCallData);

            const setExecutionCallData2 = encodeFunctionData({
				abi: Kernel__factory.abi,
				functionName: "setExecutionMultiSelector",
				args: [
					[
						funcSignaturePayHistory,
						funcSignatureLastPaidTime,
                        funcSignatureProcessPayment
					],
					this.SUB_EXECUTOR_ADDRESS,
					this.smartWallet.VALIDATOR_ADDRESS as `0x${string}`,
					validUntil,
					validAfter,
					packedData as `0x${string}`,
				],
			});
            // const useropTrx2 = await this.sendUserOperation(setExecutionCallData2, null, true);
            const useropTrx1 = this.sendUserOperation(setExecutionCallData);
            const useropTrx2 = this.sendUserOperation(setExecutionCallData2, null, true);
            const [useropTrxRes1, useropTrxRes2] = await Promise.all([useropTrx1, useropTrx2]);

            console.log("useropTrx",useropTrxRes1.userOperationHash, useropTrxRes2.userOperationHash);
            return {useropTrx1, useropTrx2};
        } catch (error) {
            console.log("attachSubExecutorToSmartWallet:error", error);
            throw new Error("attachSubExecutorToSmartWallet:",error);
        }
    };

    async createSubscription(amount: string, interval: number,validUntil: number, erc20TokenAddress: Address){
       try {
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const callData = encodeFunctionData({
                abi: SubExecutor__factory.abi,
                functionName: "createSubscription",
                args: [this.initiatorAddress as `0x${string}`, BigInt(amount), BigInt(interval), BigInt(validUntil), erc20TokenAddress]
            });
            return await this.prepareAndSendUserOperation(callData);
            
       } catch (error) {
            throw new Error(`createSubscription:${error}`,);
       } 
    };

    async modifySubscription(amount: string, interval: number, validUntil: number, erc20TokenAddress: Address){
        try {
                const isAttached = await this.checkSubExecutorAttached();
                if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");

                const callData = encodeFunctionData({
                    abi: SubExecutor__factory.abi,
                    functionName: "modifySubscription",
                    args: [this.initiatorAddress as `0x${string}`, BigInt(amount), BigInt(interval), BigInt(validUntil), erc20TokenAddress]
                })
                return await this.prepareAndSendUserOperation(callData);
           } catch (error) {
                throw new Error(`modifySubscription:${error}`,);
           } 

    };
    async revokeSubscription(){
        try {
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const callData = encodeFunctionData({
                abi: SubExecutor__factory.abi,
                functionName: "revokeSubscription",
                args: [this.initiatorAddress as `0x${string}`,]
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
            const subExecutor = SubExecutor__factory.connect(this.smartAccountAddress, this.signer);
            const subscription = await subExecutor.getSubscription(initiator);
            console.log("subscription",subscription);
            return subscription;
       } catch (error) {
            throw new Error(`getSubscription:${error}`,);
       } 
    };

    async getPaymentHistory(initiator: Address){
        try {
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const subExecutor = SubExecutor__factory.connect(this.smartAccountAddress, this.signer);
            const payHistory = await subExecutor.getPaymentHistory(initiator);
            console.log("payHistory",payHistory);
            return payHistory;
       } catch (error) {
            throw new Error(`getPaymentHistory:${error}`,);
       } 
    };

    async getLastPaidTimestamp(initiator: Address){
        try {
            const isAttached = await this.checkSubExecutorAttached();
            if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
            const subExecutor = SubExecutor__factory.connect(this.smartAccountAddress, this.signer);
            const timestamp = await subExecutor.getLastPaidTimestamp(initiator);
            console.log("timestamp",timestamp);
            return timestamp;
       } catch (error) {
            throw new Error(`getLastPaidTimestamp:${error}`,);
       } 
    };


    async initiatePayment(){
        try {
             const isAttached = await this.checkSubExecutorAttached();
             if(!isAttached) throw new Error("Subscription executor not attached to smart wallet");
             const subscription =  await this.getSubscription(this.initiatorAddress as `0x${string}`);
             const erc20TokenAddress = subscription.erc20Token;
             const callData = encodeFunctionData({
                 abi: Initiator__factory.abi,
                 functionName: "initiatePayment",
                 args: [this.smartAccountAddress as `0x${string}`]
             })
             console.log("erc20TokenAddress",erc20TokenAddress,subscription);
            if(erc20TokenAddress=="0x0000000000000000000000000000000000000000"){
                const userOperation = await this.smartWallet.prepareTransaction(this.externalProvider, this.initiatorAddress, 0, this.options, callData);
                const userOperationHash = await this.sendUserOperation("0x", userOperation);
                return userOperationHash.userOperationHash;
            }
            else{
                const approveCallData = encodeFunctionData({
                    abi: erc20ABI,
                    functionName: "approve",
                    args: [this.smartAccountAddress,(subscription.amount).toString()]
                });
                const approveUserOp = await  this.smartWallet.prepareTransaction(this.externalProvider, erc20TokenAddress, 0, this.options, approveCallData);
                // const approveOpHash = await this.sendUserOperation("0x", approveUserOp);
                const userOperation = await this.smartWallet.prepareTransaction(this.externalProvider, this.initiatorAddress, 0, this.options, callData);
                // const payOpHash = await this.sendUserOperation("0x", userOperation,true);
                
                const useropTrx1 = this.sendUserOperation("0x", approveUserOp);
                const useropTrx2 = await this.sendUserOperation("0x", userOperation,true);
                const [useropTrxRes1, useropTrxRes2] = await Promise.all([useropTrx1, useropTrx2]);
                
                return {approveOpHash: useropTrxRes1.userOperationHash, payOpHash: useropTrxRes2.userOperationHash}
            }
           
        } catch (error) {
             throw new Error(`initiatePayment:${error}`,);
        } 
     };

}