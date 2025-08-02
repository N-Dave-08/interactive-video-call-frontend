import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Star, Heart, Clock, Zap } from "lucide-react"

export default function Stage4() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAsking, setIsAsking] = useState(false)

  const selectSound = () => {
    const audio = new Audio("/event/sounds/select.mp3")
    audio.play().catch(() => {}) // Ignore errors if audio fails
  }

  const questions = [
    {
      emoji: "🚀",
      text: "What do you want to be when you grow up?",
      subtitle: "Dream big, you can do anything!",
      bgColor: "from-blue-400 via-purple-500 to-pink-500",
    },
    {
      emoji: "🎨",
      text: "What's your favorite thing to create?",
      subtitle: "Let your imagination run wild!",
      bgColor: "from-pink-400 via-red-400 to-orange-400",
    },
    {
      emoji: "⭐",
      text: "If you could have any superpower, what would it be?",
      subtitle: "You're already super amazing!",
      bgColor: "from-yellow-400 via-orange-400 to-red-400",
    },
    {
      emoji: "🌈",
      text: "What makes you really happy?",
      subtitle: "Happiness is the best superpower!",
      bgColor: "from-green-400 via-blue-400 to-purple-400",
    },
    {
      emoji: "🦄",
      text: "What's the most magical thing you can imagine?",
      subtitle: "Magic is all around us!",
      bgColor: "from-purple-400 via-pink-400 to-purple-600",
    },
    {
      emoji: "🌟",
      text: "If you could visit anywhere in the world, where would you go?",
      subtitle: "Adventure awaits everywhere!",
      bgColor: "from-cyan-400 via-blue-400 to-indigo-500",
    },
    {
      emoji: "📚",
      text: "What's your favorite story or book?",
      subtitle: "Stories take us on magical journeys!",
      bgColor: "from-indigo-400 via-blue-500 to-teal-400",
    },
    {
      emoji: "🎵",
      text: "If your life had a theme song, what would it sound like?",
      subtitle: "Everyone has their own special rhythm!",
      bgColor: "from-pink-500 via-purple-500 to-indigo-500",
    },
    {
      emoji: "🐉",
      text: "If you had a pet dragon, what would you name it?",
      subtitle: "Every great adventure needs a sidekick!",
      bgColor: "from-red-400 via-yellow-500 to-pink-500",
    },
    {
      emoji: "🚪",
      text: "If you opened a magic door, where would it lead?",
      subtitle: "Behind every door is a new wonder!",
      bgColor: "from-teal-400 via-green-400 to-lime-400",
    },
    {
      emoji: "👽",
      text: "What would you say to an alien visitor?",
      subtitle: "Even space friends need a hello!",
      bgColor: "from-lime-400 via-cyan-400 to-blue-500",
    },
    {
      emoji: "⏳",
      text: "If you had a time machine, what year would you visit?",
      subtitle: "Past or future, it’s your adventure!",
      bgColor: "from-yellow-300 via-orange-400 to-pink-500",
    },
    {
      emoji: "🍕",
      text: "If you could invent a new food, what would it be?",
      subtitle: "Yum! The world needs your recipe!",
      bgColor: "from-orange-300 via-red-300 to-yellow-400",
    },
    {
      emoji: "🖌️",
      text: "If you could paint the sky, what colors would you use?",
      subtitle: "The sky is your canvas!",
      bgColor: "from-purple-300 via-blue-300 to-pink-300",
    },
    {
      emoji: "🎭",
      text: "If you could be any character in a movie, who would you be?",
      subtitle: "Lights, camera, action — you're the star!",
      bgColor: "from-red-400 via-pink-500 to-purple-400",
    },
    {
      emoji: "⚙️",
      text: "If you could build a robot, what would it do?",
      subtitle: "The best inventions start with big ideas!",
      bgColor: "from-gray-400 via-blue-500 to-cyan-400",
    },
    {
      emoji: "🌌",
      text: "What do you think outer space smells like?",
      subtitle: "Let your imagination blast off!",
      bgColor: "from-indigo-600 via-purple-500 to-blue-500",
    },
    {
      emoji: "🧃",
      text: "If you could make your own drink flavor, what would it taste like?",
      subtitle: "Sweet, silly, or super sour — your choice!",
      bgColor: "from-orange-300 via-yellow-400 to-pink-300",
    },
    {
      emoji: "🛸",
      text: "What would your spaceship look like?",
      subtitle: "Design it your way, captain!",
      bgColor: "from-blue-300 via-teal-400 to-indigo-400",
    },
    {
      emoji: "🏰",
      text: "If you had a castle, what would be inside?",
      subtitle: "Build your dream kingdom!",
      bgColor: "from-purple-500 via-indigo-500 to-blue-500",
    },
    {
      emoji: "🧞",
      text: "If a genie gave you 3 wishes, what would you wish for?",
      subtitle: "Use them wisely—or wildly!",
      bgColor: "from-teal-300 via-cyan-400 to-indigo-400",
    },
    {
      emoji: "🌳",
      text: "If you could talk to animals, what would you ask them?",
      subtitle: "Imagine the stories they’d tell!",
      bgColor: "from-green-400 via-lime-400 to-yellow-300",
    },
    {
      emoji: "🏝️",
      text: "What would you do on a secret island?",
      subtitle: "Your own hidden paradise awaits!",
      bgColor: "from-yellow-400 via-orange-300 to-pink-400",
    },
    {
      emoji: "🎂",
      text: "If you could design the perfect birthday party, what would it be like?",
      subtitle: "The cake, the games, the fun — all yours!",
      bgColor: "from-pink-300 via-red-400 to-purple-400",
    }
    
  ]

  const handleNextQuestion = () => {
    selectSound()
    setIsAsking(true)
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)
      setIsAsking(false)
    }, 800)
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-6 flex items-center justify-center">
      <Card className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-pulse">
                <div className="text-5xl animate-bounce">🐰</div>
              </div>
              <div className="text-6xl animate-spin" style={{ animationDuration: "3s" }}>
                ✨
              </div>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-pulse">
                <div className="text-5xl animate-bounce" style={{ animationDelay: "0.5s" }}>
                  🎈
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Let's Chat!
              </h1>
              <p className="text-gray-600 text-2xl font-semibold">A super fun way to connect with amazing kids!</p>
            </div>
          </div>

          {/* Main Question Card - Now Much Wider */}
          <Card className="overflow-hidden shadow-2xl border-0 transform hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-0">
              <div
                className={`bg-gradient-to-r ${currentQuestion.bgColor} text-white p-12 text-center relative overflow-hidden`}
              >
                {/* Floating decorative elements */}
                <div className="absolute top-6 right-8 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white/80" />
                </div>
                <div className="absolute bottom-6 left-8 animate-bounce">
                  <Star className="w-8 h-8 text-white/80" />
                </div>
                <div className="absolute top-6 left-8 animate-ping">
                  <Heart className="w-6 h-6 text-white/60" />
                </div>
                <div className="absolute bottom-6 right-8 animate-pulse">
                  <Zap className="w-6 h-6 text-white/70" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                  <div className="text-8xl mb-6 animate-bounce">{currentQuestion.emoji}</div>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight drop-shadow-lg">
                    {currentQuestion.text}
                  </h2>
                  <p className="text-white/95 text-xl md:text-2xl font-bold">{currentQuestion.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ask Next Question Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleNextQuestion}
              disabled={isAsking}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white px-12 py-8 text-2xl font-black rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:scale-100 border-4 border-white/30"
            >
              <Sparkles className="w-8 h-8 mr-3 animate-spin" />
              {isAsking ? "Getting new question..." : "Ask Next Question"}
              <Sparkles className="w-8 h-8 ml-3" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center shadow-xl">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-black text-gray-800 text-2xl mb-3">Take Your Time!</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-semibold">
                  Let the child think and express themselves freely! No rush!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-100 via-green-100 to-lime-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-black text-gray-800 text-2xl mb-3">No Wrong Answers!</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-semibold">
                  Every answer is perfect and special! You're amazing!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Encouragement Banner */}
          <Card className="bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-center items-center gap-4 mb-6">
                <span className="text-4xl animate-bounce">🌟</span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                  💖
                </span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: "0.4s" }}>
                  🎉
                </span>
              </div>
              <p className="text-center font-black text-gray-800 text-2xl md:text-3xl">
                You're doing AMAZING connecting! Keep the conversation flowing!
              </p>
            </CardContent>
          </Card>

          {/* Question Counter */}
          <div className="flex justify-center gap-4">
         
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 text-lg font-black rounded-full shadow-lg">
              You're doing great!
            </Badge>
          </div>

          {/* Fun Tips Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
              <div className="text-3xl mb-2">🎨</div>
              <p className="font-bold text-gray-700">Be Creative!</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
              <div className="text-3xl mb-2">😊</div>
              <p className="font-bold text-gray-700">Have Fun!</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-100 to-lime-100 rounded-2xl">
              <div className="text-3xl mb-2">🌟</div>
              <p className="font-bold text-gray-700">Be Yourself!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
