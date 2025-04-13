import { Brain, Play, Plus } from "lucide-react";
/* import { DotLottieReact } from "@lottiefiles/dotlottie-react"; */

/* COMPONENTS */
import Hero from "../components/Hero";

function Home() {
  return (
    <div className="min-h-screen">
      {/*
      <DotLottieReact src="../lotties/frog.lottie" autoplay loop />
      */}
      <div className="relative overflow-hidden">
        <Hero />

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Brain className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Background Noise</h3>
              <p className="text-gray-600">
                Lo-Fi music typically features soft, ambient sounds that can
                help mask distracting background noises, creating a more focused
                environment for studying.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Play className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Relaxation</h3>
              <p className="text-gray-600">
                The mellow beats and calming melodies can reduce stress and
                anxiety, making it easier to concentrate on tasks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Plus className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Consistency </h3>
              <p className="text-gray-600">
                The repetitive nature of Lo-Fi tracks provides a steady auditory
                backdrop that can help maintain a flow state, allowing for
                sustained attention and productivity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Plus className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Minimal/No Lyrics </h3>
              <p className="text-gray-600">
                Most Lo-Fi music has minimal or no lyrics, which can prevent
                cognitive overload and help listeners focus on their work rather
                than getting distracted by words.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Plus className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Mood Enhancement </h3>
              <p className="text-gray-600">
                The soothing qualities of Lo-Fi music can enhance mood, making
                studying a more enjoyable experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
