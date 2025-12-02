const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DB_FILE = path.join(process.cwd(), 'student_productivity_db.json');
const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function unzipZip(zipPath, outDir) {
    try {
        if (process.platform === 'win32') {
            execSync(`powershell -Command "Expand-Archive -Force -Path '${zipPath}' -DestinationPath '${outDir}'"`, { stdio: 'ignore' });
        } else {
            execSync(`unzip -o '${zipPath}' -d '${outDir}'`, { stdio: 'ignore' });
        }
        return true;
    } catch {
        return false;
    }
}

function runKaggleDownload(slug) {
    ensureDir(DATA_DIR);
    const zipOut = path.join(DATA_DIR, slug.split('/').pop() + '.zip');
    // Download via Kaggle CLI (requires KAGGLE_USERNAME and KAGGLE_KEY)
    execSync(`kaggle datasets download -d ${slug} -p "${DATA_DIR}" -q`, { stdio: 'inherit' });
    // Find latest zip in data dir (Kaggle names vary)
    const candidates = fs.readdirSync(DATA_DIR).filter(f => f.toLowerCase().endsWith('.zip'));
    let usedZip = null;
    if (candidates.length) {
        usedZip = path.join(DATA_DIR, candidates.sort((a,b)=> fs.statSync(path.join(DATA_DIR,b)).mtimeMs - fs.statSync(path.join(DATA_DIR,a)).mtimeMs)[0]);
    }
    if (usedZip) unzipZip(usedZip, DATA_DIR);
    return DATA_DIR;
}

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function toInt(val, fallback = 0) {
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : fallback;
}

function mapExamsCSV(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''));
    const idx = (h) => headers.indexOf(h);
    const universities = ['Anna University', 'SRM University', 'VIT University', 'Amrita University'];
    const out = { students: [], productivity: [], courses: [], coding_progress: [], mobile_usage: [] };
    lines.slice(1).forEach((line, i) => {
        const cols = line.split(',');
        const math = toInt(cols[idx('math score')]);
        const reading = toInt(cols[idx('reading score')]);
        const writing = toInt(cols[idx('writing score')]);
        const avg = Math.round((math + reading + writing) / 3);
        const studentId = `STU_KAG_EXAMS_${Date.now()}_${i}`;
        const email = `exam_${i}@example.edu`;
        out.students.push({
            student_id: studentId,
            personal_info: {
                name: `Exam Student ${i+1}`,
                email,
                phone: '+91' + Math.floor(Math.random() * 9000000000 + 1000000000),
                course: 'Computer Science',
                semester: 1 + (i % 8),
                university: randomFrom(universities),
                join_date: new Date().toISOString().split('T')[0]
            },
            academic_info: {
                cgpa: Math.max(0, Math.min(10, avg/10)).toFixed(1),
                attendance: 75 + (i % 20),
                completed_courses: 2 + (i % 4),
                current_courses: 1 + (i % 3),
                certificates: ['Programming Basics']
            }
        });
        // 7 days productivity derived from avg
        for (let d=0; d<7; d++) {
            const date = new Date(); date.setDate(date.getDate()-d);
            const study = 120 + (avg % 120);
            const productive = Math.round(study * (0.5 + avg/300));
            out.productivity.push({
                student_id: studentId,
                date: date.toISOString().split('T')[0],
                study_time: study,
                productive_time: Math.min(study, productive),
                productivity_score: Math.min(100, Math.max(50, Math.round(avg))),
                tasks_completed: 3 + (avg % 8),
                focus_sessions: 1 + (avg % 5),
                breaks_taken: 1 + (avg % 6)
            });
        }
    });
    return out;
}

function mapMarksCSV(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''));
    const idx = (h) => headers.indexOf(h);
    const out = { students: [], productivity: [] };
    lines.slice(1).forEach((line, i) => {
        const cols = line.split(',');
        const marks = toInt(cols[idx('Marks')]);
        const time = toInt(cols[idx('time_study')]);
        const studentId = `STU_KAG_MARKS_${Date.now()}_${i}`;
        const email = `marks_${i}@example.edu`;
        out.students.push({
            student_id: studentId,
            personal_info: { name: `Marks Student ${i+1}`, email, phone: '+919999999999', course: 'Data Science', semester: 1 + (i % 8), university: 'SRM University', join_date: new Date().toISOString().split('T')[0] },
            academic_info: { cgpa: Math.max(0, Math.min(10, marks/10)).toFixed(1), attendance: 75 + (i%20), completed_courses: 2, current_courses: 2, certificates: [] }
        });
        const study = 60 + time;
        const productive = Math.round(study * 0.6);
        const date = new Date().toISOString().split('T')[0];
        out.productivity.push({ student_id: studentId, date, study_time: study, productive_time: productive, productivity_score: Math.min(100, Math.round(marks)), tasks_completed: 3, focus_sessions: 2, breaks_taken: 2 });
    });
    return out;
}

