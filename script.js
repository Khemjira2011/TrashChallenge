let score = Number(localStorage.getItem("trashScore")) || 0;
let questionIndex = 0;
let missionProgress = Number(localStorage.getItem("missionProgress")) || 0;
let missionClaimed = localStorage.getItem("missionClaimed") === "true";
let gameMissionClaimed = localStorage.getItem("gameMissionClaimed") === "true";
// 📊 สถิติการคัดแยกขยะ
let trashStats = JSON.parse(localStorage.getItem("trashStats")) || {
    total: 0,
    correct: 0,
    wrong: 0,
    recycle: 0,
    general: 0,
    organic: 0,
    danger: 0
};

// 📝 ประวัติการคัดแยก
let trashHistory = JSON.parse(localStorage.getItem("trashHistory")) || [];
let rewardHistory = JSON.parse(localStorage.getItem("rewardHistory")) || [];

function updateHomeScore() {
    const homeScore = document.getElementById("homeScore");
    if (homeScore) {
        homeScore.textContent = score;
    }
}

const questions = [
    {
        emoji: "🧴",
        name: "ขวดพลาสติก",
        answer: "recycle",
        explanation: "ขวดพลาสติกสามารถนำไปรีไซเคิลได้"
    },
    {
        emoji: "🍌",
        name: "เปลือกกล้วย",
        answer: "organic",
        explanation: "เปลือกกล้วยเป็นขยะอินทรีย์ สามารถนำไปทำปุ๋ยได้"
    },
    {
        emoji: "🥤",
        name: "แก้วพลาสติก",
        answer: "recycle",
        explanation: "แก้วพลาสติกบางชนิดสามารถนำไปรีไซเคิลได้"
    },
    {
        emoji: "🔋",
        name: "ถ่านไฟฉาย",
        answer: "danger",
        explanation: "ถ่านไฟฉายควรแยกเป็นขยะอันตราย"
    },
    {
        emoji: "📦",
        name: "กล่องกระดาษ",
        answer: "recycle",
        explanation: "กระดาษและกล่องกระดาษสามารถนำไปรีไซเคิลได้"
    },
    {
        emoji: "🍎",
        name: "เศษอาหาร",
        answer: "organic",
        explanation: "เศษอาหารเป็นขยะอินทรีย์"
    },
    {
        emoji: "🛍️",
        name: "ถุงพลาสติก",
        answer: "general",
        explanation: "ถุงพลาสติกที่ใช้แล้วควรทิ้งตามระบบจัดการขยะในพื้นที่"
    },
    {
        emoji: "💡",
        name: "หลอดไฟ",
        answer: "danger",
        explanation: "หลอดไฟควรแยกเป็นขยะอันตราย"
    },
    {
        emoji: "🥫",
        name: "กระป๋องอลูมิเนียม",
        answer: "recycle",
        explanation: "กระป๋องอลูมิเนียมสามารถนำไปรีไซเคิลได้"
    },
    {
        emoji: "📰",
        name: "หนังสือพิมพ์",
        answer: "recycle",
        explanation: "กระดาษสามารถนำไปรีไซเคิลได้"
    }
];

function startGame() {
    score = 0;
    localStorage.setItem("trashScore", score);
    questionIndex = 0;
    showQuestion();
}

function showQuestion() {
    const q = questions[questionIndex];
    document.querySelector(".app").innerHTML = `
        <h2>🗑️ ข้อที่ ${questionIndex + 1}/10</h2>

        <div style="
            width:100%;
            height:12px;
            background:#e0e0e0;
            border-radius:10px;
            margin:15px 0 25px;
            overflow:hidden;
        ">
            <div style="
                width:${((questionIndex + 1) / questions.length) * 100}%;
                height:100%;
                background:#55b947;
                border-radius:10px;
            "></div>
        </div>

        <div style="background:#e8f5e2;padding:35px;border-radius:20px;margin:20px 0;font-size:70px;">
            ${q.emoji}
        </div>

        <h3>
            จากภาพนี้ควรทิ้งลงถังขยะประเภทใด?
        </h3>

        <button onclick="checkAnswer('recycle')" style="background:#dff3d8;">🟢 ถังรีไซเคิล</button>

<button onclick="checkAnswer('general')" style="background:#dceeff;">🔵 ถังขยะทั่วไป</button>

<button onclick="checkAnswer('organic')" style="background:#f3e3cf;">🟤 ถังขยะอินทรีย์</button>

<button onclick="checkAnswer('danger')" style="background:#ffe0e0;">🔴 ถังขยะอันตราย</button>

    `;
}

function checkAnswer(answer) {

    const q = questions[questionIndex];

    // 📊 บันทึกสถิติ
    trashStats.total++;

    if (answer === q.answer) {
        trashStats.correct++;
    } else {
        trashStats.wrong++;
    }

    trashStats[answer]++;

    localStorage.setItem(
        "trashStats",
        JSON.stringify(trashStats)
    );

    // 📝 บันทึกประวัติการเล่นเกม
    trashHistory.unshift({
        object: q.name,
        confidence: 1,
        selectedBin: answer,
        correctBin: q.answer,
        correct: answer === q.answer,
        time: new Date().toLocaleString("th-TH")
    });

    if (trashHistory.length > 20) {
        trashHistory = trashHistory.slice(0, 20);
    }

    localStorage.setItem(
        "trashHistory",
        JSON.stringify(trashHistory)
    );

    if (answer === q.answer) {
        score += 10;
        localStorage.setItem("trashScore", score);

        document.querySelector(".app").innerHTML = `

            <h1>🎉 ถูกต้อง!</h1>

            <p>${q.explanation}</p>

            <div style="
                background:#fff4c7;
                padding:15px;
                border-radius:20px;
                margin:20px 0;
            ">
                <div style="font-size:40px;">⭐</div>
                <h2 style="margin:5px 0;">+10 คะแนน</h2>
                <p style="margin:5px 0;">คะแนนสะสม: ${score}</p>
            </div>

            <button onclick="nextQuestion()">
                ข้อต่อไป →
            </button>

        `;

    } else {

        document.querySelector(".app").innerHTML = `

            <h1>❌ ยังไม่ถูก</h1>

            <div style="
                background:#fff0f0;
                padding:25px;
                border-radius:25px;
                margin:25px 0;
            ">
                <div style="font-size:65px;">🤖</div>

                <h2>คำตอบที่ถูกต้องคือ</h2>

                <div style="
                    background:white;
                    padding:15px;
                    border-radius:15px;
                    margin:15px 0;
                    font-size:22px;
                    font-weight:bold;
                ">
                    ${q.answer}
                </div>

                <p>${q.explanation}</p>

                <p>⭐ คะแนนสะสม: ${score}</p>
            </div>

            <button onclick="nextQuestion()">
                ข้อต่อไป →
            </button>

        `;
    }
}

function nextQuestion() {

    questionIndex++;

    if (questionIndex >= questions.length) {
        showResult();
    } else {
        showQuestion();
    }
}

function showResult() {

    let message = "";

    if (score >= 90) {
        message = "🌟 เก่งมาก! คุณแยกขยะได้ยอดเยี่ยม";
    } else if (score >= 70) {
        message = "👏 ทำได้ดีมาก! ลองฝึกอีกนิดเพื่อให้ได้คะแนนเต็ม";
    } else if (score >= 50) {
        message = "💪 ทำได้ดี! มาฝึกแยกขยะกันต่อ";
    } else {
        message = "🌱 ลองเล่นอีกครั้งเพื่อเรียนรู้การแยกขยะ";
    }

    let rewardMessage = "";

    if (!gameMissionClaimed) {
        score += 100;
        gameMissionClaimed = true;

        localStorage.setItem("gameMissionClaimed", "true");
        localStorage.setItem("trashScore", score);

        rewardMessage = `
            <p style="color:#3f9d38;font-weight:bold;">
                🏆 ภารกิจพิเศษสำเร็จ! +100 คะแนน
            </p>
        `;
    } else {
        rewardMessage = `
            <p style="color:#777;">
                🏆 ภารกิจพิเศษสำเร็จแล้ว
            </p>
        `;
    }

    document.querySelector(".app").innerHTML = `

        <h1>🏆 จบเกม!</h1>

        <div style="
            background:#e8f5e2;
            padding:30px;
            border-radius:25px;
            margin:25px 0;
        ">

            <div style="font-size:70px;">🏆</div>

            <h2>เล่นครบ 10 ข้อแล้ว!</h2>

            <div style="
                font-size:50px;
                font-weight:bold;
                margin:15px 0;
            ">
                ⭐ ${score}
            </div>

            <p style="font-size:18px;">
                ${message}
            </p>

            ${rewardMessage}

        </div>

        <button onclick="startGame()">
            🔄 เล่นอีกครั้ง
        </button>

        <button onclick="goHome()">
            🏠 กลับหน้าหลัก
        </button>

    `;
}

