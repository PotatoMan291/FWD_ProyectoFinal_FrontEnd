import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { getTours, updateTour } from "../services/tourService";
import AITripAssistant from "../components/AITripAssistant";
import CloudinaryUploadButton from "../components/CloudinaryUploadButton";

function StatCard({ label, value }) { return <article className="dashboard-stat-card"><span>{label}</span><strong>{value}</strong></article>; }
function BarChart({ data }) { const max=Math.max(...data.map((item)=>item.value),1); return <div className="dashboard-chart-bars">{data.map((item)=><div className="dashboard-bar-item" key={item.label}><div className="dashboard-bar-track"><div className="dashboard-bar-fill" style={{height:`${Math.max((item.value/max)*100,4)}%`}} /></div><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>; }

function AdminDashboard({ tours, users, reservations }) {
  const { t } = useLanguage();
  const categories = useMemo(()=>Object.entries(tours.reduce((acc,tour)=>{acc[tour.categoria]=(acc[tour.categoria]||0)+1;return acc;},{})).map(([label,value])=>({label,value})),[tours]);
  const roles = useMemo(()=>Object.entries(users.reduce((acc,user)=>{acc[user.rol]=(acc[user.rol]||0)+1;return acc;},{})).map(([label,value])=>({label,value})),[users]);
  const revenue = reservations.reduce((sum,item)=>sum+Number(item.total||item.precio||0),0);
  return <div className="dashboard-stack"><div className="dashboard-stats"><StatCard label={t("dashboard.totalUsers")} value={users.length}/><StatCard label={t("dashboard.totalTours")} value={tours.length}/><StatCard label={t("dashboard.operators")} value={users.filter((user)=>user.rol==="operador").length}/><StatCard label={t("dashboard.reservations")} value={reservations.length}/><StatCard label={t("dashboard.revenue")} value={`₡${revenue.toLocaleString("es-CR")}`}/></div><div className="dashboard-chart-grid"><section className="dashboard-card"><h2>{t("dashboard.categories")}</h2><BarChart data={categories}/></section><section className="dashboard-card"><h2>{t("dashboard.roles")}</h2><BarChart data={roles}/></section></div><section className="dashboard-card"><h2>Administración</h2><div className="dashboard-actions"><Link className="button button-primary" to="/tours">Gestionar tours</Link><Link className="button button-outline" to="/tours">Ver marketplace</Link></div></section></div>;
}

function TouristDashboard({ user, tours, reservations, favorites, refreshUser }) {
  const { t } = useLanguage(); const [name,setName]=useState(user?.nombre||""); const [email,setEmail]=useState(user?.correo||""); const [saving,setSaving]=useState(false);
  const save=async(event)=>{event.preventDefault();setSaving(true);try{const updated={...user,nombre:name.trim(),correo:email.trim().toLowerCase()};await api.patch(`/usuarios/${user.id}`,{nombre:updated.nombre,correo:updated.correo});localStorage.setItem("puravida_auth",JSON.stringify({id:updated.id,nombre:updated.nombre,correo:updated.correo,rol:updated.rol}));refreshUser(updated);await Swal.fire({icon:"success",title:"Perfil actualizado",timer:1200,showConfirmButton:false});}catch(error){console.error(error);Swal.fire({icon:"error",title:"No se pudo actualizar",text:error.message});}finally{setSaving(false);}};
  return <div className="dashboard-stack"><div className="dashboard-stats"><StatCard label={t("dashboard.favorites")} value={favorites.length}/><StatCard label={t("dashboard.reservationHistory")} value={reservations.length}/><StatCard label={t("dashboard.totalTours")} value={tours.length}/></div><div className="dashboard-two-column"><section className="dashboard-card"><h2>{t("dashboard.profile")}</h2><form className="dashboard-form" onSubmit={save}><label>{t("auth.name")}<input value={name} onChange={(e)=>setName(e.target.value)}/></label><label>{t("auth.email")}<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/></label><button className="button button-primary" type="submit" disabled={saving}>{saving?"Guardando...":t("dashboard.save")}</button></form></section><section className="dashboard-card"><h2>{t("dashboard.reservationHistory")}</h2>{reservations.length===0?<p>Aún no tienes reservas registradas.</p>:<ul className="dashboard-list">{reservations.map((reservation)=><li key={reservation.id}><strong>{reservation.tourNombre||`Reserva #${reservation.id}`}</strong><span>{reservation.estado||"Pendiente"}</span></li>)}</ul>}</section></div><AITripAssistant/></div>;
}

function OperatorDashboard({ user, tours }) {
  const { t } = useLanguage(); const ownTours=tours.filter((tour)=>String(tour.operadorId)===String(user.id)||tour.operador===user.nombre); const [selectedTourId,setSelectedTourId]=useState(ownTours[0]?.id||""); const [uploaded,setUploaded]=useState(null);
  const attachMedia = async (info) => {
    setUploaded(info);
    if (!selectedTourId) return;
    try {
      const field = info.resource_type === "video" ? "video" : "imagen";
      await updateTour(selectedTourId, { [field]: info.secure_url });
      Swal.fire({ icon:"success", title:"Tour actualizado", text:"El recurso de Cloudinary quedó asociado al tour.", timer:1500, showConfirmButton:false });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon:"error", title:"No se pudo actualizar el tour", text:error.message });
    }
  };
  return <div className="dashboard-stack"><div className="dashboard-stats"><StatCard label={t("dashboard.operatorTours")} value={ownTours.length}/><StatCard label={t("dashboard.reservations")} value={0}/><StatCard label={t("dashboard.totalTours")} value={tours.length}/></div><section className="dashboard-card"><div className="dashboard-card-header"><div><h2>{t("dashboard.operatorTours")}</h2><p>Administra las experiencias asociadas a tu operación.</p></div><Link className="button button-primary" to="/tours">Ver catálogo</Link></div>{ownTours.length===0?<p>No hay tours asociados a este operador todavía.</p>:<div className="dashboard-tour-list">{ownTours.map((tour)=><article key={tour.id}><img src={tour.imagen} alt=""/><div><strong>{tour.nombre}</strong><span>{tour.ubicacion} · ₡{Number(tour.precio).toLocaleString("es-CR")}</span></div></article>)}</div>}</section><section className="dashboard-card"><h2>{t("dashboard.upload")}</h2><p>Selecciona un tour y sube su imagen o video directamente a Cloudinary.</p><div className="dashboard-form"><label>Tour<select value={selectedTourId} onChange={(e)=>setSelectedTourId(e.target.value)}><option value="">Selecciona un tour</option>{ownTours.map((tour)=><option key={tour.id} value={tour.id}>{tour.nombre}</option>)}</select></label><CloudinaryUploadButton onUploaded={attachMedia}/></div>{uploaded&&<div className="dashboard-upload-result"><label>{t("dashboard.mediaUrl")}</label><input readOnly value={uploaded.secure_url||""}/><small>{uploaded.resource_type} · {uploaded.format}</small></div>}</section></div>;
}

