import corsLib from "cors";
import * as functions from "firebase-functions";

const cors = corsLib({ origin: true });

// --- 1. HỆ THỐNG ---
export const checkServer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).send({
      status: "success",
      message: "Hệ thống MyFocus (DDL) đã sẵn sàng!",
      author: "Dam Tien Trinh",
      timestamp: new Date().toISOString()
    });
  });
});

// --- 2. QUẢN LÝ TASK
// Lấy danh sách
export const getTasks = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const mockTasks = [
      { id: "1", title: "Học React Native", category: "Study", status: "todo", pomodoros: 2, completed: false },
      { id: "2", title: "Viết API Firebase", category: "Work", status: "doing", pomodoros: 4, completed: false },
      { id: "3", title: "Làm báo cáo DDL", category: "School", status: "done", pomodoros: 1, completed: true },
    ];
    res.status(200).send(mockTasks);
  });
});

// Thêm Task mới
export const createTask = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      // Giả lập nhận data từ Body
      const { title, category } = req.body;
      res.status(201).send({ 
        message: "Tạo task thành công!", 
        data: { id: Date.now().toString(), title, category, status: "todo" } 
      });
    });
});

// Xóa Task
export const deleteTask = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      const { id } = req.query;
      res.status(200).send({ message: `Đã xóa task ${id} thành công!` });
    });
});

// --- 3. LOGIC POMODORO 
export const updatePomodoroSession = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      res.status(200).send({ 
        message: "Đã ghi nhận 1 phiên Pomodoro hoàn thành!",
        points: 10 // Thêm điểm thưởng 
      });
    });
});

// --- 4. THỐNG KÊ 
export const getStats = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).send({
      totalMinutes: 150,
      completedSessions: 6,
      weeklyData: [2, 3, 1, 5, 4, 2, 6], // Số phiên từ Thứ 2 -> Chủ Nhật
      focusRank: "Pro Focus"
    });
  });
});