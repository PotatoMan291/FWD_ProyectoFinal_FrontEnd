import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getTourRecommendations } from "../services/aiService";
import { getTours } from "../services/tourService";
import Button from "./Button";

function AITripAssistant() {
  const { t, language } = useLanguage(); const { user } = useAuth(); const [preferences,setPreferences]=useState(""); const [loading,setLoading]=useState(false); const [result,setResult]=useState(null); const [error,setError]=useState("");
  const submit=async(event)=>{event.preventDefault();if(!preferences.trim())return;setLoading(true);setError("");try{const tours=await getTours();const data=await getTourRecommendations({user,preferences,tours,language});setResult(data);}catch(err){console.error(err);setError(err.message);}finally{setLoading(false);}};
  const recommendations=result?.recommendations||[];
  return <section className="dashboard-card ai-assistant-card"><div className="dashboard-card-header"><div><span className="section-eyebrow">n8n + AI</span><h2>{t("dashboard.aiTitle")}</h2><p>{t("dashboard.aiDescription")}</p></div></div><form className="dashboard-ai-form" onSubmit={submit}><label htmlFor="ai-preferences">{t("dashboard.preferences")}</label><textarea id="ai-preferences" rows="3" value={preferences} onChange={(e)=>setPreferences(e.target.value)} placeholder={t("dashboard.aiPlaceholder")} /><Button type="submit" disabled={loading}>{loading?t("dashboard.aiLoading"):t("dashboard.askAI")}</Button></form>{error&&<p className="dashboard-error">{error}</p>}{result?.message&&<p className="dashboard-ai-message">{result.message}</p>}{recommendations.length>0&&<div className="ai-recommendations">{recommendations.map((item)=><article key={item.id} className="ai-recommendation"><strong>{item.name||item.nombre||`Tour ${item.id}`}</strong><p>{item.reason||item.motivo||item.description}</p></article>)}</div>}</section>;
}
export default AITripAssistant;
