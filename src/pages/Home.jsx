import Home1 from "../assets/Images/home1.png";
import Home2 from "../assets/Images/home2.jpeg";
import Home3 from "../assets/Images/home3.jpeg";
import Home4 from "../assets/Images/home4.png";
import Home5 from "../assets/Images/home5.png";
import HighlightText from "../components/core/Homepage/HighlightText";
import CTAButton from "../components/core/Homepage/Button";
import Footer from "../components/common/Footer";
import Atom from "../components/core/Homepage/Atom";

const Home = () => {
  return (
    <div>
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between gap-8">
        {/* Section 1 */}
        <div className="flex justify-between items-center my-16">
          <div className="w-[50%]">
            <div className="text-4xl text-center font-semibold mb-7">
              Master Skills,
              <HighlightText text={"One Step at a Time"} />
            </div>

            <div className="text-lg font-bold text-center text-richblack-300">
              Your ultimate destination for top-notch, curated courses to
              elevate your skills and career. Learn at your own pace, track your
              progress, and earn rewards as you upskill. With SkillStep, every
              step brings you closer to mastering new skills and achieving your
              goals.
            </div>

            <div className="flex justify-center flex-row gap-7 mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                Explore Courses
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Start Learning Now
              </CTAButton>
            </div>
          </div>

          <div className="w-[50%]">
            <img src={Home1} alt="Home1" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center mt-10 gap-10 sm:gap-20 mb-10">
          {/* left part */}
          <div className="w-1/2 sm:w-[38%]">
            <img src={Home2} height={300} alt="" />
          </div>

          {/* left part */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            <div className="text-4xl font-semibold mt-10">
              Structured
              <HighlightText text={" Learning "} />
              Path
            </div>

            <div className="w-[90%] text-xl font-bold text-blue-50s">
              Stay Consistent and Master New Skills Effectively
            </div>

            <div className="w-[90%] text-lg font-bold text-richblack-300">
              Follow a guided, alternate-day structure to maintain consistency
              and make steady progress. Each course is designed to keep you
              engaged and motivated, without overwhelming you.
            </div>

            <div className="flex flex-row gap-7 mt-8">
              <CTAButton
                active={true}
                linkto={"https://docchat-aehjsonnxwib6hxm9kmtic.streamlit.app/"}
              >
                Explore
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center mt-10 gap-10 sm:gap-20 mb-10">
          {/* left part */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            <div className="text-4xl font-semibold mt-10">
              Progress
              <HighlightText text={" Tracking & Certificates"} />
            </div>

            <div className="w-[90%] text-xl font-bold text-blue-50s">
              Monitor Your Progress and Showcase Your Achievements
            </div>

            <div className="w-[90%] text-lg font-bold text-richblack-300">
              Stay on top of your learning journey with personalized dashboards
              and earn certificates upon course completion to highlight your
              accomplishments.
            </div>

            <div className="flex flex-row gap-7 mt-8">
              <CTAButton
                active={true}
                linkto={"https://docchat-aehjsonnxwib6hxm9kmtic.streamlit.app/"}
              >
                Explore
              </CTAButton>
            </div>
          </div>

          {/* right part */}
          <div className="w-1/2 sm:w-[38%]">
            <img src={Home3} height={300} alt="" />
          </div>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-10 sm:gap-20">
          {/* left part */}
          <div className="w-1/2 sm:w-[38%]">
            <img src={Home4} height={300} alt="" />
          </div>

          {/* right part */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            <div className="text-4xl font-semibold mt-10">
              Gamification for
              <HighlightText text={" Motivation"} />
            </div>

            <div className="w-[90%] text-xl font-bold text-blue-50s">
              Stay Engaged and Motivated with Fun Rewards
            </div>

            <div className="w-[90%] text-lg font-bold text-richblack-300">
              Earn badges, points, and climb the leaderboard as you progress
              through your learning journey. Keep up the streak and be rewarded
              for your dedication and hard work!
            </div>

            <div className="flex flex-row gap-7 mt-8">
              <CTAButton
                active={true}
                linkto={"https://docchat-aehjsonnxwib6hxm9kmtic.streamlit.app/"}
              >
                Explore
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="flex flex-col-reverse sm:flex-row justify-center items-center mt-10 gap-10 sm:gap-20 mb-10">
          {/* left part */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            <div className="text-4xl font-semibold mt-10">
              Email
              <HighlightText text={" Notifications"} />
            </div>

            <div className="w-[90%] text-xl font-bold text-blue-50s">
              Stay Informed and On Track with Timely Updates
            </div>

            <div className="w-[90%] text-lg font-bold text-richblack-300">
              Receive timely updates and reminders about new content and
              courses, tailored to your learning preferences. Stay informed and
              never miss an opportunity to enhance your skills.
            </div>

            <div className="flex flex-row gap-7 mt-8">
              <CTAButton
                active={true}
                linkto={"https://docchat-aehjsonnxwib6hxm9kmtic.streamlit.app/"}
              >
                Explore
              </CTAButton>
            </div>
          </div>

          {/* right part */}
          <div className="w-1/2 sm:w-[38%]">
            <img src={Home5} height={300} alt="" />
          </div>
        </div>

        {/* Section 6 */}
        <div className="flex flex-col-reverse lg:flex-row justify-center items-center mt-10 gap-10 sm:gap-20 mb-10">
          {/* right part */}
          <div className="w-[90%] lg:w-[38%]">
            <Atom />
          </div>

          {/* left part */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 text-wrap">
            <div className="text-4xl font-semibold mt-10">
              Unlock Your
              <HighlightText text={" Future"} />
            </div>

            <div className="w-[90%] text-xl font-bold text-blue-50s">
              Transform Your Learning into Opportunities
            </div>

            <div className="w-[90%] text-lg font-bold text-richblack-300">
              At SkillStep, we equip you with the tools and resources to achieve
              your career goals through structured courses and a supportive
              community. Gain in-demand skills, access tailored content, earn
              recognized certifications, and connect with peers and mentors—all
              designed to prepare you for a brighter future with top companies.
            </div>

            <div className="flex flex-row gap-7 mt-8">
              <CTAButton
                active={true}
                linkto={"https://docchat-aehjsonnxwib6hxm9kmtic.streamlit.app/"}
              >
                Explore
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/*Footer */}
      <Footer />
    </div>
  );
};

export default Home;