function showKnowledge() {
    document.querySelector(".app").innerHTML = `
        <h1>♻️ โหมดความรู้</h1>

        <h2>🟢 ขยะรีไซเคิล</h2>
        <p>ขวดพลาสติก กระดาษ กระป๋อง</p>

        <h2>🔵 ขยะทั่วไป</h2>
        <p>ถุงขนม กล่องโฟม และขยะที่รีไซเคิลไม่ได้</p>

        <h2>🟤 ขยะอินทรีย์</h2>
        <p>เศษอาหาร เปลือกผลไม้ ใบไม้</p>

        <h2>🔴 ขยะอันตราย</h2>
        <p>ถ่านไฟฉาย หลอดไฟ แบตเตอรี่</p>

        <button onclick="location.reload()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function showScore() {

    document.querySelector(".app").innerHTML = `

        <h1>⭐ คะแนนของฉัน</h1>

        <div style="
            background:#fff4c7;
            padding:25px;
            border-radius:25px;
            margin:30px 0;
        ">

            <div style="font-size:55px;">⭐</div>

            <h2>${score} คะแนน</h2>

        </div>

        <h3>🏆 ผลการเล่น</h3>

        <p>คะแนนสะสม: ${score} คะแนน</p>

        <p>เป้าหมาย: 100 คะแนน</p>

        <button onclick="location.reload()">
            🏠 กลับหน้าหลัก
        </button>

        <button onclick="startGame()">
            🎮 เล่นเกม
        </button>

    `;
}

function showScore() {
    document.querySelector(".app").innerHTML = `
        <h1>⭐ คะแนนของฉัน</h1>

        <div style="
            background:#fff4c7;
            padding:30px;
            border-radius:25px;
            margin:30px 0;
        ">
            <div style="font-size:55px;">⭐</div>
            <h2 style="font-size:40px; margin:10px 0;">
                ${score}
            </h2>
            <p>คะแนนสะสม</p>
        </div>

        <button onclick="location.reload()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function showMission() {
    const progressPercent = (missionProgress / 5) * 100;

    document.querySelector(".app").innerHTML = `
        <h1>🎯 ภารกิจ</h1>

        <div style="
            background:#e8f5e2;
            padding:20px;
            border-radius:20px;
            margin:20px 0;
            text-align:left;
        ">
            <h2>🌱 ภารกิจวันนี้</h2>

            <p>♻️ คัดแยกขยะให้ถูกต้อง 5 ชิ้น</p>

            <div style="
                width:100%;
                height:14px;
                background:#ddd;
                border-radius:10px;
                overflow:hidden;
            ">
                <div style="
                    width:${progressPercent}%;
                    height:100%;
                    background:#55b947;
                    border-radius:10px;
                "></div>
            </div>

            <p style="text-align:center;font-weight:bold;">
                ${missionProgress}/5 ชิ้น
            </p>

            ${
                missionClaimed
                ? `<p style="color:#3f9d38;font-weight:bold;text-align:center;">
                    🏆 ภารกิจสำเร็จแล้ว! +50 คะแนน
                   </p>`
                : `<p>⭐ รางวัล: +50 คะแนน</p>`
            }
        </div>

        <div style="
            background:#fff4c7;
            padding:20px;
            border-radius:20px;
            text-align:left;
        ">
            <h2>🏆 ภารกิจพิเศษ</h2>
            <p>🗑️ เล่นเกมให้ครบ 10 ข้อ</p>
            <p>⭐ รางวัล: +100 คะแนน</p>
            <p>
    สถานะ:
    ${
        gameMissionClaimed
        ? "🏆 สำเร็จแล้ว!"
        : "⏳ ยังไม่สำเร็จ"
    }
</p>
        </div>

        <button onclick="location.reload()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function showSettings() {
    document.querySelector(".app").innerHTML = `
        <h1>⚙️ ตั้งค่า</h1>

        <div style="
            background:#e8f5e2;
            padding:20px;
            border-radius:20px;
            margin:20px 0;
            text-align:left;
        ">
            <h2>🔔 การแจ้งเตือน</h2>
            <p>เปิดการแจ้งเตือนภารกิจและรางวัล</p>
        </div>

        <div style="
            background:#fff4c7;
            padding:20px;
            border-radius:20px;
            margin:20px 0;
            text-align:left;
        ">
            <h2>🌱 เกี่ยวกับแอป</h2>
            <p>Trash Challenge</p>
            <p>คัดก่อนทิ้ง แยกให้ถูกที่ ♻️</p>
        </div>

        <button onclick="location.reload()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function showScanner() {
    document.querySelector(".app").innerHTML = `
        <h1>📷 สแกนขยะ</h1>

        <p>ถ่ายรูปขยะเพื่อให้ AI วิเคราะห์</p>

        <div style="
            background:#e8f5e2;
            padding:20px;
            border-radius:25px;
            margin:25px 0;
            text-align:center;
        ">

            <video id="camera" autoplay playsinline style="
                width:100%;
                max-width:400px;
                border-radius:20px;
                display:none;
            "></video>

            <canvas id="canvas" style="display:none;"></canvas>

            <img id="preview" style="
                width:100%;
                max-width:400px;
                border-radius:20px;
                display:none;
            ">

            <br>

            <button onclick="startCamera()">
                📷 เปิดกล้อง
            </button>

            <button onclick="takePhoto()" id="takeBtn" style="display:none;">
                📸 ถ่ายรูป
            </button>

            <input
                id="trashImage"
                type="file"
                accept="image/*"
                style="
                    width:100%;
                    padding:15px;
                    font-size:16px;
                    margin-top:10px;
                "
            >
        </div>

        <button onclick="handleImage()">
            🤖 วิเคราะห์ภาพ
        </button>

        <button onclick="goHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

let cameraStream;
let cameraImageData = null;

async function startCamera() {
    const video = document.getElementById("camera");
    const takeBtn = document.getElementById("takeBtn");

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });

        video.srcObject = cameraStream;
        video.style.display = "block";
        takeBtn.style.display = "inline-block";

    } catch (error) {
        alert("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้กล้อง");
        console.error(error);
    }
}

function takePhoto() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");

    if (!video.videoWidth || !video.videoHeight) {
        alert("กล้องยังไม่พร้อม กรุณารอสักครู่แล้วลองใหม่");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);

    // เก็บรูปที่ถ่ายไว้สำหรับส่งให้ AI
    cameraImageData = canvas.toDataURL("image/jpeg");

    // แสดงรูปที่ถ่าย
    preview.src = cameraImageData;
    preview.style.display = "block";

    // ซ่อนกล้อง
    video.style.display = "none";

    // ปิดกล้องหลังถ่าย
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    alert("ถ่ายรูปสำเร็จ! 📸 กด 'วิเคราะห์ภาพ' ได้เลย");
}

function previewImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    document.querySelector(".app").innerHTML = `
        <h1>🤔 เลือกประเภทขยะ</h1>

        <img src="${imageURL}" style="
            width:100%;
            max-height:280px;
            object-fit:contain;
            border-radius:20px;
            margin:20px 0;
        ">

        <p style="font-size:18px;">
            จากภาพนี้ คุณคิดว่าเป็นขยะประเภทใด?
        </p>

        <button onclick="selectTrashType('recycle')"
            style="background:#dff3d8;">
            🟢 ขยะรีไซเคิล
        </button>

        <button onclick="selectTrashType('general')"
            style="background:#dceeff;">
            🔵 ขยะทั่วไป
        </button>

        <button onclick="selectTrashType('organic')"
            style="background:#f3e3cf;">
            🟤 ขยะอินทรีย์
        </button>

        <button onclick="selectTrashType('danger')"
            style="background:#ffe0e0;">
            🔴 ขยะอันตราย
        </button>

        <button onclick="showScanner()">
            📷 เลือกรูปใหม่
        </button>
    `;
}

function selectBin(bin) {
    const correctBin = "recycle";

    const binNames = {
        recycle: "🟢 ถังรีไซเคิล",
        general: "🔵 ถังขยะทั่วไป",
        organic: "🟤 ถังขยะอินทรีย์",
        danger: "🔴 ถังขยะอันตราย"
    };

    if (bin === correctBin) {
        score += 10;

        document.querySelector(".app").innerHTML = `
            <h1>🎉 ถูกต้อง!</h1>

            <div style="
                background:#e8f5e2;
                padding:25px;
                border-radius:25px;
                margin:25px 0;
            ">
                <div style="font-size:60px;">🤖♻️</div>
                <h2>AI วิเคราะห์ว่า</h2>
                <p style="font-size:22px;">
                    ${binNames[correctBin]}
                </p>
                <h2>⭐ +10 คะแนน</h2>
            </div>

            <button onclick="showScanner()">
                📷 สแกนอีกครั้ง
            </button>

            <button onclick="goHome()">
                🏠 กลับหน้าหลัก
            </button>
        `;
    } else {
        document.querySelector(".app").innerHTML = `
            <h1>❌ ยังไม่ถูก</h1>

            <div style="
                background:#fff0f0;
                padding:25px;
                border-radius:25px;
                margin:25px 0;
            ">
                <div style="font-size:60px;">🤖</div>
                <h2>AI วิเคราะห์ว่า</h2>
                <p style="font-size:22px;">
                    ${binNames[correctBin]}
                </p>
                <p>ลองสังเกตประเภทของขยะแล้วเลือกถังให้ถูกต้องนะ</p>
            </div>

            <button onclick="showScanner()">
                📷 ลองอีกครั้ง
            </button>

            <button onclick="goHome()">
                🏠 กลับหน้าหลัก
            </button>
        `;
    }
}

function goHome() {
    location.href = "index.html";
}

function analyzeTrash(type) {
    const trashNames = {
        recycle: "🟢 ขยะรีไซเคิล",
        general: "🔵 ขยะทั่วไป",
        organic: "🟤 ขยะอินทรีย์",
        danger: "🔴 ขยะอันตราย"
    };

    document.querySelector(".app").innerHTML = `
        <h1>🤖 AI วิเคราะห์แล้ว!</h1>

        <div style="
            background:#e8f5e2;
            padding:25px;
            border-radius:25px;
            margin:25px 0;
        ">
            <div style="font-size:65px;">♻️</div>
            <h2>ประเภทขยะ</h2>
            <p style="font-size:24px;">
                ${trashNames[type]}
            </p>
            <p>
                กรุณาเลือกถังขยะให้ตรงกับประเภท
            </p>
        </div>

        <h3>คุณจะทิ้งลงถังไหน?</h3>

        <button onclick="checkTrashBin('${type}', 'recycle')">
            🟢 ถังรีไซเคิล
        </button>

        <button onclick="checkTrashBin('${type}', 'general')">
            🔵 ถังขยะทั่วไป
        </button>

        <button onclick="checkTrashBin('${type}', 'organic')">
            🟤 ถังขยะอินทรีย์
        </button>

        <button onclick="checkTrashBin('${type}', 'danger')">
            🔴 ถังขยะอันตราย
        </button>
    `;
}

function checkTrashBin(correctType, selectedBin) {
    const binNames = {
        recycle: "🟢 ถังรีไซเคิล",
        general: "🔵 ถังขยะทั่วไป",
        organic: "🟤 ถังขยะอินทรีย์",
        danger: "🔴 ถังขยะอันตราย"
    };

    if (correctType === selectedBin) {

        score += 10;

        // เพิ่มความคืบหน้าภารกิจ
        if (missionProgress < 5) {
            missionProgress++;
            localStorage.setItem("missionProgress", missionProgress);
        }

        // ให้รางวัลภารกิจเมื่อครบ 5 ชิ้น
        if (missionProgress >= 5 && !missionClaimed) {
            score += 50;
            missionClaimed = true;
            localStorage.setItem("missionClaimed", "true");
        }

        localStorage.setItem("trashScore", score);

        document.querySelector(".app").innerHTML = `
            <h1>🎉 ถูกต้อง!</h1>

            <div style="
                background:#e8f5e2;
                padding:25px;
                border-radius:25px;
                margin:25px 0;
            ">
                <div style="font-size:65px;">🤖♻️</div>

                <h2>คัดแยกถูกต้อง!</h2>

                <p style="font-size:22px;">
                    ${binNames[correctType]}
                </p>

                <h2>⭐ +10 คะแนน</h2>

                <p>คะแนนสะสม: ${score}</p>

                <p>🎯 ภารกิจ: ${missionProgress}/5</p>

                ${
                    missionProgress >= 5 && missionClaimed
                    ? `<p style="color:#3f9d38;font-weight:bold;">🏆 ภารกิจสำเร็จ! +50 คะแนน</p>`
                    : ""
                }
            </div>

            <button onclick="showScanner()">📷 สแกนอีกครั้ง</button>
            <button onclick="goHome()">🏠 กลับหน้าหลัก</button>
        `;

    } else {

        document.querySelector(".app").innerHTML = `
            <h1>❌ ยังไม่ถูก</h1>

            <div style="
                background:#fff0f0;
                padding:25px;
                border-radius:25px;
                margin:25px 0;
            ">
                <div style="font-size:65px;">🤖</div>

                <h2>ถังที่ถูกต้องคือ</h2>

                <p style="font-size:22px;">
                    ${binNames[correctType]}
                </p>

                <p>ลองสังเกตประเภทของขยะแล้วเลือกถังให้ถูกต้องนะ</p>

                <p>⭐ คะแนนสะสม: ${score}</p>

                <p>🎯 ภารกิจ: ${missionProgress}/5</p>
            </div>

            <button onclick="showScanner()">📷 ลองอีกครั้ง</button>
            <button onclick="goHome()">🏠 กลับหน้าหลัก</button>
        `;
    }
}

updateHomeScore();

function analyzeImage(imageURL) {

    document.querySelector(".app").innerHTML = `
        <h1>🤖 ผลการวิเคราะห์</h1>

        <img src="${imageURL}" style="
            width:100%;
            max-height:280px;
            object-fit:contain;
            border-radius:20px;
            margin:20px 0;
        ">

        <div style="
            background:#e8f5e2;
            padding:25px;
            border-radius:25px;
            margin:20px 0;
        ">
            <div style="font-size:60px;">🤖</div>

            <h2>ตรวจพบขยะ</h2>

            <p style="font-size:22px;">
                ระบบจำลองการวิเคราะห์ภาพ
            </p>

            <p>
                ระบบสามารถจำแนกประเภทขยะได้
            </p>
        </div>

        <h3>คุณจะทิ้งลงถังไหน?</h3>

        <button onclick="showScanner()">
            📷 สแกนใหม่
        </button>

        <button onclick="goHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function handleImage() {
    const input = document.getElementById("trashImage");

    let imageURL = null;

    // ถ่ายรูปจากกล้อง
    if (cameraImageData) {
        imageURL = cameraImageData;
    }

    // หรือเลือกรูปจากไฟล์
    else if (input && input.files[0]) {
        imageURL = URL.createObjectURL(input.files[0]);
    }

    // ยังไม่มีรูป
    else {
        alert("กรุณาถ่ายรูปหรือเลือกรูปขยะก่อน 📷");
        return;
    }

    document.querySelector(".app").innerHTML = `
        <h1>🤖 AI กำลังวิเคราะห์...</h1>

        <img id="previewImage" src="${imageURL}" style="
            width:100%;
            max-height:280px;
            object-fit:contain;
            border-radius:20px;
            margin:20px 0;
        ">

        <div style="
            background:#e8f5e2;
            padding:25px;
            border-radius:25px;
            margin:20px 0;
            text-align:center;
        ">
            <div style="font-size:60px;">🔍</div>
            <h2>กำลังวิเคราะห์ภาพ</h2>
            <p id="aiStatus">กำลังโหลด AI...</p>
        </div>
    `;

    const image = document.getElementById("previewImage");

    image.onload = async function () {

        try {
            document.getElementById("aiStatus").textContent =
                "กำลังโหลดโมเดล AI...";

            const model = await mobilenet.load({
                version: 2,
                alpha: 1.0
            });

            document.getElementById("aiStatus").textContent =
                "AI กำลังตรวจจับวัตถุ...";

            const predictions = await model.classify(image, 3);

            if (!predictions || predictions.length === 0) {
                throw new Error("AI ไม่พบวัตถุในภาพ");
            }

            const result = predictions[0];

            showAIResult(
                imageURL,
                result.className,
                result.probability
            );

        } catch (error) {

            console.error("AI ERROR:", error);

            document.querySelector(".app").innerHTML = `
                <h1>⚠️ วิเคราะห์ไม่สำเร็จ</h1>

                <div style="
                    background:#fff0f0;
                    padding:20px;
                    border-radius:20px;
                    margin:20px 0;
                ">
                    <div style="font-size:55px;">😥</div>

                    <h3>ไม่สามารถโหลด AI ได้</h3>

                    <p style="
                        font-size:13px;
                        color:#777;
                        word-break:break-word;
                    ">
                        ${error.message || error}
                    </p>
                </div>

                <button onclick="showScanner()">
                    📷 ลองใหม่
                </button>

                <button onclick="goHome()">
                    🏠 กลับหน้าหลัก
                </button>
            `;
        }
    };

        image.src = imageURL;

    image.onerror = function () {
        document.querySelector(".app").innerHTML = `
            <h1>⚠️ เปิดรูปไม่สำเร็จ</h1>
            <p>ไม่สามารถอ่านรูปภาพนี้ได้</p>

            <button onclick="showScanner()">
                📷 ลองใหม่
            </button>

            <button onclick="goHome()">
                🏠 กลับหน้าหลัก
            </button>
        `;
    };
}

