import React from 'react';
import '../../App.css';
// @ts-ignore
import mainlogo from "../../assets/mainlogo.png";


function Header() {
    const photoURL = '';
    const fullName = "Lara"
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const generateAvatarUrl = (name) => {
        const firstLetter = name.charAt(0);
        const backgroundColor = getRandomColor();
        const imageSize = 130;
        return `https://ui-avatars.com/api/?background=${backgroundColor}&size=${imageSize}&color=FFF&font-size=0.60&name=${firstLetter}`;
    };
    return (
        <header className='shadow-sm'>
            <div className="logo">
                <img src={mainlogo} alt="SwiftProsys" />
            </div>
            <div className="profile">
                <div>
                    <p>Lara</p>
                    <p>Project Leader</p>
                </div>
                <img
                    src={photoURL ? photoURL : generateAvatarUrl(fullName)}
                    alt="UserImage"
                />
            </div>
        </header>
    )
}

export default Header
