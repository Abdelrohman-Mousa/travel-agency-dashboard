import {account, appwriteConfig, database} from "~/appwrite/client";
import {ID, OAuthProvider, Query} from "appwrite";
import {redirect} from "react-router";

export const getExistingUser = async (id: string) => {
    try {
        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', id)]
        );
        return total > 0 ? documents[0] : null;
    } catch (e) {
        console.log('Error fetching user:', e);
        return null;
    }
};

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            'google',
            'http://localhost:5173',         // success redirect
            'http://localhost:5173/sign-in'  // failure redirect
        );
    } catch (e) {
        console.log('loginWithGoogle', e);
    }
}


export const getUser = async () => {
    try {
        const user = await account.get();

        if (!user) return redirect('/sign-in');

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        );

        // If user exists in database, return the user document
        if (documents.length > 0) {
            return documents[0];
        }

        // If user doesn't exist in database, store user data and return the new user document
        return await storeUserData();
    } catch (e) {
        console.log('getUser error:', e);
        return null;
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
    } catch (e) {
        console.log('logoutUser',e);
    }
}

export const getGooglePicture = async () => {
    try {
        // Get the current session which contains OAuth2 provider's access token
        const session = await account.getSession('current');

        if (!session || !session.provider || session.provider !== 'google' || !session.providerAccessToken) {
            console.log('No valid Google session found');
            return null;
        }

        const accessToken = session.providerAccessToken;

        // Make a request to Google People API to get the profile photo
        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            console.log('Failed to fetch profile photo from Google People API');
            return null;
        }

        const data = await response.json();

        // Extract the profile photo URL from the response
        const profilePhotoUrl = data.photos && data.photos.length > 0
            ? data.photos[0].url
            : null;

        return profilePhotoUrl;
    } catch (e) {
        console.log('getGooglePicture error:', e);
        return null;
    }
}

export const storeUserData = async () => {
    try {
        // Get current user
        const user = await account.get();

        if (!user) return null;

        // Check if user already exists in database
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', user.$id)]
        );

        // If user already exists, return the user document
        if (documents.length > 0) {
            return documents[0];
        }

        // Get profile photo URL from Google People API
        const profilePhotoUrl = await getGooglePicture();

        // Create new user document
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePhotoUrl || '',
                joinedAt: new Date().toISOString(),
            }
        );

        return newUser;
    } catch (e) {
        console.log('storeUserData error:', e);
        return null;
    }
}

// ✅ عدّل الدالة تستقبل object:
export const getAllUsers = async ({ limit, offset }: { limit: number; offset: number }) => {
    try {
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.limit(limit), Query.offset(offset)]
        );

        if (total === 0) return { users: [], total };

        return { users, total };
    } catch (e) {
        console.log('Error fetching users');
        return { users: [], total: 0 };
    }
}
