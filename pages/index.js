import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '../context/auth';
import NavBar from '../components/NavBar';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated]);

  return (
    <NavBar />
  );

  var basicText = " \
  <h1>Welcome the HonorBox prototype</h1> \
  <p>\
    This prototype demonstrates how the HonorBox platform can be used to \
    generate unique, per-publication revenue-sharing smart contracts and \ 
    attach those to PDF files for direct payments. \
    We even have code for detecting, extracting, a verifying signatures on \
    the W3C Verifiable credentials that describe all of these operations, \
    to make them more trustworthy.  Proposed future features include: \
    <ul> \
      <li>Binding publisher identities to Twitter account control proofs, \ 
      long-lived blockchain addresses, or other proofs of authenticity</li> \
      <li>Support for more wallets and protocols for managing publications \
      and taking that data elsewhere in the form of Verifiable Credentials</li>\
      <li>Support for more blockchain address types for revenue-sharing contracts</li>\
      <li></li>\
    </ul>\ 
  </p> \
  <p>\
    We currently use the <a href=https://spruceid.dev/docs/Credible/>Credible wallet</a> \
    from <a href=https://spruceid.com/>Spruce Systems</a>, USA, to handle \
    log-in to our custom, Strapi-powered publisher interface. Please \
    <strong>download</strong> the wallet from <a href=https://play.google.com/store/apps/details?id=com.spruceid.app.credible>Android store</a>\
    or the iOS app store (coming soon) and use the "sign up" button above \
    to get started.\
  </p>\
  \
  ";
}
