import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

// กันหน้าจอขาวเปล่าเมื่อเกิด error ที่ไม่คาดคิดระหว่าง render — แสดงข้อความไทยแทน
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("BaZi app error:", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "24px",
            textAlign: "center",
            background: "#e7dcc2",
            color: "#22262d",
            fontFamily: "'Anuphan', system-ui, sans-serif",
          }}
        >
          <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "3rem", color: "#b1352a" }}>
            八字
          </div>
          <p style={{ fontWeight: 600 }}>ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด</p>
          <p style={{ fontSize: "0.9rem", color: "#55564d", maxWidth: "420px" }}>
            ลองรีเฟรชหน้าใหม่อีกครั้ง หากยังพบปัญหา โปรดตรวจสอบข้อมูลวันเกิดที่กรอก
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "8px",
              minHeight: "var(--tap-min, 44px)",
              fontFamily: "'Anuphan', system-ui, sans-serif",
              fontSize: "1rem",
              color: "#fff",
              background: "#b1352a",
              border: 0,
              borderRadius: "4px",
              padding: "11px 24px",
              cursor: "pointer",
            }}
          >
            รีเฟรชหน้า
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
