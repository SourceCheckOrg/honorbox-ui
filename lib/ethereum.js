import { ethers } from 'ethers';
import SOURCECHECK_PROFILE_ABI from '../contracts/SourceCheckProfile';

export async function getNativeBalance(ethProfileAddr, provider) {
  const profileContract = new ethers.Contract(ethProfileAddr, SOURCECHECK_PROFILE_ABI, provider);
  const balance = await profileContract.maxNativeWithdraw(); 
  return ethers.utils.formatEther(balance);
}

export async function getBalance(ethProfileAddr, tokenAddr, tokenDec, provider) {
  const profileContract = new ethers.Contract(ethProfileAddr, SOURCECHECK_PROFILE_ABI, provider);
  const balance = await profileContract.maxWithdraw(tokenAddr);
  return ethers.utils.formatUnits(balance, tokenDec);
}

export async function nativeWithdraw(ethProfileAddr, provider) {
  const profileContract = new ethers.Contract(ethProfileAddr, SOURCECHECK_PROFILE_ABI, provider);
  return profileContract.nativeWithdraw();
}

export async function withdraw(ethProfileAddr, tokenAddr, provider) {
  const profileContract = new ethers.Contract(ethProfileAddr, SOURCECHECK_PROFILE_ABI, provider);
  return profileContract.withdraw(tokenAddr);
}
