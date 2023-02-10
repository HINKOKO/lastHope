const { ethers } = require('hardhat');
const fs = require('fs/promises');

async function main() {
  const MyAuction = await ethers.getContractFactory('MyAuction');
  const myauction = await MyAuction.deploy(
    9000000,
    '0x9166202FD48BAD039B2914B52D443E74Cc38Fa24',
    'BMW',
    'E28-1986'
  );
  await myauction.deployed();
  await writeDeployInfo(myauction);
  console.log('contract deployed to: ', myauction.address);
}

async function writeDeployInfo(contract) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile('deployment.json', content, { encoding: 'utf-8' });
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process;
    exit(1);
  });
