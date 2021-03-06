console.log("app.js has started!");

//Contract info
const DR_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "DR_Count",
        "type": "uint256"
      }
    ],
    "name": "LogAcceptance",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "DR_Count",
        "type": "uint256"
      }
    ],
    "name": "LogDeclination",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "DR_Count",
        "type": "uint256"
      }
    ],
    "name": "LogFixed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "DR_Count",
        "type": "uint256"
      }
    ],
    "name": "LogRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "DR_Count",
        "type": "uint256"
      }
    ],
    "name": "LogResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "DR_Count",
        "type": "uint256"
      }
    ],
    "name": "LogSubmission",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DR_Count",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contentOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_discrepancy",
        "type": "string"
      }
    ],
    "name": "submitDR",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_DR",
        "type": "uint256"
      },
      {
        "internalType": "enum DiscrepancyReportManager.State",
        "name": "_state",
        "type": "uint8"
      }
    ],
    "name": "determineValidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_DR",
        "type": "uint256"
      }
    ],
    "name": "resolveDiscrepancyReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_DR",
        "type": "uint256"
      },
      {
        "internalType": "enum DiscrepancyReportManager.State",
        "name": "_state",
        "type": "uint8"
      }
    ],
    "name": "evaluateResolution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_DR",
        "type": "uint256"
      }
    ],
    "name": "fetchDiscrepancyReport",
    "outputs": [
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "contentOwner",
        "type": "address"
      },
      {
        "internalType": "enum DiscrepancyReportManager.State",
        "name": "state",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "discrepancy",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const DR_Addr = '0x9Ff7f6d8D8b1Cd70669c11a9D17E327F8268b61D';

//On Page load
window.addEventListener('load', async() => {
    //Check if there is a wallet available
    if(typeof window.ethereum != 'undefined')
    {
        console.log("Wallet detecetd.");
        let mmDetected = this.document.getElementById('mm-detected');
        mmDetected.innerHTML = "Wallet has been detected."

        //Add in web3
        var web3 = new Web3(window.ethereum);

        //Get total DRs and load them
        var web3 = new Web3(window.ethereum);
        const DRM = new web3.eth.Contract(DR_ABI, DR_Addr);
        DRM.setProvider(window.ethereum)
        
        var count = "-1";
        count = await DRM.methods.DR_Count().call();
        document.getElementById("DR_Index").value = count-1;
        document.getElementById("lbl_DR_Count").innerHTML = "Total DRs: "+count; 
        document.getElementById("DR_Index").dispatchEvent(new Event('change'));
    }
    else
    {
        console.log("Wallet not found!");
        document.getElementById('mm-connect').disabled = true;
        this.alert("MetaMask or another wallet must be installed to run this application!");
        mmDetected.innerHTML = "Wallet not found."
    }
});

//Connect to MetaMask
document.getElementById('mm-connect').onclick = async() =>
{
  document.getElementById('mm-connect').disabled = true;
    console.log("Requesting Accounts from Wallet.");
    const addr = await ethereum.request({method: 'eth_requestAccounts'});
    let mmDetected = this.document.getElementById('mm-detected');
    let mmAccount = this.document.getElementById('mm-currentAccount');


    if(addr == "")
    {
        console.log("Wallet connection has failed!");
        document.getElementById('mm-connect').disabled = false;
    }
    else
    {
        console.log("Wallet connection established!");
        mmDetected.innerHTML = "Wallet is connected!";
        mmAccount.innerHTML = "Selected Account:" + addr;
    }
 
};

//Keep the 'selected Acount' current
window.ethereum.on('accountsChanged', function(accounts)
{
  let mmAccount = document.getElementById('mm-currentAccount');
  mmAccount.innerHTML = "Selected Account: " + accounts[0];
  console.log("Selected account has changed to "+ accounts[0]);
});

//Display a selected DR
document.getElementById("DR_Index").onchange = async () =>
{
  var web3 = new Web3(window.ethereum);
  const DRM = new web3.eth.Contract(DR_ABI, DR_Addr);
  DRM.setProvider(window.ethereum);
  
  console.log("Fetching selected DR.");
  const retval = await DRM.methods.fetchDiscrepancyReport(document.getElementById("DR_Index").value).call();

  document.getElementById("selected_DR_Submitter").innerHTML = "Submitter Address: " + retval[0];
  document.getElementById("selected_DR_ContentOwner").innerHTML = "Content Owner Address: " + retval[1];
  document.getElementById("selected_DR_Discrepancy").innerHTML = "Discrepancy: " + retval[3]

  var state = -1;
  switch (retval[2]) {
    case "0":
      state = "New";
      break;
    case "1":
      state = "Declined";
      break;
    case "2":
      state = "Accepted";
      break;
    case "3":
      state = "Resolved";
      break;
    case "4":
      state = "Rejected";
      break;
    case "5":
      state = "Fixed";
      break;  
    default:
      state = "Unknown!";
      break;
  }
  document.getElementById("selected_DR_State").innerHTML = "DR State: " + state;
}

//Submit a DR
document.getElementById("btn_SubmitDR").onclick = async() =>
{
  var web3 = new Web3(window.ethereum);
  const DRM = new web3.eth.Contract(DR_ABI, DR_Addr);
  DRM.setProvider(window.ethereum);

  const ContentOwner = document.getElementById("DR_ContentOwner").value;
  const Discrepancy = document.getElementById("DR_error").value;

  console.log("Submitting DR against: "+ContentOwner+" with dicrepancy: "+Discrepancy);
  
  await DRM.methods.submitDR(ContentOwner, Discrepancy).send({from: ethereum.selectedAddress});
  

  //refresh selected DR
  var count = "-1";
  count = await DRM.methods.DR_Count().call();
  document.getElementById("DR_Index").value = count -1; 
  document.getElementById("lbl_DR_Count").innerHTML = "Total DRs: "+count; 
  document.getElementById("DR_Index").dispatchEvent(new Event('change'));
}

//Determine validity of the Selected DR
document.getElementById("btn_ValidateDR").onclick = async() =>
{
  var web3 = new Web3(window.ethereum);
  const DRM = new web3.eth.Contract(DR_ABI, DR_Addr);
  DRM.setProvider(window.ethereum)

  if(document.getElementById("radio_Accepted").checked)
    var validation = "2";
  else if(document.getElementById("radio_Declined").checked)
    var validation = "1";
  else
    var validation = "-1"

  if(validation != "-1")
  {
    console.log("Determining validity of selected DR.")
    
    await DRM.methods.determineValidity(document.getElementById("DR_Index").value, validation).send({from: ethereum.selectedAddress});
    
  }
  else
    console.log("Invalid validation selection!")

  //refresh selected DR
  document.getElementById("DR_Index").dispatchEvent(new Event('change'));

}

//Resolve selected DR
document.getElementById("btn_ResolveDR").onclick = async() =>
{
  var web3 = new Web3(window.ethereum);
  const DRM = new web3.eth.Contract(DR_ABI, DR_Addr);
  DRM.setProvider(window.ethereum)

  console.log("Resolving selected DR.");
  await DRM.methods.resolveDiscrepancyReport(document.getElementById("DR_Index").value).send({from: ethereum.selectedAddress});
  
  //refresh selected DR
  document.getElementById("DR_Index").dispatchEvent(new Event('change'));
}

//Evaluate DR Resolution
document.getElementById("btn_EvaluateDR").onclick = async() =>
{
  var web3 = new Web3(window.ethereum);
  const DRM = new web3.eth.Contract(DR_ABI, DR_Addr);
  DRM.setProvider(window.ethereum)

  if(document.getElementById("radio_Fixed").checked)
    var evaluation = "5";
  else if(document.getElementById("radio_Rejected").checked)
    var evaluation = "4";
  else
    var evaluation = "-1"

  if(evaluation != "-1")
  {
    console.log("Evaluating resolution to selected DR.")
    await DRM.methods.evaluateResolution(document.getElementById("DR_Index").value, evaluation).send({from: ethereum.selectedAddress});
  }
  else
    console.log("Invalid evaluation selection!")

  //refresh selected DR
  document.getElementById("DR_Index").dispatchEvent(new Event('change'));
}