function showAnalysisResult(imageURL) {

    document.querySelector(".app").innerHTML = `
        <h1>🤖 ผลการวิเคราะห์</h1>

        <img src="${imageURL}" style="
            width:100%;
            max-height:280px;
            object-fit:contain;
            border-radius:20px;
            margin:20px 0;
        ">

        <div style="
            background:#e8f5e2;
            padding:25px;
            border-radius:25px;
            margin:20px 0;
        ">
            <div style="font-size:60px;">🤖</div>

            <h2>AI Prototype</h2>

            <p>
                ขั้นตอนนี้เป็นการจำลองการวิเคราะห์ภาพ
            </p>

            <p>
                โมเดล AI จริงสามารถนำมาเชื่อมต่อในขั้นพัฒนาต่อไป
            </p>
        </div>

        <button onclick="showScanner()">
            📷 สแกนใหม่
        </button>

        <button onclick="goHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function showAIResult(imageURL, detectedObject, probability) {

    const object = detectedObject.toLowerCase();
    const confidence = Math.round(probability * 100);

    let correctType = "general";
    let binName = "ถังขยะทั่วไป";
    let binIcon = "🔵";
    let binColor = "#2196f3";

    // ♻️ ขยะรีไซเคิล
    if (
        object.includes("bottle") ||
        object.includes("plastic") ||
        object.includes("can") ||
        object.includes("carton") ||
        object.includes("paper") ||
        object.includes("newspaper") ||
        object.includes("box") ||
        object.includes("packet") ||
        object.includes("tin")
    ) {
        correctType = "recycle";
        binName = "ถังขยะรีไซเคิล";
        binIcon = "♻️";
        binColor = "#43a047";
    }

    // 🍌 ขยะอินทรีย์
    else if (
        object.includes("banana") ||
        object.includes("apple") ||
        object.includes("orange") ||
        object.includes("lemon") ||
        object.includes("fruit") ||
        object.includes("food")
    ) {
        correctType = "organic";
        binName = "ถังขยะอินทรีย์";
        binIcon = "🍃";
        binColor = "#8d6e63";
    }

    // 🔴 ขยะอันตราย
    else if (
        object.includes("battery") ||
        object.includes("bulb") ||
        object.includes("light") ||
        object.includes("electronic")
    ) {
        correctType = "danger";
        binName = "ถังขยะอันตราย";
        binIcon = "⚠️";
        binColor = "#e53935";
    }

    // ถ้าความมั่นใจต่ำ ให้ระบบเตือน
    const lowConfidence = confidence < 35;

    window.aiResult = {
        imageURL: imageURL,
        detectedObject: detectedObject,
        probability: probability,
        confidence: confidence,
        correctType: correctType,
        binName: binName,
        lowConfidence: lowConfidence
    };

    document.querySelector(".app").innerHTML = `

        <h1>🧠 AI วิเคราะห์ภาพเสร็จแล้ว</h1>

        <img src="${imageURL}" style="
            width:100%;
            max-height:280px;
            object-fit:contain;
            border-radius:22px;
            margin:15px 0;
            box-shadow:0 5px 20px rgba(0,0,0,0.12);
        ">

        <div style="
            background:linear-gradient(135deg,#e8f5e9,#f1f8e9);
            padding:20px;
            border-radius:22px;
            margin:15px 0;
            border:2px solid #c8e6c9;
        ">

            <div style="font-size:45px;">🤖</div>

            <h2 style="margin:8px 0;">
                พร้อมท้าทายแล้ว!
            </h2>

            <p style="margin:5px 0;">
                AI วิเคราะห์ภาพเรียบร้อยแล้ว
            </p>

            <div style="
                background:white;
                padding:12px;
                border-radius:15px;
                margin-top:12px;
            ">
                <b>AI มองเห็นว่า:</b><br>
                <span style="font-size:20px;">
                    ${detectedObject}
                </span>

                <div style="
                    margin-top:8px;
                    height:10px;
                    background:#ddd;
                    border-radius:10px;
                    overflow:hidden;
                ">
                    <div style="
                        width:${confidence}%;
                        height:100%;
                        background:#4caf50;
                    "></div>
                </div>

                <small>
                    ความมั่นใจของ AI: <b>${confidence}%</b>
                </small>
            </div>

            ${
                lowConfidence
                    ? `
                    <div style="
                        margin-top:12px;
                        background:#fff8e1;
                        padding:12px;
                        border-radius:15px;
                        color:#795548;
                    ">
                        ⚠️ AI มีความมั่นใจค่อนข้างต่ำ<br>
                        ระบบจะไม่ถือว่าผล AI ถูกต้อง 100%
                        กรุณาใช้ความรู้ประกอบการตัดสินใจ
                    </div>
                    `
                    : `
                    <div style="
                        margin-top:12px;
                        background:#e8f5e9;
                        padding:12px;
                        border-radius:15px;
                    ">
                        ✅ AI มีความมั่นใจในระดับหนึ่ง
                    </div>
                    `
            }

        </div>

        <div style="
            background:#ffffff;
            padding:20px;
            border-radius:22px;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);
        ">

            <h2>🗑️ ถึงตาคุณแล้ว!</h2>

            <p>
                คุณคิดว่าขยะชิ้นนี้ควรทิ้งถังไหน?
            </p>

            <p style="color:#777;font-size:14px;">
                เลือกคำตอบก่อนดูผลเฉลยจากระบบ
            </p>

            <button onclick="answerAI('recycle')"
                style="background:#43a047;">
                ♻️ รีไซเคิล
            </button>

            <button onclick="answerAI('general')"
                style="background:#2196f3;">
                🔵 ทั่วไป
            </button>

            <button onclick="answerAI('organic')"
                style="background:#8d6e63;">
                🍃 อินทรีย์
            </button>

            <button onclick="answerAI('danger')"
                style="background:#e53935;">
                ⚠️ อันตราย
            </button>

        </div>
    `;
}

function answerAI(selectedBin) {

    const result = window.aiResult;

    if (!result) {
        alert("ไม่พบผลการวิเคราะห์ กรุณาลองใหม่");
        showScanner();
        return;
    }

    const correct = selectedBin === result.correctType;

     // 📊 บันทึกสถิติ
     trashStats.total++;

    if (correct) {
        trashStats.correct++;
    } else {
        trashStats.wrong++;
    }

trashStats[selectedBin]++;

localStorage.setItem("trashStats", JSON.stringify(trashStats));

if (correct) {
    score += 10;

    if (missionProgress < 5) {
        missionProgress++;
    }

    localStorage.setItem("trashScore", score);
    localStorage.setItem("missionProgress", missionProgress);
}

    const selectedName = getBinName(selectedBin);

// 📝 บันทึกประวัติการคัดแยก
trashHistory.unshift({
    object: result.detectedObject,
    confidence: result.confidence,
    selectedBin: selectedBin,
    correctBin: result.correctType,
    correct: correct,
    time: new Date().toLocaleString("th-TH")
});

if (trashHistory.length > 20) {
    trashHistory = trashHistory.slice(0, 20);
}

localStorage.setItem("trashHistory", JSON.stringify(trashHistory));

    const resultColor = correct ? "#e8f5e9" : "#ffebee";
    const resultIcon = correct ? "🎉" : "💡";
    const resultTitle = correct
        ? "ตอบถูกต้อง!"
        : "ยังไม่ถูกนะ!";

    document.querySelector(".app").innerHTML = `

        <h1>${resultIcon} ${resultTitle}</h1>

        <img src="${result.imageURL}" style="
            width:100%;
            max-height:250px;
            object-fit:contain;
            border-radius:22px;
            margin:15px 0;
        ">

        <div style="
            background:${resultColor};
            padding:20px;
            border-radius:22px;
            margin:15px 0;
        ">

            <h2>
                ${correct ? "✅ เยี่ยมมาก!" : "📚 มาเรียนรู้กัน!"}
            </h2>

            <p>
                คุณเลือก:
                <b>${selectedName}</b>
            </p>

            <p>
                AI แนะนำ:
                <b>${result.binName}</b>
            </p>

            <hr>

            <p>
                🤖 <b>AI ตรวจพบ:</b><br>
                ${result.detectedObject}
            </p>

            <p>
                📊 <b>ความมั่นใจ:</b>
                ${result.confidence}%
            </p>

        </div>

        <div style="
            background:white;
            padding:20px;
            border-radius:22px;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);
            text-align:left;
        ">

            <h2>💡 ทำไมต้องทิ้งถังนี้?</h2>

            <p>
                ${getTrashExplanation(result.correctType)}
            </p>

            <div style="
                background:#e3f2fd;
                padding:15px;
                border-radius:15px;
                margin-top:15px;
            ">

                <b>🌱 เกร็ดความรู้</b>

                <p style="margin-bottom:0;">
                    การแยกขยะตั้งแต่ต้นทางช่วยลดการปนเปื้อน
                    และทำให้ขยะบางประเภทสามารถนำกลับมาใช้ประโยชน์ได้ง่ายขึ้น
                </p>

            </div>

        </div>

        <div style="
            background:#fff8e1;
            padding:18px;
            border-radius:20px;
            margin-top:15px;
        ">

            <h3>🏆 คะแนนของคุณ</h3>

            <div style="font-size:35px;font-weight:bold;">
                ${score} คะแนน
            </div>

            ${
                correct
                    ? `<p>+10 คะแนน 🎉</p>`
                    : `<p>ครั้งนี้ไม่ได้คะแนน แต่ได้ความรู้เพิ่ม! 💪</p>`
            }

        </div>

        <button onclick="showScanner()">
            📷 สแกนขยะชิ้นต่อไป
        </button>

        <button onclick="goHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

