import Footer from "../components/common/Footer";
import ContactDetails from "../components/ContactPage/ContactDetails";
import ContactForm from "../components/ContactPage/ContactForm";

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row mb-20">
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>
        {/* Contact Details */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
        {/* Contact Form */}
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
