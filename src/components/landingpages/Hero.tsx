'use client';

import { trpc } from "@/trpc-client/client";
import { ArrowRight, CircleCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const HeroSection = () => {

  const  { data : session } = useSession();

  const { data: user } = trpc.getuser.useQuery({ id : session?.user.id! });

  const getHref = () => {
    if (!user) return "/auth/signup";
    if (user?.role === "PROVIDER") return "/provider/upload";
    if (user?.role === "CONSUMER") return "/consumer/dashboard";
    return "/auth/signup"; // Fallback
  };

  return (
    <section
      id="hero"
      className="pt-28 pb-20 md:pt-32 md:pb-24 px-4 bg-gradient-to-br from-white to-gray-100 dark:from-neutral-900 dark:to-neutral-800 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="w-full lg:w-2/3 space-y-6 text-center lg:text-left lg:ml-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl  font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">AI-Agent</span> API Marketplace
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Discover, integrate, and monetize APIs built for AI agents and developers.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Link
                href={getHref()}
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 text-center w-full sm:w-auto"
              >
                Get Started – It's Free!
              </Link>
              <Link
                href="#how-it-works"
                className="group inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 w-full sm:w-auto justify-center"
              >
                How it works
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"/>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-2/6 relative lg:-top-20">
          <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 border border-gray-100 dark:border-neutral-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start building in minutes</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1.5 mt-0.5">
                    <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Create a free account</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sign up in seconds, no credit card required</p>
                  </div>
                </div>
                
                
                
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1.5 mt-0.5">
                    <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Integrate seamlessly</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use our SDKs for quick implementation</p>
                  </div>
                </div>
                
              </div>
              
              <div className="mt-8 font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <div className="text-gray-400">// Quick integration example</div>
                <div className="mt-2">
                  <span className="text-purple-400">import</span> <span className="text-white">{"{"} AutonAPI {"}"}</span> <span className="text-purple-400">from</span> <span className="text-yellow-300">'@autonapi/client'</span>;
                </div>
                <div className="mt-1">
                  <span className="text-blue-400">const</span> api = <span className="text-purple-400">new</span> <span className="text-white">AutonAPI</span>(<span className="text-yellow-300">'YOUR_API_KEY'</span>);
                </div>
                <div className="mt-1">
                  <span className="text-green-400">// Connect to Vision API</span>
                </div>
                <div className="mt-1">
                  <span className="text-blue-400">const</span> vision = <span className="text-purple-400">await</span> api.<span className="text-white">connect</span>(<span className="text-yellow-300">'vision'</span>);
                </div>
                <div className="mt-1">
                  <span className="text-blue-400">const</span> result = <span className="text-purple-400">await</span> vision.<span className="text-white">analyze</span>(imageData);
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute z-[-1] -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute z-[-1] -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;