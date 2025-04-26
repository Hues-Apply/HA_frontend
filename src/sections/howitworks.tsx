import createyourprofile from '@/assets/HowItWorks/createyourprofile.png';
import getaimatch from '@/assets/HowItWorks/getaimatch.png';
import trackprogress from '@/assets/HowItWorks/trackprogress.png';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Create Your Profile',
      description:
        'Sign up & fill in details like education, career goals, and interests. AI starts learning about you. The more details you provide, the better AI matches you with opportunities that fit your profile.',
      image: createyourprofile,
    },
    {
      title: 'Get Personalized AI Matches – AI',
      description:
        'AI suggests scholarships & job opportunities based on your profile, showing eligibility percentage to help decision-making. Our AI scans thousands of opportunities to find the best ones tailored to your skills and background.',
      image: getaimatch,
    },
    {
      title: 'Apply & Track Progress',
      description:
        'Apply directly through the platform, track progress, and receive deadline alerts. Stay updated with real-time notifications and easily monitor your application status.',
      image: trackprogress,
    },
  ];

  return (
    <section className="px-6 py-12 bg-white text-center">
      <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
        <span className="text-blue-600 font-semibold text-lg">How It Works</span>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Making your job search easy and scholarship guidance</h2>
      <p className="text-gray-600 mb-10">Get personalized job and scholarship matches with Hues AI and apply in just one click.</p>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 w-full md:w-1/3 text-left"
          >
            <img
              src={step.image}
              alt={step.title}
              className="rounded-xl mb-4 w-full h-48 object-cover"
            />
            <h3 className="text-lg font-semibold text-blue-600 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;


