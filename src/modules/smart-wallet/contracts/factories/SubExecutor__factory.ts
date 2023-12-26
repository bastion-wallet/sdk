/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { SubExecutor, SubExecutorInterface } from "../SubExecutor";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "paymentProcessed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "preApproval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
    ],
    name: "revokedApproval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "subscriptionCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_paymentLimit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_erc20Token",
        type: "address",
      },
    ],
    name: "createSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
    ],
    name: "getLastPaidTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
    ],
    name: "getPaymentHistory",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "subscriber",
            type: "address",
          },
        ],
        internalType: "struct PaymentRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
    ],
    name: "getSubscription",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "validUntil",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "validAfter",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymentInterval",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "paymentLimit",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "subscriber",
            type: "address",
          },
          {
            internalType: "address",
            name: "initiator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "erc20TokensValid",
            type: "bool",
          },
          {
            internalType: "address",
            name: "erc20Token",
            type: "address",
          },
        ],
        internalType: "struct SubStorage",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_paymentLimit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_erc20Token",
        type: "address",
      },
    ],
    name: "modifySubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "processPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initiator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
    ],
    name: "revokeSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "updateAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "withdrawERC20Tokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060016000556113c2806100256000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063a706dce811610066578063a706dce8146100fe578063b5792d741461011f578063b77b3af014610132578063c8be77a114610145578063f15881b51461015857600080fd5b80630cbebc241461009857806322081c12146100c15780634ff7ff32146100cb5780637da2ba7c146100de575b600080fd5b6100ab6100a636600461112e565b61016b565b6040516100b89190611150565b60405180910390f35b6100c9610273565b005b6100c96100d936600461112e565b610533565b6100f16100ec36600461112e565b61061b565b6040516100b891906111d3565b61011161010c36600461112e565b6106be565b6040519081526020016100b8565b6100c961012d366004611235565b610737565b6100c9610140366004611285565b610967565b6100c96101533660046112b8565b610b75565b6100c9610166366004611235565b610bf5565b6101d7604051806101200160405280600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160001515815260200160006001600160a01b031681525090565b60006101e1610e1a565b6001600160a01b03938416600090815260209182526040908190208151610120810183528154815260018201549381019390935260028101549183019190915260038101546060830152600481015460808301526005810154851660a0830152600681015480861660c0840152600160a01b900460ff16151560e0830152600701549093166101008401525090919050565b61027b610e4e565b6000610285610ea7565b90506000610291610ed5565b905081600201544210156102ec5760405162461bcd60e51b815260206004820152601a60248201527f537562736372697074696f6e206e6f74207965742076616c696400000000000060448201526064015b60405180910390fd5b81600101544211156103375760405162461bcd60e51b815260206004820152601460248201527314dd589cd8dc9a5c1d1a5bdb88195e1c1a5c995960621b60448201526064016102e3565b60068201546001600160a01b031633146103a45760405162461bcd60e51b815260206004820152602860248201527f4f6e6c792074686520696e69746961746f722063616e20696e697469617465206044820152677061796d656e747360c01b60648201526084016102e3565b336000908152602082905260408120805490919082906103c6906001906112e7565b815481106103d6576103d66112fa565b600091825260209091208354600390920201915015806104095750836003015481600101546104059190611310565b4210155b6104555760405162461bcd60e51b815260206004820181905260248201527f5061796d656e7420696e74657276616c206e6f7420796574207265616368656460448201526064016102e3565b604080516060810182528554815242602080830191825260058801546001600160a01b03908116948401948552865460018082018955600089815293909320945160039091029094019384559151908301559151600290910180546001600160a01b031916919092161790556006840154600160a01b900460ff16156104e3576104de84610f03565b6104ec565b6104ec84611052565b835460405190815233907f92f1df771c7cec67bc0415d3aa1069800df41023a71c65cf6e336b4ce75859b59060200160405180910390a2505050506105316001600055565b565b6040516370a0823160e01b8152336004820181905282916001600160a01b0383169163a9059cbb9183906370a0823190602401602060405180830381865afa158015610583573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105a79190611323565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af11580156105f2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610616919061133c565b505050565b60606000610627610ed5565b6001600160a01b038416600090815260208281526040808320805482518185028101850190935280835294955090939092909184015b828210156106b2576000848152602090819020604080516060810182526003860290920180548352600180820154848601526002909101546001600160a01b031691830191909152908352909201910161065d565b50505050915050919050565b6000806106c9610ed5565b6001600160a01b038416600090815260208290526040812080549293509190036106f7575060009392505050565b8054600090829061070a906001906112e7565b8154811061071a5761071a6112fa565b600091825260209091206001600390920201015495945050505050565b60006107416110e4565b60010154600160501b90046001600160a01b03169050735ff137d4b0fdcd49dca30c7cf57e578a026d27893381148061077957503330145b8061078c5750336001600160a01b038316145b6107a85760405162461bcd60e51b81526004016102e39061135e565b60006107b2610e1a565b6001600160a01b03808a166000818152602084905260409020600681015493945092909116146108245760405162461bcd60e51b815260206004820152601b60248201527f537562736372697074696f6e20646f6573206e6f74206578697374000000000060448201526064016102e3565b878155610835426301e13380611310565b600182015542600282015561084d87620151806113ab565b6003820155600481018690556007810180546001600160a01b0319166001600160a01b03871690811790915515610885576001610888565b60005b600682018054911515600160a01b0260ff60a01b1990921691909117905560405163b7b60fa160e01b8152306004820152602481018990526044810188905260648101899052600060848201526001600160a01b038a169063b7b60fa19060a4015b600060405180830381600087803b15801561090457600080fd5b505af1158015610918573d6000803e3d6000fd5b50506040518a81526001600160a01b038c1692503391507fd4875bb105139b0ff13be26d89def72815fd7bbc4b160befe928ba20002c7e819060200160405180910390a3505050505050505050565b60006109716110e4565b60010154600160501b90046001600160a01b03169050735ff137d4b0fdcd49dca30c7cf57e578a026d2789338114806109a957503330145b806109bc5750336001600160a01b038316145b6109d85760405162461bcd60e51b81526004016102e39061135e565b60008411610a285760405162461bcd60e51b815260206004820152601860248201527f537562736372697074696f6e20616d6f756e742069732030000000000000000060448201526064016102e3565b60008311610a705760405162461bcd60e51b815260206004820152601560248201527405061796d656e7420696e74657276616c206973203605c1b60448201526064016102e3565b6000610a7a610e1a565b6001600160a01b0387166000818152602083905260408082208281556001810183905560028101839055600381018390556004808201939093556005810180546001600160a01b03199081169091556006820180546001600160a81b031916905560079091018054909116905551630ba40a5560e31b8152309181019190915291925090635d2052a890602401600060405180830381600087803b158015610b2157600080fd5b505af1158015610b35573d6000803e3d6000fd5b50506040516001600160a01b03891692507f4a3e3a1f556c9d67f650b891dac6cbbbc3654e472fb4c2b049a15f8cbf21493a9150600090a2505050505050565b6000610b7f610ea7565b60068101549091506001600160a01b03163314610bf25760405162461bcd60e51b815260206004820152602b60248201527f4f6e6c792074686520696e69746961746f722063616e2075706461746520746860448201526a6520616c6c6f77616e636560a81b60648201526084016102e3565b55565b6000610bff6110e4565b60010154600160501b90046001600160a01b03169050735ff137d4b0fdcd49dca30c7cf57e578a026d278933811480610c3757503330145b80610c4a5750336001600160a01b038316145b610c665760405162461bcd60e51b81526004016102e39061135e565b6000610c70610ea7565b8781559050610c83426301e13380611310565b60018201554260028201556005810180546001600160a01b03191630179055610caf86620151806113ab565b6003820155600481018590556006810180546001600160a01b03808b166001600160a01b031992831617909255600783018054928716929091168217905515610cf9576001610cfc565b60005b600682018054911515600160a01b0260ff60a01b199092169190911790556000610d24610e1a565b6001600160a01b038a811660008181526020849052604080822087548155600180890154908201556002808901549082015560038089015490820155600480890154818301556005808a015490830180549188166001600160a01b03199283161790556006808b0180549185018054928a168385168117825591546001600160a81b0319909316909117600160a01b9283900460ff1615159092029190911790556007808b015493018054939097169216919091179094555163b7b60fa160e01b81523093810193909352602483018c9052604483018b9052606483018c9052608483015291925063b7b60fa19060a4016108ea565b600080610e4860017f19409f62ba10999e0c9d93140a1dfee985d0ccdbd3a0d134fa82fad3d7ad53b86112e7565b92915050565b600260005403610ea05760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016102e3565b6002600055565b600080610e4860017fcd55805a4b3624f6a2fd5537ced63a2630c1f7c077a799aa5c5ef73d4954f0556112e7565b600080610e4860017ffdbfa4bb31dfc8c596223becafcfe3c706a88761f128f2e9aacae1c4eb06bf9b6112e7565b60078101546040516370a0823160e01b81523060048201526001600160a01b039091169060009082906370a0823190602401602060405180830381865afa158015610f52573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f769190611323565b8354909150811015610fca5760405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e7420746f6b656e2062616c616e636500000000000060448201526064016102e3565b600583015483546040516323b872dd60e01b81523360048201526001600160a01b0392831660248201526044810191909152908316906323b872dd906064016020604051808303816000875af1158015611028573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104c919061133c565b50505050565b80544710156110a35760405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e742045746865722062616c616e636500000000000060448201526064016102e3565b600581015481546040516001600160a01b039092169181156108fc0291906000818181858888f193505050501580156110e0573d6000803e3d6000fd5b5050565b600080610e4860017f439ffe7df606b78489639bc0b827913bd09e1246fa6802968a5b3694c53e0dd96112e7565b80356001600160a01b038116811461112957600080fd5b919050565b60006020828403121561114057600080fd5b61114982611112565b9392505050565b600061012082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015260a083015160018060a01b0380821660a08501528060c08601511660c0850152505060e08301516111ba60e084018215159052565b50610100928301516001600160a01b0316919092015290565b602080825282518282018190526000919060409081850190868401855b828110156112285781518051855286810151878601528501516001600160a01b031685850152606090930192908501906001016111f0565b5091979650505050505050565b600080600080600060a0868803121561124d57600080fd5b61125686611112565b945060208601359350604086013592506060860135915061127960808701611112565b90509295509295909350565b60008060006060848603121561129a57600080fd5b6112a384611112565b95602085013595506040909401359392505050565b6000602082840312156112ca57600080fd5b5035919050565b634e487b7160e01b600052601160045260246000fd5b81810381811115610e4857610e486112d1565b634e487b7160e01b600052603260045260246000fd5b80820180821115610e4857610e486112d1565b60006020828403121561133557600080fd5b5051919050565b60006020828403121561134e57600080fd5b8151801515811461114957600080fd5b6020808252602d908201527f6163636f756e743a206e6f742066726f6d20656e747279706f696e74206f722060408201526c37bbb732b91037b91039b2b63360991b606082015260800190565b8082028115828204841417610e4857610e486112d156";

type SubExecutorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SubExecutorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SubExecutor__factory extends ContractFactory {
  constructor(...args: SubExecutorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SubExecutor> {
    return super.deploy(overrides || {}) as Promise<SubExecutor>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SubExecutor {
    return super.attach(address) as SubExecutor;
  }
  override connect(signer: Signer): SubExecutor__factory {
    return super.connect(signer) as SubExecutor__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SubExecutorInterface {
    return new utils.Interface(_abi) as SubExecutorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SubExecutor {
    return new Contract(address, _abi, signerOrProvider) as SubExecutor;
  }
}
