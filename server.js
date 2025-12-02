const cors = require('cors');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// Helper to emit live data to a user's room (use email as room id)
function emitLiveUpdate(email, payload) {
    try {
        io.to(String(email)).emit('liveData', payload);
    } catch (e) {
        console.error('emitLiveUpdate failed', e);
    }
}

// Socket.IO connections
io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);
    socket.on('subscribeToEmail', (email) => {
        if (email) {
            socket.join(String(email));
            console.log('🔔 Subscribed', socket.id, 'to', email);
        }
    });
    socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected:', socket.id);
    });
});

const { importUciStudentPerformance } = require('./utils/datasetImporter');
const { importFromKaggle } = require('./utils/kaggleImporter');
const { getLeetCodeStats } = require('./utils/leetcode');
const { getCodeChefStats } = require('./utils/codechef');

// File-based database
const DB_FILE = 'student_productivity_db.json';

// Initialize complete database structure
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        students: [],
        productivity: [],
        coding_progress: [],
        courses: [],
        mobile_usage: [],
        events: [],
        certificates: [],
        rankings: [],
        activities: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate complete user data
function generateCompleteUserData(email) {
    const username = email.split('@')[0];
    const domains = ['Computer Science', 'Data Science', 'Engineering', 'Business Administration'];
    const coursesList = {
        'Computer Science': ['Data Structures', 'Algorithms', 'Web Development', 'Database Systems', 'Operating Systems', 'Computer Networks'],
        'Data Science': ['Python Programming', 'Statistics', 'Machine Learning', 'Data Visualization', 'Big Data Analytics'],
        'Engineering': ['Mathematics', 'Physics', 'Digital Electronics', 'Programming Fundamentals', 'Circuit Theory'],
        'Business Administration': ['Marketing', 'Finance', 'Management', 'Economics', 'Business Law']
    };
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const userCourses = coursesList[domain];
    const completedCount = Math.floor(Math.random() * 4) + 2;
    const currentCount = Math.floor(Math.random() * 3) + 1;
    
    return {
        student_id: 'STU' + Date.now(),
        personal_info: {
            name: username.charAt(0).toUpperCase() + username.slice(1) + " Student",
            email: email,
            phone: '+91' + Math.floor(Math.random() * 9000000000 + 1000000000),
            course: domain,
            semester: Math.floor(Math.random() * 8) + 1,
            university: ['Anna University', 'SRM University', 'VIT University', 'Amrita University'][Math.floor(Math.random() * 4)],
            join_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        academic_info: {
            cgpa: (Math.random() * 2 + 7).toFixed(1),
            attendance: Math.floor(Math.random() * 20) + 75,
            completed_courses: completedCount,
            current_courses: currentCount,
            certificates: [`${domain} Fundamentals`, 'Programming Basics', 'Web Development']
        }
    };
}

// Generate productivity data
function generateProductivityData(studentId) {
    const days = 7;
    const productivityData = [];
    
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        productivityData.push({
            student_id: studentId,
            date: date.toISOString().split('T')[0],
            study_time: Math.floor(Math.random() * 240) + 120,
            productive_time: Math.floor(Math.random() * 200) + 100,
            productivity_score: Math.floor(Math.random() * 30) + 65,
            tasks_completed: Math.floor(Math.random() * 8) + 3,
            focus_sessions: Math.floor(Math.random() * 5) + 1,
            breaks_taken: Math.floor(Math.random() * 6) + 2
        });
    }
    
    return productivityData;
}

// Generate coding progress data
function generateCodingData(studentId) {
    return [
        {
            student_id: studentId,
            platform: "LeetCode",
            problems_solved: Math.floor(Math.random() * 200) + 50,
            easy: Math.floor(Math.random() * 100) + 30,
            medium: Math.floor(Math.random() * 120) + 20,
            hard: Math.floor(Math.random() * 30) + 5,
            current_streak: Math.floor(Math.random() * 45) + 5,
            global_rank: Math.floor(Math.random() * 15000) + 1000
        },
        {
            student_id: studentId,
            platform: "CodeChef",
            problems_solved: Math.floor(Math.random() * 80) + 20,
            rating: Math.floor(Math.random() * 4) + 1 + "★",
            contests_joined: Math.floor(Math.random() * 25) + 5,
            global_rank: Math.floor(Math.random() * 10000) + 2000
        },
        {
            student_id: studentId,
            platform: "HackerRank",
            problems_solved: Math.floor(Math.random() * 150) + 30,
            badges: Math.floor(Math.random() * 10) + 5,
            skills: ['Python', 'Java', 'SQL', 'Problem Solving']
        }
    ];
}

