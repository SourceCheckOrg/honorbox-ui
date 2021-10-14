import { useRouter } from "next/router";
import PuffLoader from "react-spinners/PuffLoader";
import { useAuth } from "../context/auth";

const Protected = (props) => {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Render spinner while loading user data
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <PuffLoader color="blue" loading={true} size={200} />
      </div>
    );
  }

  // Redirect user to sign in page
  if (!isAuthenticated) {
    router.push('/');
  }

  return props.children;
};

export default Protected;