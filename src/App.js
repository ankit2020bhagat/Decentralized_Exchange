import { useEffect, useState } from "react";
import React from "react";
import "./styles/App.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import token from "./artifacts/contracts/cryptoDevtoken.sol/CryptoDevToken.json";
import exchange from "./artifacts/contracts/Exchange.sol/Exchange.json";
import { TOKEN_ADDRESS, EXCHANGE_ADDRESS } from "./constants/constant";
function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [ETHAmount, setETHAmount] = useState("");
  const [lptokenBalance, setLPTokenBalance] = useState("");
  const [lpToken, setlpToken] = useState("");
  const [minTokenAmount, setMinTokenAmount] = useState("");
  const [ETHTotokenAmount, setETHTokenAmount] = useState("");
  const [tokenSold, setTokenSold] = useState("");
  const [mintETH, setmintETH] = useState("");
  const [contractBalance, setContractbalance] = useState("");
  const [LpSupply, setLpSupply] = useState("");
  const [contractTokenBalance, setContractTokenbalance] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [inputReserve, setInputReserve] = useState("");
  const [outPutreserv, setOutPutReserve] = useState("");
  const [calculatetoken, setCalculateToken] = useState("");
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const mint = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          TOKEN_ADDRESS,
          token.abi,
          signer
        );
        const txn = await tokenContract.mint(tokenAmount);
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addLiquidity = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          TOKEN_ADDRESS,
          token.abi,
          signer
        );
        const allowance = await tokenContract.approve(
          EXCHANGE_ADDRESS,
          liquidityAmount
        );
        await allowance.wait();

        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );
        const balance = ethers.utils.parseEther(ETHAmount.toString());

        const txn = await exchangeContract.addLiquidity(liquidityAmount, {
          value: balance,
        });
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeLiquidity = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );
        const txn = await exchangeContract.removeLiquidity(lpToken);
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const swapETHToToken = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );
        const balance = ethers.utils.parseEther(ETHTotokenAmount.toString());
        console.log(balance.toString());
        const txn = await exchangeContract.swapEthToToken(minTokenAmount, {
          value: balance.toString(),
        });
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const swapTokentoETH = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          TOKEN_ADDRESS,
          token.abi,
          signer
        );
        const allowance = await tokenContract.approve(
          EXCHANGE_ADDRESS,
          liquidityAmount
        );
        await allowance.wait();

        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );

        const txn = await exchangeContract.swapTokenToETH(tokenSold, mintETH);
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          TOKEN_ADDRESS,
          token.abi,
          signer
        );
        const tokenBalance = await tokenContract.balanceOf(currentAccount);
        setTokenBalance(tokenBalance.toString());
        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );
        const lptoken = await exchangeContract.balanceOf(currentAccount);
        setLPTokenBalance(lptoken.toString());
        // const contractBalance = await provider.getBalance(EXCHANGE_ADDRESS);
        // console.log(contractBalance.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPoolBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          TOKEN_ADDRESS,
          token.abi,
          signer
        );
        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );
        const contractBalance = await provider.getBalance(EXCHANGE_ADDRESS);
        setContractbalance(contractBalance.toString());
        const lpSupply = await exchangeContract.totalSupply();
        setLpSupply(lpSupply.toString());
        const tokenBalance = await tokenContract.balanceOf(EXCHANGE_ADDRESS);
        setContractTokenbalance(tokenBalance.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateToken = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const exchangeContract = new ethers.Contract(
          EXCHANGE_ADDRESS,
          exchange.abi,
          signer
        );
        const tokenAmount = await exchangeContract.getAmountofToken(
          inputToken,
          inputReserve,
          outPutreserv
        );
        setCalculateToken(tokenAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja donut gif"
      />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            placeholder="Token Amount"
            onChange={(e) => setTokenAmount(e.target.value)}
          />
          <div className="button-container">
            <button
              className="cta-button mint-button"
              disabled={null}
              onClick={mint}
            >
              Mint Token
            </button>
          </div>
          <input
            type="text"
            placeholder="Liquidity Amount"
            onChange={(e) => setLiquidityAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="ETH Amount"
            onChange={(e) => setETHAmount(e.target.value)}
          />
          <div className="button-container">
            <button
              className="cta-button mint-button"
              disabled={null}
              onClick={addLiquidity}
            >
              AddLiquidity
            </button>
          </div>
          <br />
        </div>
      </div>
    );
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Decentralized Exchange </p>
              <p className="subtitle">
                Trading of ERC20 tokens without the need for intermediaries.
              </p>
            </div>

            <button
              onClick={getBalance}
              className="cta-button connect-wallet-button"
            >
              User Balance
            </button>
          </header>
          <h4>CryptoDevtoken Balance {tokenBalance}</h4>
          <h4>Liquidity Token {lptokenBalance}</h4>

          {currentAccount && renderInputForm()}
          {!currentAccount && renderNotConnectedContainer()}
          <input
            type="text"
            placeholder="LP token"
            onChange={(e) => setlpToken(e.target.value)}
          />
          <Button onClick={removeLiquidity} variant="success">
            removeLiquidity
          </Button>
          <br />
          <br />
          <input
            type="text"
            placeholder="Min amount token"
            onChange={(e) => setMinTokenAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder=" ETH Amount"
            onChange={(e) => setETHTokenAmount(e.target.value)}
          />
          <Button onClick={swapETHToToken} variant="success">
            Swap ETH to Token
          </Button>
          <br />
          <br />
          <input
            type="text"
            placeholder="Sold token"
            onChange={(e) => setTokenSold(e.target.value)}
          />
          <input
            type="text"
            placeholder=" Mint ETH"
            onChange={(e) => setmintETH(e.target.value)}
          />
          <Button onClick={swapTokentoETH} variant="success">
            Swap Token to ETH
          </Button>
          <br />
          <br />
          <button
            onClick={getPoolBalance}
            className="cta-button connect-wallet-button"
          >
            Get_Pool_Detials
          </button>
          <h4>Contract Balance {contractBalance}</h4>
          <h4>Liquidity Token Balance {LpSupply}</h4>
          <h4>Contract Token Balance {contractTokenBalance}</h4>
          <br />
          <br />
          <input
            type="text"
            placeholder="Input Token"
            onChange={(e) => setInputToken(e.target.value)}
          />
          <input
            type="text"
            placeholder="Input Reseve"
            onChange={(e) => setInputReserve(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="OutPut Reserve"
            onChange={(e) => setOutPutReserve(e.target.value)}
          />
          <br />
          <button
            onClick={calculateToken}
            className="cta-button connect-wallet-button"
          >
            CalCulate_Token
          </button>
          <h4>CalCulate_Token {calculatetoken}</h4>
        </div>

        {/* Render the input form if an account is connected */}
      </div>
    </div>
  );
}

export default App;