// Generate courses data
function generateCoursesData(studentId, domain) {
    const coursesList = {
        'Computer Science': ['Data Structures', 'Algorithms', 'Web Development', 'Database Systems'],
        'Data Science': ['Python Programming', 'Statistics', 'Machine Learning', 'Data Visualization'],
        'Engineering': ['Mathematics', 'Physics', 'Digital Electronics', 'Programming Fundamentals'],
        'Business Administration': ['Marketing', 'Finance', 'Management', 'Economics']
    };
    
    const courses = coursesList[domain] || coursesList['Computer Science'];
    
    return courses.map((course, index) => ({
        student_id: studentId,
        course_id: 'CRS' + (index + 1),
        course_name: course,
        category: domain,
        progress: Math.floor(Math.random() * 50) + 30,
        status: index < 2 ? "Completed" : "In Progress",
        start_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        instructor: `Dr. ${['Kumar', 'Sharma', 'Patel', 'Reddy'][Math.floor(Math.random() * 4)]}`
    }));
}

// Generate mobile usage data
function generateMobileUsageData(studentId) {
    const days = 7;
    const mobileData = [];
    
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mobileData.push({
            student_id: studentId,
            date: date.toISOString().split('T')[0],
            total_screen_time: Math.floor(Math.random() * 180) + 60,
            productive_apps: {
                "VS Code": Math.floor(Math.random() * 60) + 20,
                "LeetCode": Math.floor(Math.random() * 45) + 15,
                "Coursera": Math.floor(Math.random() * 30) + 10
            },
            social_apps: {
                "WhatsApp": Math.floor(Math.random() * 40) + 10,
                "Instagram": Math.floor(Math.random() * 30) + 5,
                "YouTube": Math.floor(Math.random() * 50) + 10
            },
            productivity_score: Math.floor(Math.random() * 40) + 60
        });
    }
    
    return mobileData;
}

// Generate events data
function generateEventsData() {
    return [
        {
            event_id: "EVT001",
            name: "CodeChef Monthly Contest",
            type: "Coding Competition",
            date: "2024-10-25",
            status: "registered",
            participants: 1500,
            duration: "3 hours"
        },
        {
            event_id: "EVT002",
            name: "Tech Hackathon 2024",
            type: "Hackathon",
            date: "2024-11-05",
            status: "upcoming",
            participants: 200,
            duration: "48 hours"
        },
        {
            event_id: "EVT003",
            name: "LeetCode Weekly Contest",
            type: "Coding Competition",
            date: "2024-10-28",
            status: "registered",
            participants: 8000,
            duration: "1.5 hours"
        }
    ];
}

// CORS Setup
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Student Productivity Tracker - COMPLETE DATASETS',
        status: 'All datasets ready 🚀',
        datasets: ['students', 'productivity', 'coding', 'courses', 'mobile', 'events', 'certificates']
    });
});

// COMPLETE LOGIN with ALL Data Generation
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Login attempt:', email);
        
        const db = readDB();
        
        // Find or create user with complete data
        let student = db.students.find(s => s.personal_info.email === email);
        
        if (!student) {
            // Generate complete user data
            const userData = generateCompleteUserData(email);
            student = userData;
            db.students.push(student);
            
            // Generate all related data
            db.productivity.push(...generateProductivityData(student.student_id));
            db.coding_progress.push(...generateCodingData(student.student_id));
            db.courses.push(...generateCoursesData(student.student_id, student.personal_info.course));
            db.mobile_usage.push(...generateMobileUsageData(student.student_id));
            db.events = generateEventsData();
            
            writeDB(db);
            console.log('🆕 Complete user data generated for:', email);
        }
        
        console.log('✅ Login successful:', email);
        
        // Get user's complete data
        const userProductivity = db.productivity.filter(p => p.student_id === student.student_id);
        const userCoding = db.coding_progress.filter(c => c.student_id === student.student_id);
        const userCourses = db.courses.filter(c => c.student_id === student.student_id);
        const userMobile = db.mobile_usage.filter(m => m.student_id === student.student_id);
        
        res.json({
            success: true,
            message: 'Login successful! Complete data loaded.',
            user: {
                personal: student.personal_info,
                academic: student.academic_info,
                productivity: userProductivity[0],
                coding: userCoding,
                courses: userCourses,
                mobile: userMobile[0],
                events: db.events
            }
        });
    // Emit initial live data to the user's socket room (email used as room id)
    try {
        emitLiveUpdate(email, { type: 'initial', user: student, productivity: userProductivity[0], coding: userCoding, courses: userCourses, mobile: userMobile[0], events: db.events });
    } catch (e) { console.error('Live emit failed', e); }

        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.json({ success: false, message: 'Login failed' });
    }
});

