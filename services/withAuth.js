import { onlyAuthUserSSR } from 'services/server-library';

const withAuth = (WrappedComponent, options = {}) => {
    const { redirect = true } = options;

    const AuthComponent = (props) => {
        return <WrappedComponent {...props} />;
    };


    AuthComponent.getServerSideProps = async (context) => {
        console.log("getServerSideProps is executing"); // Add this line
        const { req } = context;
        console.log("THIS GET HITSSSSSSSSSS"); // Add this line

        const user = await onlyAuthUserSSR(req);

        if (!user && redirect) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        const wrappedComponentProps = WrappedComponent.getServerSideProps
            ? await WrappedComponent.getServerSideProps(context)
            : {};

        return {
            props: {
                ...wrappedComponentProps.props,
                user: user || null,
            },
        };
    };

    return AuthComponent;
};

export default withAuth;

