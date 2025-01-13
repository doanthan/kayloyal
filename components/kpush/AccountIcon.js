import React, { useRef, useState } from 'react';
import { useAuth } from 'services/AuthProvider'; // Adjust the import path according to your project structure
import Link from 'next/link';

const AccountIcon = ({ handleIconFileSelect, setIconUrl }) => {

    const { currentAccount } = useAuth(); // Accessing currentAccount from auth state
    const auth = useAuth()
    auth.se
    return (
        <>
            {currentAccount && currentAccount.logoImg &&
                <Link href="/account-settings">
                    <img src={currentAccount.logoImg} alt="Account Icon" style={{ width: '100px', height: '100px' }} />
                </Link>

            }

        </>
    );
};

export default AccountIcon;