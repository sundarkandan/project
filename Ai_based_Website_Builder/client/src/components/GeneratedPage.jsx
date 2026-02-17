
import React from 'react';

const GeneratedPage = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MERN Stack Developer | Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex-shrink-0 font-bold text-2xl tracking-tighter text-indigo-600">
                    MERN.DEV
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-8 font-medium">
                        <a href="#home" class="hover:text-indigo-600 transition">Home</a>
                        <a href="#about" class="hover:text-indigo-600 transition">About</a>
                        <a href="#skills" class="hover:text-indigo-600 transition">Skills</a>
                        <a href="#projects" class="hover:text-indigo-600 transition">Projects</a>
                        <a href="#contact" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Contact</a>
                    </div>
                </div>
                <div class="md:hidden">
                    <button id="mobile-menu-button" class="text-slate-600 hover:text-indigo-600">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
            <a href="#home" class="block py-2">Home</a>
            <a href="#about" class="block py-2">About</a>
            <a href="#skills" class="block py-2">Skills</a>
            <a href="#projects" class="block py-2">Projects</a>
            <a href="#contact" class="block py-2 text-indigo-600 font-bold">Contact</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        <div class="max-w-6xl mx-auto text-center">
            <h2 class="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-4">MERN Stack Specialist</h2>
            <h1 class="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                Building robust <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">web experiences</span>
            </h1>
            <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                I design and develop high-performance full-stack applications using MongoDB, Express, React, and Node.js.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#projects" class="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-200">View Projects</a>
                <a href="#contact" class="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition">Get In Touch</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white px-4">
        <div class="max-w-6xl mx-auto">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="relative">
                    <div class="absolute -inset-4 bg-indigo-100 rounded-2xl rotate-3"></div>
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" alt="Developer Coding" class="relative rounded-2xl shadow-xl w-full">
                </div>
                <div>
                    <h3 class="text-3xl font-bold mb-6">Passionate about scalable architecture</h3>
                    <p class="text-slate-600 mb-6 leading-relaxed">
                        With over 4 years of experience in the JavaScript ecosystem, I focus on building clean, maintainable, and highly performant applications. I specialize in turning complex problems into simple, elegant solutions.
                    </p>
                    <ul class="space-y-4">
                        <li class="flex items-center text-slate-700">
                            <span class="bg-indigo-100 text-indigo-600 p-1 rounded-full mr-3">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            </span>
                            API Design & Documentation
                        </li>
                        <li class="flex items-center text-slate-700">
                            <span class="bg-indigo-100 text-indigo-600 p-1 rounded-full mr-3">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            </span>
                            State Management (Redux/Context)
                        </li>
                        <li class="flex items-center text-slate-700">
                            <span class="bg-indigo-100 text-indigo-600 p-1 rounded-full mr-3">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                            </span>
                            Database Optimization (MongoDB)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
            <h3 class="text-3xl font-bold text-center mb-16">Core Technologies</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-indigo-300 transition group">
                    <div class="text-indigo-600 mb-4 group-hover:scale-110 transition duration-300">
                        <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    </div>
                    <h4 class="font-bold">MongoDB</h4>
                </div>
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-indigo-300 transition group">
                    <div class="text-indigo-600 mb-4 group-hover:scale-110 transition duration-300">
                        <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <h4 class="font-bold">Express</h4>
                </div>
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-indigo-300 transition group">
                    <div class="text-indigo-600 mb-4 group-hover:scale-110 transition duration-300">
                        <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/></svg>
                    </div>
                    <h4 class="font-bold">React</h4>
                </div>
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-indigo-300 transition group">
                    <div class="text-indigo-600 mb-4 group-hover:scale-110 transition duration-300">
                        <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"/></svg>
                    </div>
                    <h4 class="font-bold">Node.js</h4>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 bg-slate-100 px-4">
        <div class="max-w-6xl mx-auto">
            <h3 class="text-3xl font-bold text-center mb-16">Featured Work</h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Project 1 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-md group border border-transparent hover:border-indigo-200 transition">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="E-commerce Project" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">
                    <div class="p-6">
                        <div class="flex gap-2 mb-4">
                            <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">MERN</span>
                            <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">REDUX</span>
                        </div>
                        <h4 class="text-xl font-bold mb-2">OmniCommerce</h4>
                        <p class="text-slate-600 text-sm mb-4">A full-featured e-commerce platform with Stripe integration and admin dashboard.</p>
                        <a href="#" class="text-indigo-600 font-semibold inline-flex items-center hover:gap-2 transition-all">View Details <span>&rarr;</span></a>
                    </div>
                </div>
                <!-- Project 2 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-md group border border-transparent hover:border-indigo-200 transition">
                    <img src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=800&q=80" alt="SaaS Project" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">
                    <div class="p-6">
                        <div class="flex gap-2 mb-4">
                            <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">REACT</span>
                            <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">SOCKET.IO</span>
                        </div>
                        <h4 class="text-xl font-bold mb-2">SyncTask</h4>
                        <p class="text-slate-600 text-sm mb-4">Real-time collaborative project management tool for remote development teams.</p>
                        <a href="#" class="text-indigo-600 font-semibold inline-flex items-center hover:gap-2 transition-all">View Details <span>&rarr;</span></a>
                    </div>
                </div>
                <!-- Project 3 -->
                <div class="bg-white rounded-2xl overflow-hidden shadow-md group border border-transparent hover:border-indigo-200 transition">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Analytics Project" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">
                    <div class="p-6">
                        <div class="flex gap-2 mb-4">
                            <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">EXPRESS</span>
                            <span class="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">CHART.JS</span>
                        </div>
                        <h4 class="text-xl font-bold mb-2">DataViz Dashboard</h4>
                        <p class="text-slate-600 text-sm mb-4">Custom internal analytics engine visualizing massive datasets from MongoDB.</p>
                        <a href="#" class="text-indigo-600 font-semibold inline-flex items-center hover:gap-2 transition-all">View Details <span>&rarr;</span></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 px-4">
        <div class="max-w-4xl mx-auto bg-indigo-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl shadow-indigo-200">
            <h3 class="text-3xl md:text-4xl font-bold mb-6">Let's build something together</h3>
            <p class="text-indigo-100 mb-10 text-lg">Currently available for freelance opportunities and full-time roles.</p>
            <form class="max-w-md mx-auto space-y-4">
                <input type="email" placeholder="Enter your email" class="w-full px-6 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-400">
                <button class="w-full bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">Get Started</button>
            </form>
            <div class="mt-12 flex justify-center space-x-6 text-2xl">
                <a href="#" class="hover:text-indigo-200 transition">LinkedIn</a>
                <a href="#" class="hover:text-indigo-200 transition">GitHub</a>
                <a href="#" class="hover:text-indigo-200 transition">Twitter</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>&copy; 2023 MERN Portfolio. All rights reserved.</p>
    </footer>

    <script>
        const btn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Close menu when link is clicked
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    </script>
</body>
</html>` }} />
  );
};

export default GeneratedPage;