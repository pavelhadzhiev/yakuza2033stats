const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const fs = require('fs');

const chain = EvmChain.ARBITRUM;
const dividoooor = 1000000000000000000;
const moralisApiKeyFilename = 'moralis_api_key';

const runApp = async () => {
  await startMoralis(moralisApiKeyFilename)

  console.log("\nProtocol stats for Yakuza2033");
  console.log("_____________________________");

  // BUGS addresses & divider const
  const bugs_contract = "0x3350748459411D148e9C9e2Cb3Dcb3B4BDC509cB";
  const burn_address_operatives = "0x000000000000000000000000000000000000dead";

  // Operatives contract address & token iDs
  const operatives_contract = "0xa23a82373749B84390dEf88963634d13e643B1dd";
  const henchmen_token_id = "0";
  const prostitutes_token_id = "1";
  const officials_token_id = "2";

  // Shards and tickets contract address & token iDs
  const shards_and_tickets_contract = "0xAb21F4b5CD58b2bE6Da5025eD48064dA8B9685AF";
  const shards_token_id = "0";
  const tickets_token_id = "1";

  // Geishas contract address
  const geishas_contract = "0x6d432148a7b2396f260c702d1F4a018A8F85c456";

  // Dice table contract addresses
  const whale_table_address = "0x549Db17d7720B11E8A5Dd6AFfE013A8399c22f16";
  const barracuda_table_address = "0x775B28CD226D14D8dC6951052Ec3a243A0f6284E";
  const minnow_table_address = "0x2DE078b86d0931C07b3E7f40E4128523e1C9A8dc";
  const burn_address_dice = "0x0000000000000000000000000000000000000000";

  const bugs_total_supply = await getTotalSupplyOfERC20(bugs_contract);
  const bugs_burnt_by_operatives = await getERC20BalanceOfAddress(bugs_contract, burn_address_operatives);
  console.log("\nToken & NFT Supply Data\n")
  console.log("BUGS: " + (bugs_total_supply - bugs_burnt_by_operatives))

  // Count all operatives
  const operatives = await getNFTsInContract(operatives_contract)
  console.log("Henchmen: " + parseSupplyOfNFT(operatives, henchmen_token_id));
  console.log("Prostitutes: " + parseSupplyOfNFT(operatives, prostitutes_token_id));
  console.log("Officials: " + parseSupplyOfNFT(operatives, officials_token_id));

  // Count shards and tickets
  const shards_and_tickets = await getNFTsInContract(shards_and_tickets_contract)
  console.log("Tickets: " + parseSupplyOfNFT(shards_and_tickets, tickets_token_id));
  console.log("Shards: " + parseSupplyOfNFT(shards_and_tickets, shards_token_id));

  // Count all geishas
  const geishas = await getNFTsInContract(geishas_contract)
  console.log("Geishas: " + parseSupplyOfAllNFTs(geishas));

  // Count ticket holders
  console.log("\nHolder Data\n")
  console.log("Ticket holders: " + await getNFTHoldersCount(shards_and_tickets_contract, tickets_token_id));

  const whale_burn_amount = await getTotalAmountSentToAddress(whale_table_address, burn_address_dice);
  const barracuda_burn_amount = await getTotalAmountSentToAddress(barracuda_table_address, burn_address_dice);
  const minnow_burn_amount = await getTotalAmountSentToAddress(minnow_table_address, burn_address_dice);

  console.log("\nBUGS Burnt from Dice\n");
  console.log("Whale table: " + whale_burn_amount)
  console.log("Barracuda table: " + barracuda_burn_amount)
  console.log("Minnow table: " + minnow_burn_amount)
  console.log("Total burnt: " + (whale_burn_amount + barracuda_burn_amount + minnow_burn_amount));
}
runApp();

async function startMoralis(apiKeyFilename) {
  try {
    await Moralis.start({
      apiKey: fs.readFileSync('moralis_api_key', 'utf8').toString(),
    });
  } catch (err) {
    console.error(err);
  }
}

async function getTotalSupplyOfERC20(address) {
  const total_supply_json = await Moralis.EvmApi.utils.runContractFunction({
    address,
    functionName: 'totalSupply',
    abi: [
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    chain,
  });

  return Number.parseInt(total_supply_json.toJSON() / dividoooor)
}

async function getERC20BalanceOfAddress(tokenAddress, balanceAddress) {
  const balance = await Moralis.EvmApi.utils.runContractFunction({
    address: tokenAddress,
    functionName: 'balanceOf',
    abi: [
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "balanceOf",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    chain,
    params: {
      account: balanceAddress
    },
  });

  return Number.parseInt(balance.toJSON() / dividoooor)
}

async function getNFTsInContract(address) {
  return await Moralis.EvmApi.nft.getContractNFTs({
    address,
    chain,
  });
}

function parseSupplyOfNFT(contractNFTs, tokenId) {
  let i = 0;
  while (i < contractNFTs.result.length) {
    if (contractNFTs.result[i].tokenId == tokenId) {
      return Number.parseInt(contractNFTs.result[i].amount);
    }
    i++;
  }
  return 0;
}

function parseSupplyOfAllNFTs(contractNFTs) {
  let i = 0;
  let all_nfts_in_contract = 0;
  while (i < contractNFTs.result.length) {
    all_nfts_in_contract += Number.parseInt(contractNFTs.result[i].amount)
    i++
  }
  return all_nfts_in_contract;
}

async function getNFTHoldersCount(address, tokenId) {
  const response = await Moralis.EvmApi.nft.getNFTOwners({
    address,
    chain,
  });

  let i = 0;
  let nft_holders = 0;
  while (i < response.result.length) {
    if (response.result[i].tokenId == tokenId) {
      nft_holders++;
    }
    i++;
  }
  return nft_holders
}

async function getTotalAmountSentToAddress(fromAddress, toAddress) {
  const all_transfers = await getWalletTransfers(fromAddress);

  let i = 0;
  let total_amount = 0;
  while (i < all_transfers.result.length) {
    if (all_transfers.result[i].toAddress.lowercase == toAddress) {
      total_amount += Number.parseInt(all_transfers.result[i].value);
    }
    i++;
  }

  return Number.parseInt(total_amount / dividoooor);
}

async function getWalletTransfers(address) {
  return await Moralis.EvmApi.token.getWalletTokenTransfers({
    address,
    chain,
  })
}