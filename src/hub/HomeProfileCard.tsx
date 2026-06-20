import { useState } from "react";
import {
  loadProfile,
  patchProfile,
  clearProfile,
  hasCoreProfile,
  type Profile,
} from "../shared/profile/profile";

// แสดงวันเกิดเป็น วัน/เดือน/พ.ศ. ให้คนไทยอ่านง่าย (เก็บจริงเป็น ค.ศ. YYYY-MM-DD)
function fmtThaiDate(iso?: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!m) return "—";
  return `${Number(m[3])}/${Number(m[2])}/${Number(m[1]) + 543}`;
}

export function HomeProfileCard({
  onSaved,
  onCleared,
}: {
  onSaved: () => void;
  onCleared: () => void;
}) {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [editing, setEditing] = useState(!hasCoreProfile(profile));
  const [date, setDate] = useState(profile.birthDate ?? "");
  const [time, setTime] = useState(profile.birthTime ?? "");
  const [gender, setGender] = useState(profile.gender ?? "");
  const [err, setErr] = useState("");

  const save = (): void => {
    if (!date) {
      setErr("กรุณาเลือกวันเกิด");
      return;
    }
    if (gender !== "ชาย" && gender !== "หญิง") {
      setErr("กรุณาเลือกเพศ");
      return;
    }
    setProfile(patchProfile({ birthDate: date, birthTime: time, gender }));
    setErr("");
    setEditing(false);
    onSaved();
  };

  const clear = (): void => {
    clearProfile();
    setProfile({});
    setDate("");
    setTime("");
    setGender("");
    setErr("");
    setEditing(true);
    onCleared();
  };

  if (!editing) {
    return (
      <section className="hub-reg" aria-label="ข้อมูลวันเกิดของคุณ">
        <div className="hub-reg-inner">
          <div className="hub-reg-row">
            <div>
              <div className="hub-reg-eyebrow">ดวงของคุณ</div>
              <div className="hub-chips">
                <span className="hub-chip">
                  วันเกิด <b>{fmtThaiDate(profile.birthDate)}</b>
                </span>
                <span className="hub-chip">
                  เวลา <b>{profile.birthTime ? `${profile.birthTime} น.` : "ไม่ระบุ"}</b>
                </span>
                <span className="hub-chip">
                  เพศ <b>{profile.gender}</b>
                </span>
              </div>
            </div>
            <div className="hub-reg-tools">
              <button type="button" className="hub-reg-edit" onClick={() => setEditing(true)}>
                แก้ไขข้อมูล
              </button>
              <button type="button" className="hub-reg-clear" onClick={clear}>
                ล้างข้อมูล
              </button>
            </div>
          </div>
          <p className="hub-reg-foot">
            กรอกครั้งเดียว ใช้ได้ทุกศาสตร์ — เลือกศาสตร์ที่สนใจด้านล่างได้เลย
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="hub-reg" aria-label="กรอกข้อมูลวันเกิด">
      <div className="hub-reg-inner">
        <div className="hub-reg-eyebrow">เริ่มที่นี่</div>
        <h2 className="hub-reg-title">
          <span className="cn" aria-hidden="true">命</span>
          กรอกวันเกิดครั้งเดียว ใช้ได้ทุกศาสตร์
        </h2>
        <p className="hub-reg-sub">คำนวณในเครื่องนี้ ไม่ส่งข้อมูลออก</p>

        <div className="hub-reg-grid">
          <div className="hub-reg-field">
            <label className="hub-reg-label" htmlFor="reg-date">
              วันเกิด
            </label>
            <input
              id="reg-date"
              className="hub-reg-ctrl"
              type="date"
              value={date}
              min="1900-01-01"
              max="2100-12-31"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="hub-reg-field">
            <label className="hub-reg-label" htmlFor="reg-time">
              เวลาเกิด
            </label>
            <input
              id="reg-time"
              className="hub-reg-ctrl"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <span className="hub-reg-note">ไม่ทราบเว้นว่างได้</span>
          </div>
          <div className="hub-reg-field">
            <span className="hub-reg-label" id="reg-sex">
              เพศ
            </span>
            <div className="hub-seg" role="group" aria-labelledby="reg-sex">
              {(["ชาย", "หญิง"] as const).map((g) => (
                <button key={g} type="button" aria-pressed={gender === g} onClick={() => setGender(g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {err && (
          <p className="hub-reg-err" role="alert">
            {err}
          </p>
        )}

        <div className="hub-reg-actions">
          <button type="button" className="hub-reg-save" onClick={save}>
            บันทึก แล้วเริ่มดูดวง
          </button>
          <span className="hub-reg-foot">เวลาเกิดช่วยให้ศาสตร์โหราศาสตร์แม่นยำขึ้น</span>
        </div>
      </div>
    </section>
  );
}
