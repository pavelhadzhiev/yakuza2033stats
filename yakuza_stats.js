const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const fs = require('fs');

const chain = EvmChain.ARBITRUM;
const dividoooor = 1000000000000000000;
const moralisApiKeyFilename = 'moralis_api_key';
const telegramApiKeyFilename = 'telegram_api_key';

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
  const drivers_token_id = "3";
  const strippers_token_id = "4";
  const lawyers_token_id = "5";

  // Shards and tickets contract address & token iDs
  const shards_and_tickets_contract = "0xAb21F4b5CD58b2bE6Da5025eD48064dA8B9685AF";
  const shards_token_id = "0";
  const tickets_token_id = "1";

  // Geishas contract address
  const geishas_contract = "0x6d432148a7b2396f260c702d1F4a018A8F85c456";

  // Weapons contract address
  const weapons_contract = "0x55B749f69285B8950893EfC046Ff60f1E3B42511";

  // Dice table contract addresses
  const whale_table_address = "0x549Db17d7720B11E8A5Dd6AFfE013A8399c22f16";
  const barracuda_table_address = "0x775B28CD226D14D8dC6951052Ec3a243A0f6284E";
  const minnow_table_address = "0x2DE078b86d0931C07b3E7f40E4128523e1C9A8dc";
  const burn_address_dice = "0x0000000000000000000000000000000000000000";

  // Socials
  const telegram_chat_id = "@yakuza2033"

  const bugs_total_supply = await getTotalSupplyOfERC20(bugs_contract)
  const bugs_burnt_by_operatives = await getERC20BalanceOfAddress(bugs_contract, burn_address_operatives)
  console.log("\nToken & NFT Supply Data\n")
  console.log("BUGS: " + (bugs_total_supply - bugs_burnt_by_operatives))

  // Count all operatives
  const operatives = await getNFTsInContract(operatives_contract)
  const henchmen_supply = getSupplyOfNFTsWithTokenID(operatives, henchmen_token_id)
  const prostitutes_supply = getSupplyOfNFTsWithTokenID(operatives, prostitutes_token_id)
  const officials_supply = getSupplyOfNFTsWithTokenID(operatives, officials_token_id)
  const drivers_supply = getSupplyOfNFTsWithTokenID(operatives, drivers_token_id)
  const strippers_supply = getSupplyOfNFTsWithTokenID(operatives, strippers_token_id)
  const lawyers_supply = getSupplyOfNFTsWithTokenID(operatives, lawyers_token_id)
  const big_ops_supply = henchmen_supply + prostitutes_supply + officials_supply
  const mini_ops_supply = drivers_supply + strippers_supply + lawyers_supply
  console.log("Operatives: " + big_ops_supply + " (big) + " + mini_ops_supply + " (mini)")
  console.log("  Henchmen: " + henchmen_supply)
  console.log("  Prostitutes: " + prostitutes_supply)
  console.log("  Officials: " + officials_supply)
  console.log("  Drivers: " + drivers_supply)
  console.log("  Strippers: " + strippers_supply)
  console.log("  Lawyers: " + lawyers_supply)
  console.log("  BUGS minted daily: " + (henchmen_supply * 4 + prostitutes_supply * 12 + officials_supply * 8 + drivers_supply * 0.04 + strippers_supply * 0.12 + lawyers_supply * 0.08))

  // Count shards and tickets
  const shards_and_tickets = await getNFTsInContract(shards_and_tickets_contract)
  console.log("Tickets: " + getSupplyOfNFTsWithTokenID(shards_and_tickets, tickets_token_id))
  console.log("Shards: " + getSupplyOfNFTsWithTokenID(shards_and_tickets, shards_token_id))

  // Count all geishas
  const geishas = await getNFTsInContract(geishas_contract)
  console.log("Geishas: " + getSupplyOfNFTs(geishas))

  // Count all weapons
  const weapons = await getNFTsInContract(weapons_contract)
  console.log("Weapons: " + getSupplyOfNFTs(weapons))

  // Count ticket holders
  console.log("\nHolder Data\n")
  console.log("Ticket holders: " + await getNFTHoldersCountForWithTokenID(shards_and_tickets_contract, tickets_token_id))

  console.log("\nBUGS Burnt from minting & gambling\n")

  const operatives_burn_amount = henchmen_supply * 1000 + prostitutes_supply * 1500 + officials_supply * 1250 + drivers_supply * 10 + strippers_supply * 15 + lawyers_supply * 12.5
  const weapons_burn_amount = await getBurnAmountOfWeapons(weapons);
  const whale_burn_amount = await getTotalAmountSentToAddress(whale_table_address, burn_address_dice)
  const barracuda_burn_amount = await getTotalAmountSentToAddress(barracuda_table_address, burn_address_dice)
  const minnow_burn_amount = await getTotalAmountSentToAddress(minnow_table_address, burn_address_dice)

  console.log("Operatives: " +  operatives_burn_amount)
  console.log("Weapons: " +  weapons_burn_amount)
  console.log("Dice: " + (whale_burn_amount + barracuda_burn_amount + minnow_burn_amount))
  console.log("  Whale table: " + whale_burn_amount)
  console.log("  Barracuda table: " + barracuda_burn_amount)
  console.log("  Minnow table: " + minnow_burn_amount)




  console.log("\nSocials\n")
  await getTelegramMembers(telegram_chat_id)
}
runApp();