// COMPLETE REGISTER - create user and all related data
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password, course } = req.body;
        const db = readDB();

        // Check if already exists
        let student = db.students.find(s => s.personal_info.email === email);
        if (!student) {
            const userData = generateCompleteUserData(email);
            // Overwrite provided fields
            if (name) userData.personal_info.name = name;
            if (course) userData.personal_info.course = course;
            student = userData;
            db.students.push(student);

            // Generate related data
            db.productivity.push(...generateProductivityData(student.student_id));
            db.coding_progress.push(...generateCodingData(student.student_id));
            db.courses.push(...generateCoursesData(student.student_id, student.personal_info.course));
            db.mobile_usage.push(...generateMobileUsageData(student.student_id));
            if (!db.events || db.events.length === 0) db.events = generateEventsData();
            writeDB(db);
        }

        res.json({
            success: true,
            message: 'Registration successful',
            user: {
                name: student.personal_info.name,
                email: student.personal_info.email,
                role: 'student',
                course: student.personal_info.course
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

// Get complete user dashboard
app.get('/api/dashboard/:email', (req, res) => {
    try {
        const db = readDB();
        let student = db.students.find(s => s.personal_info.email === req.params.email);
        
        if (!student) {
            // Auto-create user on first dashboard access
            const userData = generateCompleteUserData(req.params.email);
            student = userData;
            db.students.push(student);
            db.productivity.push(...generateProductivityData(student.student_id));
            db.coding_progress.push(...generateCodingData(student.student_id));
            db.courses.push(...generateCoursesData(student.student_id, student.personal_info.course));
            db.mobile_usage.push(...generateMobileUsageData(student.student_id));
            if (!db.events || db.events.length === 0) db.events = generateEventsData();
            writeDB(db);
        }
        
        // Get all user data
        const userData = {
            student: student,
            productivity: db.productivity.filter(p => p.student_id === student.student_id),
            coding: db.coding_progress.filter(c => c.student_id === student.student_id),
            courses: db.courses.filter(c => c.student_id === student.student_id),
            mobile_usage: db.mobile_usage.filter(m => m.student_id === student.student_id),
            events: db.events
        };
        
        res.json({
            success: true,
            message: 'Complete dashboard data',
            data: userData
        });
        
    } catch (error) {
        res.json({ success: false, message: 'Failed to load dashboard' });
    }
});

// Track activity
app.post('/api/track-activity', (req, res) => {
    try {
        const { email, activity, duration, category } = req.body;
        
        const db = readDB();
        db.activities.push({
            id: Date.now().toString(),
            email: email,
            activity: activity,
            duration: duration,
            category: category,
            timestamp: new Date().toISOString()
        });
        
        writeDB(db);
        res.json({ success: true, message: 'Activity tracked' });
        
    } catch (error) {
        res.json({ success: false, message: 'Tracking failed' });
    }
});

// Get all users (admin view)
app.get('/api/admin/users', (req, res) => {
    try {
        const db = readDB();
        res.json({
            success: true,
            total_users: db.students.length,
            users: db.students.map(s => ({
                id: s.student_id,
                name: s.personal_info.name,
                email: s.personal_info.email,
                course: s.personal_info.course,
                productivity: s.academic_info.cgpa,
                join_date: s.personal_info.join_date
            }))
        });
    } catch (error) {
        res.json({ success: false, message: 'Failed to load users' });
    }
});

// Update mobile usage
app.post('/api/mobile-usage', (req, res) => {
    try {
        const { email, screenTime, productiveTime, appsUsed = {} } = req.body;
        
        const db = readDB();
        const student = db.students.find(s => s.personal_info.email === email);
        
        if (student) {
            const totalScreenTime = Math.max(0, Number(screenTime) || 0);

            // Prefer deriving productive time from provided app breakdown when available
            const productiveFromApps = appsUsed.productive ? Object.values(appsUsed.productive).reduce((a, b) => a + (Number(b) || 0), 0) : undefined;
            const providedProductive = Number(productiveTime);
            const rawProductive = Number.isFinite(providedProductive) ? providedProductive : (productiveFromApps || 0);
            const safeProductive = Math.max(0, Math.min(rawProductive, totalScreenTime));

            const productivityScore = totalScreenTime > 0 ? Math.round((safeProductive / totalScreenTime) * 100) : 0;
            
            db.mobile_usage.push({
                student_id: student.student_id,
                date: new Date().toISOString().split('T')[0],
                total_screen_time: totalScreenTime,
                productive_apps: appsUsed.productive || {},
                social_apps: appsUsed.social || {},
                productivity_score: productivityScore
            });
            
            writeDB(db);
        }
        
        res.json({ success: true, message: 'Mobile usage updated' });
        
    } catch (error) {
        res.json({ success: false, message: 'Update failed' });
    }
});

// Real-time mobile usage: stream an app usage event and aggregate into today's totals
app.post('/api/mobile-usage/event', (req, res) => {
    try {
        const { email, appName, minutes, category } = req.body;
        const db = readDB();
        const student = db.students.find(s => s.personal_info.email === email);
        if (!student) return res.status(404).json({ success: false, message: 'User not found' });

        const today = new Date().toISOString().split('T')[0];
        let entry = db.mobile_usage.find(m => m.student_id === student.student_id && m.date === today);
        if (!entry) {
            entry = {
                student_id: student.student_id,
                date: today,
                total_screen_time: 0,
                productive_apps: {},
                social_apps: {},
                productivity_score: 0
            };
            db.mobile_usage.push(entry);
        }

        const mins = Math.max(0, Number(minutes) || 0);
        entry.total_screen_time += mins;
        if (category === 'productive') {
            entry.productive_apps[appName] = (Number(entry.productive_apps[appName]) || 0) + mins;
        } else {
            entry.social_apps[appName] = (Number(entry.social_apps[appName]) || 0) + mins;
        }

        const productiveFromApps = Object.values(entry.productive_apps).reduce((a, b) => a + (Number(b) || 0), 0);
        const total = Math.max(0, Number(entry.total_screen_time) || 0);
        entry.productivity_score = total > 0 ? Math.round((productiveFromApps / total) * 100) : 0;

        writeDB(db);
        res.json({ success: true, message: 'Event recorded', today: entry });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Event record failed' });
    }
});

// Get last 7 days mobile usage for a user
app.get('/api/mobile-usage/:email', (req, res) => {
    try {
        const db = readDB();
        const student = db.students.find(s => s.personal_info.email === req.params.email);
        if (!student) return res.status(404).json({ success: false, message: 'User not found' });
        const items = db.mobile_usage
            .filter(m => m.student_id === student.student_id)
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 7);
        res.json({ success: true, days: items });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to load mobile usage' });
    }
});

// Keep AI endpoints
// AI chat endpoint: dataset-aware answers; falls back to OpenAI or fixed response
const FIXED_AI_RESPONSE = process.env.FIXED_AI_RESPONSE || 'This is the only approved response.';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
function datasetAnswer(email, userMsg) {
    try {
        if (!email || !userMsg) return null;
        const db = readDB();
        const student = db.students.find(s => s.personal_info.email === email);
        if (!student) return null;
        const sid = student.student_id;
        const msg = String(userMsg).toLowerCase();
        const mobile = db.mobile_usage.filter(m => m.student_id === sid).sort((a,b)=> (a.date<b.date?1:-1));
        const today = mobile[0];
        const prod = db.productivity.filter(p => p.student_id === sid);
        const coding = db.coding_progress.filter(c => c.student_id === sid);
        const courses = db.courses.filter(c => c.student_id === sid);
        // Q: productivity today / weekly average
        if (msg.includes('productivity') && msg.includes('today') && today) {
            return `Today's productivity is ${today.productivity_score}%.`;
        }
        if (msg.includes('average') && msg.includes('productivity') && prod.length) {
            const avg = Math.round(prod.reduce((s,x)=>s+Number(x.productivity_score||0),0)/prod.length);
            return `Your 7-day average productivity is ${avg}%.`;
        }
        // Q: screen time today
        if ((msg.includes('screen') || msg.includes('usage')) && msg.includes('today') && today) {
            return `Today's screen time is ${today.total_screen_time} minutes.`;
        }
        // Q: top productive app today
        if ((msg.includes('top') || msg.includes('most')) && msg.includes('app') && today) {
            const entries = Object.entries(today.productive_apps||{});
            if (entries.length) {
                const [app, mins] = entries.sort((a,b)=>b[1]-a[1])[0];
                return `Top productive app today is ${app} with ${mins} minutes.`;
            }
        }
        // Q: leetcode problems solved / rank
        if (msg.includes('leetcode')) {
            const lc = coding.find(c=>c.platform==='LeetCode');
            if (lc && msg.includes('problem')) return `LeetCode problems solved: ${lc.problems_solved}.`;
            if (lc && (msg.includes('rank')||msg.includes('ranking'))) return `LeetCode global rank is ${lc.global_rank}.`;
        }
        // Q: courses completed/current
        if (msg.includes('course')) {
            const completed = courses.filter(c=>String(c.status).toLowerCase()==='completed').length;
            const inprog = courses.filter(c=>String(c.status).toLowerCase()==='in progress').length;
            return `Courses completed ${completed}, in progress ${inprog}.`;
        }
        // Q: next event
        if (msg.includes('event')) {
            const ev = (db.events||[]).slice().sort((a,b)=> (a.date>b.date?1:-1))[0];
            if (ev) return `Next event is ${ev.name} on ${ev.date}.`;
        }
        return null;
    } catch { return null; }
}
app.post('/api/deepseek/message', async (req, res) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        const userMsg = (req.body && req.body.message) || '';
        const email = (req.body && req.body.email) || '';
        const dataAns = datasetAnswer(email, userMsg);
        if (dataAns) return res.json({ success: true, response: dataAns });
        if (!apiKey) {
            console.log('AI[fixed]:', userMsg);
            return res.json({ success: true, response: FIXED_AI_RESPONSE });
        }
        console.log('AI[req]:', userMsg);
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    { role: 'system', content: 'Answer the user\'s question directly in one short sentence. No greetings, no filler, no explanations.' },
                    { role: 'user', content: String(userMsg) }
                ],
                temperature: 0.3
            })
        });
        const data = await resp.json();
        if (!resp.ok) {
            console.warn('AI[error]:', data);
            return res.json({ success: true, response: FIXED_AI_RESPONSE });
        }
        let content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '';
        content = String(content).split('\n')[0].trim();
        console.log('AI[resp]:', content);
        res.json({ success: true, response: content || FIXED_AI_RESPONSE });
    } catch (e) {
        console.error('AI[exception]:', e);
        res.json({ success: true, response: FIXED_AI_RESPONSE });
    }
});

