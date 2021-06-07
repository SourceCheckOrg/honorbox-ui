import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "../../context/auth";
import api from "../../lib/api";
import socket from "../../lib/socket";
import Protected from "../../components/Protected";
import Layout from "../../components/AppLayout";
import Button from "../../components/Button";
import NotificationPanel from "../../components/NotificationPanel";
import QrCodeModal from "../../components/QrCodeModal";
import SelectField from "../../components/SelectField";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const PREVIEW_HOST = process.env.NEXT_PUBLIC_PREVIEW_HOST
const PUBLICATION_PATH = process.env.NEXT_PUBLIC_PUBLICATION_PATH;
const PUBLISHER_PATH=process.env.NEXT_PUBLIC_PUBLISHER_PATH
const ROYALTY_STRUCTURE_PATH = process.env.NEXT_PUBLIC_ROYALTY_STRUCTURE_PATH;
const PUBLISHER_VC_PATH = process.env.NEXT_PUBLIC_PUBLISHER_VC_PATH;
const PUBLISHER_VP_PATH = process.env.NEXT_PUBLIC_PUBLISHER_VP_PATH;

export default function Publication() {
  // Data fetching
  const { isReady } = useAuth();
  const router = useRouter();
  const pathId = router.query.id;
  const shouldFetchPublication = isReady && pathId && pathId !== "new";
  const { data: royaltyStructures, error: rsError } = useSWR(isReady ? ROYALTY_STRUCTURE_PATH : null);
  const { data: publication, error: pubError } = useSWR(shouldFetchPublication ? `${PUBLICATION_PATH}/${pathId}` : null);
  const { data: publisher, error: fetchError } = useSWR(isReady ? PUBLISHER_PATH : null);

  // Publication state
  const [id, setId] = useState();
  const [uuid, setUuid] = useState();
  const [pdfRaw, setPdfRaw] = useState(null);
  const [pdfRawData, setPdfRawData] = useState(null);
  const [pdf_raw_hash, setPdfRawHash] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [royalty_structure, setRoyaltyStructure] = useState(null);
  const [publisher_vc_issued, setPublisherVCIssued] = useState(null);
  const [publisher_vp, setPublisherVP] = useState(null);
  const [published, setPublished] = useState(null);

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [publisherCredentialOffer, setPublisherCredentialOffer] = useState(false);
  const [publisherPresentationRequest, setPublisherPresentationRequest] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState(false);

  // Create socket on component mount
  useEffect(() => {
    socket.initiate(API_HOST);
    
    // Disconnect from socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Update Publication state on data fetch
  useEffect(() => {
    if (publication) {
      setId(publication.id);
      setUuid(publication.uuid);
      setTitle(publication.title);
      setSlug(publication.slug);
      setRoyaltyStructure(publication.royalty_structure ? publication.royalty_structure.id : null);
      setPdfRawHash(publication.pdf_raw_hash);
      if (publication.pdf_raw) {
        setPdfRawData({
          name: publication.pdf_raw.name,
          size: publication.pdf_raw.size,
        });
      }
      setPublisherVCIssued(publication.publisher_vc_issued);
      setPublisherVP(publication.publisher_vp);
      setPublished(publication.published);
    }
  }, [publication]);

  // Handle file upload
  function onFileUpload(evt) {
    const file = evt.target.files[0];
    setPdfRaw(file);
    setPdfRawData({
      name: file.name,
      size: file.size, // TODO format in kB or mB
    });
  }

  // Handle file remove
  function onFileRemove(evt) {
    evt.preventDefault();
    setPdfRaw(null);
    setPdfRawData(null);
    setPdfRawHash(null);
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const isNew = !id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? PUBLICATION_PATH : `${PUBLICATION_PATH}/${id}`;
    const data = { id, title, slug, royalty_structure, pdf_raw_hash };

    // Request data and headers
    const hasFile = pdfRaw && pdfRawData;

    let formData;
    let contentType;
    if (hasFile) {
      formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("files.pdf_raw", pdfRaw);
      contentType = "multipart/form-data";
    } else {
      formData = pdfRawData ? data : { ...data, pdf_raw: null };
      contentType = "application/json";
    }

    try {
      const response = await api.request({ method, url, data: formData, headers: { "Content-Type": contentType } });
      const savedPublication = response.data;
      setSaving(false);
      setSaveSuccess(true);
      if (isNew) {
        const newId = savedPublication.id;
        setId(newId);
        router.push(`/publication/${newId}`, undefined, { shallow: true });
      }
      setTimeout(() => setSaveSuccess(false), 2000);
      mutate(`${PUBLICATION_PATH}/${id}`);
    } catch (err) {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 2000);
    }
  }

  // Handle Publisher Verifiable Credential offer
  function onPublisherCredOffer() {
    if (!uuid) return;
    socket.emit("publisher-cred-offer-sub", uuid);
    socket.on("publisher-cred-offer-done", () => {
      socket.emit("publisher-cred-offer-unsub", uuid);
      setPublisherCredentialOffer(false);
      mutate(`${PUBLICATION_PATH}/${id}`);
    });
    setPublisherCredentialOffer(true);
  }

  // Handle cancellation of Publisher Verifiable Credential offer
  function onPublisherCredOfferCancel() {
    socket.emit("publisher-cred-offer-unsub", uuid);
    setPublisherCredentialOffer(false);
  }

  // Handle Publisher Verifiable Presentation request
  function onPublisherPresReq() {
    if (!uuid) return;
    socket.emit("publisher-pres-req-sub", uuid);
    socket.on("publisher-pres-req-done", () => {
      socket.emit("publisher-pres-req-unsub", uuid);
      setPublisherPresentationRequest(false);
      mutate(`${PUBLICATION_PATH}/${id}`);
    });
    setPublisherPresentationRequest(true);
  }

  // Handle cancellation of Publisher Verifiable Presentation request
  function onPublisherPresReqCancel() {
    socket.emit("publisher-pres-req-unsub", uuid);
    setPublisherPresentationRequest(false);
  }

  // Handle publication of Publication
  async function onPublish() {
    setPublishing(true);
    try {
      const response = await api.request({ method: 'PUT', url: `${PUBLICATION_PATH}/publish/${id}`, data: {} });
      mutate(`${PUBLICATION_PATH}/${id}`);
      setPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 2000);
    } catch (err) {
      setPublishing(false);
      setPublishError(true);
      setTimeout(() => setPublishError(false), 2000);
    }
  }

  return (
    <Protected>
      <Layout>
        <QrCodeModal
          show={publisherCredentialOffer}
          title="Get Publisher Credential"
          message="Please scan the QR code with your Credible Wallet to accept the Publisher Credential"
          url={`${API_HOST}${PUBLISHER_VC_PATH}?uuid=${uuid}`}
          onCancel={onPublisherCredOfferCancel}
        />
        <QrCodeModal
          show={publisherPresentationRequest}
          title="Share Publisher Credential"
          message="Please scan the QR code with your Credible Wallet to share the Publisher Credential"
          url={`${API_HOST}${PUBLISHER_VP_PATH}?uuid=${uuid}`}
          onCancel={onPublisherPresReqCancel}
        />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Publication</h1>
            </div>
            <NotificationPanel
              show={saveSuccess || publishSuccess}
              bgColor="bg-green-100"
              message={saveSuccess ? "Publication Saved!" : "Publication Published!"}
            />
            <NotificationPanel
              show={saveError || publishError}
              bgColor="bg-red-100"
              message={saveError ? "Error saving Publication!" : "Error publishing Publication!"}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div id="new-publication-form" className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={onSubmit}>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={title}
                          onChange={(evt) => setTitle(evt.target.value)}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          Slug
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={slug}
                          onChange={(evt) => setSlug(evt.target.value)}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <label htmlFor="royalty-structure" className="block text-sm font-medium text-gray-700">
                          Revenue Share
                        </label>
                        <SelectField
                          options={royaltyStructures}
                          valueField="id"
                          labelField="name"
                          selected={royalty_structure ? royalty_structure : null}
                          onChange={(value) => setRoyaltyStructure(value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          PDF
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {pdfRawData && pdfRawData.name ? (
                              <>
                                <p className="text-sm text-gray-500">
                                  {pdfRawData.name} ({pdfRawData.size})
                                </p>
                                <div className="flex justify-center font-medium text-sm text-indigo-600">
                                  <label
                                    htmlFor="raw_pdf"
                                    className="cursor-pointer rounded-md hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>Replace</span>
                                    <input
                                      id="raw_pdf"
                                      name="raw_pdf"
                                      type="file"
                                      className="sr-only"
                                      onChange={onFileUpload}
                                    />
                                  </label>
                                  <span className="pl-1 hover:text-indigo-500">
                                    {" "}
                                    /{" "}
                                    <button onClick={onFileRemove}>
                                      Remove
                                    </button>
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="raw_pdf"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="raw_pdf"
                                      name="raw_pdf"
                                      type="file"
                                      className="sr-only"
                                      onChange={onFileUpload}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PDF up to 30MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button label="Get Publisher Credential" color="indigo" disabled={!pdf_raw_hash || publisher_vc_issued} onClick={onPublisherCredOffer} />
                        <Button label="Share Publisher Credential" color="indigo" disabled={!publisher_vc_issued || publisher_vp } onClick={onPublisherPresReq} />
                        { publishing ? (
                            <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                              <PulseLoader  color="white" loading={publishing} size={9}/>
                            </div>
                          ) : (
                            <Button label="Publish" color="indigo" disabled={!publisher_vp || published} onClick={onPublish} />
                          )
                        }
                      </div>
                      { published && publisher && publisher.slug ? (
                          <div>
                            <label className="inline-block mr-2 text-sm font-medium text-gray-700">Preview URL: </label>
                            <a className="text-sm font-medium text-indigo-700" href={`${PREVIEW_HOST}/${publisher.slug}/${slug}`}>{`${PREVIEW_HOST}/${publisher.slug}/${slug}`}</a>
                          </div>
                        ) : (
                          ''
                        )
                      }
                        
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      {saving ? (
                          <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                            <PulseLoader color="white" loading={saving} size={9} />
                          </div>
                        ) : (
                          <button type="submit" className="h-10 w-20 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Save
                          </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </Protected>
  );
}
