import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import slugIt from "slug";
import useSWR, { mutate } from "swr";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "../../context/auth";
import api from "../../lib/api";
import Protected from "../../components/Protected";
import Layout from "../../components/AppLayout";
import Button from "../../components/Button";
import NotificationPanel from "../../components/NotificationPanel";
import QRCode from 'qrcode.react';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const PUBLICATION_PATH = process.env.NEXT_PUBLIC_PUBLICATION_PATH;

export default function Publication() {
  // Data fetching
  const { isReady, user } = useAuth();
  const router = useRouter();
  const pathId = router.query.id;
  const shouldFetchPublication = isReady && pathId && pathId !== "new";
  const { data: publication, error: _pubError } = useSWR(shouldFetchPublication ? `${PUBLICATION_PATH}/${pathId}` : null);

  // Publication state
  const [id, setId] = useState();
  const [uuid, setUuid] = useState();
  const [pdfRaw, setPdfRaw] = useState(null);
  const [pdfRawData, setPdfRawData] = useState(null);
  const [pdf_raw_hash, setPdfRawHash] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  // UI state
  const [generateSlug, setGenerateSlug] = useState(true);
  const [pdfChanged, setPdfChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [embedding, setEmbedding] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Update Publication state on data fetch
  useEffect(() => {
    if (publication) {
      setId(publication.id);
      setUuid(publication.uuid);
      setTitle(publication.title);
      setSlug(publication.slug);
      if (slugIt(publication.title) !== publication.slug) {
        setGenerateSlug(false);
      }
      setPdfRawHash(publication.pdf_raw_hash);
      if (publication.pdf_raw) {
        setPdfRawData({
          name: publication.pdf_raw.name,
          size: publication.pdf_raw.size,
        });
        setPdfChanged(false);
      }
      if (publication.pdf_embedded) {
        setDownloadUrl(publication.pdf_embedded.url)
      } else {
        setDownloadUrl(null);
      }
    }
  }, [publication]);

  function onChangeTitle(newTitle) {
    if (generateSlug) {
      setSlug(`${slugIt(newTitle)}.pdf`);
    }
    setTitle(newTitle);
  }

  function onGenerateSlugChange(generate) {
    if (generate) {
      setSlug(`${slugIt(title)}.pdf`)
    }
    setGenerateSlug(generate);
  }

  // Handle file upload
  function onFileUpload(evt) {
    if (!pdfRaw) {
      setPdfChanged(true);
    }
    const file = evt.target.files[0];
    setDownloadUrl(null);
    setPdfRaw(file);
    setPdfRawData({
      name: file.name,
      size: file.size, // TODO format in kB or mB
    });
    setDownloadUrl(null);
  }

  // Handle file remove
  function onFileRemove(evt) {
    evt.preventDefault();
    setPdfRaw(null);
    setPdfRawData(null);
    setPdfRawHash(null);
    setDownloadUrl(null);
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const isNew = !id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? PUBLICATION_PATH : `${PUBLICATION_PATH}/${id}`;
    const data = { id, title, slug, pdf_raw_hash };

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
      setSuccessMsg('Publication Saved!')
      if (isNew) {
        setId(savedPublication.id);
        router.push(`/publication/${savedPublication.id}`, undefined, { shallow: true });
      }
      setTimeout(() => setSuccessMsg(null), 3000);
      mutate(`${PUBLICATION_PATH}/${id}`);
    } catch (err) {
      setErrorMsg('Error saving Publication!')
      setTimeout(() => setErrorMsg(null), 3000);
    }
  }

  // // Handle embedding of QR code
  async function onEmbed() {
    setEmbedding(true);
    try {
      const response = await api.request({ method: 'PUT', url: `${PUBLICATION_PATH}/embed/${id}`, data: {} });
      mutate(`${PUBLICATION_PATH}/${id}`);
      setEmbedding(false);
      setSuccessMsg('QR Code embedded successfully!')
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setEmbedding(false);
      setErrorMsg('Error embedding QR code!')
      setTimeout(() => setErrorMsg(null), 3000);
    }
  }

  return (
    <>
      <NotificationPanel show={!!successMsg} bgColor="bg-green-400" message={successMsg} />
      <NotificationPanel show={!!errorMsg} bgColor="bg-red-400" message={errorMsg} />
      <Protected>
      <Layout>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Publication</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div id="new-publication-form" className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={onSubmit}>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-6 pt-6 pb-3 bg-white space-y-3">
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={title}
                          onChange={(evt) => onChangeTitle(evt.target.value)}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                        <input type="checkbox" checked={generateSlug} onChange={() => onGenerateSlugChange(!generateSlug)}></input>
                        <label className="ml-3 text-xs inline-block" htmlFor="embedded">Auto generate </label>
                        <input
                          type="text"
                          name="slug"
                          value={slug}
                          onChange={(evt) => setSlug(evt.target.value)}
                          disabled={generateSlug}
                          required
                          className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">PDF</label>
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
                                  <label htmlFor="raw_pdf" className="cursor-pointer rounded-md hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Replace</span>
                                    <input
                                      id="raw_pdf"
                                      name="raw_pdf"
                                      type="file"
                                      className="sr-only"
                                      onChange={onFileUpload}
                                    />
                                  </label>
                                  <span className="pl-1 hover:text-indigo-500">{" "} /{" "} <button onClick={onFileRemove}>Remove</button></span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex text-sm text-gray-600">
                                  <label htmlFor="raw_pdf" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
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
                                <p className="text-xs text-gray-500">PDF up to 30MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <label htmlFor="royalty-structure" className="block text-sm font-medium text-gray-700">
                          QR Code
                        </label>
                        <div className="pt-4 text-center">
                          { user && user.eth_profile_addr ? (
                            <QRCode
                              className="inline"
                              value={user.eth_profile_addr}
                              size={200}
                              level={"H"}
                              includeMargin={false}
                            />
                          ): (
                            <div className="p-5 text-red-500 rounded-md border-2 border-gray-300 border-dashed">
                              <p>Please verify your profile and deploy it to the blockchain!</p>
                              <p>After doing that, you will be able to embed the QR code into your publication</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                      </div>
                      { downloadUrl ? (
                        <div>
                          <label className="inline-block mr-2 text-sm font-medium text-gray-700">Download URL: </label>
                          <a className="text-sm font-medium text-indigo-700" target="_blank" href={`${API_HOST}${downloadUrl}`}>{`${API_HOST}${downloadUrl}/${slug}`}</a>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                      { embedding ? (
                        <div className="h-10 w-20 mr-2 inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md  bg-indigo-600 hover:bg-indigo-700">
                          <PulseLoader  color="white" loading={embedding} size={9}/>
                        </div>
                      ) : (
                      <Button label="Embed QR Code & Publish" hidden={(user && !user.eth_profile_addr) || !pdf_raw_hash || downloadUrl || pdfChanged} color="indigo" disabled={downloadUrl || !pdf_raw_hash} onClick={onEmbed} />
                      )}
                      { saving ? (
                        <div className="h-10 w-20 inline-block text-center py-2 px-4 border border-transparent shadow-sm rounded-md  bg-indigo-600 hover:bg-indigo-700">
                          <PulseLoader color="white" loading={saving} size={9} />
                        </div>
                      ) : (
                        <Button label="Save" color="indigo" type="submit" />
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
    </>

);
}
