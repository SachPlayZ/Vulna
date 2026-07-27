const contractAddress = process.env.NEXT_PUBLIC_VULNA_V2_CONTRACT_ADDRESS?.trim() ?? '';

export const configuredVulnaV2ContractAddress = /^[0-9a-f]{64}$/i.test(contractAddress)
  ? contractAddress
  : '';
