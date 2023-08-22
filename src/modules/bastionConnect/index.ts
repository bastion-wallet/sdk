import { Deferrable } from "ethers/lib/utils";
import { Provider, TransactionRequest, TransactionResponse, JsonRpcProvider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";
import { SmartWallet } from "../smart-wallet";
import { transactionRouting, batchTransactionRouting, getTransactionHash } from "../../helpers/signerHelper";
import { checkChainCompatibility } from "../../helper";

export interface BastionSignerOptions {
	privateKey: string;
	rpcUrl: string;
	chainId: number;
	apiKey: string;
	gasToken?: string;
	noSponsorship?: boolean;
}

export interface BasicTransaction {
	to: string;
	value?: number;
	data?: string;
}

export class BastionConnect extends Signer {
	signer: Signer;
	address: string;
	externalProvider: JsonRpcProvider;
	options: BastionSignerOptions;
	smartWalletInstance: SmartWallet;

	async init(externalProvider: JsonRpcProvider, options?: BastionSignerOptions) {
		this.smartWalletInstance = new SmartWallet();
		this.externalProvider = externalProvider;
		this.options = options || {
			privateKey: "",
			rpcUrl: "",
			chainId: 0,
			apiKey: "",
		};
		const chainId = options?.chainId || (await externalProvider.getNetwork()).chainId;

		//Check whether the SDK supports this chain
		await checkChainCompatibility(chainId);
	}

	constructor() {
		super();
	}

	async getAddress(): Promise<string> {
		const { smartAccountAddress } = await this.smartWalletInstance.initParams(this.externalProvider, this.options);
		return smartAccountAddress;
	}

	async signMessage(message: string | ethers.utils.Bytes): Promise<string> {
		return this.signer.signMessage(message);
	}

	async getSigner(): Promise<Signer> {
		return this.signer;
	}

	async getTransactionCount(block?: string | number): Promise<number> {
		return this.signer.getTransactionCount(block);
	}

	async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
		return transactionRouting(this.externalProvider, transaction, this.options);
	}

	async executeBatch(transactions: BasicTransaction[]): Promise<TransactionResponse> {
		return batchTransactionRouting(this.externalProvider, transactions, this.options);
	}

	async signTransaction(transaction: Deferrable<ethers.providers.TransactionRequest>): Promise<string> {
		throw new Error("signTransaction Method not implemented.");
	}

	async getTransactionHash(userOpHash: string): Promise<string> {
		return getTransactionHash(this.externalProvider, userOpHash, this.options);
	}

	connect(provider: Provider): ethers.Signer {
		throw new Error("Method not implemented.");
	}
}