function RoleDashboard({ role }) {
  const { user, updateSessionUser } = useAuth(); const { t } = useLanguage(); const [tours,setTours]=useState([]); const [users,setUsers]=useState([]); const [reservations,setReservations]=useState([]); const [favorites,setFavorites]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{Promise.all([getTours(),api.get("/usuarios"),api.get("/reservas"),api.get("/favoritos")]).then(([tourData,userData,reservationData,favoriteData])=>{setTours(tourData);setUsers(userData);setReservations(reservationData.filter((item)=>String(item.usuarioId)===String(user.id)||role==="admin"));setFavorites(favoriteData.filter((item)=>String(item.usuarioId)===String(user.id)));}).catch((error)=>console.error(error)).finally(()=>setLoading(false));},[role,user.id]);
  if(loading)return <main className="dashboard-page"><div className="dashboard-loading">Cargando dashboard...</div></main>;
  const title=role==="admin"?t("dashboard.adminTitle"):role==="operador"?t("dashboard.operatorTitle"):t("dashboard.touristTitle"); const description=role==="admin"?t("dashboard.adminDescription"):role==="operador"?t("dashboard.operatorDescription"):t("dashboard.touristDescription");
  return <main className="dashboard-page"><div className="dashboard-container"><header className="dashboard-hero"><div><span className="section-eyebrow">PURAVIDA TRIPS · DASHBOARD</span><h1>{title}</h1><p>{description}</p></div><span className="dashboard-role-badge">{user.nombre}</span></header>{role==="admin"&&<AdminDashboard tours={tours} users={users} reservations={reservations}/>} {role==="turista"&&<TouristDashboard user={user} tours={tours} reservations={reservations} favorites={favorites} refreshUser={updateSessionUser}/>} {role==="operador"&&<OperatorDashboard user={user} tours={tours}/>}</div></main>;
}
export default RoleDashboard;