// Allow simple GET test from browser
app.get('/api/deepseek/message', (req, res) => {
    res.json({ success: true, response: FIXED_AI_RESPONSE });
});

// Real-time coding stats: LeetCode
app.post('/api/realtime/leetcode', async (req, res) => {
    try {
        const { email, username } = req.body;
        const stats = await getLeetCodeStats(username);
        const db = readDB();
        const student = db.students.find(s => s.personal_info.email === email);
        if (!student) return res.status(404).json({ success: false, message: 'User not found' });

        // upsert in coding_progress
        const key = (r) => r.student_id === student.student_id && r.platform === 'LeetCode';
        const idx = db.coding_progress.findIndex(key);
        const updated = {
            student_id: student.student_id,
            platform: 'LeetCode',
            problems_solved: stats.problemsSolved,
            easy: undefined,
            medium: undefined,
            hard: undefined,
            current_streak: undefined,
            global_rank: stats.ranking || 0
        };
        if (idx >= 0) db.coding_progress[idx] = { ...db.coding_progress[idx], ...updated };
        else db.coding_progress.push(updated);
        writeDB(db);
        res.json({ success: true, stats });
    } catch (e) {
        res.status(500).json({ success: false, message: 'LeetCode fetch failed' });
    }
});

// Real-time coding stats: CodeChef
app.post('/api/realtime/codechef', async (req, res) => {
    try {
        const { email, username } = req.body;
        const stats = await getCodeChefStats(username);
        const db = readDB();
        const student = db.students.find(s => s.personal_info.email === email);
        if (!student) return res.status(404).json({ success: false, message: 'User not found' });

        // upsert in coding_progress
        const key = (r) => r.student_id === student.student_id && r.platform === 'CodeChef';
        const idx = db.coding_progress.findIndex(key);
        const updated = {
            student_id: student.student_id,
            platform: 'CodeChef',
            problems_solved: stats.problemsSolved,
            rating: `${Math.max(1, Math.min(7, Math.round(stats.stars || 0)))}★`,
            contests_joined: undefined,
            global_rank: stats.globalRank || 0
        };
        if (idx >= 0) db.coding_progress[idx] = { ...db.coding_progress[idx], ...updated };
        else db.coding_progress.push(updated);
        writeDB(db);
        res.json({ success: true, stats });
    } catch (e) {
        res.status(500).json({ success: false, message: 'CodeChef fetch failed' });
    }
});

