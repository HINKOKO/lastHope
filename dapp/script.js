const provider = new ethers.providers.Web3Provider(window.ethereum);
const abi = [
  'constructor(uint256 _biddingTime, address _owner, string _brand, string _Rnumber)',
  'event BidEvent(address indexed highestBidder, uint256 highestBid)',
  'event CanceledEvent(string message, uint256 time)',
  'event WithdrawalEvent(address withdrawer, uint256 amount)',
  'function Mycar() view returns (string Brand, string Rnumber)',
  'function STATE() view returns (uint8)',
  'function auction_end() view returns (uint256)',
  'function auction_start() view returns (uint256)',
  'function bid(uint256 _bid) payable returns (bool)',
  'function bids(address) view returns (uint256)',
  'function cancel_auction() returns (bool)',
  'function destruct_auction() returns (bool)',
  'function get_owner() view returns (address)',
  'function highestBid() view returns (uint256)',
  'function highestBidder() view returns (address)',
  'function withdraw() returns (bool)',
];

const address = '0xc644dCfd21551d3392AC92B0046b750C6DCAC5fA';
let contract = null;

async function init() {
  if (contract) return;
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  contract = new ethers.Contract(address, abi, signer);
}

async function bid(val) {
  await init();
  var mybid = document.getElementById('value').value;
  await contract.bid(
    {
      value: mybid,
    },
    function (err, result) {
      if (err) {
        console.log('error is ' + err);
        document.getElementById('biding_status').innerHTML =
          'Think to pull out Biftons!';
      } else {
        document.getElementById('biding_status').innerHTML =
          'Successfull bid, transaction ID pour les impots: ' + result;
      }
    }
  );
}
