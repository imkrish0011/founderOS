const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outDir = path.join(__dirname, '..', 'src', 'data');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function parseMarkdown() {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));
  
  const curriculum = [];
  const library = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const lines = content.split('\n');

    let phase = {
      id: file.replace('.md', ''),
      title: '',
      goal: '',
      duration: '',
      difficulty: '',
      modules: [],
      projects: [],
      checklist: []
    };

    let currentModule = null;
    let currentTopic = null;

    let parsingState = 'START'; // START, GOAL, MODULE, TOPIC, RESOURCES, PRACTICE, PROJECTS, CHECKLIST
    let phaseTitleMatch = /Phase ([A-Z]+) [—\-] (.*)/;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Phase Title
      if (line.startsWith('> Phase') || line.startsWith('# Phase')) {
        const match = line.match(phaseTitleMatch);
        if (match) {
          phase.title = `Phase ${match[1]}: ${match[2]}`;
        } else {
          phase.title = line.replace(/^[>#]\s*/, '');
        }
      }

      // Goal
      if (line.startsWith('## Goal') || line.startsWith('> Goal:')) {
        parsingState = 'GOAL';
        if (line.startsWith('> Goal:')) {
           phase.goal = line.replace('> Goal:', '').trim();
        }
        continue;
      }
      if (parsingState === 'GOAL' && !line.startsWith('#') && !line.startsWith('**') && !line.startsWith('-')) {
        phase.goal += (phase.goal ? ' ' : '') + line;
      }

      if (line.includes('**Estimated Duration:**')) {
        phase.duration = line.split('**Estimated Duration:**')[1].trim();
      }
      if (line.includes('**Difficulty:**')) {
        phase.difficulty = line.split('**Difficulty:**')[1].trim();
      }

      // Modules
      if (line.startsWith('# Module')) {
        parsingState = 'MODULE';
        currentModule = {
          title: line.replace(/^#\s*/, ''),
          topics: []
        };
        phase.modules.push(currentModule);
        continue;
      }

      // Topics
      if (line.startsWith('## Topic') || (line.startsWith('## ') && !line.startsWith('## Goal') && !line.startsWith('## '))) {
        parsingState = 'TOPIC';
        currentTopic = {
          title: line.replace(/^##\s*/, ''),
          learn: []
        };
        if (currentModule) {
           currentModule.topics.push(currentTopic);
        } else {
           currentModule = { title: phase.title, topics: [currentTopic] };
           phase.modules.push(currentModule);
        }
        continue;
      }

      // Topic Learn Items
      if (parsingState === 'TOPIC' && line.startsWith('- ')) {
        if (currentTopic) currentTopic.learn.push(line.replace('- ', '').trim());
      }
      if (line.startsWith('### Learn') || line.startsWith('## Learn')) {
        parsingState = 'TOPIC';
        if (!currentTopic && currentModule) {
          currentTopic = { title: currentModule.title + ' Topics', learn: [] };
          currentModule.topics.push(currentTopic);
        }
        continue;
      }

      // Resources
      if (line.startsWith('### Resources') || line.startsWith('## Resources')) {
        parsingState = 'RESOURCES';
        continue;
      }
      if (parsingState === 'RESOURCES') {
        if (line.startsWith('- ')) {
           const resourceText = line.replace('- ', '').trim();
           let type = 'article';
           if (resourceText.toLowerCase().includes('video') || resourceText.toLowerCase().includes('course') || resourceText.toLowerCase().includes('freecodecamp')) type = 'video';
           if (resourceText.toLowerCase().includes('book')) type = 'book';
           if (resourceText.toLowerCase().includes('docs') || resourceText.toLowerCase().includes('documentation') || resourceText.includes('http')) type = 'paper';
           
           let title = resourceText;
           if (resourceText.includes('(') && resourceText.includes(')')) {
               const match = resourceText.match(/\[(.*?)\]\((.*?)\)/);
               if (match) title = match[1];
           }

           library.push({
             id: Math.random().toString(36).substr(2, 9),
             type,
             title,
             author: phase.title || 'FounderOS',
             year: new Date().getFullYear().toString(),
             tags: [phase.title ? phase.title.split(':')[0] : 'General'] 
           });
        }
      }

      // Projects
      if (line.startsWith('### Mini Project') || line.startsWith('### Projects') || line.startsWith('## Projects') || line.startsWith('### Mini Projects')) {
        parsingState = 'PROJECTS';
        continue;
      }
      if (parsingState === 'PROJECTS') {
        if (line.startsWith('- ')) {
           phase.projects.push(line.replace('- ', '').trim());
        } else if (!line.startsWith('#') && line.trim().length > 5) {
           phase.projects.push(line.trim());
        }
      }

      // Checklist
      if (line.includes('Completion Checklist')) {
        parsingState = 'CHECKLIST';
        continue;
      }
      if (parsingState === 'CHECKLIST') {
        if (line.startsWith('- [ ]') || line.startsWith('-')) {
           phase.checklist.push(line.replace(/^- \[[ x]\] /, '').replace(/^- /, '').trim());
        }
      }
    }

    curriculum.push(phase);
  }

  const romanToInt = (roman) => {
      const romanNumerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let result = 0;
      for (let i = 0; i < roman.length; i++) {
        if (i > 0 && romanNumerals[roman[i]] > romanNumerals[roman[i - 1]]) {
          result += romanNumerals[roman[i]] - 2 * romanNumerals[roman[i - 1]];
        } else {
          result += romanNumerals[roman[i]];
        }
      }
      return result;
  };

  curriculum.sort((a, b) => {
      const getRoman = (title) => {
          if (!title) return 0;
          const match = title.match(/Phase ([A-Z]+)/);
          return match ? romanToInt(match[1]) : 0;
      }
      return getRoman(a.title) - getRoman(b.title);
  });

  fs.writeFileSync(path.join(outDir, 'curriculum.json'), JSON.stringify(curriculum, null, 2));
  fs.writeFileSync(path.join(outDir, 'library.json'), JSON.stringify(library, null, 2));
  
  console.log('Parsed', curriculum.length, 'phases and', library.length, 'resources.');
}

parseMarkdown();
