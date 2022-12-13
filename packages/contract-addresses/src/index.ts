import {
  convertObjectAddressesToChecksummedAddresses,
  getChecksummedAddress,
  isValidNonICAPEthereumAddress,
} from "./addressUtils";
import * as deployedAddresses from "./deployed-addresses.json";

// Note: This is the base contract addresses but with libraries and tokens omitted. This is exposed via an endpoint
// by the rolla-yield-api. We can use Omit<ContractAddresses, "libraries", "tokens"> but that causes swagger UI to
// look really weird and expose all types so to avoid that we use this base type. The type lives here and
// not in the API as don't want redundancy since more addresses may be added which would require updates
// to both projects.
export interface ContractAddresses {
  CollateralToken: string;
  QuantProtocolMultisig: string;
  QuantWebMultisig: string;
  AssetsRegistry: string;
  OptionsFactory: string;
  PriceRegistry: string;
  OracleRegistry: string;
  ChainlinkOracleManager: string;
  ChainlinkFixedTimeOracleManager: string;
  QuantCalculator: string;
  Controller: string;
  RollaOrderProtocol: string;
  Whitelist: string;
  OperateProxy: string;
  RollaFaucet?: string;
  Multicall3?: string;
  TimelockController?: string;
  QToken?: string;
  startBlock: string;
}

/**
 * An extension of the contract addresses to include libraries and tokens
 */
export interface ContractAddressesExhaustive extends ContractAddresses {
  tokens: {
    [key: string]: string;
  };
}

const deploymentNameToAddresses: {
  [deploymentName: string]: ContractAddressesExhaustive;
} = deployedAddresses;

/**
 * Used to get addresses of contracts that have been deployed.
 * Throws if there are no known contracts deployed under that deployment name.
 * @param deploymentName The desired deployment to get addresses for. can refer to a network or
 * deployment name.
 * @returns The set of addresses for contracts which have been deployed under that deployment name.
 */
function getContractAddressesForDeploymentOrThrow(
  deploymentName: string
): ContractAddressesExhaustive {
  if (deploymentNameToAddresses[deploymentName] === undefined) {
    throw new Error(
      `Unknown network id (${deploymentName}). No known contracts have been deployed on this network.`
    );
  }

  // Ensure we are returning checksummed addresses
  return convertObjectAddressesToChecksummedAddresses(
    deploymentNameToAddresses[deploymentName]
  );
}

export {
  getContractAddressesForDeploymentOrThrow,
  convertObjectAddressesToChecksummedAddresses,
  isValidNonICAPEthereumAddress,
  getChecksummedAddress,
};
