import { db } from "@/config/firebaseConfig";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

export const getTopRankings = async (filterType: 'today' | 'weekly' | 'month') => {
  try {
    const usersRef = collection(db, "users");
    const now = new Date();
    
    const todayStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    const currentMonth = `${now.getMonth() + 1}-${now.getFullYear()}`;
    
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    const currentWeek = `${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}-${now.getFullYear()}`;

    let filterField = "lastMonthActive";
    let filterValue = currentMonth;
    // let sortField = "completedSessions";

    if (filterType === 'today') {
      filterField = "lastDayActive";
      filterValue = todayStr;
    } else if (filterType === 'weekly') {
      filterField = "lastWeekActive";
      filterValue = currentWeek;
    }

    let results: any[] = [];

    const q = query(
      usersRef, 
      where(filterField, "==", filterValue),
      orderBy("completedSessions", "desc"), 
      limit(10)
    );

    let snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      const qAll = query(usersRef, orderBy("completedSessions", "desc"), limit(10));
      snapshot = await getDocs(qAll);
    }
    
    results = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        displayName: data.displayName || data.email?.split('@')[0] || "User",
        completedSessions: data.completedSessions || 0,
        photoURL: data.photoURL || null
      };
    });
    return results;

  } catch (error: any) {
    console.error("Lỗi lấy BXH:", error.message);
    return [];
  }
};