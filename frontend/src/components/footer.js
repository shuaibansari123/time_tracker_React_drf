import React from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faHome, faEnvelope, faPhone, faPrint } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (

      <footer
        className="text-center text-lg-start text-white"
        style={{ backgroundColor: "#1c2331" }}
      >
        <section
          className="d-flex justify-content-between p-4"
          style={{ backgroundColor: "#6351ce" }}
        >
          <div className="me-5">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            {/* Links to social networks would go here */}
            {/* Replace # with actual links */}
            <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
            {/* Add other social icons as needed */}
            <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faGithub} size="lg" />
            </a>
            <a href="#" className="text-white me-4">
                <FontAwesomeIcon icon={faInstagram}  size="lg" />
            </a>

          </div>
        </section>

        <section className="">
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              {/* Company Info */}
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className=" fw-bold">TrackerAI</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{ width: "60px", backgroundColor: "#7c4dff", height: "2px" }}
                />
                <p>
                  This is the footer
                </p>
              </div>

              {/* Products */}
              {/* Repeat the structure for other columns as needed */}
              
              {/* Contact Info */}
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">

                <h6 className="text-uppercase fw-bold">Contact</h6>


                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{ width: "60px", backgroundColor: "#7c4dff", height: "2px" }}
                />
                <p><FontAwesomeIcon icon={faHome} size="lg" className="mr-3" /> London, UK</p>
                <p><FontAwesomeIcon icon={faEnvelope} size="lg" className="mr-3" />  jeyu54217@gmail.com</p>
                <p><FontAwesomeIcon icon={faPhone} size="lg" className="mr-3" /> + 44 234 567 88</p>
                <p><FontAwesomeIcon icon={faPrint} size="lg" className="mr-3" /> + 44 234 567 89</p>
                                
              </div>
              
            </div>
          </div>
        </section>

        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2024 Copyright:
          <a className="text-white" href="/">Jerry Yu</a>
        </div>
      </footer>

  );
};

export default Footer;
