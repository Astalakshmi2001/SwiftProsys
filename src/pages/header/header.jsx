import React from 'react';

function Header({ collapsed, toggleSidebar }) {
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
        <header className="fixed top-0 left-0 w-full h-[60px] bg-white flex justify-between items-center px-2 shadow-sm">
            <button
                onClick={toggleSidebar}
                className={`text-2xl bg-white text-black transition-all duration-300 w-[10px] ${collapsed ? "ml-[70px]" : "ml-[250px]"
                    }`}
            >
                <i className="bx bx-menu text-black"></i>
            </button>

            <div className="flex flex-row-reverse gap-2 items-center">
                <div>
                    <p className="m-0 p-0">Lara</p>
                    <p className="m-0 p-0 text-sm">Project Leader</p>
                </div>
                <img
                    src={photoURL ? photoURL : generateAvatarUrl(fullName)}
                    alt="UserImage"
                    className="w-[45px] h-[45px] rounded-full"
                />
            </div>
        </header>
    )
}

export default Header
