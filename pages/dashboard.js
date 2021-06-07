
import Protected from '../components/Protected';
import Layout from '../components/AppLayout';

export default function Dashboard() {
  return (
    <Protected>
      <Layout>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <span className="hidden">
                TODO Implement Dashboard
              </span>
              <div className="py-4">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
              </div>
              <span className="hidden">TODO: REMOVE /End replace </span>
            </div>
          </div>
        </main>
      </Layout>
    </Protected>
  );
}
