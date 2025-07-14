import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, RotateCcw, Check, Palette, HashIcon as Hair, Shirt, Dices, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { backgroundOptions, clothesOptions, expressionOptions, hairOptions, headOptions } from "@/helpers/avatar-options";

// Decorative background blobs
const BackgroundBlob = ({ color, size, position }: { color: string; size: string; position: string }) => {
  return (
    <div
      className={`absolute ${size} ${color} rounded-full opacity-10 ${position} animate-pulse`}
      style={{ animationDuration: "4s" }}
    />
  );
};

export default function AvatarCreator() {
  const menuSelectSound = () => {
    const audio = new Audio("/avatar-assets/sounds/menuselect.mp3");
    audio.play().catch(() => {}); // Ignore errors if audio fails
  };

  const selectStyleSound = () => {
    const audio = new Audio("/avatar-assets/sounds/click_select.mp3");
    audio.play().catch(() => {}); // Ignore errors if audio fails
  };

  useEffect(() => {
    const audio = new Audio("/avatar-assets/sounds/you_made_it.mp3");
    audio.play().catch(() => {}); // Ignore errors if audio fails
  }, [])

  // Default values from your options
  const defaultHead = "/avatar-assets/heads/default-head-clear.png";
  const defaultHair = "/avatar-assets/hairs/HairB1.png";
  const defaultExpression = "/avatar-assets/expressions/F1.png";
  const defaultClothes = "/avatar-assets/clothes/boy-uniform.png";

  const [selectedHead, setSelectedHead] = useState(defaultHead);
  const [selectedHair, setSelectedHair] = useState(defaultHair);
  const [selectedExpression, setSelectedExpression] = useState(defaultExpression);
  const [selectedClothes, setSelectedClothes] = useState(defaultClothes);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("head");

  const [selectedBackground, setSelectedBackground] = useState('/avatar-assets/bg/bg3.jpg');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    setSelectedHead(defaultHead);
    setSelectedHair(defaultHair);
    setSelectedExpression(defaultExpression);
    setSelectedClothes(defaultClothes);
    selectStyleSound();
  };

  const handleRandomize = () => {
    // Get random options from each category
    const randomHead = headOptions[Math.floor(Math.random() * headOptions.length)].image;
    const randomHair = hairOptions[Math.floor(Math.random() * hairOptions.length)].image;
    const randomExpression = expressionOptions[Math.floor(Math.random() * expressionOptions.length)].image;
    const randomClothes = clothesOptions[Math.floor(Math.random() * clothesOptions.length)].image;
    const randomBackground = backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)].image;

    // Set the random selections
    setSelectedHead(randomHead);
    setSelectedHair(randomHair);
    setSelectedExpression(randomExpression);
    setSelectedClothes(randomClothes);
    setSelectedBackground(randomBackground);

    // Play sound
    selectStyleSound();
  };

  const handleOptionSelect = (type: string, image: string) => {
    if (type === "head") setSelectedHead(image);
    if (type === "hair") setSelectedHair(image);
    if (type === "expression") setSelectedExpression(image);
    if (type === "clothes") setSelectedClothes(image);

    selectStyleSound();
  };

  const handleNextBackground = () => {
    const currentIndex = backgroundOptions.findIndex(bg => bg.image === selectedBackground);
    const nextIndex = (currentIndex + 1) % backgroundOptions.length;
    setSelectedBackground(backgroundOptions[nextIndex].image);
    selectStyleSound();
  };
  
  const handlePrevBackground = () => {
    const currentIndex = backgroundOptions.findIndex(bg => bg.image === selectedBackground);
    const prevIndex = (currentIndex - 1 + backgroundOptions.length) % backgroundOptions.length;
    setSelectedBackground(backgroundOptions[prevIndex].image);
    selectStyleSound();
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative blobs */}
      <BackgroundBlob color="bg-blue-200" size="w-32 h-32" position="top-10 right-20" />
      <BackgroundBlob color="bg-purple-200" size="w-24 h-24" position="top-40 right-80" />
      <BackgroundBlob color="bg-pink-200" size="w-40 h-40" position="bottom-20 left-10" />
      <BackgroundBlob color="bg-indigo-200" size="w-28 h-28" position="bottom-40 right-40" />
      <BackgroundBlob color="bg-cyan-200" size="w-36 h-36" position="top-60 left-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">PREP PLAY AVATAR CREATOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Create our Avatar!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create a cool and unique character using our easy and fun tools!
          </p>
        </div>

        <div className="grid lg:grid-cols-10 gap-8">
          {/* Avatar Preview - Left Side (60%) */}
          <div
            className={`lg:col-span-6 transition-all duration-1000 delay-300 ease-out ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <Card className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden sticky top-8 h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="text-center mb-6 flex flex-col justify-center items-center w-full ">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Avatar</h3>
                  <p className="text-sm text-slate-500">Live Preview</p>
                 
                </div>
                {/* Large Avatar Preview */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-white/30 w-full max-w-md">        
                    <div className="relative w-full aspect-square mx-auto">
                      <img src={selectedBackground} className="absolute inset-0 object-cover h-full w-full brightness-75 rounded-lg"/>
                      {/* Clothes overlay with breathing animation */}
                      <img
                        src={selectedClothes || "/placeholder.svg?height=192&width=192"}
                        className="absolute inset-0 w-full h-full object-contain transition-all duration-500 animate-breathing top-[-10px]"
                        alt="Avatar clothes"
                        style={{
                          animation: "breathing 3s ease-in-out infinite"
                        }}
                      />
                      {/* Base head with bobbing animation */}
                      <div 
                        className="absolute inset-0 w-full h-full transition-all duration-500 animate-head-bob"
                        style={{
                          animation: "headBob 2s ease-in-out infinite",
                          transformOrigin: "bottom center"
                        }}
                      >
                        <img
                          src={selectedHead || "/placeholder.svg?height=192&width=192"}
                          className="w-full h-full object-contain"
                          alt="Avatar head"
                        />
                      </div>
                    
                      {/* Hair overlay with same bobbing animation */}
                      <div 
                        className="absolute inset-0 w-full h-full transition-all duration-500 animate-head-bob"
                        style={{
                          animation: "headBob 2s ease-in-out infinite",
                          transformOrigin: "bottom center"
                        }}
                      >
                        <img
                          src={selectedHair || "/placeholder.svg?height=192&width=192"}
                          className="w-full h-full object-contain"
                          alt="Avatar hair"
                        />
                      </div>

                      {/* Expressions overlay with same bobbing animation */}
                      <div 
                        className="absolute inset-0 w-full h-full transition-all duration-500 animate-head-bob"
                        style={{
                          animation: "headBob 2s ease-in-out infinite",
                          transformOrigin: "bottom center"
                        }}
                      >
                        <img
                          src={selectedExpression || "/placeholder.svg?height=192&width=192"}
                          className="w-full h-full object-contain"
                          alt="Avatar expression"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center mb-2">
                    <Button variant="outline" size="sm" className="border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm rounded-xl gap-1" onClick={handlePrevBackground}>
                      <ChevronLeft className="w-4 h-4" /> 
                    </Button>
                    <span className="text-sm font-medium text-slate-600">Change Background</span>                 
                    <Button variant="outline" size="sm" className="border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm rounded-xl gap-1" onClick={handleNextBackground} >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                {/* Action Buttons */}
                <div className="flex gap-4 mt-auto">
                  <Button 
                    onClick={handleRandomize}
                    className="flex-1 h-12 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-base rounded-xl shadow-lg"
                  >
                    <Dices className="w-5 h-5 mr-2" />
                    Randomize
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 px-6 border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm rounded-xl"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                 
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Options - Right Side (40%) */}
          <div
            className={`lg:col-span-4 transition-all duration-1000 delay-500 ease-out ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <Card className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden h-full">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Customize Your Look</h3>
                  <p className="text-slate-600">Choose from various styles and features</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-12 bg-white/60 backdrop-blur-lg p-1 shadow-xl border border-white/20 rounded-xl mb-6">
                    <TabsTrigger
                      onClick={() => menuSelectSound()}
                      value="head"
                      className="flex items-center gap-1 text-xs font-medium transition-all duration-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
                    >
                      <User className="w-3 h-3" />
                      Head
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => menuSelectSound()}
                      value="hair"
                      className="flex items-center gap-1 text-xs font-medium transition-all duration-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
                    >
                      <Hair className="w-3 h-3" />
                      Hair
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => menuSelectSound()}
                      value="expressions"
                      className="flex items-center gap-1 text-xs font-medium transition-all duration-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
                    >
                      <Hair className="w-3 h-3" />
                      Face
                    </TabsTrigger>
                    <TabsTrigger
                      onClick={() => menuSelectSound()}
                      value="clothes"
                      className="flex items-center gap-1 text-xs font-medium transition-all duration-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg"
                    >
                      <Shirt className="w-3 h-3" />
                      Clothes
                    </TabsTrigger>
                  </TabsList>

                  {/* Head Options */}
                  <TabsContent value="head" className="mt-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Head Styles</h4>
                        <p className="text-sm text-slate-600">Choose your base character</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {headOptions.map((head, index) => (
                        <div
                          key={head.id}
                          onClick={() => handleOptionSelect("head", head.image)}
                          className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${600 + index * 50}ms` }}
                        >
                          <div
                            className={`w-full aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                              selectedHead === head.image ? "border-slate-600 shadow-slate-200" : "border-white/40"
                            }`}
                          >
                            <img
                              src={head.image || "/placeholder.svg?height=48&width=48"}
                              className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-110"
                              alt={head.name}
                            />
                            {selectedHead === head.image && (
                              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-slate-700 border-2 border-white shadow-lg rounded-full">
                                <Check className="w-2 h-2" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Hair Options */}
                  <TabsContent value="hair" className="mt-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center">
                        <Hair className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Hair Styles</h4>
                        <p className="text-sm text-slate-600">Pick your perfect hairstyle</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {hairOptions.map((hair, index) => (
                        <div
                          key={hair.id}
                          onClick={() => handleOptionSelect("hair", hair.image)}
                          className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${600 + index * 50}ms` }}
                        >
                          <div
                            className={`w-full aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                              selectedHair === hair.image ? "border-slate-600 shadow-slate-200" : "border-white/40"
                            }`}
                          >
                            <img
                              src={hair.image || "/placeholder.svg?height=48&width=48"}
                              className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-110"
                              alt={hair.name}
                            />
                            {selectedHair === hair.image && (
                              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-slate-600 border-2 border-white shadow-lg rounded-full">
                                <Check className="w-2 h-2" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Expressions Options */}
                  <TabsContent value="expressions" className="mt-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center">
                        <Hair className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Facial Expressions</h4>
                        <p className="text-sm text-slate-600">Pick your expression</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {expressionOptions.map((expression, index) => (
                        <div
                          key={expression.id}
                          onClick={() => handleOptionSelect("expression", expression.image)}
                          className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${600 + index * 50}ms` }}
                        >
                          <div
                            className={`w-full aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                              selectedExpression === expression.image ? "border-slate-600 shadow-slate-200" : "border-white/40"
                            }`}
                          >
                            <img
                              src={expression.image || "/placeholder.svg?height=48&width=48"}
                              className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-110"
                              alt={expression.name}
                            />
                            {selectedExpression === expression.image && (
                              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-slate-600 border-2 border-white shadow-lg rounded-full">
                                <Check className="w-2 h-2" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Clothes Options */}
                  <TabsContent value="clothes" className="mt-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center">
                        <Shirt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Clothes</h4>
                        <p className="text-sm text-slate-600">Pick your style</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {clothesOptions.map((clothes, index) => (
                        <div
                          key={clothes.id}
                          onClick={() => handleOptionSelect("clothes", clothes.image)}
                          className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                          style={{ transitionDelay: `${600 + index * 50}ms` }}
                        >
                          <div
                            className={`w-full aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                              selectedClothes === clothes.image ? "border-slate-600 shadow-slate-200" : "border-white/40"
                            }`}
                          >
                            <img
                              src={clothes.image || "/placeholder.svg?height=48&width=48"}
                              className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-110"
                              alt={clothes.name}
                            />
                            {selectedClothes === clothes.image && (
                              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-slate-600 border-2 border-white shadow-lg rounded-full">
                                <Check className="w-2 h-2" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes headTilt {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(2deg);
          }
          75% {
            transform: translateY(-3px) rotate(-2deg);
          }
        }

        @keyframes headBob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        @keyframes breathing {
          50%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}

