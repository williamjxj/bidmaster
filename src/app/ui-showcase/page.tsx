import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Star, 
  Rocket, 
  Shield,
  Eye,
  Activity,
  Target
} from 'lucide-react'

export default function UIShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
      <div className="container mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gradient-rainbow animate-fade-in">
            Modern UI Showcase
          </h1>
          <p className="text-xl text-muted-foreground animate-slide-up">
            Experience the enhanced design system with glass morphism, neobrutalism, and modern animations
          </p>
        </div>

        {/* Glass Morphism Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Glass Morphism Effects</h2>
          <div className="grid-cards">
            <Card className="glass-card hover-lift-gentle animate-scale-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl animate-breathe">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-gradient-modern">Glass Card</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beautiful glass morphism effect with backdrop blur and subtle transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="card-floating animate-scale-in" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-xl animate-morph">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-gradient-modern">Floating Card</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enhanced floating card with advanced shadows and 3D hover effects.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern hover-glow-primary animate-scale-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-xl animate-heartbeat">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-gradient-modern">Modern Card</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clean modern design with subtle gradients and hover animations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Neobrutalism Design */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Neobrutalism Design</h2>
          <div className="grid-modern">
            <Card className="neo-card hover-lift-strong animate-slide-in-left">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-xl animate-wiggle">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Bold Design</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Strong shadows, bold borders, and confident typography that makes a statement.
                </p>
              </CardContent>
            </Card>

            <Card className="neo-card hover-tilt-left animate-slide-in-bottom" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/20 rounded-xl animate-bounce">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Interactive</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Engaging hover effects and micro-interactions that delight users.
                </p>
              </CardContent>
            </Card>

            <Card className="neo-card hover-tilt-right animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/20 rounded-xl animate-float">
                    <Rocket className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Dynamic</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Animated elements that bring the interface to life with purposeful motion.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Button Variations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Modern Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="btn-gradient hover-lift-gentle">
              <Star className="h-4 w-4 mr-2" />
              Gradient
            </Button>
            
            <Button className="btn-glass hover-glow-primary">
              <Shield className="h-4 w-4 mr-2" />
              Glass
            </Button>
            
            <Button className="neo-button">
              <Zap className="h-4 w-4 mr-2" />
              Neo Brutal
            </Button>
            
            <Button className="btn-gradient hover-bounce">
              <Sparkles className="h-4 w-4 mr-2" />
              Animated
            </Button>
          </div>
        </section>

        {/* Status Indicators */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Status Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="status-success p-4 rounded-lg text-center">
              <div className="font-semibold">Success</div>
              <div className="text-sm opacity-80">All systems operational</div>
            </div>
            
            <div className="status-warning p-4 rounded-lg text-center">
              <div className="font-semibold">Warning</div>
              <div className="text-sm opacity-80">Minor issues detected</div>
            </div>
            
            <div className="status-error p-4 rounded-lg text-center">
              <div className="font-semibold">Error</div>
              <div className="text-sm opacity-80">Action required</div>
            </div>
            
            <div className="status-info p-4 rounded-lg text-center">
              <div className="font-semibold">Info</div>
              <div className="text-sm opacity-80">New updates available</div>
            </div>
          </div>
        </section>

        {/* Typography Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Typography Effects</h2>
          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-gradient-rainbow">Rainbow Gradient Text</h3>
            <h3 className="text-4xl font-bold text-shimmer">Shimmer Effect Text</h3>
            <h3 className="text-4xl font-bold text-gradient-modern">Modern Gradient Text</h3>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-modern p-6">
              <CardTitle className="mb-4">Skeleton Loading</CardTitle>
              <div className="space-y-3">
                <div className="loading-skeleton h-4 w-3/4"></div>
                <div className="loading-skeleton h-4 w-1/2"></div>
                <div className="loading-skeleton h-4 w-2/3"></div>
              </div>
            </Card>
            
            <Card className="card-modern p-6">
              <CardTitle className="mb-4 flex items-center gap-3">
                Dots Loading
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </CardTitle>
              <p className="text-muted-foreground">
                Animated dots indicate processing states.
              </p>
            </Card>
            
            <Card className="card-modern p-6">
              <CardTitle className="mb-4 flex items-center gap-3">
                Spinner Loading
                <div className="loading-spinner"></div>
              </CardTitle>
              <p className="text-muted-foreground">
                Classic spinner for general loading states.
              </p>
            </Card>
          </div>
        </section>

        {/* Badges Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient-modern">Enhanced Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge className="btn-gradient animate-glow">Premium</Badge>
            <Badge className="btn-glass hover-lift-gentle">Glass Effect</Badge>
            <Badge className="neo-card bg-blue-100 text-blue-800">Neobrutalism</Badge>
            <Badge className="status-success">Success Badge</Badge>
            <Badge className="status-warning">Warning Badge</Badge>
            <Badge className="status-error">Error Badge</Badge>
            <Badge className="status-info">Info Badge</Badge>
          </div>
        </section>

      </div>
    </div>
  )
}
