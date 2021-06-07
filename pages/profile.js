import { useEffect, useState } from 'react';
import useSWR from 'swr'
import PulseLoader from 'react-spinners/PulseLoader';
import { useAuth } from '../context/auth';
import Protected from '../components/Protected';
import api from '../lib/api';
import Layout from '../components/AppLayout';
import NotificationPanel from '../components/NotificationPanel';

const PUBLISHER_PATH=process.env.NEXT_PUBLIC_PUBLISHER_PATH

export default function Profile() {

  // Data fetching
  let { isReady, user } = useAuth();
  const url = isReady ? PUBLISHER_PATH : null;
  const { data: publisher, error: fetchError } = useSWR(url);

  user = user ? user : {};
  
  // Publisher state
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Update Publisher state on data fetch
  useEffect(() => {
    if (publisher && publisher.id) {
      setId(publisher.id);
      setName(publisher.name);
      setSlug(publisher.slug);
    }
  }, [publisher])
 
  async function onSubmit (e) {
    e.preventDefault()
    setSaving(true);

    const isNew = !id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? PUBLISHER_PATH : `${PUBLISHER_PATH}/${id}`;
    const data = { id, name, slug }

    try {
      const response = await api.request({ method, url, data });
      const savedPublisher = response.data;
      setSaving(false);
      setSaveSuccess(true)
      if (isNew) {
        setId(savedPublisher.id);
      }
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err) {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 2000)
    }
  }

  return (
    <Protected>
      <Layout>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">User</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input 
                        type="text" 
                        name="username" 
                        value={user.username}
                        disabled
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="text" 
                        name="email" 
                        value={user.email}
                        disabled
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="did" className="block text-sm font-medium text-gray-700">DID</label>
                      <input 
                        type="text" 
                        name="did" 
                        value={user.did}
                        disabled
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mb-4 mt-6 px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Publisher</h1>
            </div>
            <NotificationPanel show={saveSuccess} bgColor="bg-green-100" message="Publisher data updated!" />
            <NotificationPanel show={saveError} bgColor="bg-red-100" message="Error updating Publisher data!" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={onSubmit}>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={name}
                          onChange={evt => setName(evt.target.value)}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                        <input 
                          type="text" 
                          name="slug" 
                          value={slug}
                          onChange={evt => setSlug(evt.target.value)}
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                        />
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    { saving ? (
                          <div className="inline-block text-center py-2 px-2 border border-transparent shadow-sm rounded-md h-10 w-20 bg-indigo-600 hover:bg-indigo-700">
                            <PulseLoader color="white" loading={saving} size={9} /> 
                          </div>
                        ) : (
                          <button type="submit" className="h-10 w-20 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Save
                          </button>
                        ) 
                      }
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
