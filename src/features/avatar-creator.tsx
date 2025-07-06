import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Eye, Smile, Download, RotateCcw, Check, Palette, HashIcon as Hair } from "lucide-react"
import { Button } from "@/components/ui/button"

// Decorative background blobs
const BackgroundBlob = ({ color, size, position }: { color: string; size: string; position: string }) => {
  return (
    <div
      className={`absolute ${size} ${color} rounded-full opacity-10 ${position} animate-pulse`}
      style={{ animationDuration: "4s" }}
    />
  )
}

export default function AvatarCreator() {
  const menuSelectSound = () => {
    const audio = new Audio("/avatars/sounds/menuselect.mp3")
    audio.play().catch(() => {}) // Ignore errors if audio fails
  }

  const selectStyleSound = () => {
    const audio = new Audio("/avatars/sounds/click_select.mp3")
    audio.play().catch(() => {}) // Ignore errors if audio fails
  }

  const [selectedHead, setSelectedHead] = useState("/avatars/heads/h1.png")
  const [selectedHair, setSelectedHair] = useState("/avatars/hairs/hr1.png")
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("head")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const headOptions = [
    { id: 1, image: "/avatars/heads/head1.png", name: "Classic Boy" },
    { id: 2, image: "/avatars/heads/head2.png", name: "Modern Boy" },
    { id: 3, image: "/avatars/heads/head3.png", name: "Cool Boy" },
    { id: 4, image: "/avatars/heads/head4.png", name: "Smart Boy" },
    { id: 5, image: "/avatars/heads/head5.png", name: "Modern Girl" },
    { id: 6, image: "/avatars/heads/head6.png", name: "Modern Girl" },
    { id: 7, image: "/avatars/heads/head7.png", name: "Cool Girl" },
    { id: 8, image: "/avatars/heads/head8.png", name: "Smart Girl" },
    { id: 9, image: "/avatars/heads/head9.png", name: "Cool Girl" },
    { id: 10, image: "/avatars/heads/head10.png", name: "Smart Girl" },
  ]

  const hairOptions = [
    { id: 1, image: "/avatars/hairs/hair1.png", name: "Short Hair" },
    { id: 2, image: "/avatars/hairs/hair2.png", name: "Long Hair" },
    { id: 3, image: "/avatars/hairs/hair3.png", name: "Curly Hair" },
    { id: 4, image: "/avatars/hairs/hair4.png", name: "Wavy Hair" },
    { id: 5, image: "/avatars/hairs/hair5.png", name: "Straight Hair" },
    { id: 6, image: "/avatars/hairs/hair6.png", name: "Braided Hair" },
  ]

  const handleReset = () => {
    setSelectedHead("/avatars/heads/h1.png")
    setSelectedHair("/avatars/hairs/hr1.png")
  }

  const handleOptionSelect = (type: string, image: string) => {
    if (type === "head") setSelectedHead(image)
    if (type === "hair") setSelectedHair(image)

    selectStyleSound()
  }

  return (
    <div className="min-h-screen  relative overflow-hidden">
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
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">AVATAR CREATOR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Create Your Perfect Avatar
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Design a unique digital identity with our intuitive customization tools
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Avatar Preview - Left Side */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-300 ease-out ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <Card className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden sticky top-8">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Avatar</h3>
                  <p className="text-sm text-slate-500">Live Preview</p>
                </div>

                {/* Large Avatar Preview */}
                <div className="flex justify-center mb-8">
                  <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-white/30">
                    <div className="relative w-48 h-48 mx-auto">
                      {/* Base head */}
                      <img
                        src={selectedHead || "/placeholder.svg?height=192&width=192"}
                        className="absolute inset-0 w-full h-full object-contain transition-all duration-500"
                        alt="Avatar head"
                      />
                    
                      {/* Hair overlay */}
                      <img
                        src={selectedHair || "/placeholder.svg?height=192&width=192"}
                        className="absolute inset-0 w-full h-full object-contain transition-all duration-500"
                        alt="Avatar hair"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1 h-12 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-base rounded-xl shadow-lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download Avatar
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

          {/* Customization Options - Right Side */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 delay-500 ease-out ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Customize Your Look</h3>
              <p className="text-slate-600">Choose from various styles and features</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-white/60 backdrop-blur-lg p-1 shadow-xl border border-white/20 rounded-2xl mb-8">
                <TabsTrigger
                  onClick={() => menuSelectSound()}
                  value="head"
                  className="flex items-center gap-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
                >
                  <User className="w-4 h-4" />
                  Head
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => menuSelectSound()}
                  value="hair"
                  className="flex items-center gap-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
                >
                  <Hair className="w-4 h-4" />
                  Hair
                </TabsTrigger>
               
              </TabsList>

              {/* Head Options */}
              <TabsContent value="head" className="mt-0">
                <Card className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">Head Styles</h4>
                        <p className="text-slate-600">Choose your base character</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
                            className={`w-16 h-16 rounded-2xl border-3 transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                              selectedHead === head.image ? "border-slate-600 shadow-slate-200" : "border-white/40"
                            }`}
                          >
                            <img
                              src={head.image || "/placeholder.svg?height=48&width=48"}
                              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                              alt={head.name}
                            />
                            {selectedHead === head.image && (
                              <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-slate-700 border-2 border-white shadow-lg rounded-full">
                                <Check className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hair Options */}
              <TabsContent value="hair" className="mt-0">
                <Card className="bg-white/60 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-600 rounded-2xl flex items-center justify-center">
                        <Hair className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">Hair Styles</h4>
                        <p className="text-slate-600">Pick your perfect hairstyle</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
                            className={`w-16 h-16 rounded-2xl border-3 transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${
                              selectedHair === hair.image ? "border-slate-600 shadow-slate-200" : "border-white/40"
                            }`}
                          >
                            <img
                              src={hair.image || "/placeholder.svg?height=48&width=48"}
                              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                              alt={hair.name}
                            />
                            {selectedHair === hair.image && (
                              <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-slate-600 border-2 border-white shadow-lg rounded-full">
                                <Check className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

           
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
