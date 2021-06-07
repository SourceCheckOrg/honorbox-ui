import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import api from "../lib/api";
import Layout from "../components/AppLayout";
import NotificationPanel from "../components/NotificationPanel";

const PUBLICATION_PATH = process.env.NEXT_PUBLIC_PUBLICATION_PATH;

export default function Verify() {
  
  // File to Upload
  const [upload, setUpload] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  
  // UI state
  const [uploading, setUploading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle file upload
  function onFileUpload(evt) {
    const file = evt.target.files[0];
    setUpload(file);
    setUploadData({ name: file.name, size: file.size });
    setVerificationSuccess(false);
    setVerificationError(false);
  }

  // Handle file remove
  function onFileRemove(evt) {
    evt.preventDefault();
    setUpload(null);
    setUploadData(null);
    setVerificationSuccess(false);
    setVerificationError(false);
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    setUploading(true);

    const method = 'POST';
    const url = `${PUBLICATION_PATH}/verify`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const data = new FormData();
    data.append("data", JSON.stringify({}));
    data.append("files.upload", upload);
    
    try {
      const response = await api.request({ method, url, data, headers });
      const result = response.data;
      setUploading(false);
      setMessage(result.message);
      if (result.result === 'Success') {
        setVerificationSuccess(true);
      } else {
        setVerificationError(true);
      }
    } catch (err) {
      setUploading(false);
    }
  }

  return (
    <Layout>
      <main
        className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
        tabIndex="0"
      >
        <div className="py-6">
          <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Verify PDF File
            </h1>
          </div>
          <NotificationPanel
              show={verificationSuccess}
              bgColor="bg-green-100"
              message={`Verification succesfull: ${message}`}
            />
            <NotificationPanel
              show={verificationError}
              bgColor="bg-red-100"
              message={`Verification failed: ${message}`}
            />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div
              id="new-publication-form"
              className="mt-5 md:mt-0 md:col-span-2"
            >
              <form onSubmit={onSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
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
                          {uploadData && uploadData.name ? (
                            <>
                              <p className="text-sm text-gray-500">
                                {uploadData.name} ({uploadData.size})
                              </p>
                              <div className="flex justify-center font-medium text-sm text-indigo-600">
                                <label
                                  htmlFor="upload"
                                  className="cursor-pointer rounded-md hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Replace</span>
                                  <input
                                    id="upload"
                                    name="upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={onFileUpload}
                                  />
                                </label>
                                <span className="pl-1 hover:text-indigo-500">
                                  / {" "}
                                  <button onClick={onFileRemove}>
                                    Remove
                                  </button>
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                  <span>Upload a file</span>
                                  <input id="upload" name="upload" type="file" className="sr-only" onChange={onFileUpload} />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">PDF up to 30MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    {uploading ? (
                      <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                        <PulseLoader color="white" loading={uploading} size={9} />
                      </div>
                    ) : (
                      <button type="submit" className="h-10 w-20 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Verify
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
  );
}
