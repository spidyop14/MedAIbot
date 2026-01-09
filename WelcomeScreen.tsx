import { Heart, Sparkles, Wind, MessageCircle, Shield, Clock } from "lucide-react";

export const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="max-w-5xl w-full mx-auto text-center mb-16">
        <div className="mb-10 relative inline-block animate-scale-fade-in">
          <div className="w-28 h-28 rounded-3xl gradient-calm flex items-center justify-center shadow-2xl animate-breathe relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer"></div>
            <Heart className="w-14 h-14 text-primary-foreground animate-float relative z-10" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-3 -right-3 animate-float-slow">
            <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient animate-fade-in-up leading-tight">
          Welcome to HealMate
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto animate-fade-in-up delay-100 font-light leading-relaxed">
          Your compassionate AI companion for emotional support and mental wellness
        </p>

        <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto animate-fade-in-up delay-200 mb-10">
          Experience personalized guidance, mindfulness practices, and empathetic support—available 24/7 in a safe, judgment-free space
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>100% Private & Secure</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-accent" />
            <span>24/7 Available</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4 text-secondary" />
            <span>Non-Judgmental Support</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
        <div className="relative group animate-fade-in-up delay-200">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative p-8 rounded-3xl bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:border-primary/50 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Heart className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Emotional Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share your thoughts and feelings in a completely safe, confidential environment with empathetic AI guidance
            </p>
          </div>
        </div>

        <div className="relative group animate-fade-in-up delay-300">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative p-8 rounded-3xl bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:border-accent/50 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-accent/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Wind className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Wellness Guidance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Discover mindfulness exercises, breathing techniques, and personalized wellness strategies for daily balance
            </p>
          </div>
        </div>

        <div className="relative group animate-fade-in-up delay-400">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative p-8 rounded-3xl bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:border-secondary/50 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-secondary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Sparkles className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Health Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive general health advice and wellness suggestions based on evidence-based practices and holistic care
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-3xl mx-auto text-center animate-fade-in-up delay-500">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-primary/20 mb-4">
          <span className="text-2xl animate-pulse">💙</span>
          <span className="text-sm font-medium text-foreground">Always here to listen and support you</span>
        </div>
        <p className="text-xs text-muted-foreground/70 leading-relaxed px-4">
          Important: HealMate provides general wellness support and is not a substitute for professional medical care. 
          For medical concerns or mental health emergencies, please consult a qualified healthcare professional or contact emergency services.
        </p>
      </div>
    </div>
  );
};