function mapLeetCodeCSV(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''));
    const idx = (h) => headers.indexOf(h);
    const out = { students: [], coding_progress: [] };
    lines.slice(1).forEach((line, i) => {
        const cols = line.split(',');
        const username = cols[idx('username')] || `lc_user_${i}`;
        const solved = toInt(cols[idx('solved')] || cols[idx('solutions')] || 0);
        const studentId = `STU_KAG_LC_${Date.now()}_${i}`;
        const email = `${username}@example.edu`;
        out.students.push({ student_id: studentId, personal_info: { name: username, email, phone: '+919888888888', course: 'Computer Science', semester: 3, university: 'VIT University', join_date: new Date().toISOString().split('T')[0] }, academic_info: { cgpa: '8.0', attendance: 85, completed_courses: 3, current_courses: 2, certificates: [] } });
        out.coding_progress.push({ student_id: studentId, platform: 'LeetCode', problems_solved: solved, easy: Math.round(solved*0.5), medium: Math.round(solved*0.4), hard: Math.max(0, solved - Math.round(solved*0.9)), current_streak: 5 + (solved%30), global_rank: 1000 + solved });
    });
    return out;
}

function mergeIntoDb(mapped) {
    const db = readDB();
    if (mapped.students) db.students.push(...mapped.students);
    if (mapped.productivity) db.productivity.push(...mapped.productivity);
    if (mapped.coding_progress) db.coding_progress.push(...mapped.coding_progress);
    if (mapped.courses) db.courses.push(...mapped.courses);
    if (mapped.mobile_usage) db.mobile_usage.push(...mapped.mobile_usage);
    writeDB(db);
}

async function importFromKaggle({ slug, limit = 100, strict = false }) {
    // Download and unzip
    runKaggleDownload(slug);
    // Map known datasets
    let mapped = {};
    const lower = slug.toLowerCase();
    if (lower.includes('students-performance-in-exams')) {
        // common file name
        const csv = ['StudentsPerformance.csv', 'students_performance.csv'].map(f=> path.join(DATA_DIR,f)).find(p=> fs.existsSync(p));
        if (!csv) { if (strict) throw new Error('CSV not found for exams dataset'); else return { imported: 0 }; }
        mapped = mapExamsCSV(csv);
    } else if (lower.includes('student-marks-dataset')) {
        const guess = fs.readdirSync(DATA_DIR).find(f => f.toLowerCase().includes('student') && f.toLowerCase().endsWith('.csv'));
        if (!guess) { if (strict) throw new Error('CSV not found for marks dataset'); else return { imported: 0 }; }
        mapped = mapMarksCSV(path.join(DATA_DIR, guess));
    } else if (lower.includes('leetcode')) {
        const guess = fs.readdirSync(DATA_DIR).find(f => f.toLowerCase().includes('leet') && f.toLowerCase().endsWith('.csv'));
        if (!guess) { if (strict) throw new Error('CSV not found for leetcode dataset'); else return { imported: 0 }; }
        mapped = mapLeetCodeCSV(path.join(DATA_DIR, guess));
    } else {
        throw new Error('Unsupported Kaggle dataset slug');
    }
    // Respect limit
    if (Number(limit) > 0) {
        if (mapped.students) mapped.students = mapped.students.slice(0, limit);
        if (mapped.productivity) mapped.productivity = mapped.productivity.filter((p) => mapped.students.find(s => s.student_id === p.student_id));
        if (mapped.coding_progress) mapped.coding_progress = mapped.coding_progress.filter((c) => mapped.students.find(s => s.student_id === c.student_id));
    }
    mergeIntoDb(mapped);
    return { importedStudents: (mapped.students||[]).length };
}

module.exports = { importFromKaggle };


