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

const address = '0xcae4911fe80cD787bcDc08e29b0B1bED69B27099';
let auction = null;

async function getAccess() {
  if (auction) return;
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  auction = new ethers.Contract(address, abi, signer);
}
async function bid() {
  await getAccess();
  let mybid = document.getElementById('value').value;
  mybidContract = ethers.BigNumber.from(mybid);
  await auction.bid(mybidContract).then((error, res) => {
    if (error) {
      console.log('error here ' + error);
      document.getElementById('biding_status').innerHTML =
        'Think to bidding higher';
    } else {
      document.getElementById('biding_status').innerHTML =
        'Successfull bid, transaction ID' + result;
    }
  });
}

async function init() {
  auction.auction_end(function (error, result) {
    document.getElementById('auction_end').innerHTML = result;
  });
  auction.highestBidder(function (error, result) {
    document.getElementById('HighestBidder').innerHTML = result;
  });
  auction.highestBid(function (error, result) {
    var bidEther = web3.fromWei(result, 'ether');
    document.getElementById('HighestBid').innerHTML = bidEther;
  });
  auction.STATE(function (error, result) {
    document.getElementById('STATE').innerHTML = result;
  });
  auction.Mycar(function (error, result) {
    document.getElementById('car_brand').innerHTML = result[0];
    document.getElementById('registration_number').innerHTML = result[1];
  });
  auction.bids(bidder, function (error, result) {
    var bidEther = web3.fromWei(result, 'ether');
    document.getElementById('MyBid').innerHTML = bidEther;
    console.log(bidder);
  });
}

var auction_owner = null;
auction.get_owner(function (error, result) {
  if (!error) {
    auction_owner = result;
    if (bidder != auction_owner) {
      $('#auction_owner_operations').hide();
    }
  }
});

function cancel_auction() {
  auction.cancel_auction(function (error, result) {
    console.log(result);
  });
}

function Destruct_auction() {
  auction.destruct_auction(function (error, result) {
    console.log(result);
  });
}

var BidEvent = auction.BidEvent();
BidEvent.watch(function (error, result) {
  if (!error) {
    $('#eventslog').html(
      result.args.highestBidder +
        ' has bidden(' +
        result.args.highestBid +
        ' wei)'
    );
  } else {
    console.log(error);
  }
});

var CanceledEvent = auction.CanceledEvent();
CanceledEvent.watch(function (error, result) {
  if (!error) {
    $('#eventslog').html(result.args.message + ' at ' + result.args.time);
  }
});

const filter = web3.eth.filter({
  fromBlock: 0,
  toBlock: 'latest',
  address: contractAddress,
  topics: [web3.sha3('BidEvent(address,uint256)')],
});

filter.get((error, result) => {
  if (!error) console.log(result);
});
