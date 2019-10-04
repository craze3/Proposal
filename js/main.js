var contract = "0xb60FC2042B4B9c0843b3f4bC9544d67DAbb02a09"; // Ropsten: 0xc6feb5a4360744ca133bb841d165423aa495a76d";
let account;
let projectUrl;
var currentContract;

var abi = [ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "projectStarter", "type": "address" }, { "indexed": false, "internalType": "string", "name": "projectTitle", "type": "string" }, { "indexed": false, "internalType": "string", "name": "projectDesc", "type": "string" }, { "indexed": false, "internalType": "string", "name": "projectUrl", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "goalAmount", "type": "uint256" } ], "name": "PetitionStarted", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string", "name": "urlString", "type": "string" }, { "internalType": "uint256", "name": "amountToRaise", "type": "uint256" } ], "name": "startPetition", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "string", "name": "urlString", "type": "string" } ], "name": "getPetition", "outputs": [ { "internalType": "address payable", "name": "projectStarter", "type": "address" }, { "internalType": "string", "name": "projectTitle", "type": "string" }, { "internalType": "string", "name": "projectDesc", "type": "string" }, { "internalType": "address", "name": "projectContract", "type": "address" }, { "internalType": "uint256", "name": "created", "type": "uint256" }, { "internalType": "uint256", "name": "currentAmount", "type": "uint256" }, { "internalType": "uint256", "name": "goalAmount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "string", "name": "urlString", "type": "string" } ], "name": "getPetitionCreator", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "returnAllPetitions", "outputs": [ { "internalType": "contract Petition[]", "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

var abi2 = [ { "inputs": [ { "internalType": "address payable", "name": "projectStarter", "type": "address" }, { "internalType": "string", "name": "projectTitle", "type": "string" }, { "internalType": "string", "name": "projectDesc", "type": "string" }, { "internalType": "string", "name": "projectUrl", "type": "string" }, { "internalType": "uint256", "name": "goalAmount", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "recipient", "type": "address" } ], "name": "CreatorPaid", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "contributor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "currentTotal", "type": "uint256" } ], "name": "SigningReceived", "type": "event" }, { "constant": true, "inputs": [], "name": "amountGoal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "contributions", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "currentBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "description", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getDetails", "outputs": [ { "internalType": "address payable", "name": "projectStarter", "type": "address" }, { "internalType": "string", "name": "projectTitle", "type": "string" }, { "internalType": "string", "name": "projectDesc", "type": "string" }, { "internalType": "address", "name": "projectContract", "type": "address" }, { "internalType": "uint256", "name": "created", "type": "uint256" }, { "internalType": "uint256", "name": "currentAmount", "type": "uint256" }, { "internalType": "uint256", "name": "goalAmount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "signPetition", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "title", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "urlString", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

// --- INITIALIZE IPFS.JS ---
var ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', {protocol: 'https'});

function upload(title, slogan, description, url, goalAmount) {
    // Get selected image
    var file = document.getElementById('appimage').files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log("Got image contents: ", reader.result);
      var fileString = reader.result;

      // Create new app object to store metadata
      var newApp = {
        title: title,
        description: description,
        url: url,
        slogan: slogan,
        image: fileString,
      };

      // Upload app/metadata object to IPFS:
      console.log("Upload to IPFS: ", newApp, JSON.stringify(newApp));
      var metadata = JSON.stringify(newApp);

      const Buffer = window.IpfsApi().Buffer;
      var ifpsBuffer = Buffer.from(metadata);
      ipfs.add([ifpsBuffer], {pin:false})
        .then(response => {
          var hash = response[0].hash;
          if(hash) {
            console.log("Image + Metadata uploaded:" + hash);

            startPetition(title, hash, url, goalAmount);
          }
        });
    };
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function fetchIPFS(hash) {
  ipfs.get(hash, function (err, files) {
    files.forEach((file) => {
      //console.log(file.path)
      console.log(file.content.toString('utf8'))
    })
  });
}

// --- INITIALIZE WEB3.JS ---
async function connectAccount() {
  // Modern dapp browsers...
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          web3.eth.getAccounts(function(err, accounts){
            account = accounts[0];
            console.log("GOT ACCOUNT: ", account);
          });
      } catch (error) {
          // User denied account access...
      }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.getAccounts(function(err, accounts){
        account = accounts[0];
        console.log("GOT ACCOUNT: ", account);
      });
  }
  // Non-dapp browsers...
  else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask! Connecting to Infura...');
      window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/77264244428d46c7878f4d7773c85f78"));
  }
}

window.addEventListener('load', async () => {
    connectAccount();
      //contractInstance = new web3.eth.Contract(abi,'0x0ef28ba1d77a6613e196949853407ded602c1a7f'); // MAINNET
    contractInstance = new web3.eth.Contract(abi, contract); // ROPSTEN'
    console.log("Connected to " + contract + " on main net");

    // Get supplied Ethereum projectUrl from URL:
      if(window.location.hash && window.location.hash.length > 0) {
        var hash = window.location.hash.substr(1);
        projectUrl = hash;
      }
      else if(window.location.pathname.replace('/').length > 0) {
        projectUrl = window.location.pathname.replace('/', '');
      }
      if(projectUrl && projectUrl.length > 0)
      {
        getPetition(projectUrl);
      }
});

function getPetition(urlString) {
  if(urlString == '/create.html' || urlString == '/index.html' || urlString == '/explore.html' || urlString == '/') return false;
  contractInstance.methods.getPetition(urlString).call({from: account}, (error, result) => {
          console.log("Petition data from web3.js: ", result);

          if(result) {
          var today = new Date();
          //var cmas = new Date(result.deadline*1000);

          if (today.getMonth()==11 && today.getDate()>25)
          {
            //cmas.setFullYear(cmas.getFullYear()+1);
          }
          var one_day=1000*60*60*24;
          //var diff = Math.ceil((cmas.getTime()-today.getTime())/(one_day));

          document.getElementById('title-tag').innerHTML = result.projectTitle.replace(/<[^>]*>/g, '').substring(0, 69) + " | Proposal | Start your online petition";
          document.getElementById('title').innerHTML = result.projectTitle;
          document.getElementById('pledged').innerHTML = result.currentAmount;
          document.getElementById('funded').innerHTML = result.goalAmount;
          //document.getElementById('daysLeft').innerHTML = diff
          //document.getElementById('description').innerHTML = result.projectDesc; // TODO: parse
          //document.getElementById('slogan').innerHTML = result.projectDesc.replace(/<[^>]*>/g, '').substring(0, 69) + '...';

          ipfs.get(result.projectDesc, function (err, files) {
            files.forEach((file) => {
              var metadata = JSON.parse(file.content.toString('utf8'));
              console.log("Petition Description Metadata:", metadata);

              document.getElementById('description').innerHTML = metadata.description;
              document.getElementById('slogan').innerHTML = metadata.slogan;

              document.getElementById('imageembed').src = metadata.image;

            })
          });

          document.getElementById('author').innerHTML = "<a href='https://etherscan.io/address/"+result.projectStarter+"' target='_blank'>"+result.projectStarter.substring(0, 13)+"...</a>";

          currentContract = result.projectContract;

          //result.currentAmount = 7777;
          var percentage = Math.min(Math.round((result.currentAmount / result.goalAmount) * 100), 100);

          if(result.projectStarter == account) {
            document.getElementById('forOwner').style.display = 'block';
          } else {
            document.getElementById('forPublic').style.display = 'block';

            // Show reclaim button if it ended unsuccessfully
            if(parseInt(result.state) === 1) {
              document.getElementById('reclaim').style.display = 'block';
              document.getElementById('contribute').style.display = 'none';
            }
            if(parseInt(result.state) === 2) {
              document.getElementById('expired').style.display = 'block';
              document.getElementById('contribute').style.display = 'none';
              percentage = 100;
            }
          }

          document.getElementById('progress').style.width = percentage + '%';
          document.getElementById('percentage').innerHTML = percentage;

          var created = new Date(result.created * 1000);
          document.getElementById('created').innerHTML = (created.getMonth() + 1) + '/' + created.getDate() + '/' +  created.getFullYear();

          getContributions(currentContract);
        }
      });
}

function returnAllPetitions() {
  contractInstance.methods.returnAllPetitions().call({from: account}, (error, result) => {
          console.log("Data from web3.js: ", result);
      });
}

function startPetition(title, description, url, goalAmount) {
    contractInstance.methods.startPetition(title, description, url, goalAmount).send({from: account})
    .on('transactionHash', (hash) => {
        // Show loader
        document.getElementById('loader').style.display = 'block';
        alert('Successfully submitted! Please wait...');
    })
    .on('receipt', (receipt) => {
      console.log("Transaction completed ", receipt);
      alert('Petition created successfully! Now redirecting...')
      //window.location.replace("/"+url);
      window.location.replace("/details.html#"+url);
    })
    .on('confirmation', (confirmationNumber, receipt) => {
    })
    .on('error', console.error);
};

function submitForm() {
  // Disable Button Text
  document.getElementById('submit-button').disabled = true;
  document.getElementById('submit-button').innerHTML = 'Loading...';

  // Show loader
  document.getElementById('loader').style.display = 'block';

  // Fetch form data
  var title = document.getElementById('title').value;
  var slogan = document.getElementById('slogan').value;
  var description = quill.root.innerHTML;
  var url = document.getElementById('url').value;
  var goalAmount = document.getElementById('goalAmount').value;

  upload(title, slogan, description, url, goalAmount);
}


function signPetition(address) {
  let contractInstance2 = new web3.eth.Contract(abi2, address);
    contractInstance2.methods.signPetition().send({from: account})
    .on('transactionHash', (hash) => {
        alert('Successfully submitted! Please wait...');
    })
    .on('receipt', (receipt) => {
      console.log("Transaction confirmed!");
      alert('Your donation was sent! Now refreshing...');
      location.reload();
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      //
    })
    .on('error', console.error);
};

function getContributions(address) {
  let contractInstance3 = new web3.eth.Contract(abi2, address);
  var event = contractInstance3.getPastEvents('SigningReceived', {filter: {contributor: address}, fromBlock: 0, toBlock: 'latest'}, function(error, events){
   if (!error) {
     //console.log(events);
     console.log("Total Contributions = ", events.length);
     document.getElementById("contributorCount").innerHTML = events.length;
     events.forEach(function(item){
       console.log(item.returnValues.contributor + " - " + item.returnValues.amount);

       document.getElementById("conttable").innerHTML = document.getElementById("conttable").innerHTML + '<tr><td><a target="_blank" href="https://etherscan.io/address/'+item.returnValues.contributor+'">'+item.returnValues.contributor.substring(0, 9)+'...</td><td>'+web3.utils.fromWei(item.returnValues.amount, 'ether')+'</td></tr>';//(item.returnValues.contributor + " - " + item.returnValues.amount + "<br />");
     });
   }
    else console.log(error);
  });
}

function getRecentPetitions() {
  let contractInstance3 = new web3.eth.Contract(abi, contract);
  var event = contractInstance3.getPastEvents('PetitionStarted', {filter: {}, fromBlock: 0, toBlock: 'latest'}, function(error, petitions){
   if (!error) {
     console.log("Total Projects = ", petitions.length);
     var ogProjects = petitions;

     // Reverse array so the newest petitions are the top:
     petitions.reverse();
     // Limit to first 90 petitions:
     petitions.slice(0, 90);

     console.log(petitions);

     petitions.forEach(function(item){

       var result = item.returnValues;
       console.log(result);
       var today = new Date();
       //var cmas = new Date(result.deadline*1000);

       if (today.getMonth()==11 && today.getDate()>25)
       {
         //cmas.setFullYear(cmas.getFullYear()+1);
       }
       var one_day=1000*60*60*24;
       //var diff = Math.ceil((cmas.getTime()-today.getTime())/(one_day));
       var uUrl = result.projectUrl;
       var uTitle = result.projectTitle;
       var uAmountGoal = web3.utils.fromWei(result.goalAmount, 'ether')  + ' ETH';
       var uDaysLeft = 0; //diff

       ipfs.get(result.projectDesc, function (err, files) {
         files.forEach((file) => {
           var metadata = JSON.parse(file.content.toString('utf8'));
           console.log("Petition Description Metadata:", metadata);

           var uDescription = metadata.description;
           var uSlogan = metadata.slogan;
           var uImage = metadata.image; //.toString('utf8');

           // Insert new DOM element here:
document.getElementById('campaigns').innerHTML += '<a href="/details.html#'+uUrl+'" style=\'text-decoration: none\'><div class="pricing-table"> <div class="pricing-table-inner"> <img style="width: 100%; height: 200px; object-fit: cover; padding: 0" src="'+ uImage +'"> <div class="pricing-table-main"> <div class="pricing-table-header is-revealing" style="visibility: visible;"> <!--<div class="pricing-table-title mt-12 mb-8">Productivity</div>--> <div class="pricing-table-title2 mt-12 mb-8">'+uTitle+'</div> <div class="pricing-table-title3">'+uSlogan+'</div> <!--<div class="pricing-table-price mb-32 pb-24"><span class="pricing-table-price-currency h4">$</span><span class="pricing-table-price-amount h2">27</span>/mo</div>--> </div> <ul class="list-unstyled d-flex justify-content-between mb-3 text-center small" style="list-style: none; padding-left: 0px;"> <!--<li class="pledged"> <p class="mb-1 font-weight-bold text-dark">Pledged</p> <span class="amount">$87,000</span> </li>--> <li class="funded"> <p class="mb-1 font-weight-bold text-dark">Goal</p> <span class="amount">' + uAmountGoal + '</span> </li> <li class="days"> <p class="mb-1 font-weight-bold text-dark">Days Left</p> <span class="amount">' + uDaysLeft +'</span> </li> </ul> <!--<div class="w3-light-grey w3-round"> <div class="w3-container w3-round w3-green" style="width:63%">63%</div> </div>--> </div> </div> </div></a>';
         })
       });

       //document.getElementById('author').innerHTML = "<a href='https://etherscan.io/address/"+result.projectStarter+"' target='_blank'>"+result.projectStarter.substring(0, 13)+"...</a>";
       //currentContract = result.projectContract;

       var percentage = Math.min(Math.round((result.currentAmount / result.goalAmount) * 100), 100);

       document.getElementById('progress').style.width = percentage + '%';
       document.getElementById('percentage').innerHTML = percentage;

       var created = new Date(result.created * 1000);
       document.getElementById('created').innerHTML = (created.getMonth() + 1) + '/' + created.getDate() + '/' +  created.getFullYear();

     });
   }
    else console.log(error);
  });
}
