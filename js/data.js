const b = (ar, en) => ({ ar, en });
const seedCourses = [
  { id: 'c1', category: 'programming', level: 'beginner', duration: b('٤ أسابيع', '4 weeks'), title: b('أساسيات البرمجة', 'Programming Fundamentals'), desc: b('مدخل عملي إلى التفكير البرمجي وكتابة الشيفرة.', 'A practical introduction to computational thinking and writing code.'), outcomes: b(['فهم المتغيرات والتحكم بالتدفق', 'كتابة برامج صغيرة'], ['Understand variables and control flow', 'Write small programs']), status: 'published', sample: true },
  { id: 'c2', category: 'web', level: 'intermediate', duration: b('٦ أسابيع', '6 weeks'), title: b('تطوير الويب الحديث', 'Modern Web Development'), desc: b('بناء واجهات ويب متجاوبة وتطبيقات تفاعلية.', 'Build responsive web interfaces and interactive apps.'), outcomes: b(['بناء صفحات متجاوبة', 'التعامل مع واجهات API'], ['Build responsive pages', 'Work with APIs']), status: 'published', sample: true },
  { id: 'c3', category: 'ai', level: 'advanced', duration: b('٨ أسابيع', '8 weeks'), title: b('مدخل إلى تعلم الآلة', 'Introduction to Machine Learning'), desc: b('مفاهيم تعلم الآلة وتطبيقاتها في المسائل الهندسية.', 'Core ML concepts applied to engineering problems.'), outcomes: b(['تدريب نماذج بسيطة', 'تقييم النتائج'], ['Train simple models', 'Evaluate results']), status: 'published', sample: true },
  { id: 'c4', category: 'data', level: 'intermediate', duration: b('٥ أسابيع', '5 weeks'), title: b('قواعد البيانات', 'Database Fundamentals'), desc: b('تصميم قواعد البيانات واستعلامات SQL.', 'Database design and SQL querying.'), outcomes: b(['تصميم مخططات', 'كتابة استعلامات'], ['Design schemas', 'Write queries']), status: 'published', sample: true },
  { id: 'c5', category: 'mobile', level: 'intermediate', duration: b('٦ أسابيع', '6 weeks'), title: b('تطوير تطبيقات الموبايل', 'Mobile App Development'), desc: b('بناء تطبيقات للهواتف الذكية من الفكرة إلى النموذج.', 'Build smartphone apps from idea to prototype.'), outcomes: b([], []), status: 'draft', sample: true },
  { id: 'c6', category: 'career', level: 'beginner', duration: b('أسبوعان', '2 weeks'), title: b('التأهيل لسوق العمل', 'Career Readiness'), desc: b('السيرة الذاتية والمقابلات والمهارات المهنية.', 'CVs, interviews and professional skills.'), outcomes: b(['إعداد سيرة ذاتية', 'الاستعداد للمقابلات'], ['Prepare a CV', 'Prepare for interviews']), status: 'published', sample: true },
];
const seedProjects = [
  { id: 'p1', category: 'webapps', tech: 'React, Vite', title: b('منصة إدارة تدريب', 'Training Management Platform'), desc: b('مثال توضيحي لمنصة تدير الدورات والمسجلين.', 'Demo concept of a platform managing courses and enrollments.'), status: 'published', sample: true },
  { id: 'p2', category: 'software', tech: 'Python, SQLite', title: b('أداة أتمتة هندسية', 'Engineering Automation Tool'), desc: b('مثال توضيحي لأداة تؤتمت مهام هندسية متكررة.', 'Demo concept of a tool automating repetitive engineering tasks.'), status: 'published', sample: true },
  { id: 'p3', category: 'ai', tech: 'Python, scikit-learn', title: b('نموذج تنبؤ', 'Predictive Model Prototype'), desc: b('مثال توضيحي لنموذج تعلم آلة على بيانات هندسية.', 'Demo concept of an ML model on engineering data.'), status: 'published', sample: true },
  { id: 'p4', category: 'engineering', tech: 'CAD, Simulation', title: b('دراسة جدوى هندسية', 'Engineering Feasibility Study'), desc: b('مثال توضيحي لهيكل دراسة استشارية.', 'Demo outline of a consultancy study.'), status: 'published', sample: true },
  { id: 'p5', category: 'research', tech: 'Research', title: b('مبادرة بحثية', 'Research Initiative'), desc: b('مثال توضيحي لمشروع بحث وابتكار.', 'Demo concept of a research and innovation project.'), status: 'draft', sample: true },
];
const seedMessages = [
  { id: 'm1', name: 'Demo Sender A', email: 'demo-a@example.com', type: 0, message: 'Demo message about a course inquiry.', read: false, demo: true },
  { id: 'm2', name: 'Demo Sender B', email: 'demo-b@example.com', type: 1, message: 'Demo message requesting a consultation.', read: true, demo: true },
];
const seedSettings = {
  company: 'Do Tech Group', tagline: { ar: 'نتعلّم. نبني. نبتكر.', en: 'Learn. Build. Innovate.' }, accent: '#D6AA55',
  email: '', phone: '0987177510', social: '', seoTitle: { ar: '', en: '' }, seoDesc: { ar: '', en: '' }, heroHeadline: { ar: '', en: '' },
};