function getBinName(type) {

    if (type === "recycle") return "♻️ ถังขยะรีไซเคิล";
    if (type === "organic") return "🍃 ถังขยะอินทรีย์";
    if (type === "danger") return "⚠️ ถังขยะอันตราย";

    return "🔵 ถังขยะทั่วไป";
}

function getTrashExplanation(type) {

    if (type === "recycle") {
        return "ขยะประเภทนี้สามารถนำเข้าสู่กระบวนการคัดแยกและรีไซเคิลเพื่อนำวัสดุกลับมาใช้ประโยชน์ได้ โดยควรเทสิ่งสกปรกหรือเศษอาหารออกก่อนทิ้ง";
    }

    if (type === "organic") {
        return "ขยะอินทรีย์หรือเศษอาหารสามารถย่อยสลายได้ตามธรรมชาติ และบางส่วนสามารถนำไปทำปุ๋ยหรือใช้ประโยชน์ต่อได้";
    }

    if (type === "danger") {
        return "ขยะอันตรายควรแยกออกจากขยะทั่วไป เพราะอาจมีสารหรือส่วนประกอบที่เป็นอันตรายต่อคนและสิ่งแวดล้อม";
    }

    return "ขยะทั่วไปคือขยะที่ไม่เหมาะกับการรีไซเคิล ไม่ใช่ขยะอินทรีย์ และไม่ใช่ขยะอันตราย จึงควรแยกออกจากขยะประเภทอื่นก่อนทิ้ง";
}

