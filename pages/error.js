import { useRouter } from 'next/router';

const ErrorPage = () => {
    const router = useRouter();
    const { message } = router.query; // Access the 'message' query parameter

    return (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#ffcccc', color: '#333' }}>
            <h1>Error Occurred</h1>
            <p>{message ? decodeURIComponent(message) : 'An unknown error occurred.'}</p>
        </div>
    );
};

export default ErrorPage;