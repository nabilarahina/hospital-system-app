import React from 'react';
import { Network, FileText, Search, ShieldCheck } from 'lucide-react';

const DocsView: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 md:p-12 max-w-4xl mx-auto">
        
        <div className="mb-10 border-b border-blue-100 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Desain Sistem Agen Cerdas Rumah Sakit
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Arsitektur koordinasi dan spesialisasi informasi untuk layanan kesehatan terintegrasi.
            Desain ini berpusat pada koordinasi tugas yang logis dan efisiensi penanganan permintaan.
          </p>
        </div>

        {/* Section 1: Coordinator */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
            <Network className="w-6 h-6" />
            1. Agen Pusat: Hospital System Coordinator
          </h2>
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-400 rounded-full block"></span>
                Deskripsi dan Peran Utama
              </h3>
              <p className="text-slate-700 mb-3">
                Bertindak sebagai pusat utama untuk semua pertanyaan terkait rumah sakit. Fungsi utamanya adalah 
                <span className="font-semibold text-blue-800"> merutekan permintaan </span> 
                ke sub-agen khusus yang sesuai. Ia mengoordinasikan tugas manajemen pasien yang berfungsi sebagai sub-sistem.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-400 rounded-full block"></span>
                Instruksi & Alur Kerja
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-700 ml-2">
                <li className="pl-2"><span className="font-medium">Identifikasi:</span> Kategorikan permintaan (Manajemen pasien, jadwal, info medis, laporan).</li>
                <li className="pl-2"><span className="font-medium">Seleksi:</span> Pilih sub-agen (Patient Management, Appointment Scheduler, Medical Info, Report Generator).</li>
                <li className="pl-2"><span className="font-medium">Ekstraksi:</span> Ambil detail relevan dari permintaan pengguna.</li>
                <li className="pl-2"><span className="font-medium">Delegasi:</span> Panggil sub-agen dengan argumen yang tepat.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 2: Medical Info Agent */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            2. Detail Sub-Agen: Medical Information Agent
          </h2>

          <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="w-1 h-6 bg-teal-400 rounded-full block"></span>
                  Tugas Utama
                </h3>
                <p className="text-slate-700 mb-4">
                  Memberikan informasi mengenai kondisi medis, perawatan, obat-obatan, dan kesehatan umum.
                  Berfungsi sebagai spesialis informasi medis menggunakan <strong>Pencarian Google</strong>.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                   <Search className="w-5 h-5 text-teal-600" />
                   Ekspektasi Keluaran
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    Menjawab langsung pertanyaan medis.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    Akurat dan bersumber terpercaya.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    Format jelas, ringkas, mudah dicerna.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-500">•</span>
                    Hindari jargon teknis tanpa penjelasan.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DocsView;