import React from 'react';
import '../../styles/mainPage.css';
// components
import VideoBlock from './VideoBlock';
import AboutBlock from './AboutBlock';
import Footer from '../footer';
import Navbar from '../Navbar';
import MainFeatures from './MainFeatures';
import Slogan from './Slogan';
import DemoImg from './DemoImg';

function MainPage() {


    return (
        <div className="main-page">
            <Navbar />
            <div className="container">
                
                <div className="row main-page-row">
                    {/* Slogan */}
                    <Slogan />
                    {/* Demo Img  */}
                    <DemoImg />
                </div>
            </div>
            {/* Video Demos */}
            <div className="bg-dark text-light  py-3">
                <VideoBlock />
            </div>
            {/* Main Features */}
            <div className="container main-page-container-block">
                <MainFeatures />
            </div>
            {/* About */}
            <div className="container main-page-container-block">
                <AboutBlock />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default MainPage;
 