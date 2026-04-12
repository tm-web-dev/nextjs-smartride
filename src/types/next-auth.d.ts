import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        isVerified?:boolean
    }

    interface Session {
        user: {
            id?: string;
            email?: string;
            isVerified?:boolean
        } & DefaultSession['user'];
    }
}
