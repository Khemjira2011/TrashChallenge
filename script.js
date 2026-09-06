let score = Number(localStorage.getItem("trashScore")) || 0;
let questionIndex = 0;
let missionProgress = Number(localStorage.getItem("missionProgress")) || 0;
let missionClaimed = localStorage.getItem("missionClaimed") === "true";
let gameMissionClaimed = localStorage.getItem("gameMissionClaimed") === "true";

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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);

    preview.src = canvas.toDataURL("image/jpeg");
    preview.style.display = "block";

    video.style.display = "none";

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }

    alert("ถ่ายรูปสำเร็จ! 📸");
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

async function handleImage() {
    const input = document.getElementById("trashImage");

    if (!input || !input.files[0]) {
        alert("กรุณาถ่ายรูปหรือเลือกรูปขยะก่อน 📷");
        return;
    }

    const file = input.files[0];
    const imageURL = URL.createObjectURL(file);

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

    image.onerror = function () {
        document.querySelector(".app").innerHTML = `
            <h1>⚠️ เปิดรูปไม่สำเร็จ</h1>
            <p>ไม่สามารถอ่านรูปภาพนี้ได้</p>

            <button onclick="showScanner()">
                📷 ลองใหม่
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

    let correctType = null;
    let binName = "";
    let binIcon = "";

    // ♻️ รีไซเคิล
    if (
        object.includes("bottle") ||
        object.includes("can") ||
        object.includes("carton") ||
        object.includes("paper") ||
        object.includes("newspaper") ||
        object.includes("packet")
    ) {
        correctType = "recycle";
        binName = "ขยะรีไซเคิล";
        binIcon = "🟢";
    }

    // 🟤 อินทรีย์
    else if (
        object.includes("banana") ||
        object.includes("apple") ||
        object.includes("orange") ||
        object.includes("lemon") ||
        object.includes("fruit")
    ) {
        correctType = "organic";
        binName = "ขยะอินทรีย์";
        binIcon = "🟤";
    }

    // 🔴 อันตราย
    else if (
        object.includes("battery") ||
        object.includes("lightbulb")
    ) {
        correctType = "danger";
        binName = "ขยะอันตราย";
        binIcon = "🔴";
    }

    // 🔵 ทั่วไป
    else {
        correctType = "general";
        binName = "ขยะทั่วไป";
        binIcon = "🔵";
    }

    const percent = Math.round(probability * 100);

    document.querySelector(".app").innerHTML = `

        <div class="ai-result-page">

            <div class="ai-header">
                <div class="ai-header-icon">🤖</div>

                <div>
                    <h1>AI วิเคราะห์สำเร็จ</h1>
                    <p>ระบบตรวจพบวัตถุจากภาพของคุณ</p>
                </div>
            </div>


            <div class="ai-image-card">

                <img src="${imageURL}" class="ai-result-image">

                <div class="scan-success">
                    <span>✓</span>
                    วิเคราะห์ภาพเรียบร้อย
                </div>

            </div>


            <div class="ai-detection-card">

                <div class="section-title">
                    🔍 สิ่งที่ AI ตรวจพบ
                </div>

                <div class="detected-object">
                    ${detectedObject}
                </div>

                <div class="confidence">

                    <div class="confidence-top">
                        <span>ความมั่นใจ</span>
                        <strong>${percent}%</strong>
                    </div>

                    <div class="confidence-bar">
                        <div
                            class="confidence-fill"
                            style="width:${percent}%"
                        ></div>
                    </div>

                </div>

            </div>


            <div class="ai-bin-card">

                <div class="section-title">
                    🗑️ ประเภทที่ระบบประเมิน
                </div>

                <div class="recommended-bin">
                    <div class="bin-big-icon">
                        ${binIcon}
                    </div>

                    <div>
                        <div class="recommended-label">
                            ควรทิ้งลง
                        </div>

                        <div class="recommended-name">
                            ${binName}
                        </div>
                    </div>
                </div>

            </div>


            <div class="choose-title">
                🗑️ เลือกถังขยะ
            </div>

            <p class="choose-subtitle">
                คุณคิดว่า AI วิเคราะห์ถูกหรือไม่?
            </p>


            <div class="bin-grid">

                <button
                    class="bin-button recycle"
                    onclick="checkTrashBin('${correctType}', 'recycle')"
                >
                    <span>🟢</span>
                    <strong>รีไซเคิล</strong>
                    <small>Recycle</small>
                </button>


                <button
                    class="bin-button general"
                    onclick="checkTrashBin('${correctType}', 'general')"
                >
                    <span>🔵</span>
                    <strong>ทั่วไป</strong>
                    <small>General</small>
                </button>


                <button
                    class="bin-button organic"
                    onclick="checkTrashBin('${correctType}', 'organic')"
                >
                    <span>🟤</span>
                    <strong>อินทรีย์</strong>
                    <small>Organic</small>
                </button>


                <button
                    class="bin-button danger"
                    onclick="checkTrashBin('${correctType}', 'danger')"
                >
                    <span>🔴</span>
                    <strong>อันตราย</strong>
                    <small>Danger</small>
                </button>

            </div>


            <div class="ai-actions">

                <button
                    class="scan-again-button"
                    onclick="showScanner()"
                >
                    📷 สแกนขยะชิ้นใหม่
                </button>

                <button
                    class="home-button"
                    onclick="goHome()"
                >
                    🏠 กลับหน้าหลัก
                </button>

            </div>

        </div>
    `;
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
