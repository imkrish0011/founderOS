export interface VideoResource {
  title: string;
  url: string; // the embed URL or direct URL
  type: 'video' | 'playlist' | 'course' | 'doc';
}

export const VIDEO_MAPPING: Record<string, VideoResource[]> = {
  // Phase 1: Foundations
  "development environment": [
    { title: "VS Code Full Course", url: "https://www.youtube.com/embed/wpisNGE6iCQ", type: "video" },
    { title: "VS Code Docs", url: "https://code.visualstudio.com/docs", type: "doc" }
  ],
  "visual studio code": [
    { title: "VS Code Full Course", url: "https://www.youtube.com/embed/wpisNGE6iCQ", type: "video" }
  ],
  "git & github": [
    { title: "Git & GitHub Crash Course", url: "https://www.youtube.com/embed/SWYqp7iY_Tc", type: "video" }
  ],
  "linux terminal": [
    { title: "Linux Command Line Full Course", url: "https://www.youtube.com/embed/ZtqBQ68cfJc", type: "video" }
  ],
  "python programming": [
    { title: "CS50P - Harvard Python", url: "https://www.youtube.com/embed/nLRL_NcnK-4", type: "video" },
    { title: "Python Full Course - freeCodeCamp", url: "https://www.youtube.com/embed/rfscVS0vtbw", type: "video" }
  ],

  // Phase 2: CS Fundamentals
  "computational thinking": [
    { title: "Harvard CS50 - Week 0", url: "https://www.youtube.com/embed/IDDmrzzB14M", type: "video" }
  ],
  "time & space complexity": [
    { title: "Abdul Bari - Time Complexity", url: "https://www.youtube.com/embed/moPtwq_cVH8", type: "video" }
  ],
  "data structures": [
    { title: "NeetCode DSA Playlist", url: "https://www.youtube.com/embed/videoseries?list=PLpeSDQCUwHcmcj9kXwQ4cawXq5bC13FqT", type: "playlist" },
    { title: "Abdul Bari DSA", url: "https://www.youtube.com/embed/videoseries?list=PLBlnK6fEyqRj9lld8sWIUNwlKfdUoPd1Y", type: "playlist" } 
  ],
  "algorithms": [
    { title: "Algorithms Course", url: "https://www.youtube.com/embed/8hly31xKli0", type: "video" }
  ],
  "software engineering": [
    { title: "Clean Code", url: "https://www.youtube.com/embed/7EmboKQH8lM", type: "video" }
  ],

  // Phase 3: Math for AI
  "linear algebra": [
    { title: "Essence of Linear Algebra", url: "https://www.youtube.com/embed/videoseries?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "playlist" }
  ],
  "calculus": [
    { title: "Essence of Calculus", url: "https://www.youtube.com/embed/videoseries?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", type: "playlist" }
  ],
  "probability": [
    { title: "StatQuest - Probability", url: "https://www.youtube.com/embed/videoseries?list=PLblh5JKOoLUK0FLit04nRgYzjvkI396y5", type: "playlist" }
  ],
  "statistics": [
    { title: "StatQuest - Statistics Fundamentals", url: "https://www.youtube.com/embed/videoseries?list=PLblh5JKOoLUK0FLit04nRgYzjvkI396y5", type: "playlist" }
  ],
  "optimization": [
    { title: "Gradient Descent", url: "https://www.youtube.com/embed/sDv4f4s2SB8", type: "video" }
  ],
  "numerical computing": [
    { title: "NumPy Tutorial", url: "https://www.youtube.com/embed/QUT1VHiLmmI", type: "video" }
  ],

  // Phase 4: Machine Learning
  "machine learning foundations": [
    { title: "Andrew Ng ML Specialization", url: "https://www.youtube.com/embed/videoseries?list=PLkDaE6sCZn6FNC6YWrNthvcbuOX4p4u8", type: "playlist" }
  ],

  // Phase 5: Deep Learning
  "neural network fundamentals": [
    { title: "Neural Networks - 3Blue1Brown", url: "https://www.youtube.com/embed/videoseries?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "playlist" }
  ],
  "convolutional neural networks": [
    { title: "Stanford CS231n", url: "https://www.youtube.com/embed/vT1JzLTH4G4", type: "video" }
  ],

  // Phase 6: Computer Vision
  "image fundamentals": [
    { title: "OpenCV Course", url: "https://www.youtube.com/embed/oXlwWbU8l2o", type: "video" }
  ],

  // Phase 7: NLP
  "nlp fundamentals": [
    { title: "DeepLearning.AI NLP", url: "https://www.youtube.com/embed/videoseries?list=PLkDaE6sCZn6GMWNNA6_yI9Yc2H5wRkQ4P", type: "playlist" }
  ],
  "hugging face ecosystem": [
    { title: "Hugging Face Course", url: "https://www.youtube.com/embed/videoseries?list=PLo2EIpI_JMQvWfQndUesu0nPBAtZ9gP1o", type: "playlist" }
  ],

  // Phase 8: Transformers
  "why transformers?": [
    { title: "Stanford CS25 - Transformers United", url: "https://www.youtube.com/embed/XfpMkf4rD6E", type: "video" }
  ],

  // Phase 9: LLM Engineering
  "llm fundamentals": [
    { title: "Andrej Karpathy - Let's build GPT", url: "https://www.youtube.com/embed/kCc8FmEb1nY", type: "video" }
  ],

  // Phase 10: AI Systems
  "ai system design": [
    { title: "MLOps Crash Course", url: "https://www.youtube.com/embed/mFFqoTWxHkY", type: "video" }
  ],

  // Phase 11: Reinforcement Learning
  "rl foundations": [
    { title: "David Silver RL Lectures", url: "https://www.youtube.com/embed/2pWv7GOvuf0", type: "video" }
  ],

  // Phase 12: AI Research
  "research foundations": [
    { title: "How to Read a Paper", url: "https://www.youtube.com/embed/733m6qBH-jI", type: "video" }
  ],

  // Phase 13: AI for Physics
  "scientific machine learning": [
    { title: "Physics-Informed Neural Networks", url: "https://www.youtube.com/embed/vD_58ldzX30", type: "video" }
  ]
};
