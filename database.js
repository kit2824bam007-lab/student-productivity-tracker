// Complete database structure
const dbStructure = {
    students: [
        {
            id: "unique_id",
            personal: {
                name: "Your Name",
                email: "your_email@student.com",
                phone: "your_phone",
                course: "Your Course",
                semester: "Current Semester",
                university: "Your University"
            },
            academic: {
                cgpa: 8.5,
                attendance: 85,
                completedCourses: ["Course1", "Course2"],
                currentCourses: ["Course3", "Course4"],
                certificates: ["Cert1", "Cert2"]
            },
            productivity: {
                dailyStudyHours: 6,
                weeklyGoals: 30,
                productivityScore: 78,
                focusSessions: 15,
                breakTime: 2
            },
            coding: {
                leetcode: { solved: 185, rank: 1254, streak: 45 },
                codechef: { solved: 62, rating: "3★", rank: 5821 },
                hackerrank: { solved: 120, badges: 8 },
                github: { repos: 15, contributions: 240 }
            },
            mobileUsage: {
                dailyScreenTime: 180,
                productiveApps: ["VS Code", "Coursera", "LeetCode"],
                socialApps: ["WhatsApp", "Instagram"],
                productivityScore: 75
            },
            events: [
                { name: "Hackathon", date: "2024-10-15", status: "registered" },
                { name: "Code Competition", date: "2024-10-20", status: "participating" }
            ]
        }
    ]
};