import React from "react";
import { FooterLink2 } from "../../../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <footer className="bg-richblack-800 text-richblack-400">
      <div className="w-11/12 max-w-maxContent mx-auto py-14">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 border-b border-richblack-700 pb-10">
          {/* Left Section */}
          <div className="lg:w-1/2 flex flex-wrap gap-8">
            {/* Logo + Company */}
            <div className="w-[40%] min-w-[160px] flex flex-col gap-4">
              <img src={Logo} alt="Logo" className="w-36 object-contain" />
              <h2 className="text-richblack-50 font-semibold text-lg">Company</h2>
              <ul className="space-y-2">
                {["About", "Careers", "Affiliates"].map((ele, i) => (
                  <li key={i}>
                    <Link
                      to={ele.toLowerCase()}
                      className="hover:text-richblack-50 transition"
                    >
                      {ele}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 text-xl mt-4">
                <FaFacebook className="hover:text-blue-500 transition" />
                <FaGoogle className="hover:text-red-500 transition" />
                <FaTwitter className="hover:text-sky-400 transition" />
                <FaYoutube className="hover:text-red-600 transition" />
              </div>
            </div>

            {/* Resources */}
            <div className="w-[40%] min-w-[160px]">
              <h2 className="text-richblack-50 font-semibold text-lg">Resources</h2>
              <ul className="space-y-2 mt-2">
                {Resources.map((ele, index) => (
                  <li key={index}>
                    <Link
                      to={ele.split(" ").join("-").toLowerCase()}
                      className="hover:text-richblack-50 transition"
                    >
                      {ele}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="text-richblack-50 font-semibold text-lg mt-6">Support</h2>
              <Link
                to={"/help-center"}
                className="block mt-2 hover:text-richblack-50 transition"
              >
                Help Center
              </Link>
            </div>

            {/* Plans + Community */}
            <div className="w-[40%] min-w-[160px]">
              <h2 className="text-richblack-50 font-semibold text-lg">Plans</h2>
              <ul className="space-y-2 mt-2">
                {Plans.map((ele, index) => (
                  <li key={index}>
                    <Link
                      to={ele.split(" ").join("-").toLowerCase()}
                      className="hover:text-richblack-50 transition"
                    >
                      {ele}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="text-richblack-50 font-semibold text-lg mt-6">Community</h2>
              <ul className="space-y-2 mt-2">
                {Community.map((ele, index) => (
                  <li key={index}>
                    <Link
                      to={ele.split(" ").join("-").toLowerCase()}
                      className="hover:text-richblack-50 transition"
                    >
                      {ele}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section (Dynamic Links) */}
          <div className="lg:w-1/2 flex flex-wrap gap-8">
            {FooterLink2.map((ele, i) => (
              <div key={i} className="min-w-[160px] w-[40%]">
                <h2 className="text-richblack-50 font-semibold text-lg">{ele.title}</h2>
                <ul className="space-y-2 mt-2">
                  {ele.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.link}
                        className="hover:text-richblack-50 transition"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center text-sm mt-6">
          <div className="flex flex-wrap gap-4">
            {BottomFooter.map((ele, i) => (
              <Link
                key={i}
                to={ele.split(" ").join("-").toLowerCase()}
                className="hover:text-richblack-50 transition"
              >
                {ele}
              </Link>
            ))}
          </div>
          <div className="mt-4 lg:mt-0 text-center">
            Made with ❤️ SkillUp © 2023 Priyaaaa
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
