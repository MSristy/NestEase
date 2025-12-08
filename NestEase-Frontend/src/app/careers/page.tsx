'use client';

import { FaMapMarkerAlt, FaBriefcase, FaUsers, FaHeart, FaGraduationCap, FaClock, FaStar } from 'react-icons/fa';

export default function CareersPage() {
  const positions = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "2-4 years",
      description: "We're looking for a skilled Frontend Developer to join our engineering team. You'll be responsible for building and maintaining our web platform using Next.js and React.",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "3-5 years",
      description: "Join our design team to create beautiful and intuitive user experiences for our platform. You'll work closely with product and engineering teams to bring designs to life.",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"]
    },
    {
      title: "Customer Support Specialist",
      department: "Support",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "1-3 years",
      description: "Help our users navigate the platform and resolve their issues. You'll be the first point of contact for our customers and play a crucial role in maintaining customer satisfaction.",
      skills: ["Customer Service", "Problem Solving", "Communication", "CRM Tools"]
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "4-6 years",
      description: "Lead our marketing efforts to grow our user base and brand awareness. You'll develop and execute marketing strategies across various channels.",
      skills: ["Digital Marketing", "SEO", "Social Media", "Analytics"]
    }
  ];

  const benefits = [
    {
      icon: FaStar,
      title: "Competitive Salary",
      description: "We offer competitive salaries and regular performance reviews with growth opportunities."
    },
    {
      icon: FaHeart,
      title: "Health Insurance",
      description: "Comprehensive health insurance coverage for you and your family members."
    },
    {
      icon: FaClock,
      title: "Flexible Work",
      description: "Flexible working hours and remote work options to maintain work-life balance."
    },
    {
      icon: FaGraduationCap,
      title: "Learning & Development",
      description: "Regular training sessions, workshops, and opportunities for professional growth."
    },
    {
      icon: FaUsers,
      title: "Team Building",
      description: "Regular team outings, company events, and collaborative projects."
    },
    {
      icon: FaBriefcase,
      title: "Work-Life Balance",
      description: "Generous vacation policy, paid time off, and mental health support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Join Our <span className="text-blue-200">Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Help us revolutionize urban living in Dhaka. Be part of a team that's making a difference in people's lives.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">🚀 Fast Growing</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">💡 Innovative</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">🤝 Collaborative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're looking for talented individuals who are passionate about making a difference in urban living.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {positions.map((position, index) => (
              <div key={index} className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {position.title}
                    </h3>
                    <p className="text-primary font-semibold mb-2">{position.department}</p>
                    <p className="text-muted-foreground">{position.description}</p>
                  </div>
                  <span className="bg-primary/10 text-primary text-sm px-4 py-2 rounded-full font-semibold">
                    {position.type}
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <FaMapMarkerAlt className="w-5 h-5 mr-3" />
                    <span>{position.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <FaBriefcase className="w-5 h-5 mr-3" />
                    <span>{position.experience} experience</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-card-foreground mb-3">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {position.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`/careers/apply?position=${position.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Join Us?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe in taking care of our team members and providing them with the best possible work environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border group text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">
                Don't See Your Dream Job?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                We're always looking for talented individuals to join our team. 
                Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/careers/apply"
                  className="bg-white text-blue-600 py-4 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Submit Your Resume
                </a>
                <a
                  href="/contact"
                  className="bg-blue-500 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Contact HR Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 