function getTrashExplanation(type) {

    const explanations = {

        recycle:
            "ขยะรีไซเคิล เช่น ขวดพลาสติก กระป๋อง และกระดาษ สามารถนำไปผ่านกระบวนการเพื่อนำกลับมาใช้ประโยชน์ได้",

        general:
            "ขยะทั่วไปเป็นขยะที่ไม่สามารถนำกลับมาใช้ใหม่หรือย่อยสลายได้ง่าย เช่น ถุงพลาสติกบางประเภท",

        organic:
            "ขยะอินทรีย์ เช่น เศษอาหารและเปลือกผลไม้ สามารถย่อยสลายได้และนำไปทำปุ๋ยได้",

        danger:
            "ขยะอันตราย เช่น แบตเตอรี่และหลอดไฟ ควรแยกทิ้งโดยเฉพาะ เพราะอาจมีสารที่เป็นอันตราย"
    };

    return explanations[type];
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => {
                console.log("Service Worker พร้อมใช้งาน");
            })
            .catch(error => {
                console.log("Service Worker error:", error);
            });
    });
}

// 📊 แสดงสถิติการคัดแยกขยะ
function showStats() {

    const accuracy = trashStats.total > 0
        ? Math.round((trashStats.correct / trashStats.total) * 100)
        : 0;

    const bins = {
        recycle: trashStats.recycle,
        general: trashStats.general,
        organic: trashStats.organic,
        danger: trashStats.danger
    };

    let bestBin = "general";

    if (trashStats.total > 0) {
        bestBin = Object.keys(bins).reduce((a, b) =>
            bins[a] >= bins[b] ? a : b
        );
    }

    const bestBinName = getBinName(bestBin);

    let feedback = "ลองสแกนขยะเพิ่มอีกนิดเพื่อให้ระบบวิเคราะห์ข้อมูลของคุณ 😊";

    if (trashStats.total > 0) {

        const weakestBin = Object.keys(bins).reduce((a, b) =>
            bins[a] <= bins[b] ? a : b
        );

        const weakestBinName = getBinName(weakestBin);

        if (accuracy >= 80) {
            feedback = "🌟 ยอดเยี่ยม! คุณคัดแยกขยะได้แม่นยำมาก";
        }
        else if (accuracy >= 60) {
            feedback = "💪 ทำได้ดี! ลองฝึกเพิ่มเติมเกี่ยวกับ " + weakestBinName;
        }
        else {
            feedback = "🌱 ระบบแนะนำให้ฝึกเกี่ยวกับ " + weakestBinName + " เป็นพิเศษ";
        }
    }

    document.querySelector(".app").innerHTML = `
        <h1>📊 สถิติของคุณ</h1>

        <div style="
            background:white;
            padding:20px;
            border-radius:20px;
            margin:20px 0;
            box-shadow:0 4px 12px rgba(0,0,0,0.1);
        ">

            <h2>📈 ผลการใช้งาน</h2>

            <p>🗑️ สแกนทั้งหมด: <b>${trashStats.total}</b> ครั้ง</p>
            <p>✅ ตอบถูก: <b>${trashStats.correct}</b> ครั้ง</p>
            <p>❌ ตอบผิด: <b>${trashStats.wrong}</b> ครั้ง</p>

            <hr>

            <h2>🎯 ความแม่นยำ</h2>

            <div style="
                font-size:48px;
                font-weight:bold;
                margin:15px;
            ">
                ${accuracy}%
            </div>

            <p>${feedback}</p>

            <hr>

            <h2>🗑️ ประเภทขยะที่เลือก</h2>

            <p>♻️ รีไซเคิล: ${trashStats.recycle} ครั้ง</p>
            <p>🔵 ทั่วไป: ${trashStats.general} ครั้ง</p>
            <p>🍃 อินทรีย์: ${trashStats.organic} ครั้ง</p>
            <p>⚠️ อันตราย: ${trashStats.danger} ครั้ง</p>

            <hr>

            <h3>📊 การเลือกถังขยะ</h3>

            <div style="margin:15px 0;">
                <div>♻️ รีไซเคิล</div>
                <div style="
                    background:#e0e0e0;
                    border-radius:10px;
                    height:20px;
                    overflow:hidden;
                ">
                    <div style="
                        width:${Math.min(trashStats.recycle * 10, 100)}%;
                        height:20px;
                        background:#43a047;
                    "></div>
                </div>
            </div>

            <div style="margin:15px 0;">
                <div>🔵 ทั่วไป</div>
                <div style="
                    background:#e0e0e0;
                    border-radius:10px;
                    height:20px;
                    overflow:hidden;
                ">
                    <div style="
                        width:${Math.min(trashStats.general * 10, 100)}%;
                        height:20px;
                        background:#2196f3;
                    "></div>
                </div>
            </div>

            <div style="margin:15px 0;">
                <div>🍃 อินทรีย์</div>
                <div style="
                    background:#e0e0e0;
                    border-radius:10px;
                    height:20px;
                    overflow:hidden;
                ">
                    <div style="
                        width:${Math.min(trashStats.organic * 10, 100)}%;
                        height:20px;
                        background:#8d6e63;
                    "></div>
                </div>
            </div>

            <div style="margin:15px 0;">
                <div>⚠️ อันตราย</div>
                <div style="
                    background:#e0e0e0;
                    border-radius:10px;
                    height:20px;
                    overflow:hidden;
                ">
                    <div style="
                        width:${Math.min(trashStats.danger * 10, 100)}%;
                        height:20px;
                        background:#e53935;
                    "></div>
                </div>
            </div>

            <hr>

            <h3>🏆 ประเภทที่เลือกบ่อยที่สุด</h3>

            <p>
                ${bestBinName}
            </p>

        </div>

        <button onclick="showScanner()">
            📷 สแกนขยะอีกครั้ง
        </button>

        <button onclick="showHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

// 📝 แสดงประวัติการคัดแยก
function showHistory() {

    let historyHTML = "";

    if (trashHistory.length === 0) {
        historyHTML = `
            <div style="
                background:white;
                padding:30px;
                border-radius:20px;
                margin:20px 0;
                text-align:center;
            ">
                <div style="font-size:50px;">🗑️</div>
                <h2>ยังไม่มีประวัติ</h2>
                <p>ลองสแกนขยะเพื่อเริ่มสร้างประวัติของคุณ</p>
            </div>
        `;
    } else {

        historyHTML = trashHistory.map((item, index) => {

            const resultIcon = item.correct ? "✅" : "❌";
            const resultText = item.correct ? "ตอบถูก" : "ตอบผิด";

            return `
                <div style="
                    background:white;
                    padding:16px;
                    border-radius:16px;
                    margin:12px 0;
                    box-shadow:0 3px 10px rgba(0,0,0,0.08);
                    text-align:left;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    ">
                        <b>ครั้งที่ ${trashHistory.length - index}</b>
                        <span>${resultIcon} ${resultText}</span>
                    </div>

                    <hr>

                    <p>
                        🤖 AI ตรวจพบ:
                        <b>${item.object}</b>
                    </p>

                    <p>
                        🎯 ความมั่นใจ:
                        <b>${Math.round(item.confidence * 100)}%</b>
                    </p>

                    <p>
                        🗑️ คุณเลือก:
                        <b>${getBinName(item.selectedBin)}</b>
                    </p>

                    <p>
                        💡 ถังที่ระบบแนะนำ:
                        <b>${getBinName(item.correctBin)}</b>
                    </p>

                    <small>🕐 ${item.time}</small>

                </div>
            `;
        }).join("");
    }

    document.querySelector(".app").innerHTML = `
        <h1>📝 ประวัติการคัดแยก</h1>

        <p>
            แสดงประวัติการสแกนล่าสุด
            ${trashHistory.length} รายการ
        </p>

        ${historyHTML}

        <button onclick="showScanner()">
            📷 สแกนขยะ
        </button>

        <button onclick="showStats()">
            📊 ดูสถิติ
        </button>

        <button onclick="showHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

// 🏆 ระบบตรวจสอบเหรียญ / Badge
function getBadges() {

    const accuracy = trashStats.total > 0
        ? Math.round((trashStats.correct / trashStats.total) * 100)
        : 0;

    return [
        {
            icon: "🗑️",
            name: "นักสแกนมือใหม่",
            description: "สแกนขยะครบ 5 ครั้ง",
            unlocked: trashStats.total >= 5
        },
        {
            icon: "🎯",
            name: "นักคัดแยกมือโปร",
            description: "ตอบถูกครบ 5 ครั้ง",
            unlocked: trashStats.correct >= 5
        },
        {
            icon: "🌟",
            name: "ผู้เชี่ยวชาญการคัดแยก",
            description: "มีความแม่นยำตั้งแต่ 80% ขึ้นไป",
            unlocked: accuracy >= 80 && trashStats.total >= 5
        }
    ];
}

// 🏆 แสดงเหรียญ / Badge
function showBadges() {

    const badges = getBadges();

    const badgeHTML = badges.map(badge => {

        const status = badge.unlocked
            ? "🏆 ปลดล็อกแล้ว"
            : "🔒 ยังไม่ปลดล็อก";

        const opacity = badge.unlocked ? "1" : "0.45";

        return `
            <div style="
                background:white;
                padding:20px;
                border-radius:20px;
                margin:15px 0;
                text-align:center;
                opacity:${opacity};
                box-shadow:0 4px 12px rgba(0,0,0,0.1);
            ">

                <div style="font-size:60px;">
                    ${badge.icon}
                </div>

                <h2>${badge.name}</h2>

                <p>${badge.description}</p>

                <strong>${status}</strong>

            </div>
        `;

    }).join("");

    document.querySelector(".app").innerHTML = `
        <h1>🏆 เหรียญของฉัน</h1>

        <p>
            ปลดล็อก Badge เพื่อแสดงความสำเร็จในการคัดแยกขยะ
        </p>

        ${badgeHTML}

        <button onclick="showScanner()">
            📷 สแกนขยะ
        </button>

        <button onclick="showStats()">
            📊 ดูสถิติ
        </button>

        <button onclick="showHome()">
            🏠 กลับหน้าหลัก
        </button>
    `;
}

// 🏠 กลับหน้าหลัก
function showHome() {
    location.reload();
}

function showRewards() {
    const score = Number(localStorage.getItem("trashScore")) || 0;

    document.querySelector(".app").innerHTML = `
        <div class="page">
            <h2>🎁 แลกของรางวัล</h2>

            <p class="reward-score">
                ⭐ คะแนนของฉัน: <strong>${score}</strong>
            </p>

            <div class="reward-list">

                <div class="reward-card">
                    <div class="reward-icon">🌱</div>
                    <h3>เมล็ดพันธุ์</h3>
                    <p>ใช้ 100 คะแนน</p>
                    <button onclick="redeemReward(100, '🌱 เมล็ดพันธุ์')">
                        แลกของรางวัล
                    </button>
                </div>

                <div class="reward-card">
                    <div class="reward-icon">🛍️</div>
                    <h3>ถุงผ้า</h3>
                    <p>ใช้ 200 คะแนน</p>
                    <button onclick="redeemReward(200, '🛍️ ถุงผ้า')">
                        แลกของรางวัล
                    </button>
                </div>

                <div class="reward-card">
                    <div class="reward-icon">♻️</div>
                    <h3>สมุดรีไซเคิล</h3>
                    <p>ใช้ 300 คะแนน</p>
                    <button onclick="redeemReward(300, '♻️ สมุดรีไซเคิล')">
                        แลกของรางวัล
                    </button>
                </div>

                <div class="reward-card">
                    <div class="reward-icon">🏆</div>
                    <h3>รางวัลพิเศษ</h3>
                    <p>ใช้ 500 คะแนน</p>
                    <button onclick="redeemReward(500, '🏆 รางวัลพิเศษ')">
                        แลกของรางวัล
                    </button>
                </div>

            </div>

                <div class="reward-section">

                    <h3>🎁 รางวัลที่เคยแลก</h3>

    ${
                rewardHistory.length === 0
                ? "<p>ยังไม่มีรางวัลที่แลก</p>"
                 : rewardHistory.slice(0, 5).map(reward => `
            <div class="reward-history-item">
                <strong>${reward.name}</strong>
                <span>⭐ ${reward.cost} คะแนน</span>
                <small>${reward.time}</small>
            </div>
        `).join("")
    }

</div>
            <button onclick="goHome()">
                🏠 กลับหน้าหลัก
            </button>
        </div>
    `;
}

function redeemReward(cost, rewardName) {
    let score = Number(localStorage.getItem("trashScore")) || 0;

    if (score < cost) {
        alert("❌ คะแนนยังไม่พอสำหรับรางวัลนี้");
        return;
    }

    score -= cost;

    localStorage.setItem("trashScore", score);

    rewardHistory.unshift({
        name: rewardName,
        cost: cost,
        time: new Date().toLocaleString("th-TH")
    });

    localStorage.setItem(
        "rewardHistory",
        JSON.stringify(rewardHistory)
    );

    alert(`🎉 แลก ${rewardName} สำเร็จ!`);

    showRewards();
}

function showProfile() {
    const score = Number(localStorage.getItem("trashScore")) || 0;
    const playerRank = getPlayerRank(score);

    const total = trashStats.total || 0;
    const correct = trashStats.correct || 0;

    const accuracy = total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    const badges = getBadges();
    const unlockedBadges = badges.filter(badge => badge.unlocked).length;

    document.querySelector(".app").innerHTML = `
        <div class="page">

            <h2>👤 โปรไฟล์ของฉัน</h2>

            <div class="profile-card">

                <div class="big-profile">
                    👤
                </div>

                <h3>นักคัดแยกขยะ</h3>

                <p>
        ${playerRank.icon} <strong>${playerRank.name}</strong>
                </p>

            <p>♻️ Trash Challenge Player</p>

            </div>

            <div class="profile-stats">

                <div class="profile-stat">
                    <strong>⭐ ${score}</strong>
                    <span>คะแนน</span>
                </div>

                <div class="profile-stat">
                    <strong>📷 ${total}</strong>
                    <span>สแกนทั้งหมด</span>
                </div>

                <div class="profile-stat">
                    <strong>🎯 ${correct}</strong>
                    <span>ตอบถูก</span>
                </div>

                <div class="profile-stat">
                    <strong>📈 ${accuracy}%</strong>
                    <span>ความแม่นยำ</span>
                </div>

            </div>

            <div class="profile-section">
                <h3>🏆 เหรียญที่ได้รับ</h3>
                <p>${unlockedBadges} / ${badges.length} เหรียญ</p>
            </div>

            <button onclick="showBadges()">
                🏆 ดูเหรียญทั้งหมด
            </button>

            <button onclick="showRewards()">
                🎁 แลกของรางวัล
            </button>

            <button onclick="goHome()">
                🏠 กลับหน้าหลัก
            </button>

        </div>
    `;
}

function getPlayerRank(score) {
    if (score >= 500) {
        return {
            icon: "👑",
            name: "ตำนานนักคัดแยก"
        };
    }

    if (score >= 300) {
        return {
            icon: "♻️",
            name: "ฮีโร่รักษ์โลก"
        };
    }

    if (score >= 100) {
        return {
            icon: "🌱",
            name: "นักคัดแยก"
        };
    }

    return {
        icon: "⭐",
        name: "มือใหม่รักษ์โลก"
    };
}

// ==========================================
// 🎮 GAME CENTER
// ==========================================

function openGameCenter() {
    document.querySelector(".app").innerHTML = `
        <div class="page game-center">

            <h2>🎮 Game Center</h2>
            <p class="game-subtitle">
                เลือกเกมที่ต้องการ แล้วมาท้าทายความรู้เรื่องขยะ!
            </p>

            <div class="game-card" onclick="startTrueFalseGame()">
                <div class="game-icon">🧠</div>
                <div>
                    <h3>จริงหรือไม่?</h3>
                    <p>ทดสอบความรู้เรื่องการคัดแยกขยะ</p>
                    <span>เล่น 10 ข้อ • +10 คะแนน</span>
                </div>
            </div>

            <div class="game-card" onclick="startSpeedGame()">
                <div class="game-icon">⚡</div>
                <div>
                    <h3>ตอบให้ไว!</h3>
                    <p>เลือกถังขยะให้ถูกก่อนหมดเวลา</p>
                    <span>จับเวลา • ฝึกการตัดสินใจ</span>
                </div>
            </div>

            <div class="game-card" onclick="startGame()">
                <div class="game-icon">🗑️</div>
                <div>
                    <h3>คัดให้ถูกถัง</h3>
                    <p>เกมคัดแยกขยะรูปแบบดั้งเดิม</p>
                    <span>เกมหลักของ Trash Challenge</span>
                </div>
            </div>

            <div class="game-card" onclick="showScanner()">
                <div class="game-icon">📷</div>
                <div>
                    <h3>AI Scanner</h3>
                    <p>ให้ AI ช่วยวิเคราะห์สิ่งของจากภาพ</p>
                    <span>ทดลองใช้ AI</span>
                </div>
            </div>

            <button onclick="location.reload()">
                🏠 กลับหน้าหลัก
            </button>

        </div>
    `;
}

// ==========================================
// 🧠 TRUE OR FALSE GAME
// ==========================================

const trueFalseQuestions = [
    {
        question: "ขวดพลาสติกสามารถนำไปรีไซเคิลได้",
        answer: true
    },
    {
        question: "เศษอาหารควรทิ้งรวมกับถ่านไฟฉาย",
        answer: false
    },
    {
        question: "ถ่านไฟฉายเป็นขยะอันตราย",
        answer: true
    },
    {
        question: "เปลือกผลไม้จัดเป็นขยะอินทรีย์",
        answer: true
    },
    {
        question: "การแยกขยะช่วยให้สามารถนำวัสดุกลับมาใช้ประโยชน์ได้ง่ายขึ้น",
        answer: true
    },
    {
        question: "กระดาษทุกชนิดสามารถนำไปรีไซเคิลได้โดยไม่ต้องคัดแยก",
        answer: false
    },
    {
        question: "หลอดไฟที่ใช้แล้วควรทิ้งรวมกับเศษอาหาร",
        answer: false
    },
    {
        question: "การลดการใช้สิ่งของที่ไม่จำเป็นเป็นหลักการ Reduce",
        answer: true
    },
    {
        question: "ขยะอันตรายควรจัดการแยกจากขยะทั่วไป",
        answer: true
    },
    {
        question: "การทิ้งขยะถูกประเภทช่วยลดปัญหาขยะปะปนกัน",
        answer: true
    }
];

let trueFalseIndex = 0;
let trueFalseScore = 0;

function startTrueFalseGame() {

    trueFalseIndex = 0;
    trueFalseScore = 0;

    showTrueFalseQuestion();
}

function showTrueFalseQuestion() {

    const q = trueFalseQuestions[trueFalseIndex];

    document.querySelector(".app").innerHTML = `
        <div class="page true-false-page">

            <div class="game-top">
                <span>🧠 จริงหรือไม่?</span>
                <strong>${trueFalseIndex + 1}/${trueFalseQuestions.length}</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                     style="width:${((trueFalseIndex + 1) / trueFalseQuestions.length) * 100}%">
                </div>
            </div>

            <div class="question-card">

                <div class="question-icon">
                    ❓
                </div>

                <p class="question-label">
                    ข้อที่ ${trueFalseIndex + 1}
                </p>

                <h2>
                    ${q.question}
                </h2>

            </div>

            <div class="tf-buttons">

                <button class="true-btn"
                        onclick="answerTrueFalse(true)">
                    ✅ จริง
                </button>

                <button class="false-btn"
                        onclick="answerTrueFalse(false)">
                    ❌ ไม่จริง
                </button>

            </div>

            <p class="game-score">
                ⭐ คะแนนรอบนี้: ${trueFalseScore}
            </p>

            <button onclick="openGameCenter()">
                🎮 กลับ Game Center
            </button>

        </div>
    `;
}

function answerTrueFalse(answer) {

    const q = trueFalseQuestions[trueFalseIndex];

    if (answer === q.answer) {
        trueFalseScore += 10;
        alert("🎉 ถูกต้อง! +10 คะแนน");
    } else {
        alert("❌ ยังไม่ถูก ลองจำข้อนี้ไว้นะ!");
    }

    trueFalseIndex++;

    if (trueFalseIndex >= trueFalseQuestions.length) {
        finishTrueFalseGame();
    } else {
        showTrueFalseQuestion();
    }
}

function finishTrueFalseGame() {

    let score = Number(localStorage.getItem("trashScore")) || 0;
    score += trueFalseScore;

    localStorage.setItem("trashScore", score);

    document.querySelector(".app").innerHTML = `
        <div class="page game-finish">

            <div class="finish-icon">🏆</div>

            <h2>จบเกมแล้ว!</h2>

            <p>🧠 จริงหรือไม่?</p>

            <div class="final-score-card">
                <small>คะแนนที่ได้</small>
                <strong>+${trueFalseScore} ⭐</strong>
            </div>

            <p>
                ${trueFalseScore >= 80
                    ? "🌟 ยอดเยี่ยม! ความรู้เรื่องขยะของคุณดีมาก"
                    : trueFalseScore >= 50
                    ? "🌱 เก่งมาก! ลองเล่นอีกครั้งเพื่อทำคะแนนให้สูงขึ้น"
                    : "💡 ลองอ่านความรู้แล้วกลับมาเล่นอีกครั้งนะ"
                }
            </p>

            <button class="start-btn"
                    onclick="startTrueFalseGame()">
                🔄 เล่นอีกครั้ง
            </button>

            <button onclick="openGameCenter()">
                🎮 เลือกเกมอื่น
            </button>

            <button onclick="location.reload()">
                🏠 กลับหน้าหลัก
            </button>

        </div>
    `;
}

// ==========================================
// 📚 KNOWLEDGE CENTER
// ==========================================

const knowledgeData = [
    {
        icon: "♻️",
        title: "รู้จักประเภทขยะ",
        text: "ขยะสามารถแบ่งเป็นหลายประเภท เช่น ขยะรีไซเคิล ขยะอินทรีย์ ขยะทั่วไป และขยะอันตราย การแยกประเภทช่วยให้จัดการขยะได้เหมาะสม"
    },
    {
        icon: "🟢",
        title: "ขยะรีไซเคิล",
        text: "เช่น ขวดพลาสติก กระป๋องอะลูมิเนียม กระดาษ และกล่องกระดาษ ควรคัดแยกและเตรียมวัสดุให้เหมาะสมก่อนนำไปรีไซเคิล"
    },
    {
        icon: "🟤",
        title: "ขยะอินทรีย์",
        text: "ได้แก่ เศษอาหาร เปลือกผลไม้ และใบไม้ ขยะประเภทนี้สามารถนำไปใช้ประโยชน์ เช่น ทำปุ๋ยหรือจัดการด้วยวิธีที่เหมาะสม"
    },
    {
        icon: "🔵",
        title: "ขยะทั่วไป",
        text: "เป็นขยะที่ไม่เหมาะกับการรีไซเคิลหรือการนำไปใช้ประโยชน์ด้วยวิธีอื่น เช่น วัสดุบางชนิดที่ปนเปื้อนหรือไม่สามารถนำกลับมาใช้ได้"
    },
    {
        icon: "🔴",
        title: "ขยะอันตราย",
        text: "เช่น ถ่านไฟฉาย แบตเตอรี่ และหลอดไฟ ควรแยกออกจากขยะทั่วไปและนำไปจัดการในจุดที่เหมาะสม"
    },
    {
        icon: "🚮",
        title: "ทำไมต้องแยกขยะ?",
        text: "การแยกขยะช่วยลดการปะปนของขยะ ทำให้วัสดุที่สามารถนำกลับมาใช้ประโยชน์ได้ถูกนำไปจัดการอย่างเหมาะสม และช่วยลดปริมาณขยะที่ต้องกำจัด"
    },
    {
        icon: "♻️",
        title: "หลัก 3R",
        text: "Reduce คือ ลดการใช้สิ่งของที่ไม่จำเป็น Reuse คือ นำสิ่งของกลับมาใช้ซ้ำ และ Recycle คือ นำวัสดุที่เหมาะสมเข้าสู่กระบวนการรีไซเคิล"
    },
    {
        icon: "🏫",
        title: "แยกขยะในโรงเรียน",
        text: "เริ่มได้จากการทิ้งขยะให้ถูกประเภท ลดการใช้พลาสติกแบบใช้ครั้งเดียว และช่วยกันรักษาความสะอาด เพื่อให้โรงเรียนมีสภาพแวดล้อมที่ดีขึ้น"
    }
];

function showKnowledge() {

    document.querySelector(".app").innerHTML = `
        <div class="page knowledge-page">

            <div class="knowledge-header">
                <div class="knowledge-big-icon">📚</div>
                <h2>ห้องความรู้</h2>
                <p>เรียนรู้ก่อนเล่น ฝึกแยกขยะให้ถูกต้อง 🌱</p>
            </div>

            <div class="knowledge-grid">

                ${knowledgeData.map((item, index) => `
                    <button class="knowledge-card"
                            onclick="showKnowledgeDetail(${index})">

                        <div class="knowledge-icon">
                            ${item.icon}
                        </div>

                        <div class="knowledge-card-text">
                            <strong>${item.title}</strong>
                            <small>กดเพื่ออ่าน →</small>
                        </div>

                    </button>
                `).join("")}

            </div>

            <button onclick="location.reload()">
                🏠 กลับหน้าหลัก
            </button>

        </div>
    `;
}

function showKnowledgeDetail(index) {

    const item = knowledgeData[index];

    document.querySelector(".app").innerHTML = `
        <div class="page knowledge-detail">

            <button class="back-button"
                    onclick="showKnowledge()">
                ← กลับห้องความรู้
            </button>

            <div class="detail-icon">
                ${item.icon}
            </div>

            <h2>${item.title}</h2>

            <div class="knowledge-content">
                <p>${item.text}</p>
            </div>

            <div class="knowledge-tip">
                💡 <strong>จำไว้!</strong>
                <br>
                ความรู้ที่ดีเริ่มต้นจากการรู้จักแยกขยะให้ถูกประเภท
            </div>

            <button class="start-btn"
                    onclick="openGameCenter()">
                🎮 ไปเล่นเกม
            </button>

        </div>
    `;
}

// ==========================================
// ⚡ SPEED SORT GAME
// ==========================================

const speedQuestions = [
    { item: "🥤 ขวดพลาสติก", answer: "recycle" },
    { item: "🍌 เปลือกกล้วย", answer: "organic" },
    { item: "🔋 ถ่านไฟฉาย", answer: "danger" },
    { item: "🥡 กล่องอาหารเปื้อน", answer: "general" },
    { item: "🥫 กระป๋องอะลูมิเนียม", answer: "recycle" },
    { item: "🍎 เศษผลไม้", answer: "organic" },
    { item: "💡 หลอดไฟ", answer: "danger" },
    { item: "🛍️ ถุงพลาสติกใช้แล้ว", answer: "general" },
    { item: "📰 หนังสือพิมพ์", answer: "recycle" },
    { item: "🍚 เศษข้าว", answer: "organic" }
];

let speedIndex = 0;
let speedScore = 0;
let speedTime = 10;
let speedTimer;

function startSpeedGame() {
    speedIndex = 0;
    speedScore = 0;
    showSpeedQuestion();
}

function showSpeedQuestion() {

    clearInterval(speedTimer);
    speedTime = 10;

    const q = speedQuestions[speedIndex];

    document.querySelector(".app").innerHTML = `
        <div class="page speed-page">

            <div class="game-top">
                <span>⚡ ตอบให้ไว!</span>
                <strong>${speedIndex + 1}/${speedQuestions.length}</strong>
            </div>

            <div class="speed-timer">
                ⏱️ <span id="speedTime">${speedTime}</span> วินาที
            </div>

            <div class="speed-item-card">
                <small>ขยะชิ้นนี้ควรทิ้งที่ไหน?</small>
                <div class="speed-item">${q.item}</div>
            </div>

            <div class="speed-bins">

                <button onclick="answerSpeed('recycle')">
                    🟢
                    <strong>รีไซเคิล</strong>
                </button>

                <button onclick="answerSpeed('general')">
                    🔵
                    <strong>ทั่วไป</strong>
                </button>

                <button onclick="answerSpeed('organic')">
                    🟤
                    <strong>อินทรีย์</strong>
                </button>

                <button onclick="answerSpeed('danger')">
                    🔴
                    <strong>อันตราย</strong>
                </button>

            </div>

            <p class="game-score">
                ⭐ คะแนนรอบนี้: ${speedScore}
            </p>

        </div>
    `;

    speedTimer = setInterval(() => {

        speedTime--;

        const timer = document.getElementById("speedTime");

        if (timer) {
            timer.textContent = speedTime;
        }

        if (speedTime <= 0) {
            clearInterval(speedTimer);

            alert("⏰ หมดเวลา!");

            speedIndex++;

            if (speedIndex >= speedQuestions.length) {
                finishSpeedGame();
            } else {
                showSpeedQuestion();
            }
        }

    }, 1000);
}

function answerSpeed(answer) {

    clearInterval(speedTimer);

    const q = speedQuestions[speedIndex];

    if (answer === q.answer) {

        speedScore += 10;

        alert(`🎉 ถูกต้อง! +10 คะแนน\n⏱️ เหลือ ${speedTime} วินาที`);

    } else {

        alert("❌ ยังไม่ถูก!");

    }

    speedIndex++;

    if (speedIndex >= speedQuestions.length) {
        finishSpeedGame();
    } else {
        showSpeedQuestion();
    }
}

function finishSpeedGame() {

    clearInterval(speedTimer);

    let score = Number(localStorage.getItem("trashScore")) || 0;

    score += speedScore;

    localStorage.setItem("trashScore", score);

    document.querySelector(".app").innerHTML = `
        <div class="page game-finish">

            <div class="finish-icon">⚡</div>

            <h2>จบเกม!</h2>

            <p>ตอบให้ไว! ⚡</p>

            <div class="final-score-card">
                <small>คะแนนที่ได้</small>
                <strong>+${speedScore} ⭐</strong>
            </div>

            <p>
                ${speedScore >= 80
                    ? "🏆 เร็วและแม่นมาก!"
                    : speedScore >= 50
                    ? "🌱 ทำได้ดี! ลองอีกครั้งเพื่อทำคะแนนให้สูงขึ้น"
                    : "💡 ลองทบทวนใบความรู้แล้วกลับมาเล่นอีกครั้งนะ"
                }
            </p>

            <button class="start-btn"
                    onclick="startSpeedGame()">
                🔄 เล่นอีกครั้ง
            </button>

            <button onclick="openGameCenter()">
                🎮 เลือกเกมอื่น
            </button>

            <button onclick="location.reload()">
                🏠 กลับหน้าหลัก
            </button>

        </div>
    `;
}
