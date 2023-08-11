import React, { useState, useEffect } from "react";
import "./App.css";
const ethers = require("ethers");

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [tokenContractAddress, setTokenContractAddress] = useState(
    "0x2b651AC68B8D637065DD6E3c8a0272eadF3A7e3C"
  );
  const [tokenContract, setTokenContract] = useState();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountToMint, setAmountToMint] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function initializeProviderAndSigner() {
      if (window.ethereum) {
        const metamaskProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        setProvider(metamaskProvider);
        setSigner(metamaskProvider.getSigner());
      } else {
        console.log("Metamask not detected");
      }
    }

    initializeProviderAndSigner();
  }, []);

  useEffect(() => {
    if (provider && signer) {
      setTokenContract(
        new ethers.Contract(
          tokenContractAddress,
          [
            "function mint(address to, uint256 amount) public",
            "function balanceOf(address account) public view returns (uint256)",
            "function transfer(address recipient, uint256 amount) public returns (bool)",
            "function whitelist(address account) external",
            "function blacklist(address account) external",
          ],
          signer
        )
      );
    }
  }, [provider, signer]);

  const mintTokens = async () => {
    try {
      const tx = await tokenContract.mint(
        recipientAddress,
        ethers.utils.parseEther(amountToMint)
      );
      await tx.wait();
    } catch (error) {
      setErrorMessage("Error minting tokens" + error.error.data.message);
    }
  };

  const whiteListAddress = async () => {
    try {
      const tx = await tokenContract.whitelist(recipientAddress);
      await tx.wait();
      console.log(tx);
    } catch (error) {
      console.log(error.error.data.message);
      setErrorMessage("Error whitelisting address" + error.error.data.message);
    }
  };
  const blackListAddress = async () => {
    try {
      const tx = await tokenContract.blacklist(recipientAddress);
      await tx.wait();
    } catch (error) {
      setErrorMessage("Error blacklisting address" + error.error.data.message);
    }
  };

  const getBalance = async () => {
    try {
      const balance = await tokenContract.balanceOf(recipientAddress);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error.error)
      setErrorMessage("Error getting balance" + error.error.data.message);
    }
  };

  const transferTokens = async () => {
    try {
      const tx = await tokenContract.transfer(
        recipientAddress,
        ethers.utils.parseEther(transferAmount)
      );
      await tx.wait();
    } catch (error) {
      setErrorMessage("Error transferring tokens" + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ERC20 Token Interaction</h1>
        <div>
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Amount to Mint:</label>
          <input
            type="text"
            value={amountToMint}
            onChange={(e) => setAmountToMint(e.target.value)}
          />
          <button onClick={mintTokens}>Mint</button>
        </div>
        <div>
          <button onClick={getBalance}>Get Balance</button>
          <p>Balance: {balance} tokens</p>
        </div>
        <div style={{ flex: "row" }}>
          <button onClick={whiteListAddress}>WhiteList</button>
          {/* <p>Balance: {balance} tokens</p> */}
          <button onClick={blackListAddress}>Black List</button>
        </div>

        <div>
          <label>Transfer Amount:</label>
          <input
            type="text"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <button onClick={transferTokens}>Transfer</button>
        </div>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </header>
    </div>
  );
}

export default App;
