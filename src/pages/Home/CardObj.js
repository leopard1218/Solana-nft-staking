import React from "react";
import { useState, useEffect, useRef } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Home.module.sass';
import axios from 'axios'
import { CustomButton } from "../../components/CustomButton";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionInstruction, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import * as SPLToken from "@solana/spl-token";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};

export const CardObj = () => {

    const [open, setOpen] = useState(false);
    const [tokensOfOwner, setTokensOfOwner] = useState([]);
    const [stakeState, setStakeState] = useState(false);
    const [harvest, setHarvest] = useState(0);
    const [selectedNFT, setSelectedNFT] = useState([])

    const [walletBalance, setWalletBalance] = useState(null);
    const [address, setAddress] = useState(null);
    const connectToWallet = async () => {
        await window.solana.connect()
    }

    const toastErr = (msg) => {
        toast.error(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored"
        });
    }
    const getBalance = async () => {
        let connection = getConnection();
        const res = await connection.getBalance(getPublicKey());
        // console.log(res);
        setWalletBalance(res);
    }

    const getConnection = () => {
        let connection = new Connection("https://api.devnet.solana.com", "confirmed");
        // console.log(connection)
        return connection;
    }

    const getPublicKey = () => {
        // Okay so I had my localnet offline and thus it was failing. Nothing to do with
        // Publickey or Keypair
        let userAddress = new PublicKey(window.solana.publicKey.toString());
        return userAddress;
    }

    const handleConnectWallet = async () => {
        // Check if phantom is installed or not and prompt to install it.
        if (window.solana && window.solana.isPhantom) {
            await connectToWallet();

            // update address and balance of the wallet
            setAddress(window.solana.publicKey.toString());
            getBalance();


            //----test-----
            // let programId = Keypair.fromSecretKey(Uint8Array.from([17,14,180,44,177,24,37,109,72,145,17,236,128,87,95,76,161,56,213,239,247,226,233,154,190,154,5,156,31,84,223,252,251,103,241,37,107,31,214,135,216,57,176,104,181,34,239,0,87,5,238,213,82,233,24,5,207,38,196,99,148,115,117,192]));
            // console.log(programId.publicKey.toBase58())
            // console.log(programId.secretKey);
            // let connection = new Connection("https://api.devnet.solana.com", "confirmed");

            // let addr = window.solana.publicKey;
            // let mintAccount = new PublicKey('3rMQDQrKkvFLkm4rcYhCr2wTD2mzm3bWFyrZi3UpzhF2')
            
            // let token = await connection.getTokenAccountsByOwner(addr, {
            //     mint: mintAccount
            // })
            // let token = await connection.getAccountInfo(addr, {
            //     mint: mintAccount
            // })
            // console.log(token)
            // let token = new SPLToken.Token(connection, '5WpTCGrmvuaVKnKVqHNcdDuAgxUEz7UvrqGELtpGKCxA', SPLToken.TOKEN_PROGRAM_ID, null);
            // let tokenInfo = await token.getMintInfo();
            // console.log(tokenInfo);

            // getDerivedAccountAddress();
            // console.log(getConnection())
        } else {
            toastErr("Phantom wallet is not installed. Please install.");
            setTimeout(openPhantom, 5000)
        }
    }
    const openPhantom = () => {
        window.open("https://phantom.app/", "_target")
    }
    const StandardImageList = (props) => {
        const clickHandler = (event, e) => {
            if (selectedNFT.includes(e)) setSelectedNFT(selectedNFT.filter(item => item !== e))
            else setSelectedNFT([...selectedNFT, e])
            event.target.scrollIntoView();
        }
        return (
            <ImageList sx={{ width: 'auto', height: 450, padding: '50px' }} cols={4}>
                {props.itemData.map((item, key) => (
                    <div className={selectedNFT.includes(item.tokenId) ? styles.active : ""} key={key}>
                        <ImageListItem onClick={(event) => clickHandler(event, item.tokenId)}>
                            <div className={styles.image_card}>
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={item.title}
                                    position="below"
                                />
                            </div>
                        </ImageListItem>
                    </div>
                ))}
            </ImageList>
        );
    }

    const onClickStake = async () => {

        // for (let i = 0; i < selectedNFT.length; i++) {
        //     selectedNFT[i] = selectedNFT[i] - 0;
        // }
        // console.log(selectedNFT)
        // if (selectedNFT.length > 0) {
        //     const web3 = new Web3(Web3.givenProvider);
        //     let farmContract;
        //     let nftContract;
        //     try {
        //         const chainId = await web3.eth.getChainId()
        //         if (chainId === netchainId) {
        //             const web3Modal = new Web3Modal();
        //             const connection = await web3Modal.connect();
        //             const provider = new ethers.providers.Web3Provider(connection);
        //             const signer = provider.getSigner();
        //             farmContract = new ethers.Contract(
        //                 CrocosFarmAddr,
        //                 CrocosFarmCont.abi,
        //                 signer
        //             );
        //             nftContract = new ethers.Contract(
        //                 CrocosNFTAddr,
        //                 CrocosNFTCont.abi,
        //                 signer
        //             );
        //             if (stakeState === true) {
        //                 const nftCon = await nftContract.setApprovalForAll(CrocosFarmAddr, 1);
        //                 await nftCon.wait();
        //                 const farmCon = await farmContract.batchStake(selectedNFT);
        //                 await farmCon.wait();
        //                 setOpen(false)
        //             } else {
        //                 const farmCon = await farmContract.batchWithdraw(selectedNFT);
        //                 await farmCon.wait();
        //                 setOpen(false)
        //             }
        //             setSelectedNFT([])
        //         } else {
        //             try {
        //                 await web3.currentProvider.request({
        //                     method: "wallet_switchEthereumChain",
        //                     params: [{ chainId: netchainIdHex }]
        //                 });
        //             } catch (error) {
        //                 console.log(error.message);
        //             }
        //         }
        //     } catch (err) {
        //         console.log(err)
        //     }
        // } else {
        //     alert('please select nft')
        // }
    }

    useEffect(() => {
        // const timer = setInterval(async () => {
        //     const web3 = new Web3(Web3.givenProvider);
        //     let farmContract;
        //     try {
        //         const chainId = await web3.eth.getChainId()
        //         const web3Modal = new Web3Modal();
        //         const connection = await web3Modal.connect();
        //         const provider = new ethers.providers.Web3Provider(connection);
        //         const signer = provider.getSigner();
        //         myAddr = signer.provider.provider.selectedAddress;
        //         // console.log(myAddr)
        //         farmContract = new ethers.Contract(
        //             CrocosFarmAddr,
        //             CrocosFarmCont.abi,
        //             signer
        //         );
        //         if (chainId === netchainId) {

        //             const reward = (await farmContract.getTotalClaimable(myAddr) / Math.pow(10, 18)).toString().slice(0, 7);
        //             setHarvest(reward);

        //         } else {
        //             try {
        //                 clearInterval(timer)
        //                 await web3.currentProvider.request({
        //                     method: "wallet_switchEthereumChain",
        //                     params: [{ chainId: netchainIdHex }]
        //                 });

        //             } catch (error) {
        //                 console.log(error.message);
        //             }
        //         }
        //     } catch (err) {
        //         console.log(err)
        //     }
        // }, 3000)
    }, [])

    const onClickPick = async () => {
        // setStakeState(true);
        // setSelectedNFT([]);
        // const web3 = new Web3(Web3.givenProvider);
        // let nftContract;
        // try {
        //     const chainId = await web3.eth.getChainId()
        //     if (chainId === netchainId) {
        //         const web3Modal = new Web3Modal();
        //         const connection = await web3Modal.connect();
        //         const provider = new ethers.providers.Web3Provider(connection);
        //         const signer = provider.getSigner();
        //         myAddr = signer.provider.provider.selectedAddress;
        //         console.log(myAddr)
        //         nftContract = new ethers.Contract(
        //             CrocosNFTAddr,
        //             CrocosNFTCont.abi,
        //             provider
        //         );
        //         // const balance = await nftContract.balanceOf(myAddr);
        //         const walletOfOwner = await nftContract.walletOfOwner(myAddr);
        //         const tokenData = [];
        //         for (var i = 0; i < walletOfOwner.length; i++) {
        //             let tokenURI = await nftContract.tokenURI(walletOfOwner[i] - 0);
        //             // tokenURI = tokenURI.slice(0, 82)
        //             const nftMetaData = await axios.get(tokenURI);
        //             console.log(nftMetaData)
        //             const nftTokenData = { img: `https://ipfs.io/ipfs/${nftMetaData.data.image.slice(7)}`, title: nftMetaData.data.name, tokenId: walletOfOwner[i] }
        //             tokenData.push(nftTokenData);
        //         }
        //         setTokensOfOwner(tokenData);
        //         console.log(tokenData)
        //         setOpen(true)   
        //     } else {
        //         try {
        //             await web3.currentProvider.request({
        //                 method: "wallet_switchEthereumChain",
        //                 params: [{ chainId: netchainIdHex }]
        //             });
        //         } catch (error) {
        //             console.log(error.message);
        //         }
        //     }
        // } catch (err) {
        //     console.log(err)
        // }

    }

    const onClickHarvest = async () => {
        // console.log('clicked')
        // const web3 = new Web3(Web3.givenProvider);
        // let farmContract;
        // try {
        //     const chainId = await web3.eth.getChainId()
        //     if (chainId === netchainId) {
        //         const web3Modal = new Web3Modal();
        //         const connection = await web3Modal.connect();
        //         const provider = new ethers.providers.Web3Provider(connection);
        //         const signer = provider.getSigner();
        //         myAddr = signer.provider.provider.selectedAddress;
        //         console.log(myAddr)
        //         farmContract = new ethers.Contract(
        //             CrocosFarmAddr,
        //             CrocosFarmCont.abi,
        //             signer
        //         )
        //         if (harvest > 0) {
        //             const farmCon = await farmContract.harvest();
        //             await farmCon.wait();
        //         }

        //     } else {
        //         try {
        //             await web3.currentProvider.request({
        //                 method: "wallet_switchEthereumChain",
        //                 params: [{ chainId: netchainIdHex }]
        //             });
        //         } catch (error) {
        //             console.log(error.message);
        //         }
        //     }
        // } catch (err) {
        //     console.log(err)
        // }
    }

    const onClickWithdraw = async () => {
        // setStakeState(false);
        // setSelectedNFT([])
        // console.log(selectedNFT)
        // const tokenData = [];
        // console.log('clicked')
        // const web3 = new Web3(Web3.givenProvider);
        // let farmContract;
        // let nftContract;
        // try {
        //     const chainId = await web3.eth.getChainId()
        //     if (chainId === netchainId) {
        //         const web3Modal = new Web3Modal();
        //         const connection = await web3Modal.connect();
        //         const provider = new ethers.providers.Web3Provider(connection);
        //         const signer = provider.getSigner();
        //         myAddr = signer.provider.provider.selectedAddress;
        //         console.log(myAddr)
        //         farmContract = new ethers.Contract(
        //             CrocosFarmAddr,
        //             CrocosFarmCont.abi,
        //             signer
        //         );
        //         nftContract = new ethers.Contract(
        //             CrocosNFTAddr,
        //             CrocosNFTCont.abi,
        //             signer
        //         );
        //         const stakeOfOwner = await farmContract.stakeOfOwner(myAddr);
        //         console.log(stakeOfOwner)
        //         for (var i = 0; i < stakeOfOwner.length; i++) {
        //             let tokenURI = await nftContract.tokenURI(stakeOfOwner[i]);
        //             console.log(tokenURI);
        //             const nftMetaData = await axios.get(tokenURI);
        //             const nftTokenData = { img: `https://ipfs.io/ipfs/${nftMetaData.data.image.slice(7)}`, title: nftMetaData.data.name, tokenId: stakeOfOwner[i] }
        //             tokenData.push(nftTokenData);
        //         }
        //         setTokensOfOwner(tokenData);
        //         console.log(tokenData)
        //         setOpen(true)
        //     } else {
        //         try {
        //             await web3.currentProvider.request({
        //                 method: "wallet_switchEthereumChain",
        //                 params: [{ chainId: netchainIdHex }]
        //             });
        //         } catch (error) {
        //             console.log(error.message);
        //         }
        //     }
        // } catch (err) {
        //     console.log(err)
        // }

    }

    return (
        <div>
            <CustomButton style={{ marginTop: '50px' }} value={address ? address.slice(0, 4) + "....." + address.slice(-3) : "Connect wallet"} onClick={handleConnectWallet} />
            <div className={styles.card}>
                <div className={styles.title}>Stake NFT get BONGOS</div>
                <img src="./assets/img/nft.png" alt="nft" />
                <CustomButton value="Pick NFT" onClick={onClickPick} />
                <div className={styles.box}>
                    <h5>Reward</h5>
                    <p>{harvest} BONGOS</p>
                    <CustomButton value="Harvest" onClick={onClickHarvest} />
                </div>
                <CustomButton value="Withdraw" onClick={onClickWithdraw} />
            </div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <StandardImageList itemData={tokensOfOwner} stakeState={stakeState} />
                        <CustomButton value={stakeState ? "Stake" : "Withdraw"} onClick={onClickStake} style={{ float: 'right', margin: '0 30px 20px', width: 150 }} />
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer />
        </div>
    )
}