// Admin: import real dataset (UCI Student Performance)
app.post('/api/admin/import-dataset', async (req, res) => {
    try {
        const { limit, strict } = req.query;
        const result = await importUciStudentPerformance({
            limit: limit !== undefined ? Number(limit) : undefined,
            strict: String(strict).toLowerCase() === 'true'
        });
        res.json({ success: true, message: 'UCI dataset imported', details: result });
    } catch (e) {
        console.error('Import failed', e);
        res.status(500).json({ success: false, message: 'Import failed', error: String(e.message || e) });
    }
});

// Convenience: allow GET from browser to trigger import
app.get('/api/admin/import-dataset', async (req, res) => {
    try {
        const { limit, strict } = req.query;
        const result = await importUciStudentPerformance({
            limit: limit !== undefined ? Number(limit) : undefined,
            strict: String(strict).toLowerCase() === 'true'
        });
        res.json({ success: true, message: 'UCI dataset imported', details: result });
    } catch (e) {
        console.error('Import failed', e);
        res.status(500).json({ success: false, message: 'Import failed', error: String(e.message || e) });
    }
});

// Import from Kaggle by dataset slug
// Example: /api/admin/import-kaggle?slug=spscientist/students-performance-in-exams&limit=0&strict=true
app.get('/api/admin/import-kaggle', async (req, res) => {
    try {
        const { slug, limit, strict } = req.query;
        if (!slug) return res.status(400).json({ success: false, message: 'Missing slug' });
        const result = await importFromKaggle({ slug, limit: limit !== undefined ? Number(limit) : 100, strict: String(strict).toLowerCase() === 'true' });
        res.json({ success: true, message: 'Kaggle dataset imported', details: result });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Kaggle import failed', error: String(e.message || e) });
    }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5001;


// --- Real-time tracking endpoint ---
// Clients or agents can POST live events here:
// { email: 'user@example.com', event: { type: 'mobile_usage', payload: {...} } }
app.post('/api/live/track', (req, res) => {
    try {
        const { email, event } = req.body || {};
        if (!email || !event) {
            return res.status(400).json({ success: false, message: 'Missing email or event in body' });
        }
        const db = readDB();
        // Append to events stream (simple)
        if (!db.events) db.events = [];
        const ev = Object.assign({ id: Date.now(), timestamp: new Date().toISOString(), email }, event);
        db.events.push(ev);
        writeDB(db);

        // Emit to subscribed sockets for this email
        emitLiveUpdate(email, { type: 'event', event: ev });

        return res.json({ success: true, message: 'Event tracked', event: ev });
    } catch (e) {
        console.error('Live track error', e);
        return res.status(500).json({ success: false, message: String(e) });
    }
});
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('✅ COMPLETE DATASETS READY!');
    console.log('📊 Students, Productivity, Coding, Courses, Mobile, Events');
    console.log('👤 Any email → Complete realistic data generated');
    console.log('🌐 Test now with any email address!');
    try {
        // Auto-import on first run if DB has few students
        const db = JSON.parse(fs.readFileSync(DB_FILE));
        const autoImportLimit = process.env.IMPORT_LIMIT ? Number(process.env.IMPORT_LIMIT) : 100;
        const autoImportEnabled = String(process.env.AUTO_IMPORT || 'true').toLowerCase() !== 'false';
        if (autoImportEnabled && (db.students || []).length < 5) {
            importUciStudentPerformance({ limit: autoImportLimit }).then((r) => {
                console.log('📥 UCI dataset auto-imported:', r);
            }).catch((e) => console.error('Auto import failed:', e));
        }
    } catch (e) {
        console.error('Startup import check failed:', e);
    }
});