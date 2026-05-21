import { db, auth } from "../../config/firebaseConfig"; 
import { doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export const updateUserFocusTime = async (minutes: number) => {
  const user = auth.currentUser;
  
  if (!user) {
    // console.log("⚠️ [Firebase] Chưa đăng nhập, không thể cập nhật điểm.");
    return;
  }

  const now = new Date();
  
  // 1. Đồng bộ định dạng chuỗi ngày tháng (Quan trọng để BXH tìm thấy)
  const todayStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
  const currentMonth = `${now.getMonth() + 1}-${now.getFullYear()}`;
  
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
  const currentWeek = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}-${now.getFullYear()}`;

  try {
    const userRef = doc(db, "users", user.uid);
    
    // 2. Thực hiện ghi dữ liệu ngay lập tức
    await updateDoc(userRef, {
      totalMinutes: increment(minutes),      
      totalSessions: increment(1),       
      lastDayActive: todayStr,               
      lastWeekActive: currentWeek,           
      lastMonthActive: currentMonth,         
      lastActive: serverTimestamp(),
    });

    console.log(`🔥 [Firebase] Đã cộng ${minutes} phút vào BXH cho user: ${user.uid}`);
  } catch (error) {
    console.error("❌ Lỗi cập nhật xếp hạng:", error);
  }
};