
import { Link } from 'react-router-dom';

const RoleCard = ({ role, description, link, gradient, icon, delay }: { role: string; description: string; link: string; gradient: string; icon: string; delay: string }) => (
  <div className={`relative group p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border border-gray-100 overflow-hidden ${delay}`}>
    {/* Background Gradient on Hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

    {/* Icon */}
    <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg mb-6 transform group-hover:rotate-6 transition-transform duration-300`}>
      {icon}
    </div>

    <h2 className="text-3xl font-extrabold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 transition-colors">
      {role}
    </h2>
    <p className="text-gray-500 mb-8 leading-relaxed">
      {description}
    </p>

    <Link to={link} className="block">
      <button className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 transform`}>
        Continue as {role} →
      </button>
    </Link>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex flex-col justify-center">

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 tracking-wide uppercase border border-blue-100">
            Welcome to the Future of Commerce
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Journey</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join our thriving ecosystem. Whether you're buying unique finds, selling your craft, or managing the platform.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto w-full px-4">

          <RoleCard
            role="Customer"
            description="Discover unique, handcrafted goods from local artisans. Shop seamlessly and securely."
            link="/auth?role=customer"
            gradient="from-blue-500 to-cyan-500"
            icon="🛍️"
            delay="animate-fade-in-up"
          />

          <RoleCard
            role="Vendor"
            description="Launch your digital storefront in minutes. Reach customized audiences and grow your brand."
            link="/auth?role=vendor"
            gradient="from-emerald-500 to-teal-500"
            icon="🏪"
            delay="animate-fade-in-up animation-delay-200"
          />

          <RoleCard
            role="Admin"
            description="Oversee marketplace operations, manage users, and ensure platform integrity."
            link="/auth?role=admin"
            gradient="from-indigo-600 to-violet-600"
            icon="🛡️"
            delay="animate-fade-in-up animation-delay-400"
          />

        </div>

        {/* Footer Text */}
        <div className="text-center mt-20 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} E-Shop Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
