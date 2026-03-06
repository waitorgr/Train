import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Certificate } from "../types";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      const response = await api.get("/certificates/my/");
      setCertificates(response.data);
    };

    fetchCertificates();
  }, []);

  return (
    <div>
      <h1>Мої сертифікати</h1>
      {certificates.length === 0 && <p>Сертифікатів поки немає.</p>}

      {certificates.map((certificate) => (
        <div key={certificate.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <h2>{certificate.course_title}</h2>
          <p>Номер: {certificate.certificate_number}</p>
          <p>Дата видачі: {new Date(certificate.issued_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}