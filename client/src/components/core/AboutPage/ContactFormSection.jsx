import React from "react";
import ContactUsForm from "../../common/ContactUsForm";

const ContactFormSection = () => {
    return (
        <section className="w-full bg-richblack-900 ">
            <div className="max-w-4xl mx-auto text-center">
                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Get In <span className="text-yellow-500">Touch</span>
                </h1>

                {/* Subtitle */}
                <p className="text-richblack-300 max-w-2xl mx-auto mb-10">
                    We’d love to hear from you. Please fill out this form and we’ll get
                    back to you as soon as possible.
                </p>

                {/* Form Container */}
                <div >
                    <ContactUsForm />
                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;
