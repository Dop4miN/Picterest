import React from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import loginBackgroundVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

const Login = () => {
    const navigate = useNavigate();

    function handleCallbackResponse(response) {
        let userObj = jwt_decode(response.credential);
        console.log(userObj);
        localStorage.setItem('user', JSON.stringify(response.credential));

        const { name, jti, picture } = userObj;

        const doc = {
            _id: jti,
            _type: 'user',
            userName: name,
            image: picture
        };

        client.createIfNotExists(doc).then(() => {
            navigate('/', { replace: true });
        });
    }

    React.useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
            callback: handleCallbackResponse
        });
        google.accounts.id.renderButton(
            document.getElementById('signInGoogle'),
            { theme: 'outline', size: 'large' }
        );
    }, []);

    return (
        <div className="flex justify-start items-center flex-col h-screen">
            <div className="relative w-full h-full">
                <video
                    src={loginBackgroundVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className="h-full w-full object-cover"
                />
                <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} alt="logo" width="130px" />
                    </div>
                    <div className="shadow-2xl">
                        <div id="signInGoogle" className="bg-mainColor"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
