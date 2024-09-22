import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
      <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
        We're here to help!
      </h1>
      <p>
        For questions, feedback, or support, reach out anytime. Our team is
        dedicated to ensuring you have the best experience on SkillStep.
      </p>
      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