async function startMoralis(apiKeyFilename) {
  await Moralis.start({
    apiKey: getApiKey(apiKeyFilename)
  });
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

function getSupplyOfNFTs(contractNFTs) {
  let all_nfts_in_contract = 0;
  for (const nft of contractNFTs.result) {
    all_nfts_in_contract += Number.parseInt(nft.amount)
  }
  return all_nfts_in_contract;
}

function getBurnAmountOfWeapons(contract) {
  let total_burnt = 0;
  for (const nft of contract.result) {
    switch (nft.tokenId) {
      case '0':
        total_burnt += nft.amount * 100;
        break;
      case '1':
        total_burnt += nft.amount * 225;
        break;
      case '2':
        total_burnt += nft.amount * 500;
        break;
      case '3':
        total_burnt += nft.amount * 750;
        break;
      case '4':
        total_burnt += nft.amount * 1000;
        break;
      case '5':
        total_burnt += nft.amount * 1500;
        break;
      case '6':
        total_burnt += nft.amount * 2250;
        break;
      case '7':
        total_burnt += nft.amount * 2500;
        break;
      case '8':
        total_burnt += nft.amount * 4000;
        break;
      case '9':
        total_burnt += nft.amount * 6000;
        break;
      case '10':
        total_burnt += nft.amount * 10000;
        break;
      case '11':
        total_burnt += nft.amount * 15000;
        break;
      default:
        console.log(`ERROR: Unidenified weapon with ID ${expr}.`);
    }

  }
  return total_burnt;
}

function getSupplyOfNFTsWithTokenID(contractNFTs, tokenId) {
  for (const nft of contractNFTs.result) {
    if (nft.tokenId == tokenId) {
      return Number.parseInt(nft.amount);
    }
  }
  return 0;
}

async function getNFTHoldersCountForWithTokenID(address, tokenId) {
  const contract_holders = await Moralis.EvmApi.nft.getNFTOwners({
    address,
    chain,
  });

  let nft_holders = 0;
  for (const holder of contract_holders.result) {
    if (holder.tokenId == tokenId) {
      nft_holders++;
    }
  }

  return nft_holders
}

async function getTotalAmountSentToAddress(fromAddress, toAddress) {
  const limit = 100;
  let cursor = null;
  let total_amount = 0;

  do {
    const transfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address: fromAddress,
      chain,
      limit,
      cursor,
    });

    for (const transfer of transfers.result) {
      if (transfer.toAddress.lowercase == toAddress) {
        total_amount += Number.parseInt(transfer.value);
      }
    }

    cursor = transfers.pagination.cursor;
  } while (cursor != '' && cursor != null);
  return Number.parseInt(total_amount / dividoooor)
}

async function getTelegramMembers(chat_name) {
  fetch("https://api.telegram.org/bot" + getApiKey(telegramApiKeyFilename) + "/getChatMemberCount?chat_id=" + chat_name)
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log("Telegram members: " + data.result)
    }).catch(function (err) {
      console.log('Fetch Error (Telegram):-S', err);
    });
}

function getApiKey(filename) {
  try {
    return fs.readFileSync(filename, 'utf8').toString()
  } catch (err) {
    console.error(err);
  }
}