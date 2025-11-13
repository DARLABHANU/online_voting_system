import { Link } from 'react-router-dom';
import { Vote, Shield, CheckCircle, Users, BarChart3, Lock } from 'lucide-react';
import { Button } from './ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Vote className="h-8 w-8 text-blue-600" />
              <span className="text-xl">VoteSecure</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800">Secure & Transparent Voting</span>
          </div>
          <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
            Democracy Made Digital
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A modern, secure, and transparent online voting platform that ensures every voice is heard and every vote counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Register to Vote
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose VoteSecure?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge security and transparency features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-white">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                JWT-based authentication with bcrypt password hashing and rate limiting protection
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-white">
              <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl mb-2">One Vote Per Person</h3>
              <p className="text-gray-600">
                Strict validation ensures each voter can only cast one vote per election
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-white">
              <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl mb-2">Voter Approval</h3>
              <p className="text-gray-600">
                Admin approval system ensures only verified users can participate
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-gradient-to-br from-pink-50 to-white">
              <div className="h-12 w-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl mb-2">Real-Time Results</h3>
              <p className="text-gray-600">
                View detailed election results and statistics after voting closes
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-white">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl mb-2">Self-Nomination</h3>
              <p className="text-gray-600">
                Eligible voters can nominate themselves as candidates
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-gradient-to-br from-orange-50 to-white">
              <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl mb-2">Eligibility Filtering</h3>
              <p className="text-gray-600">
                Elections can be restricted to specific voter groups
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of voters participating in secure, transparent elections
          </p>
          <Link to="/register">
            <Button size="lg">
              Register Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 VoteSecure. Built with security and transparency in mind.</p>
        </div>
      </footer>
    </div>
  );
}
