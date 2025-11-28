document.addEventListener('DOMContentLoaded', () => {
    const studentListElement = document.getElementById('student-list');
    const saveButton = document.getElementById('save-button');
    const saveStatus = document.getElementById('save-status');
    const currentDateElement = document.getElementById('current-date');
    
    // 現在の日付を表示
    currentDateElement.textContent = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // ダミーの学生リスト
    const students = [
        { id: 1, name: "佐藤 健太" },
        { id: 2, name: "田中 美咲" },
        { id: 3, name: "山本 大輔" },
        { id: 4, name: "小林 優子" },
        { id: 5, name: "中村 翼" }
    ];

    // 出席状況の初期状態（未確認: 0, 出席: 1, 欠席: 2）
    let attendanceStatus = {};
    const STORAGE_KEY = 'attendanceData_' + new Date().toISOString().slice(0, 10); // 日付ごとにキーを分ける

    // ----------------------------------------------------
    // 1. データのロード
    // ----------------------------------------------------
    function loadAttendance() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            attendanceStatus = JSON.parse(savedData);
        } else {
            // データがない場合は初期化（すべて未確認）
            students.forEach(student => {
                attendanceStatus[student.id] = 0;
            });
        }
    }
    
    // ----------------------------------------------------
    // 2. リストの描画
    // ----------------------------------------------------
    function renderStudentList() {
        studentListElement.innerHTML = ''; // リストをクリア
        
        students.forEach(student => {
            const status = attendanceStatus[student.id] || 0; // ステータスを取得
            const listItem = document.createElement('li');
            listItem.className = 'student-item';
            
            const statusText = ['未確認', '出席', '欠席'][status];
            const statusClass = ['status-default', 'status-present', 'status-absent'][status];

            listItem.innerHTML = `
                <span class="student-name">${student.name}</span>
                <button class="attendance-button ${statusClass}" data-id="${student.id}" data-status="${status}">
                    ${statusText}
                </button>
            `;
            
            studentListElement.appendChild(listItem);
        });
    }

    // ----------------------------------------------------
    // 3. 出席状況のトグル（切り替え）
    // ----------------------------------------------------
    function toggleAttendance(event) {
        if (event.target.classList.contains('attendance-button')) {
            const button = event.target;
            const studentId = parseInt(button.dataset.id);
            let currentStatus = parseInt(button.dataset.status);

            // ステータスをトグル
            // 0 (未確認) -> 1 (出席) -> 2 (欠席) -> 0 (未確認) ...
            let newStatus = (currentStatus + 1) % 3; 

            // データモデルを更新
            attendanceStatus[studentId] = newStatus;

            // UIを更新
            const newStatusText = ['未確認', '出席', '欠席'][newStatus];
            const newStatusClass = ['status-default', 'status-present', 'status-absent'][newStatus];
            
            button.textContent = newStatusText;
            button.className = `attendance-button ${newStatusClass}`;
            button.dataset.status = newStatus; // データ属性も更新
        }
    }

    // ----------------------------------------------------
    // 4. データの保存
    // ----------------------------------------------------
    function saveAttendance() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceStatus));
            saveStatus.textContent = '✅ 保存が完了しました！';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 3000);
        } catch (e) {
            saveStatus.textContent = '❌ 保存に失敗しました。';
            console.error('Local Storage Save Error:', e);
        }
    }

    // ----------------------------------------------------
    // イベントリスナーの設定と初期化
    // ----------------------------------------------------
    studentListElement.addEventListener('click', toggleAttendance);
    saveButton.addEventListener('click', saveAttendance);

    // 初期化処理
    loadAttendance();
    renderStudentList();
});
