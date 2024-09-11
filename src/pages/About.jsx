import FoundingStory from "../assets/Images/FoundingStory.png";
import WhyChooseUs from "../components/core/AboutPage/ChooseUs";
import HighlightText from "../components/core/Homepage/HighlightText";
import Footer from "../components/common/Footer";

const About = () => {
  return (
    <div>
      {/* Section 1 */}
      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-richblack-100">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[90%]">
            Driving Innovation in Online Education for a<br></br>
            <HighlightText text={"Brighter Future"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[90%]">
              At SkillStep, we make learning accessible, engaging, and
              structured to help you grow step by step. Our platform supports
              individuals committed to self-improvement, offering curated
              courses, progress tracking, and gamified rewards for an effective
              and fun learning experience.
            </p>
          </header>
        </div>
      </section>
      {/* Section 2 */}
      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            {/* Our Founding Story */}
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                SkillStep was born out of a simple realization — learning online
                often lacks structure and motivation. Our founders, passionate
                lifelong learners, found themselves overwhelmed by the sheer
                number of resources and courses available but with no clear path
                to mastery.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                They envisioned a platform that would not only provide
                high-quality content but also guide learners through structured
                pathways, ensuring consistency, progress, and long-term success.
                Thus, SkillStep was created to bridge the gap between endless
                information and effective, goal-oriented learning.
              </p>
            </div>
            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            {/* Our vision and mission */}
            <div className="flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                To create a global community of learners empowered by
                structured, consistent learning experiences that help them
                achieve their full potential in a rapidly evolving world. We aim
                to foster an environment where individuals can continuously
                grow, adapt, and excel, regardless of their starting point.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our mission is to revolutionize the way people learn by offering
                structured, engaging, and rewarding educational experiences. We
                are committed to making learning accessible, motivating learners
                to stay consistent, and helping them celebrate every milestone
                on their journey to mastery.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section 4 */}
      <div className="flex justify-center items-center">
        <WhyChooseUs />
      </div>
      <Footer />
    </div>
  );
};

export default About;
