import { useState } from 'react';
import useSWR, { mutate } from 'swr'
import Link from 'next/link';
import { useAuth } from '../context/auth';
import api from '../lib/api';
import Protected from '../components/Protected';
import Layout from '../components/AppLayout';
import Modal from '../components/Modal';
import NotificationPanel from '../components/NotificationPanel';
import getIcon from '../components/Icons';

const PUBLICATION_PATH = process.env.NEXT_PUBLIC_PUBLICATION_PATH;

// Icons
const IconPencil = getIcon('pencil');
const IconTrash = getIcon('trash');

export default function Publications() {

  // Data fetching
  const { isReady } = useAuth();
  const { data: publications, error: fetchError } = useSWR(isReady ? PUBLICATION_PATH : null);

  // UI state
  const [ deleteId, setDeleteId ] = useState(null);
  const [ deleteSuccess, setDeleteSuccess ] = useState(false);
  const [ deleteError, setDeleteError ] = useState(false);
  
  // Delete publication
  async function deletePublication(id) {
    try {
      setDeleteId(null);
      mutate(PUBLICATION_PATH, publications.filter(pub => pub.id !== id), false);
      await api.delete(`${PUBLICATION_PATH}/${id}`);
      mutate(PUBLICATION_PATH);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      setDeleteError(true);
      setTimeout(() => setDeleteError(false), 3000);
    }
  }
  
  function renderPublications(publications) {
    return publications.map((publication, idx) => {
      const odd = (idx + 1) % 2 !== 0;
      return (
        <tr className={`text-gray-500 hover:text-gray-900 ${odd ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 group`} key={publication.id} >
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{publication.title}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">{publication.published_at ? 'Published' : 'Draft'}</td>
          <td className="py-4 whitespace-nowrap text-sm font-medium w-2">
            <div className="mr-2 inline-block cursor-pointer">
              <button onClick={() => setDeleteId(publication.id)}>
                <IconTrash color="text-gray-500" hoverColor="text-gray-900" width="6"/>
              </button>
            </div>
            <div className="mr-2 inline-block cursor-pointer">
              <Link href={`/publication/${publication.id}`}>
                <a><IconPencil color="text-gray-500" hoverColor="text-gray-900" width="6"/></a>
              </Link>
            </div>
          </td>
        </tr>
      );
    })
  }
 
  return (
    <>
      <NotificationPanel show={!!fetchError} bgColor="bg-red-400" message="Error fetching Publications! Please try to reload the app!"/>
      <NotificationPanel show={deleteError} bgColor="bg-red-400" message="Error deleting Publication!"/>
      <NotificationPanel show={deleteSuccess} bgColor="bg-green-400" message="Publication successfully deleted!"/>
      <Protected>
        <Layout>
          <Modal 
            show={!!deleteId}
            title="Delete" 
            message="Are you sure you want to delete this Publication?" 
            confirmLabel="Delete"
            onCancel={() => setDeleteId(null) }
            onConfirm={() => deletePublication(deleteId)}
          />
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 pb-6 sm:px-8 flex" >
                <div className="flex-1"><h1 className="text-2xl font-semibold text-gray-900">Publications</h1></div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                              <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                              <th scope="col" className="px-2 py-2 text-right">
                                <Link href="/publication/new">
                                  <button type="button"className="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500" >
                                    <span>New</span>
                                  </button>
                                </Link>
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            { renderPublications(publications || []) }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Layout>
      </Protected>
    </>
  );
}
